<template>
  <Page>
    <Header :search="false" />
    <GridLayout rows="auto, *" backgroundColor="#F4F6F8">
      <GridLayout margin="5" row="0" rows="*" columns="*, 70">
        <SearchBar
          row="0"
          col="0"
          height="50"
          margin="10"
          class="search-bar"
          hint="Buscar..."
          v-model="search"
          @textChange="filter"
          @submit="filter"
          @clear="clear"
        />
        <ButtonNavigate
          row="0"
          col="1"
          height="60"
          width="60"
          icon="fa-sync-alt"
          size="22"
          radius="50"
          :rotate="360"
          :handleEvent="() => refreshPallets()"
        />
      </GridLayout>
      <Label
        row="1"
        textWrap="true"
        class="info"
        v-if="array_filter.length == 0"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fas" text.decode="&#x1F4E6;" />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        row="1"
        for="(item, index) in array_filter"
        @itemTap="onItemTap"
        @itemLoading="onScroll"
        :class="spaceButtom"
        ref="listView"
        v-if="array_filter.length > 0"
      >
        <v-template>
          <GridLayout columns="30,*,50">
            <Label
              col="0"
              :text="index + 1"
              fontSize="11"
              textWrap="true"
              fontWeight="bold"
              class="styleIndex"
            />
            <StackLayout orientation="horizontal" col="1">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-pallet' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth">
                <Label
                  text="Pallet:"
                  class="subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="15"
                />
                <Label textWrap="true">
                  <FormattedString>
                    <Span text="Codigo: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span
                      text="Observacion: "
                      fontWeight="bold"
                      fontSize="15"
                    />
                    <Span
                      :text="
                        item.observation
                          ? item.observation
                          : 'Sin observacion...'
                      "
                      fontSize="15"
                    />
                  </FormattedString>
                </Label>
              </StackLayout>
            </StackLayout>
            <ButtonNavigate
              col="2"
              height="50"
              width="50"
              icon="fa-ellipsis-v"
              radius="50"
              :handleEvent="() => navigate(item, index)"
            />
            <!-- <Label
              :text="'fa-ellipsis-v' | fonticon"
              class="fas iconOptions"
              fontSize="15"
              col="2"
              @tap="navigate(item, index)"
            /> -->
          </GridLayout>
        </v-template>
      </ListView>
      <FloatingButton row="1" :icon="'fa-cloud-upload-alt'" :method="sendAll" />
    </GridLayout>
  </Page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
const {
  getPalletsAll,
  getPallet,
  deletePallet,
  loadPallets,
} = require("~/sqlite/database");
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue";
import Alert from "~/alerts/Alerts";
import axios from "axios";
import { mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";
import ListModal from "~/components/listModal/ListModal.vue";
import GeneralPalletList from "~/views/generalPallets/GeneralPalletList";

export default {
  name: "Ships",
  components: {
    Header,
    FloatingButton,
  },

  data() {
    return {
      message: "No hay Pallets Escaneados",
      search: "",
      pallets: [],
      array_filter: [],
      infoPallet: {},
      icons: {
        iconLogo: "fa-pallet",
        iconOperations: "fa-ellipsis-v",
      },
      sendPallets: [],
      showSpace: true,
      space: false,
    };
  },

  mixins: [mixinMasters],

  computed: {
    spaceButtom() {
      return {
        "n-buttom": this.space == false,
        "m-buttom": this.space == true,
      };
    },
  },

  methods: {

    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.pallets.filter(
          (prev) =>
            !this.search ||
            prev.code.toLowerCase().includes(this.search.toLowerCase())
        );
      } else if (this.search.length === 0) {
        this.array_filter = [];
      }
    },

    onScroll(args) {
      if (args.index < this.pallets.length - 1) {
        this.space = false;
      } else if (args.index == this.pallets.length - 1) {
        this.space = true;
      }
    },

    clear() {
      this.array_filter = this.pallets;
    },

    refreshPallets() {
      this.getAll();
    },

    async palletInfo(item) {
      try {
        const res = await getPallet(item);
        this.infoPallet = res.data
        console.log("info pallet ",res)
      } catch (error) {
        console.log("error al traer los datos ", error);
      }
    },

    async showInfo(item) {
      try {
        const listRows = GeneralPalletList.listRows;
        await this.palletInfo(item);
        this.$showModal(ListModal, {
          animated: true,
          props: {
            title: "Infomacion del Pallet",
            info: this.infoPallet,
            listRows: listRows,
          },
        });
      } catch (error) {
        console.log("error al traer los datos ", error);
      }
    },

    async navigate(item, index) {
      await this.palletInfo(item);
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: this.infoPallet,
          generalOptions: true,
          component: CreateEditPallet,
          infoRegister: () => this.showInfo(item),
          updateRegister: () => this.palletEdit(this.infoPallet),
          deleteRow: () => this.removePallet(item.id, index),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {},
        },
      };
      this.$showBottomSheet(ButtomSheet, options);
    },

    async getAll() {
      try {
        this.loadingCharge(true);
        this.pallets = [];
        const res = await getPalletsAll();
        this.pallets = res.data;
        this.array_filter = this.pallets;
      } catch (error) {
        console.error("error al traer lo datos ", error);
      } finally {
        this.loadingCharge();
      }
    },

    async sendAll() {
      try {
        this.loadingCharge(true);
        this.sendPallets = [];
        const res = await loadPallets();
        if (res.data.length > 0) {
          this.sendPallets = res.data
          const postPallets = await axios.post('http://186.1.181.146:8811/mcp-backend/public/api/mobile/loadpallets', this.sendPallets)
          //const postPallets = await axios.post('http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/loadpallets', this.sendPallets)
          /* const postPallets = await axios.post(
            "http://172.70.9.110/mcp-backend/public/api/mobile/loadpallets",
            this.sendPallets
          ); */
          this.loadingCharge();
          Alert.success("Cargue Exitoso!");
        } else {
          this.loadingCharge();
          Alert.danger(
            "No se encontraron pallets",
            "por favor asegurese antes de sincronizar"
          );
        }
      } catch (error) {
        this.loadingCharge();
        Alert.danger("Hubo un error en el cargue", error.message);
      }
    },

    palletEdit(item) {
      this.$showModal(CreateEditPallet, {
        animated: true,
        fullscreen: true,
        props: { info: item },
      }).then((res) => {
        this.$emit("someEvent", "Valor de ejemplo");
      });
    },

    async removePallet(id, index) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const pallet = await deletePallet(id);
          this.pallets.splice(index, 1);
          this.$closeBottomSheet();
        } catch (error) {
          console.log("hubo un error al eliminar");
        }
      }
    },
  },

  created() {
    this.getAll();
  },
  /* components: { GridLayout }, */
};
</script>
<style lang="scss">
@import "@nativescript/theme/scss/variables/blue";

.heigth {
  height: 70%;
}

.colorIcons {
  color: #303947;
}

.subTittle {
  color: #222a37;
  text-decoration: underline;
  font-weight: bold;
}

.styleIndex {
  background-color: #3c495e;
  color: #f4f6f8;
  text-align: center;
  border-radius: 50px;
}

.iconOptions {
  color: #303947;
  height: 230px;
  text-align: center;
}

.m-buttom {
  margin-bottom: 50;
}

.n-bottom {
  margin-bottom: 0;
}

// Custom styles
/* .fas {
  @include colorize($color: accent);
} */

.info {
  font-size: 16;
  horizontal-align: center;
  vertical-align: center;
}
</style>
