<template>
    <GridLayout rows="auto, *" class="nt-drawer__content">
        <StackLayout row="0" class="nt-drawer__header" backgroundColor="#00acc1">
            <Image class="nt-drawer__header-image fas t-36" src="~/assets/images/logobarco.png" />
            <Label class="nt-drawer__header-brand coloIcons" color="#F4F6F8" fontWeight="bold" text="WSP" />
        </StackLayout>
        <ScrollView row="1" class="nt-drawer__body" backgroundColor="#F4F6F8">
            <StackLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="home">
                    <Label col="0" :text="'fa-home' | fonticon" class="fas colorIcons" fontSize="18" />
                    <Label col="1" text="Inicio" fontSize="15" class="p-l-10 colorIcons" />
                </GridLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="pallets">
                    <Label col="0" :text="'fa-pallet' | fonticon" class="fas colorIcons" fontSize="18" />
                    <Label col="1" text="Pallets" fontSize="15" class="p-l-10 colorIcons" />
                </GridLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="createTables">
                    <Label col="0" :text="'fa-sync' | fonticon" class="fas colorIcons" fontSize="18" />
                    <Label col="1" text="Actualizar" fontSize="15" class="p-l-10 colorIcons" />
                </GridLayout>
               <!--  <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="deleteDB">
                    <Label col="0" :text="'fa-trash-alt' | fonticon" class="fas colorIcons" fontSize="18" />
                    <Label col="1" text="Eliminar DB" fontSize="15" class="p-l-10 colorIcons" />
                </GridLayout> -->
                <!-- <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="showProgressDialog">
                    <Label col="0" :text="'fa-trash-alt' | fonticon" class="fas colorIcons" fontSize="18" />
                    <Label col="1" text="Prueba" fontSize="15" class="p-l-10 colorIcons" />
                </GridLayout> -->
            </StackLayout>
        </ScrollView>
    </GridLayout>
</template>
<script>
//import {createTable, openDatabase} from '~/sqlite/database'
const { createTable, DBdelete, structure } = require('../../sqlite/database');
import * as utils from "~/shared/util";
import axios from "axios"
import { mapState, mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";

export default {
    name: 'Content-Drawer',
    /* components: {
        Loading
    }, */

    data() {
        return {
            loading: false,
        }
    },

    computed: {
        ...mapState(['indicator'])
    },

    mixins: [mixinMasters],

    methods: {

        ...mapMutations(['saveShipsWarehouses', 'indicatorState']),

        async getShipsWarehouses() {
            try {
                /* const shipsWarehouses = await axios.get('http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/ships'); */
                const shipsWarehouses = await axios.get('http://172.70.8.122/mcp-backend/public/api/mobile/ships');
                this.saveShipsWarehouses(shipsWarehouses)
                return shipsWarehouses
            } catch (error) {
                /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
                console.log(error)
            }
        },

        prueba() {
            this.$router.pushClear('prueba.index')
            utils.closeDrawer()
        },

        async createTables() {
            try {
                //this.loading = true
                this.loadingCharge(true)
                const shipsWarehouses = await this.getShipsWarehouses()
                const db = await createTable(shipsWarehouses.data.data)
                this.$router.pushClear('ship.index')
                this.loadingCharge()
                Alert.success("Actualizacion de DB")
                //console.log(db)
            } catch (error) {
                this.loadingCharge()
                Alert.danger("No se pudo actualizar la DB",error)
                console.log('error intentando crear las tablas...')
            }
        },

        home() {
            try {
                this.$router.pushClear('ship.index')
                utils.closeDrawer()
            } catch (error) {
                console.log("error al dirigirme a la ruta ", error)
            }
        },

        pallets() {
            try {
                this.$router.pushClear('generalpallets.index')
                utils.closeDrawer()
                /* const db = await structure()
                alert({
                    title:'Inicializando DB',
                    message:'Actualizando Tablas...',
                    okButtonText:"aceptar"
                })
                console.log(db) */
            } catch (error) {
                console.log('error intentando crear las tablas...')
            }
        },

        /* async deleteDB() {
            try {
                const db = await DBdelete()
                console.log("... ", db)
            } catch (error) {
                console.log('delete exitoso!')
            }
        } */
    },
}
</script>
<style>
.colorIcons {
    color: #222a37;
}
</style>
