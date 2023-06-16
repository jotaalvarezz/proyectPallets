<template>
  <!-- <Page> -->
    <grid-layout rows="*" backgroundColor="#3C495E">
      <ListView for="(item, index) in listOfItems" @itemTap="onItemTap">
        <v-template>
          <FlexboxLayout>
            <Label
              :text="'fa-ship' | fonticon"
              class="fas"
              width="110"
              fontSize="70"
              backgroundColor="#222A37"
              color="white"
            />
            <Label
              :text="item.text"
              class="p-l-10"
              width="auto"
              color="white"
              fontSize="25"
            />
          </FlexboxLayout>
        </v-template>
      </ListView>
      <fab @tap="getShips" marginBottom="13%" :text="'fa-sync' | fonticon" class="fab-sync fas" rippleColor="#f1f1f1"></fab>
      <FloatingButton row="2" :add="openModal"/>
    </grid-layout>
  <!-- </Page> -->
</template>

<script>
/* import { GridLayout } from "@nativescript/core"; */
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import CreateEditShip from "./createEditShip/CreateEditShip.vue";
const {allData} = require('~/sqlite/database')

export default {
  name: "Ships",
  components: {
    FloatingButton,
    CreateEditShip
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
  methods: {
    onItemTap() {
      console.log("success");
    },

    openModal(){
      this.$showModal(CreateEditShip,{fullscreen:true})
    },

    async getShips(){
      try {
        this.listOfItems = []
        const ships = await allData()
        console.log(ships)
        for (let i = 0; i < ships.length; i++) {
          this.listOfItems.push({text:ships[i][1]})
        }
      } catch (error) {
        console.error("error al traer lo datos ",error)
      }
    }
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
