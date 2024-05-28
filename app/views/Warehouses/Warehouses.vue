<template>
  <Page>
    <Header :search="false" />
    <GridLayout rows="auto, auto ,*" backgroundColor="#F4F6F8">
      <Label
        row="0"
        :text="'Bodegas ' + shipName"
        class="tittle text-center"
        fontSize="18"
        fontWeight="bold"
        textWrap="true"
      />
      <Stripe row="1" color="#3c495e" />
      <ListView for="(item, index) in warehouses" row="2">
        <v-template>
          <GridLayout columns="* ,40">
            <StackLayout orientation="horizontal" @tap="navigate(item)" col="0">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-warehouse' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <!-- color="#0096b7" -->
              <StackLayout class="heigth">
                <Label
                  text="Bodega:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="14"
                />
                <Label
                  :text="item.text"
                  class="p-l-10 colorIcons"
                  width="auto"
                  fontSize="14"
                />
              </StackLayout>
            </StackLayout>
            <Label
              :text="'fa-times' | fonticon"
              class="fas colorMinus"
              fontSize="15"
              col="1"
              @tap="deleteRow(item.id, index)"
            />
          </GridLayout>
        </v-template>
      </ListView>
      <FloatingButton row="2" :icon="'fa-plus'" :method="openModal" />
    </GridLayout>
  </Page>
</template>

<script>
import Alert from "~/alerts/Alerts";
import Header from "~/components/header/Header.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import CreateEditWarehouse from "./createEditWarehouse/CreateEditWarehouse.vue";
import Stripe from "~/components/stripe/Stripe";
const { getWarehouses, deleteWarehouse } = require("~/sqlite/database");
import { mapState, mapMutations } from "vuex";

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
    Stripe,
    Header,
  },
  data() {
    return {
      valor: true,
      warehouses: [],
      shipName: "",
    };
  },
  computed: {
    ...mapState(["item", "ship"]),
  },
  methods: {
    ...mapMutations(["saveItem"]),

    navigate(item) {
      this.saveItem(item);
      this.$router.push("pallets.index");
    },

    openModal() {
      this.$showModal(CreateEditWarehouse, {
        fullscreen: true,
        props: {
          textBar: "Nueva Bodega",
          textHint1: "Nombre de Bodega...",
          shipName: this.shipName,
          item: this.item,
          update: false,
        },
      }).then(() => {
        this.getWarehouses();
      });
    },

    async deleteRow(id, index) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteWarehouse(id);
          this.warehouses.splice(index, 1);
        } catch (error) {
          console.log("eleminacion fallida ", error);
        }
      }
    },

    async getWarehouses() {
      try {
        this.warehouses = [];
        const warehouses = await getWarehouses(this.ship.id);
        for (let i = 0; i < warehouses.length; i++) {
          this.warehouses.push({
            id: warehouses[i][0],
            text: warehouses[i][1],
            warehouse_id: warehouses[i][2],
            ship_id: warehouses[i][3],
          });
        }
      } catch (error) {
        console.error("error al traer lo datos ", error);
      }
    },
  },

  created() {
    this.shipName = this.item.text;
    this.getWarehouses();
  },
};
</script>
<style lang="scss">
.heigth {
  height: 70%;
}

.colorIcons {
  color: #303947;
}

.colorMinus {
  color: #e92222;
  height: auto;
  text-align: center;
}

.header {
  background-color: #f4f6f8;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.tittle {
  color: #3c495e;
  /* text-shadow: 2px 12px 5px rgba(0, 0, 0, 0.5); */
  margin: 10;
}

.subTittle {
  color: #222a37;
  text-decoration: underline;
  font-weight: bold;
}
</style>
