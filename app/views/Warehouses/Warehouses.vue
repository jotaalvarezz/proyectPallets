<template>
  <Page>
    <Header :search="false" />
    <GridLayout rows="auto, auto ,*" backgroundColor="#F4F6F8">
      <Label
        row="0"
        :text="'Bodegas ' + ship.name"
        class="tittle text-center"
        fontSize="18"
        fontWeight="bold"
        textWrap="true"
      />
      <Stripe row="1" color="#3c495e" />
      <ListView row="2" for="(item, index) in warehouses" @itemTap="navigate">
        <v-template>
          <GridLayout columns="* ,50">
            <StackLayout orientation="horizontal" col="0">
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
                  :text="item.name"
                  class="p-l-10 colorIcons"
                  width="auto"
                  fontSize="14"
                />
              </StackLayout>
            </StackLayout>
            <ButtonNavigate
              col="1"
              height="50"
              width="50"
              icon="fa-times"
              iconColor="#e92222"
              radius="50"
              :handleEvent="() => deleteRow(item.id, index)"
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
import CreateEditWarehouse from "./createEditWarehouse/CreateEditWarehouse.vue";
const { getWarehouses, deleteWarehouse } = require("~/sqlite/database");
import { mapState, mapMutations } from "vuex";

export default {
  name: "Ships",
  components: {},
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

    navigate(event) {
      this.saveItem(event.item);
      this.$router.push("pallets.index");
    },

    openModal() {
      this.$showModal(CreateEditWarehouse, {
        fullscreen: true,
        props: {
          textBar: "Nueva Bodega",
          item: this.item
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
        const res = await getWarehouses(this.ship.id);
        this.warehouses = res.data
      } catch (error) {
        console.error("error al traer lo datos ", error);
      }
    },
  },

  created() {
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
