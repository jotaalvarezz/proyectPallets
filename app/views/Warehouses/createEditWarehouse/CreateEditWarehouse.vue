<template>
    <Page>
        <StackLayout backgroundColor="#F4F6F8">
            <StackLayout orientation="horizontal" style="background-color: #00acc1; text-align: center" height="70">
                <Label :text="'fa-reply' | fonticon" fontSize="18" class="fas" color="#F4F6F8" width="20%"
                    @tap="$modal.close"></Label>
                <Label :text="textBar" fontSize="18" color="#F4F6F8" fontWeight="bold" width="60%"></Label>
                <!-- <Image src="~/assets/images/logobarco.png" stretch="aspectFit" width="60%"/> -->
                <!-- <Label text="Nuevo Barco" width="20%"></Label> -->
            </StackLayout>
            <card-view margin="10" elevation="40" radius="15">
                <GridLayout rows="auto,auto,auto,auto" padding="30">
                    <Image row="0" src="~/assets/images/logobarco.png" stretch="aspectFit" height="30%" width="60%" />
                    <TextField row="1" padding="10" v-model="model.nameWarehouse" hint="Nombre de Bodega..." height="40"
                        fontSize="15" boder="none"
                        style="placeholder-color: #3c495e; color: #3c495e; background-color: #c0c9d7; width: 80%;" />
                    <GridLayout row="2" height="50" columns="auto, *,auto" padding="10" @tap="modalOption"
                        style="background-color: #c0c9d7; width: 80%;">
                        <Label :text="'fa-ship' | fonticon" fontSize="18" class="fas" col="0" color="#3c495e" />
                        <Label :text="nameShip" ccolor="white" class="p-l-10" fontSize="15" col="1" color="#3c495e" />
                        <Label :text="'fa-sort-down' | fonticon" fontSize="18" class="fas" col="2" color="#3c495e" />
                    </GridLayout>
                    <Button row="3" text="Agregar" backgroundColor="#F4F6F8" color="#222a37"
                        fontSize="22" @tap="addWarehouse" borderWidth="1" borderColor="#222a37" borderRadius="30"
                        marginTop="14" />
                </GridLayout>
            </card-view>
        </StackLayout>
    </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
const { insertWarehuse, getShips } = require("~/sqlite/database");
import Alerts from "~/alerts/Alerts";
import { mapState } from "vuex";

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
        shipName: {
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
                nameWarehouse: "",
                ship_id: "",
            },
            options: [],
            selectedIndex: "",
        };
    },
    computed: {
        ...mapState(['ship']),
        nameShip() {
            this.model.ship_id = this.ship.id;
            return this.ship.text;
        },
    },
    methods: {
        modalOption() {
            /* this.$showModal(ListOptions); */
        },

        onSelectedIndexChanged(event) {
            this.selectedIndex = event.value;
            this.model.nameShip = this.options[this.selectedIndex];
        },

        async addWarehouse() {
            try {
                if (this.model.nameWarehouse.length > 0) {
                    const warehouse = await insertWarehuse(this.model);
                    console.log("save ", warehouse);
                    this.model.nameWarehouse = "";
                    this.$modal.close()
                } else {
                    Alerts.info("El campo nombre de Bodega esta vacio...", 1)
                }
            } catch (error) {
                console.log("al insertar error ", error);
            }
        },

        async getShips() {
            try {
                this.ships = []
                const ships = await getShips()
                console.log(ships)
                for (let i = 0; i < ships.length; i++) {
                    this.options.push(ships[i][1])
                }
            } catch (error) {
                console.error("error al traer lo datos ", error)
            }
        }
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
