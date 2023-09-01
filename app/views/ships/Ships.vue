<template>
  <Page @loaded="getShips">
    <Header :data="ships" :icons="icons" :operation1="navigate" :operation2="navigateOptions" :search="true" />
    <GridLayout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in ships" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="*,40" @longPress="operations">
            <StackLayout orientation="horizontal" @tap="navigate(item)" col="0">
              <Label :text="'fa-ship' | fonticon" class="fas" width="110" fontSize="70" color="#0096b7"/>
              <StackLayout class="heigth">
                <Label text="Barco:" class="p-l-10 subTittle" textWrap="true" width="auto" fontSize="18" />
                <Label :text="item.text" class="p-l-10 colorIcons" fontSize="18"/>
              </StackLayout>
            </StackLayout>
            <Label :text="'fa-ellipsis-v' | fonticon" class="fas iconOptions" fontSize="18" col="1"
              style="text-align: center;" @tap="navigateOptions(item, index)"/>
          </GridLayout>
        </v-template>
      </ListView>
      <FloatingButton row="2" :icon="'fa-plus'" :method="openModal" />
    </GridLayout>
  </Page>
</template>

<script>
import Warehouses from "~/views/Warehouses/Warehouses.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import CreateEditShip from "~/views/ships/createEditShip/CreateEditShip.vue";
import infoShip from "~/views/ships/infoShips/infoShip.vue"
import Header from "~/components/header/Header.vue";
import { mapMutations, mapState } from 'vuex'
const { getShips, deleteShip } = require('~/sqlite/database')
import Alert from "~/alerts/Alerts";
import ButtomSheet from '~/components/buttomSheet/ButtomSheet.vue';
import mixinMasters from "~/mixins/Master";


export default {
  name: "Ships",
  components: {
    FloatingButton,
    CreateEditShip,
    Warehouses,
    Header,
    ButtomSheet
  },
  data() {
    return {
      ships: [],
      selectedOption: null,
      isChecked: false,
      icons: {
        iconLogo: 'fa-ship',
        iconOperations: 'fa-ellipsis-v'
      }
    };
  },
  mixins: [mixinMasters],
  computed: {
    ...mapState(['item', 'shipsWarehouses'])
  },
  methods: {
    ...mapMutations(['saveItem', 'setShip']),

    onItemTap() {
      console.log("success");
    },

    navigate(item) {
      this.saveItem(item)
      this.setShip(item)
      this.$router.push('warehouses.index')
    },

    navigateOptions(item, index) {
      item.action = true
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: true,
          component: CreateEditShip,
          componentInfo: infoShip,
          getInfo: () => this.getShips(),
          deleteRow: () => this.deleteRow(item.id, index)
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => { console.log(value) }
        }
      }
      this.$showBottomSheet(ButtomSheet, options)
        .then(() => {
          this.getAll()
        })
    },

    openModal() {
      this.$showModal(CreateEditShip,
        {
          fullscreen: true, props: {
            textBar: 'Nuevo Barco',
            info: {
              text:"",
              journey:"",
              action: false
            },
          }
        })
        .then((res) => {
          this.getShips()
        })
    },

    async deleteRow(id, index) {
      let confirmated = await Alert.Danger(1)
      if (confirmated) {
        try {
          const record = await deleteShip(id)
          this.ships.splice(index, 1)
          console.log(record)
        } catch (error) {
          console.log("eleminacion fallida ", error)
        }
      }
    },

    operations() {
      /* menu de opciones */
    },

    async getShips() {
      try {
        this.loadingCharge(true)
        this.ships = []
        const ships = await getShips()
        console.log(ships)
        for (let i = 0; i < ships.length; i++) {
          this.ships.push({ id: ships[i][0], text: ships[i][1], journey: ships[i][2] })
        }
        this.loadingCharge()
      } catch (error) {
        this.loadingCharge()
        Alert.danger("Hubo un error", error)
        console.error("error al traer lo datos ", error)
      }
    }
  },

  created() {

    /* this.loadingCharge() */
  }
  /* components: { GridLayout }, */
};
</script>
<style lang="scss" scoped>
.heigth{
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
</style>
