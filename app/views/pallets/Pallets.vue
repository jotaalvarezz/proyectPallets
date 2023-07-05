<template>
  <Page @loaded="addFocus">
    <Header />
    <grid-layout rows="auto, *" backgroundColor="#F4F6F8">
      <card-view margin="10" elevation="2" radius="40" row="0">
        <GridLayout rows="auto,auto,auto" padding="30">
          <Image src="~/assets/images/logopallets.png" stretch="aspectFit" height="10%" width="30%" row="0" />
          <Label row="1" text="Pallet:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
          <TextField ref="field" row="2" v-model="code" padding="10" hint="code..." class="fas" height="45" fontSize="18"
            boder="none" style="
                        placeholder-color: #3c495e;
                        color: #3c495e;
                        background-color: #c0c9d7;
                        width: 80%;
                    " />
        </GridLayout>
      </card-view>
      <ListView for="(item, index) in pallets" :class="spaceEnd" @itemLoading="scrolling" @loadMoreItems="onScroll" @itemTap="onItemTap" row="1">
        <v-template>
          <GridLayout columns="auto, *,50" @longPress="operations">
            <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" col="0" color="#0096b7" />
            <Label :text="item.text" class="p-l-10 colorIcons" textWrap="true" width="auto" fontSize="25" col="1" />
            <Label :text="'fa-times' | fonticon" class="fas colorMinus" fontSize="18" col="2"
              @tap="deleteRow(item.id, index)" />
          </GridLayout>
        </v-template>
      </ListView>
    </grid-layout>
  </Page>
</template>

<script>
import Header from '~/components/header/Header.vue'
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
/* import CreateEditShip from "./createEditShip/CreateEditShip.vue"; */
import { mapState } from 'vuex';
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue"
const { getPallets, insertPallet, deletePallet } = require("~/sqlite/database");
import Alert from '~/alerts/Alerts';

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
    Header
  },
  data() {
    return {
      bandera:false,
      model: {
        codePallet: "",
        warehouse_id: "",
      },
      code: '',
      typingTimer: null,
      typingTimeout: 1000,
      pallets: [],
    };
  },
  computed: {
    ...mapState(['item']),

    spaceEnd(){
      return{
        'e-height' : this.bandera == true,
        'n-height' : this.bandera == false
      }
    }
  },
  watch: {
    code() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(this.savePallet, this.typingTimeout);
    }
  },
  methods: {
    scrolling(){
      if(this.bandera){
        this.bandera = false
      }
    },

    onScroll(){
      this.bandera = true
      console.log(this.spaceEnd)
      console.log("movimiento")
    },

    onItemTap() {
      console.log("success");
    },

    openModal() {
      this.$showModal(CreateEditPallet, { fullscreen: true, props: { item: this.item } });
    },

    async deleteRow(id, index) {
      let confirmated = await Alert.Danger()
      if (confirmated) {
        try {
          const record = await deletePallet(id);
          console.log(record);
          this.pallets.splice(index, 1)
        } catch (error) {
          console.log("eleminacion fallida ", error);
        }
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

    async paletas() {
      try {
        const pallets = await getPalletsAll();
        console.log("paletas ", pallets)
      } catch (error) {
        console.log(error)
      }
    },

    async savePallet() {
      try {
        if (this.code.length > 0) {
          this.model.codePallet = this.code
          console.log("CUCH ", this.model.codePallet)
          this.model.warehouse_id = this.item.id
          const pallet = await insertPallet(this.model);
          console.log("save ", pallet);
          this.code = "";
          this.model.warehouse_id = "";
          this.$refs.field.nativeView.focus()
          this.getPallets()
        }
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },

    async getPallets() {
      try {
        this.pallets = [];
        console.log("item ", this.item)
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

    addFocus() {
      this.$refs.field.nativeView.focus()
    },
  },

  created() {
    this.getPallets()
  }
  /* components: { GridLayout }, */
};
</script>
<style lang="scss" scoped>
.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #00acc1;
  color: #f4f6f8;
  horizontal-align: right;
  vertical-align: bottom;
}

.n-height{
  height: 100%;
}

.e-height{
  height: 300px;
}
.colorIcons {
  color: #222a37;
}

.colorMinus {
  color: #e92222;
}
</style>
