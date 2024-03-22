<template>
  <Page>
    <Header
      :data="pallets"
      :icons="icons"
      :operation1="showInfo"
      :operation2="navigate"
      :search="true"
    />
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <Label class="info" v-if="pallets.length == 0">
        <FormattedString>
          <Span class="fas" text.decode="&#x1F6A2; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        for="(item, index) in pallets"
        @itemTap="onItemTap"
        @itemLoading="onScroll"
        @loadMoreItems="scrolling"
        :class="spaceButtom"
        ref="listView"
        v-if="pallets.length > 0"
      >
        <v-template>
          <GridLayout columns="30,*,40">
            <Label
              col="0"
              :text="index + 1"
              fontSize="11"
              textWrap="true"
              fontWeight="bold"
              class="styleIndex"
            />
            <StackLayout orientation="horizontal" @tap="showInfo(item)" col="1">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-pallet' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth">
                <Label
                  text="Codigo:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="14"
                />
                <Label
                  :text="item.text"
                  class="p-l-10 colorIcons"
                  textWrap="true"
                  width="auto"
                  fontSize="14"
                />
              </StackLayout>
            </StackLayout>
            <Label
              :text="'fa-ellipsis-v' | fonticon"
              class="fas iconOptions"
              fontSize="15"
              col="2"
              @tap="navigate(item, index)"
            />
          </GridLayout>
        </v-template>
      </ListView>
      <FloatingButton :icon="'fa-cloud-upload-alt'" :method="sendAll" />
    </grid-layout>
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
import InfoPallet from "./infoPallet/InfoPallet.vue";
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue";
import Alert from "~/alerts/Alerts";
import axios from "axios";
import { mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";

export default {
  name: "Ships",
  components: {
    Header,
    FloatingButton,
  },

  data() {
    return {
      message: "No hay Pallets Escaneados",
      pallets: [],
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
    ...mapMutations(["indicatorState"]),

    onItemTap() {
      console.log("success");
    },

    onScroll(args) {
      console.log("index ", args.index);
      if (args.index < this.pallets.length - 1) {
        this.space = false;
      } else if (args.index == this.pallets.length - 1) {
        this.space = true;
      }
      console.log("loading ", this.space);
    },

    scrolling() {
      /*  console.log("REF ", this.$refs.listView.nativeView)
       if (!this.space) {
         this.space = true
       }
       console.log("hide scroll", this.space) */
    },

    async palletInfo(item) {
      try {
        console.log("item ", item);
        const pallet = await getPallet(item);
        console.log("info ", pallet);
        for (let i = 0; i < pallet.length; i++) {
          this.infoPallet = Object.assign(
            {},
            {
              id: pallet[i][0],
              code: pallet[i][1],
              observation: pallet[i][2],
              ship_id: pallet[i][3],
              warehouse_id: pallet[i][4],
            }
          );
        }
      } catch (error) {
        console.log("error al traer los datos ", error);
      }
    },

    async showInfo(item) {
      try {
        await this.palletInfo(item);
        this.$showModal(InfoPallet, { props: { infoPallet: this.infoPallet } });
        console.log(this.infoPallet);
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
          generalOptions: false,
          component: CreateEditPallet,
          getInfo: () => this.getAll(),
          deleteRow: () => this.removePallet(item.id, index),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {
            console.log(value);
          },
        },
      };
      this.$showBottomSheet(ButtomSheet, options).then(() => {
        this.getAll();
      });
    },

    async getAll() {
      try {
        this.pallets = [];
        const pallets = await getPalletsAll();
        console.log(pallets);
        for (let i = 0; i < pallets.length; i++) {
          this.pallets.push({
            id: pallets[i][0],
            text: pallets[i][1],
            observation: pallets[i][2],
            warehouse_id: pallets[i][3],
          });
        }
        //this.total = true
        /* console.log(this.total) */
      } catch (error) {
        console.error("error al traer lo datos ", error);
      }
    },

    async sendAll() {
      try {
        this.loadingCharge(true);
        this.sendPallets = [];
        const pallets = await loadPallets();
        if (pallets.length > 0) {
          for (let i = 0; i < pallets.length; i++) {
            this.sendPallets.push({
              code: pallets[i][1],
              observation: pallets[i][2],
              ship_id: pallets[i][3],
              ship_name: pallets[i][4],
              journey: pallets[i][5],
              warehouse_id: pallets[i][6] || 0,
              warehouse_name: pallets[i][7],
              pallet_creation: pallets[i][8],
            });
          }
          console.log("send ", this.sendPallets);
          //const postPallets = await axios.post('http://186.1.181.146:8811/mcp-backend/public/api/mobile/loadpallets', this.sendPallets)
          //const postPallets = await axios.post('http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/loadpallets', this.sendPallets)
          const postPallets = await axios.post(
            "http://172.70.8.122/mcp-backend/public/api/mobile/loadpallets",
            this.sendPallets
          );
          this.loadingCharge();
          Alert.success("Cargue");
          console.log("send ", postPallets.data);
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

    async removePallet(id, index) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const pallet = await deletePallet(id);
          this.pallets.splice(index, 1);
          /* console.log("delete ", pallet) */
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
