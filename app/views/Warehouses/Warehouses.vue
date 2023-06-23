<template>
  <Page>
    <Header/>
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in warehouses" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="auto, *,50" @tap="navigate(item)" @longPress="operations">
            <Label :text="'fa-warehouse' | fonticon" class="fas" width="110" fontSize="70" col="0"
            color="#0096b7" />
            <Label :text="item.text" class="p-l-10 colorIcons" width="auto" fontSize="25" col="1" />
            <Label :text="'fa-trash-alt' | fonticon" class="fas colorIcons" fontSize="18" col="2" @tap="deleteRow(item.id, index)" />
          </GridLayout>
        </v-template>
      </ListView>
      <fab @tap="getWarehouses" marginBottom="13%" :text="'fa-sync' | fonticon" class="fab-sync fas" rippleColor="#f1f1f1">
      </fab>
      <FloatingButton row="2" :add="openModal" />
    </grid-layout>
  </Page>
</template>

<script>
/* import { GridLayout } from "@nativescript/core"; */
import Header from '~/components/header/Header.vue'
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import CreateEditWarehouse from './createEditWarehouse/CreateEditWarehouse.vue';
const { getWarehouses, deleteWarehouse } = require('~/sqlite/database')
import { mapState, mapMutations } from "vuex";

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
   Header
  },
  data() {
    return {
      warehouses: [],
    };
  },
  computed:{
    ...mapState(['item'])
  },
  methods: {
    ...mapMutations(['saveItem']),
    onItemTap() {
      console.log("success");
    },

    navigate(item) {
      this.saveItem(item)
      this.$router.push('pallets.index')
    },

    openModal() {
      this.$showModal(CreateEditWarehouse, {
        fullscreen: true, props: {
          textBar: 'Nueva Bodega',
          textHint1: 'Nombre de Bodega...',
          textHint2: 'Barco...',
          item: this.item,
          update: false,
        }
      })
    },

    async deleteRow(id, index) {
      try {
        const record = await deleteWarehouse(id)
        this.warehouses.splice(index,1)
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

    async getWarehouses() {
      try {
        this.warehouses = []
        const warehouses = await getWarehouses(this.item.id)
        console.log(warehouses)
        for (let i = 0; i < warehouses.length; i++) {
          this.warehouses.push({ id: warehouses[i][0], text: warehouses[i][1], ship_id:warehouses[i][2]})
        }
      } catch (error) {
        console.error("error al traer lo datos ", error)
      }
    }
  },

  created() {
    this.getWarehouses()
  },
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
