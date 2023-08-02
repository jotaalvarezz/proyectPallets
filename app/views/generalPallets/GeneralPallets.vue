<template>
  <Page>
    <Header :data="pallets" :icons="icons" :operation1="showInfo" :operation2="navigate" :search="true" />
    <grid-layout rows="*" backgroundColor="#F4F6F8">
      <ListView for="(item, index) in pallets" @itemTap="onItemTap" @itemLoading="onScroll" @loadMoreItems="scrolling"
        :class="spaceButtom" ref="listView">
        <v-template>
          <GridLayout columns="30,*,40">
            <Label row="0" :text="(index + 1)" fontSize="10" textWrap="true" fontWeight="bold" class="styleIndex" />
            <StackLayout orientation="horizontal" @tap="showInfo(item)" col="1">
              <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" color="#0096b7" />
              <StackLayout>
                <Label text="Codigo:" class="p-l-10 subTittle" textWrap="true" width="auto" fontSize="18" />
                <Label :text="item.text" class="p-l-10 colorIcons" textWrap="true" width="auto" fontSize="18" />
              </StackLayout>
            </StackLayout>
            <Label :text="'fa-ellipsis-v' | fonticon" class="fas iconOptions" fontSize="18" col="2"
                  @tap="navigate(item, index)" />
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
      sendPallets: [],
      showSpace: true,
      space: false,
    };
  },

  mixins: [mixinMasters],

  computed: {
    spaceButtom() {
      return {
        'n-buttom': this.space == false,
        'm-buttom': this.space == true
      }
    }
  },

  methods: {
    ...mapMutations(['indicatorState']),

    onItemTap() {
      console.log("success");
    },

    onScroll(args) {
      console.log("index ", args.index)
      if (args.index < this.pallets.length - 1) {
        this.space = false
      } else if (args.index == this.pallets.length - 1) {
        this.space = true
      }
      console.log("loading ", this.space)
    },

    scrolling() {
      /*  console.log("REF ", this.$refs.listView.nativeView)
       if (!this.space) {
         this.space = true
       }
       console.log("hide scroll", this.space) */

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
        //this.total = true
        console.log(this.total)
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
        //const postPallets = await axios.post('http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/loadpallets', this.sendPallets)
        const postPallets = await axios.post('http://172.70.8.122/mcp-backend/public/api/mobile/loadpallets', this.sendPallets)
        this.loadingCharge()
        Alert.success("Cargue")
        console.log("send ", postPallets.data)
      } catch (error) {
        this.loadingCharge()
        Alert.danger("Hubo un error en el cargue", error.message)
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
<style lang="scss" scoped>
.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #EAB14D;
  color: #F4F6F8;
  horizontal-align: right;
  vertical-align: bottom;
}

.colorIcons {
  color: #303947;
}

.subTittle{
  color: #222a37;
  text-decoration: underline;
}

.styleIndex {
  background-color: #3c495e;
  color: #f4f6f8;
  text-align: center;
  border-radius: 50px;
}

.iconOptions{
  color: #303947;
  height: 300px;
  text-align: center;
}

.m-buttom {
  margin-bottom: 50;
}

.n-bottom {
  margin-bottom: 0;
}
</style>
