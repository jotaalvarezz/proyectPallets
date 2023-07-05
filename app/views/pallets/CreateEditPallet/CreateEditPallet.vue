<template>
    <Page>
        <StackLayout backgroundColor="#F4F6F8">
            <StackLayout orientation="horizontal" style="background-color: #00acc1; text-align: center" height="70">
                <Label :text="'fa-reply' | fonticon" fontSize="18" color="#F4F6F8" class="fas" width="20%"
                    @tap="$modal.close"></Label>
                <Label text="Registro de Pallet" fontSize="18" color="#F4F6F8" fontWeight="bold" width="60%"></Label>
            </StackLayout>
            <card-view margin="10" elevation="40" radius="15">
                <GridLayout rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" padding="30">
                    <Image src="~/assets/images/logopallets.png" stretch="aspectFit" height="30%" width="60%" row="0" />
                    <Label row="1" text="Pallet:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
                    <TextField ref="field" row="2" isEnabled="false" v-model="model.code" padding="10" hint="code..."
                        class="fas" height="45" fontSize="18" boder="none" style="
                        placeholder-color: #3c495e;
                        color: #3c495e;
                        background-color: #c0c9d7;
                        width: 80%;
                    " />
                    <Label row="3" text="Observacion:" fontSize="18" fontWeight="bold"
                        style=" color: #3c495e; width: 80%;" />
                    <TextField ref="field" row="4" v-model="model.observation" padding="10" hint="observacion..."
                        class="fas" height="45" fontSize="18" boder="none" style="
                        placeholder-color: #3c495e;
                        color: #3c495e;
                        background-color: #c0c9d7;
                        width: 80%;
                    " />
                    <Label row="5" text="Barco:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
                    <GridLayout row="6" height="45" columns="auto, *,auto" padding="10"
                        style="background-color: #c0c9d7; width: 80%;">
                        <Label :text="'fa-ship' | fonticon" fontSize="18" class="fas" col="0" color="#3c495e" />
                        <Label :text="model.ship_id" ccolor="white" class="p-l-10" fontSize="15" col="1" color="#3c495e" />
                        <Label :text="'fa-sort-down' | fonticon" fontSize="18" class="fas" col="2" color="#3c495e" />
                    </GridLayout>
                    <Label row="7" text="Bodega:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
                    <GridLayout row="8" height="45" columns="auto, *,auto" padding="10"
                        style="background-color: #c0c9d7; width: 80%;">
                        <Label :text="'fa-warehouse' | fonticon" fontSize="18" class="fas" col="0" color="#3c495e" />
                        <Label :text="model.warehouse_id" ccolor="white" class="p-l-10" fontSize="15" col="1"
                            color="#3c495e" />
                        <Label :text="'fa-sort-down' | fonticon" fontSize="18" class="fas" col="2" color="#3c495e" />
                    </GridLayout>
                    <Button row="9" marginTop="30" backgroundColor="#0096b7" color="#F4F6F8" text="ENVIAR" @tap="editPallet"
                        style="width: 80%;" borderWidth="1" borderColor="#222a37" borderRadius="30" />
                </GridLayout>
            </card-view>
        </StackLayout>
    </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
const { insertPallet, updatePallet } = require("~/sqlite/database");
import { BarcodeScanner } from "nativescript-barcodescanner";
import Alerts from '~/alerts/Alerts'

export default {
    name: 'CreateEditPallet',
    components: {
        Header,
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
            code: '',
            options: ["Cala Pedra", "Cala Pino", "Cala Pula"],
            selectedIndex: 1,
            typingTimer: null,
            typingTimeout: 1000
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
                if (this.code.length > 0) {
                    this.model.codePallet = this.code
                    console.log("CUCH ", this.model.codePallet)
                    this.model.warehouse_id = this.item.id
                    const pallet = await insertPallet(this.model);
                    console.log("save ", pallet);
                    this.code = "";
                    this.model.warehouse_id = "";
                    this.$refs.field.nativeView.focus()
                }
            } catch (error) {
                console.log("al insertar error ", error);
            }
        },

        async editPallet() {
            let confirmated = await Alerts.confirmation()
            if (confirmated) {
                try {
                    console.log("observacion ", this.model.observation)
                    if (this.model.observation.length > 0) {
                        const pallet = await updatePallet(this.model)
                        console.log("update ", pallet)
                        this.$modal.close()
                        //this.$router.pushClear('generalpallets.index')
                    }
                } catch (error) {
                    console.error("Hubo un error al editar ", error)
                }
            }
        },

        addFocus() {
            this.$refs.field.nativeView.focus()
        }
    },

    created() {
        this.model = this.info
        console.log(this.model)
    }
};
</script>
<style>
.custom-dropdown {
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 8px;
}
</style>
