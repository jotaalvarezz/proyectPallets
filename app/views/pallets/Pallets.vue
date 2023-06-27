<template>
  <Page @loaded="addFocus">
    <Header />
    <grid-layout rows="auto, *" backgroundColor="#F4F6F8">
      <card-view margin="10" elevation="40" radius="15" row="0">
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
      <ListView for="(item, index) in pallets" @itemTap="onItemTap" row="1">
        <v-template>
          <GridLayout columns="auto, *,50" @longPress="operations">
            <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" col="0" color="#0096b7" />
            <Label :text="item.text" class="p-l-10 colorIcons" width="auto" fontSize="25" col="1" />
            <Label
              :text="'fa-minus' | fonticon"
              class="fas colorMinus"
              fontSize="18"
              col="2"
              @tap="deleteRow(item.id)"
            />
          </GridLayout>
        </v-template>
      </ListView>
      <fab row="2" @tap="getPallets" marginBottom="13%" :text="'fa-sync' | fonticon" class="fab-sync fas"
        rippleColor="#f1f1f1">
      </fab>
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
const { getPallets, insertPallet } = require("~/sqlite/database");

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
    Header
  },
  data() {
    return {
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
    ...mapState(['item'])
  },
  watch: {
    code() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(this.savePallet, this.typingTimeout);
    }
  },
  methods: {
    onItemTap() {
      console.log("success");
    },

    openModal() {
      this.$showModal(CreateEditPallet, { fullscreen: true, props: { item: this.item } });
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

.colorIcons {
  color: #222a37;
}

.colorMinus{
  color: #ff0000;
}
</style>
