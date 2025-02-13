<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <HeaderComponent title="Registro de Pallets" :handleback="$modal.close" />
      <GridLayout
        ref="form"
        class="shadow"
        rows="*"
        backgroundColor="#F4F6F8"
        margin="10"
        borderWidth="1"
        borderColor="#c0c9d7"
        borderRadius="5"
      >
        <ScrollView>
          <GridLayout
            rows="auto,auto,auto,auto,auto,auto,auto,auto"
            padding="30"
          >
            <Image
              src="~/assets/images/logopallets.png"
              stretch="aspectFit"
              height="5%"
              width="45%"
              row="0"
            />
            <FormGroupTextField
              row="1"
              label="Pallet:"
              placeholder="codigo de pallet..."
              fontsize="14"
              v-model="model.code"
              enable="false"
            />
            <FormGroupTextField
              row="2"
              label="Observacion:"
              placeholder="observacion..."
              fontsize="14"
              typeInput="number"
              v-model="model.observation"
            />
            <FormGroupTextField
              row="3"
              label="Barco:"
              placeholder="nombre de barco..."
              fontsize="14"
              v-model="model.ship_id"
              enable="false"
            />
            <FormGroupTextField
              row="4"
              label="Bodega:"
              placeholder="nombre de bodega..."
              fontsize="14"
              v-model="model.warehouse_id"
              enable="false"
            />
            <!-- <Stripe
              row="5"
              class="stripe"
              color="#3c495e"
              marginTop="20"
              marginBottom="20"
            />
            <Button
              row="6"
              backgroundColor="#F4F6F8"
              color="#222a37"
              text="ENVIAR"
              @tap="editPallet"
              style="width: 80%"
              borderWidth="1"
              borderColor="#222a37"
              borderRadius="30"
            /> -->
          </GridLayout>
        </ScrollView>
        <FloatingButton
          :icon="'fa-save'"
          iconSize="sm"
          :method="editPallet"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import Stripe from "~/components/stripe/Stripe";
const { insertPallet, updatePallet } = require("~/sqlite/database");
import { BarcodeScanner } from "nativescript-barcodescanner";
import Alerts from "~/alerts/Alerts";

export default {
  name: "CreateEditPallet",
  components: {
    Header,
    FormGroupTextField,
    Stripe,
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      model: {},
      code: "",
      options: ["Cala Pedra", "Cala Pino", "Cala Pula"],
      selectedIndex: 1,
      typingTimer: null,
      typingTimeout: 1000,
    };
  },
  computed: {
    setJourney() {
      this.journey = this.item.text;
      return this.journey;
    },
  },
  methods: {
    scanner() {
      let barcodeScanner = new BarcodeScanner();

      barcodeScanner
        .scan({
          //formats: "QR_CODE,PDF_417",    Pass in of you want to restrict scanning to certain types
          cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
          cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
          message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
          showFlipCameraButton: true, // default false
          preferFrontCamera: false, // default false
          showTorchButton: true, // default false
          beepOnScan: true, // Play or Suppress beep on scan (default true)
          fullScreen: true, // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
          torchOn: false, // launch with the flashlight on (default false)
          closeCallback: function () {}, // invoked when the scanner was closed (success or abort)
          resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
          orientation: "portrait", // Android only, optionally lock the orientation to either "portrait" or "landscape"
          openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
        })
        .then((res) => {
          this.model.codePallet = res.text;
          this.model.warehouse_id = this.item.id;
        });
    },

    onSelectedIndexChanged(event) {
      this.selectedIndex = event.value;
      this.model.nameShip = this.options[this.selectedIndex];
    },

    modalOption() {
      this.$showModal(ListOptions);
    },

    async savePallet() {
      try {
        if (this.code.length > 0) {
          this.model.codePallet = this.code;
          this.model.warehouse_id = this.item.id;
          const pallet = await insertPallet(this.model);
          this.code = "";
          this.model.warehouse_id = "";
          this.$refs.field.nativeView.focus();
        }
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },

    async editPallet() {
      let confirmated = await Alerts.confirmation();
      if (confirmated) {
        try {
          if (this.model.observation.length > 0) {
            const pallet = await updatePallet(this.model);
            this.$modal.close();
            //this.$router.pushClear('generalpallets.index')
          }
        } catch (error) {
          console.error("Hubo un error al editar ", error);
        }
      }
    },

    addFocus() {
      this.$refs.field.nativeView.focus();
    },
  },

  created() {
    this.model = this.info;
  },
};
</script>
<style>
.custom-dropdown {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 8px;
}
</style>
