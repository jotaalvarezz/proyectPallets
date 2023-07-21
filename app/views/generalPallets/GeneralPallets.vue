<template>
  <Page>
    <Header :data="pallets" :icons="icons" :operation1="showInfo" :operation2="navigate" />
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in pallets" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="*,70">
            <StackLayout orientation="horizontal" @tap="showInfo(item)" col="0">
              <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" color="#0096b7" />
              <Label :text="item.text" class="p-l-10 colorIcons" textWrap="true" width="65%" fontSize="25" />
            </StackLayout>
            <Label :text="'fa-ellipsis-v' | fonticon" class="fas colorIcons" fontSize="18" col="1"
              style="text-align: center;" @tap="navigate(item, index)" />
          </GridLayout>
        </v-template>
      </ListView>
      <fab @tap="sendAll" :text="'fa-sync' | fonticon" class="fab-sync fas" rippleColor="#f1f1f1">
      </fab>
    </grid-layout>
  </Page>
</template>

<script>
import Header from "~/components/header/Header.vue";
const { getPalletsAll, getPallet, deletePallet, loadPallets } = require("~/sqlite/database");
import ButtomSheet from '~/components/buttomSheet/ButtomSheet.vue';
import InfoPallet from "./infoPallet/InfoPallet.vue";
import CreateEditPallet from '~/views/pallets/CreateEditPallet/CreateEditPallet.vue'
import Alert from "~/alerts/Alerts";
import axios from "axios"
import { mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";

export default {
  name: "Ships",
  components: {
    Header
  },
  data() {
    return {
      pallets: [],
      infoPallet: {},
      icons: {
        iconLogo: 'fa-pallet',
        iconOperations: 'fa-ellipsis-v'
      },
      sendPallets: []
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapMutations(['indicatorState']),

    onItemTap() {
      console.log("success");
    },

    async palletInfo(item) {
      try {
        console.log("item ", item)
        const pallet = await getPallet(item)
        console.log("info ", pallet)
        for (let i = 0; i < pallet.length; i++) {
          this.infoPallet = Object.assign({},
            {
              id: pallet[i][0],
              code: pallet[i][1],
              observation: pallet[i][2],
              ship_id: pallet[i][3],
              warehouse_id: pallet[i][4]
            })
        }
      } catch (error) {
        console.log("error al traer los datos ", error)
      }
    },

    async showInfo(item) {
      try {
        await this.palletInfo(item)
        this.$showModal(InfoPallet, { props: { infoPallet: this.infoPallet } })
        console.log(this.infoPallet)
      } catch (error) {
        console.log("error al traer los datos ", error)
      }
    },

    async navigate(item, index) {
      await this.palletInfo(item)
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: this.infoPallet,
          generalOptions: false,
          component: CreateEditPallet,
          getInfo: () => this.getAll(),
          deleteRow: () => this.removePallet(item.id, index)
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

    async getAll() {
      try {
        this.pallets = []
        const pallets = await getPalletsAll()
        console.log(pallets)
        for (let i = 0; i < pallets.length; i++) {
          this.pallets.push(
            {
              id: pallets[i][0],
              text: pallets[i][1],
              observation: pallets[i][2],
              warehouse_id: pallets[i][3]
            })
        }
        console.log(this.pallets)
      } catch (error) {
        console.error("error al traer lo datos ", error)
      }
    },

    async sendAll() {
      try {
        this.loadingCharge(true)
        this.sendPallets = []
        const pallets = await loadPallets()
        for (let i = 0; i < pallets.length; i++) {
          this.sendPallets.push(
            {
              id: pallets[i][0],
              code: pallets[i][1],
              observation: pallets[i][2],
              ship_id: pallets[i][3],
              ship_name: pallets[i][4],
              journey: pallets[i][5],
              warehouse_id: pallets[i][6],
              warehouse_name: pallets[i][7],
              pallet_creation: pallets[i][8]
            })
        }
        const postPallets = await axios.post('http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/loadpallets', this.sendPallets)
        this.loadingCharge()
        Alert.success("Cargue")
        console.log("send ", postPallets.data)
      } catch (error) {
        this.loadingCharge()
        Alert.danger("Hubo un error en el cargue",error)
      }
    },

    async removePallet(id, index) {
      let confirmated = await Alert.Danger()
      if (confirmated) {
        try {
          const pallet = await deletePallet(id)
          this.pallets.splice(index, 1)
          console.log("delete ", pallet)
          this.$closeBottomSheet()
        } catch (error) {
          console.log("hubo un error al eliminar")
        }
      }
    },
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
