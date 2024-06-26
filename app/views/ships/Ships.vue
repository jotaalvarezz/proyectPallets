<template>
  <Page @loaded="getShips">
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
          rotate="360"
          :handleEvent="() => refresShips()"
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
          <Span class="fas" text.decode="&#x1F6A2;" />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        row="1"
        v-if="array_filter.length > 0"
        for="(item, index) in array_filter"
        @itemTap="navigate"
      >
        <v-template>
          <GridLayout columns="*,50">
            <StackLayout orientation="horizontal" col="0">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-ship' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth">
                <Label
                  text="Barco:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="14"
                />
                <Label
                  :text="item.name"
                  class="p-l-10 colorIcons"
                  fontSize="14"
                />
              </StackLayout>
            </StackLayout>
            <ButtonNavigate
              col="1"
              height="50"
              width="50"
              icon="fa-ellipsis-v"
              radius="50"
              :handleEvent="() => navigateOptions(item, index)"
            />
          </GridLayout>
        </v-template>
      </ListView>
      <FloatingButton row="1" :icon="'fa-plus'" :method="openModal" />
    </GridLayout>
  </Page>
</template>

<script>
import Warehouses from "~/views/Warehouses/Warehouses.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import CreateEditShip from "~/views/ships/createEditShip/CreateEditShip.vue";
import Header from "~/components/header/Header.vue";
import { mapMutations, mapState } from "vuex";
const { getShips, deleteShip } = require("~/sqlite/database");
import Alert from "~/alerts/Alerts";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import mixinMasters from "~/mixins/Master";
import ListModal from "~/components/listModal/ListModal.vue";
import ShipList from "~/views/ships/ShipList";

export default {
  name: "Ships",
  components: {
    FloatingButton,
    CreateEditShip,
    Warehouses,
    Header,
    ButtomSheet,
  },
  data() {
    return {
      message: "No hay barcos para mostrar",
      search: "",
      ships: [],
      array_filter: [],
      selectedOption: null,
      isChecked: false,
      icons: {
        iconLogo: "fa-ship",
        iconOperations: "fa-ellipsis-v",
      },
    };
  },
  mixins: [mixinMasters],
  computed: {
    ...mapState(["item", "shipsWarehouses"]),
  },
  methods: {
    ...mapMutations(["saveItem", "setShip"]),

    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.ships.filter(
          (data) =>
            !this.search ||
            data.name.toLowerCase().includes(this.search.toLowerCase())
        );
      } else if (this.search.length === 0) {
        this.array_filter = [];
      }
    },

    clear() {
      this.array_filter = this.ships;
    },

    refresShips() {
      this.getShips();
    },

    navigate(event) {
      this.saveItem(event.item);
      this.setShip(event.item);
      this.$router.push("warehouses.index");
    },

    navigateOptions(item, index) {
      item.action = true;
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: true,
          component: CreateEditShip,
          infoRegister: () => this.shipInfo(item),
          updateRegister: () => this.shipEdit(item),
          deleteRow: () => this.deleteRow(item.id, index),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {},
        },
      };
      this.$showBottomSheet(ButtomSheet, options).then(() => {
        this.getAll();
      });
    },

    openModal() {
      this.$showModal(CreateEditShip, {
        fullscreen: true,
        props: {
          textBar: "Nuevo Barco",
          info: {
            text: "",
            journey: "",
            action: false,
          },
        },
      }).then((res) => {
        this.getShips();
      });
    },

    shipInfo(item) {
      const listRows = ShipList.listRows;
      this.$showModal(ListModal, {
        props: {
          title: "Informacion del Barco",
          info: item,
          listRows: listRows,
        },
      });
    },

    shipEdit(item) {
      item.action = true;
      this.$showModal(CreateEditShip, {
        fullscreen: true,
        props: { textBar: "Actualizar Barco", info: item },
      }).then((res) => {
        this.$emit("someEvent", "Valor de ejemplo");
      });
    },

    async deleteRow(id, index) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteShip(id);
          this.ships.splice(index, 1);
        } catch (error) {
          console.log("eleminacion fallida ", error);
        }
      }
    },

    async getShips() {
      try {
        this.loadingCharge(true);
        this.ships = [];
        const res = await getShips();
        this.ships = res.data;
        this.array_filter = this.ships;
      } catch (error) {
        Alert.danger("Hubo un error", error);
        console.error("error al traer lo datos ", error);
      } finally {
        this.loadingCharge();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.heigth {
  height: 70%;
}

.subTittle {
  color: #222a37;
  text-decoration: underline;
  font-weight: bold;
}

.iconOptions {
  color: #303947;
  height: auto;
  text-align: center;
}

.colorIcons {
  color: #303947;
}

.colorTimes {
  color: #e92222;
}

.search-bar {
  font-size: 15; /* Cambia el tamaño del texto aquí */
}
</style>
