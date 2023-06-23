<template>
    <Page>
        <StackLayout backgroundColor="#F4F6F8">
            <StackLayout orientation="horizontal" style="background-color: #00acc1; text-align: center" height="70">
                <Label :text="'fa-reply' | fonticon" fontSize="18" class="fas" width="20%" @tap="$modal.close"></Label>
                <Label text="Registro de Pallets" fontSize="18" color="#F4F6F8" fontWeight="bold" width="60%"></Label>
                <!-- <Image src="~/assets/images/logobarco.png" stretch="aspectFit" width="60%"/> -->
                <!-- <Label text="Nuevo Barco" width="20%"></Label> -->
            </StackLayout>
            <card-view margin="10" elevation="40" radius="15">
                <GridLayout rows="auto,auto,auto" padding="30">
                    <!-- <Image
              row="0"
              src="~/assets/images/logobarco.png"
              stretch="aspectFit"
              height="30%"
              width="60%"
            /> -->
                    <Label row="0" text="Pallet:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
                    <TextField row="1" v-model="model.codePallet" padding="10" hint="code..." class="fas" height="45"
                        fontSize="18" boder="none" style="
                        placeholder-color: #3c495e;
                        color: #3c495e;
                        background-color: #c0c9d7;
                        width: 80%;
                    " @textChange="savePallet" />
                    <Label row="2" :text="'fa-qrcode' | fonticon" class="fas" marginTop="10" fontSize="45" fontWeight="bold"
                        style=" color: #3c495e; width: 80%; text-align:center;" @tap="scanner" />
                    <!-- <GridLayout row="1"  height="40" columns="auto, *,auto" padding="10" @tap="modalOption" style="background-color: #c0c9d7; width: 80%;">
              <Label :text="'fa-ship' | fonticon" fontSize="18" class="fas" col="0" color="#3c495e"/>
              <Label text="item" ccolor="white" class="p-l-10" fontSize="15" col="1" color="#3c495e"/>
              <Label :text="'fa-sort-down' | fonticon" fontSize="18" class="fas" col="2" color="#3c495e"/>
            </GridLayout> -->
                    <!-- <Button
              row="3"
              marginTop="14"
              backgroundColor="#0096b7"
              color="#F4F6F8"
              text="Agregar"
              @tap="addShip"
              style="width: 80%"
            /> -->
                </GridLayout>
            </card-view>
        </StackLayout>
    </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
const { insertPallet } = require("~/sqlite/database");
import { BarcodeScanner } from "nativescript-barcodescanner";

export default {
    components: {
        Header,
    },
    props: {
        textBar: {
            type: String,
            required: true,
        },
        textHint1: {
            type: String,
            required: true,
        },
        textHint2: {
            type: String,
            required: true,
        },
        item: {
            type: Object,
        },
        update: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            model: {
                codePallet: "",
                warehouse_id: "",
            },
            options: ["Cala Pedra", "Cala Pino", "Cala Pula"],
            selectedIndex: 1,
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
            let barcodeScanner = new BarcodeScanner()

            barcodeScanner.scan({
                //formats: "QR_CODE,PDF_417",    Pass in of you want to restrict scanning to certain types
                cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
                cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                showFlipCameraButton: true,   // default false
                preferFrontCamera: false,     // default false
                showTorchButton: true,        // default false
                beepOnScan: true,             // Play or Suppress beep on scan (default true)
                fullScreen: true,             // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
                torchOn: false,               // launch with the flashlight on (default false)
                closeCallback: function () { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
                resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
                openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
            }).then((res) => {
                this.model.codePallet = res.text
                this.model.warehouse_id = this.item.id
            }
                /* function (result) {
                    console.log("Scan format: " + result.format);
                    console.log("Scan text:   " + result.text);

                },
                function (error) {
                    console.log("No scan: " + error);
                } */
            );
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
                const pallet = await insertPallet(this.model);
                console.log("save ", pallet);
                /* this.model.codePallet = "";
                this.model.warehouse_id = ""; */
            } catch (error) {
                console.log("al insertar error ", error);
            }
        },
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
