<template>
  <Page>
    <Header />
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in ships" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="auto, *,50" @tap="navigate(item)" @longPress="operations">
            <Label :text="'fa-ship' | fonticon" class="fas" width="110" fontSize="70" col="0"
              color="#0096b7" />
            <Label :text="item.text" class="p-l-10 colorIcons" width="auto"  fontSize="25" col="1" />
            <Label :text="'fa-trash-alt' | fonticon" class="fas colorIcons" fontSize="18" col="2" @tap="deleteRow(item.id, index)" />
            <!-- <StackLayout col="3">
              <check-box :checked="isChecked" boxType="circle" @checkedChange="isChecked = $event.value" />
            </StackLayout> -->
          </GridLayout>
        </v-template>
      </ListView>
      <fab @tap="getShips" marginBottom="13%" :text="'fa-sync' | fonticon" class="fab-sync fas" rippleColor="#f1f1f1">
      </fab>
      <FloatingButton row="2" :add="openModal" />
    </grid-layout>
  </Page>
</template>

<script>
/* import { GridLayout } from "@nativescript/core"; */
import Warehouses from "~/views/Warehouses/Warehouses.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import CreateEditShip from "~/views/ships/createEditShip/CreateEditShip.vue";
import Header from "~/components/header/Header.vue";
import { mapMutations, mapState } from 'vuex'
const { getShips, deleteShip } = require('~/sqlite/database')


export default {
  name: "Ships",
  components: {
    FloatingButton,
    CreateEditShip,
    Warehouses,
    Header
  },
  data() {
    return {
      ships: [],
      selectedOption: null,
      isChecked: false
    };
  },
  computed: {
    ...mapState(['item'])
  },
  methods: {
    ...mapMutations(['saveItem', 'saveCollection']),

    onItemTap() {
      console.log("success");
    },

    navigate(item) {
      this.saveItem(item)
      this.$router.push('warehouses.index')
    },

    openModal() {
      this.$showModal(CreateEditShip,
        {
          fullscreen: true, props: {
            textBar: 'Nuevo Barco',
            textHint1: 'Nombre de Barco...',
            textHint2: 'Viaje...',
            item: {},
            update: false,
          }
        })
    },

    async deleteRow(id, index) {
      try {
        const record = await deleteShip(id)
        this.ships.splice(index,1)
        console.log(record)
      } catch (error) {
        console.log("eleminacion fallida ", error)
      }
    },

    operations() {
      try {
        /* const btnShip = document.querySelector('#ship');
        btnShip.addEventListener('mouseup', (e)=>{
          console.log('hola mouseup')
        }) */
        console.log('por fuera')
      } catch (error) {
        console.log('hubo un error con el evento ', error)
      }
    },

    async getShips() {
      try {
        this.ships = []
        const ships = await getShips()
        console.log(ships)
        for (let i = 0; i < ships.length; i++) {
          this.ships.push({ id: ships[i][0], text: ships[i][1], journey: ships[i][2]})
        }
      } catch (error) {
        console.error("error al traer lo datos ", error)
      }
    }
  },

  created(){
    this.getShips()
  }
  /* components: { GridLayout }, */
};
</script>
<style lang="scss">
.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #00acc1;
  color: #F4F6F8;
  horizontal-align: right;
  vertical-align: bottom;
}

.colorIcons{
    color: #303947;
}
</style>
