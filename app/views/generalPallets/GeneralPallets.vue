<template>
  <Page>
    <Header />
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in pallets" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="auto, *,50">
            <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" col="0" color="#0096b7" />
            <Label :text="item.text" class="p-l-10 colorIcons" width="auto" fontSize="25" col="1"
              @tap="showInfo(item)"/>
            <Label :text="'fa-ellipsis-v' | fonticon" class="fas colorIcons" fontSize="18" col="2"
              @tap="navigate(item)" />
          </GridLayout>
        </v-template>
      </ListView>
      <fab @tap="getAll" marginBottom="13%" :text="'fa-sync' | fonticon" class="fab-sync fas" rippleColor="#f1f1f1">
      </fab>
    </grid-layout>
  </Page>
</template>

<script>
import Header from "~/components/header/Header.vue";
const { getPalletsAll, getPallet } = require("~/sqlite/database");
import ButtomSheet from '~/components/buttomSheet/ButtomSheet.vue';
import InfoPallet from "./infoPallet/InfoPallet.vue";


export default {
  name: "Ships",
  components: {
    Header
  },
  data() {
    return {
      pallets: [],
      infoPallet:[]
    };
  },

  methods: {
    onItemTap() {
      console.log("success");
    },

    async showInfo(item){
      try {
        const pallet = await getPallet(item)
        console.log("info ",pallet)
        for (let i = 0; i < pallet.length; i++) {
          this.infoPallet.push({
                    id: pallet[i][0],
                    code: pallet[i][1],
                    observation: pallet[i][2],
                    ship_id: pallet[i][3],
                    warehouse_id: pallet[i][4]
                  })
        }
        this.$showModal(InfoPallet,{props:{infoPallet:this.infoPallet[0]}})
        console.log(this.infoPallet)
      } catch (error) {
        console.log("error al traer los datos ",error)
      }
    },

    navigate(item) {
      const options = {
        dismissOnBackgroundTap:true,
        dismissOnDraggingDownSheet:false,
        transparent:true,
        props: {
          item:item
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => { console.log(value) }
        }
      }
      this.$showBottomSheet(ButtomSheet, options)
    },

    async getAll() {
      try {
        this.pallets = []
        const pallets = await getPalletsAll()
        console.log(pallets)
        for (let i = 0; i < pallets.length; i++) {
          this.pallets.push({ id: pallets[i][0], text: pallets[i][1], observation: pallets[i][2], warehouse_id: pallets[i][3] })
        }
      } catch (error) {
        console.error("error al traer lo datos ", error)
      }
    }
  },

  created() {
    this.getAll()
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

.colorIcons {
  color: #303947;
}
</style>
