<template>
  <Page @loaded="addFocus">
    <Header />
    <grid-layout rows="auto, *" backgroundColor="#F4F6F8">
      <card-view margin="10" elevation="2" radius="40" row="0">
        <GridLayout rows="auto,auto,auto,auto" padding="30">
          <StackLayout row="0" orientation="horizontal" >
            <Image src="~/assets/images/logopallets.png" stretch="aspectFit" height="10%" width="40%" />
            <StackLayout width="60%">
              <Label text="N° de Pallets:" textAlignment="center" fontSize="18" margin="5" fontWeight="bold"
                style=" color: #3c495e; width: 100%;" />
              <Label :text="pallets.length" textAlignment="center" fontSize="18" fontWeight="bold"
                style=" color: #3c495e; width: 100%;" backgroundColor="#c0c9d7"/>
            </StackLayout>
          </StackLayout>
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
      <ListView for="(item, index) in pallets" :class="spaceEnd" @itemLoading="scrolling" @loadMoreItems="onScroll"
        @itemTap="onItemTap" row="1">
        <v-template>
          <GridLayout columns="*,70" @longPress="operations">
            <StackLayout orientation="horizontal" @tap="addObservation(item)" col="0">
              <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" color="#0096b7" />
              <Label :text="item.text" class="p-l-10 colorIcons" textWrap="true" width="auto" fontSize="25" />
            </StackLayout>
            <Label :text="'fa-times' | fonticon" class="fas colorMinus" fontSize="18" col="1"
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
import { mapState } from 'vuex';
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue"
import CustomInput from '~/components/pallets/inputObservation/CustomInput'
const { getPallets, insertPallet, deletePallet, updatePallet } = require("~/sqlite/database");
import Alert from '~/alerts/Alerts';
import moment from 'moment';

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
    Header
  },
  data() {
    return {
      bandera: false,
      model: {
        codePallet: "",
        warehouse_id: "",
      },
      code: '',
      typingTimer: null,
      typingTimeout: 500,
      pallets: [],
    };
  },
  computed: {
    ...mapState(['item']),

    spaceEnd() {
      return {
        'e-height': this.bandera == true,
        'n-height': this.bandera == false
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
    scrolling() {
      if (this.bandera) {
        this.bandera = false
      }
    },

    onScroll() {
      this.bandera = true
      /* console.log(this.spaceEnd)
      console.log("movimiento") */
    },

    onItemTap() {
      console.log("success");
    },

    openModal() {
      this.$showModal(CreateEditPallet, { fullscreen: true, props: { item: this.item } });
    },

    addObservation(item) {
      this.$showModal(
        CustomInput
        /* {
          fullscreen: false,
          props: {
            item: item
          }
        } */
      ).then((res) => {
        if (res.option) {
          item.observation = res.observation
          this.editPallet(item)
        }
      })
    },

    async editPallet(item) {
      try {
        console.log("observacion ", item.observation)
        const pallet = await updatePallet(item)
        console.log("update ", pallet)
      } catch (error) {
        console.error("Hubo un error al editar ", error)
      }
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
          this.model.pallet_creation = moment().format("YYYY-MM-DD HH:mm:ss")
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

.n-height {
  height: 100%;
}

.e-height {
  height: 300px;
}

.colorIcons {
  color: #222a37;
}

.colorMinus {
  color: #e92222;
}
</style>
