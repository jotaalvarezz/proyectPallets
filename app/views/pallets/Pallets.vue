<template>
  <Page>
    <Header/>
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in pallets" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="auto, *,50" @longPress="operations">
            <Label
              :text="'fa-pallet' | fonticon"
              class="fas"
              width="110"
              fontSize="70"
              col="0"
              color="#0096b7"
            />
            <Label
              :text="item.text"
              class="p-l-10 colorIcons"
              width="auto"
              fontSize="25"
              col="1"
            />
            <!-- <Label
              :text="'fa-trash-alt' | fonticon"
              class="fas colorIcons"
              fontSize="18"
              col="2"
              @tap="deleteRow(item.id)"
            /> -->
          </GridLayout>
        </v-template>
      </ListView>
      <fab
        @tap="getPallets"
        marginBottom="13%"
        :text="'fa-sync' | fonticon"
        class="fab-sync fas"
        rippleColor="#f1f1f1"
      ></fab>
      <FloatingButton row="2" :add="openModal" />
    </grid-layout>
  </Page>
</template>

  <script>
/* import { GridLayout } from "@nativescript/core"; */
import Header from '~/components/header/Header.vue'
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
/* import CreateEditShip from "./createEditShip/CreateEditShip.vue"; */
import { mapState } from 'vuex';
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue"
const { getPallets, getPalletas } = require("~/sqlite/database");

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
     Header
  },
  data() {
    return {
      pallets: [],
    };
  },
  computed: {
    ...mapState(['item'])
  },

  methods: {
    onItemTap() {
      console.log("success");
    },

    openModal() {
      this.$showModal(CreateEditPallet, { fullscreen: true , props:{item:this.item}});
    },

    async deleteRow(id) {
      try {
        const record = await deleteRecord(id);
        console.log(record);
      } catch (error) {
        console.log("eleminacion fallida ", error);
      }
    },

    operations() {
      try {
        /* const btnShip = document.querySelector('#ship');
          btnShip.addEventListener('mouseup', (e)=>{
            console.log('hola mouseup')
          }) */
        console.log("por fuera");
      } catch (error) {
        console.log("hubo un error con el evento ", error);
      }
    },

    async paletas(){
      try {
        const pallets = await getPalletas();
        console.log("paletas ", pallets)
      } catch (error) {
        console.log(error)
      }
    },

    async getPallets() {
      try {
        this.pallets = [];
        console.log("item ",this.item)
        const pallets = await getPallets(this.item.id);
        console.log(pallets);
        for (let i = 0; i < pallets.length; i++) {
          this.pallets.push(
          {
            id: pallets[i][0],
            text: pallets[i][1],
            observation: pallets[i][2],
            warehouse_id: pallets[i][3]
          });
        }
      } catch (error) {
        console.error("error", error);
      }
    },
  },

  created(){
    this.getPallets()
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
  color: #f4f6f8;
  horizontal-align: right;
  vertical-align: bottom;
}

.colorIcons{
    color: #303947;
}
</style>
