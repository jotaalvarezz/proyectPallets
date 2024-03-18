<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <GridLayout
        height="65"
        rows="*"
        columns="50, 3*, 50"
        backgroundColor="#00acc1"
      >
        <Label
          row="0"
          col="0"
          :text="'fa-reply' | fonticon"
          fontSize="16"
          class="fas text-center"
          color="#F4F6F8"
          @tap="$modal.close"
        />
        <Label
          row="0"
          col="1"
          class="text-center"
          text="Registro de Pallets"
          fontSize="15"
          color="#F4F6F8"
          fontWeight="bold"
        ></Label>
      </GridLayout>
      <card-view margin="10" elevation="2" radius="5">
        <GridLayout
          rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto"
          padding="30"
        >
          <Image
            src="~/assets/images/logopallets.png"
            stretch="aspectFit"
            height="30%"
            width="60%"
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
          <!-- <Label
            row="5"
            text="Barco:"
            fontSize="18"
            fontWeight="bold"
            style="color: #3c495e; width: 80%"
          />
          <GridLayout
            row="6"
            height="45"
            columns="auto, *,auto"
            padding="10"
            borderRadius="2"
            style="background-color: #c0c9d7; width: 90%"
          >
            <Label
              :text="'fa-ship' | fonticon"
              fontSize="18"
              class="fas"
              col="0"
              color="#3c495e"
            />
            <Label
              :text="model.ship_id"
              ccolor="white"
              class="p-l-10"
              fontSize="15"
              col="1"
              color="#3c495e"
            />
            <Label
              :text="'fa-sort-down' | fonticon"
              fontSize="18"
              class="fas"
              col="2"
              color="#3c495e"
            />
          </GridLayout>
          <Label
            row="7"
            text="Bodega:"
            fontSize="18"
            fontWeight="bold"
            style="color: #3c495e; width: 80%"
          />
          <GridLayout
            row="8"
            height="45"
            columns="auto, *,auto"
            padding="10"
            borderRadius="2"
            style="background-color: #c0c9d7; width: 90%"
          >
            <Label
              :text="'fa-warehouse' | fonticon"
              fontSize="18"
              class="fas"
              col="0"
              color="#3c495e"
            />
            <Label
              :text="model.warehouse_id"
              ccolor="white"
              class="p-l-10"
              fontSize="15"
              col="1"
              color="#3c495e"
            />
            <Label
              :text="'fa-sort-down' | fonticon"
              fontSize="18"
              class="fas"
              col="2"
              color="#3c495e"
            />
          </GridLayout> -->
          <Stripe
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
          />
        </GridLayout>
      </card-view>
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
  /*   watch: {
          code() {
              clearTimeout(this.typingTimer);
              this.typingTimer = setTimeout(this.savePallet, this.typingTimeout);
          }
      }, */
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
        closeCallback: function () {
          console.log("Scanner closed");
        }, // invoked when the scanner was closed (success or abort)
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
          console.log("CUCH ", this.model.codePallet);
          this.model.warehouse_id = this.item.id;
          const pallet = await insertPallet(this.model);
          console.log("save ", pallet);
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
          console.log("observacion ", this.model.observation);
          if (this.model.observation.length > 0) {
            const pallet = await updatePallet(this.model);
            console.log("update ", pallet);
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
    console.log(this.model);
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
