<template>
  <Page>
    <!-- <Header/> -->
    <grid-layout rows="*" backgroundColor="#3C495E">
      <ListView for="(item, index) in listOfItems" @tap="navigate" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="auto, *,50" @longPress="operations">
            <Label :text="'fa-warehouse' | fonticon" class="fas" width="110" fontSize="70" col="0"
              backgroundColor="#222A37" color="white" />
            <Label :text="item.text" class="p-l-10" width="auto" color="white" fontSize="25" col="1" />
            <Label :text="'fa-trash-alt' | fonticon" class="fas" fontSize="18" col="2" @tap="deleteRow(item.id)" />
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
//import Header from '~/components/header/Header.vue'
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
/* import CreateEditShip from "./createEditShip/CreateEditShip.vue"; */
const { allData, deleteRecord } = require('~/sqlite/database')
import { mapState } from "vuex";

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
    // Header
  },
  data() {
    return {
      listOfItems: [
        { text: "first" },
        { text: "second" },
        { text: "three" },
        { text: "four" },
      ],
    };
  },
  computed:{
    ...mapState(['item'])
  },
  methods: {
    onItemTap() {
      console.log("success");
    },

    navigate() {
      console.log("state >> ",this.item)
      //this.$router.push('pallets.index')
    },

    openModal() {
      this.$showModal(CreateEditShip, {
        fullscreen: true, props: {
          textBar: 'Nueva Bodega',
          textHint1: 'Nombre de Bodega...',
          textHint2: 'Barco...',
          update: false,
        }
      })
    },

    async deleteRow(id) {
      try {
        const record = await deleteRecord(id)
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
        this.listOfItems = []
        const ships = await allData()
        console.log(ships)
        for (let i = 0; i < ships.length; i++) {
          this.listOfItems.push({ id: ships[i][0], text: ships[i][1] })
        }
      } catch (error) {
        console.error("error al traer lo datos ", error)
      }
    }
  },

  created() {
    console.log("params ship ",this.$route.query)
  },
  /* components: { GridLayout }, */
};
</script>
<style lang="scss">
.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #081a36;
  horizontal-align: right;
  vertical-align: bottom;
}
</style>
