<template>
    <GridLayout rows="auto,*" class="nt-drawer__content">
        <StackLayout row="0" class="nt-drawer__header">
            <Image class="nt-drawer__header-image fas t-36" src.decode="font://&#xf2bd;" />
            <Label class="nt-drawer__header-brand" text="User Name" />
            <Label class="nt-drawer__header-footnote" text="username@mail.com" />
        </StackLayout>
        <ScrollView row="1" class="nt-drawer__body">
            <StackLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="home">
                    <Label col="0" :text="'fa-home' | fonticon" class="fas" fontSize="18" />
                    <Label col="1" text="Inicio" fontSize="15" class="p-l-10" />
                </GridLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="createTabless">
                    <Label col="0" :text="'fa-pallet' | fonticon" class="fas" fontSize="18" />
                    <Label col="1" text="Pallets" fontSize="15" class="p-l-10" />
                </GridLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="createTables">
                    <Label col="0" :text="'fa-sync' | fonticon" class="fas" fontSize="18" />
                    <Label col="1" text="Actualizar" fontSize="15" class="p-l-10" />
                </GridLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="deleteDB">
                    <Label col="0" :text="'fa-trash-alt' | fonticon" class="fas" fontSize="18" />
                    <Label col="1" text="Eliminar DB" fontSize="15" class="p-l-10" />
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </GridLayout>
</template>
<script>
//import {createTable, openDatabase} from '~/sqlite/database'
const { createTable, DBdelete, structure } = require('../../sqlite/database');
import * as utils from "~/shared/util";
import PalletsWarehouse from '~/views/tabview/palletsWarehouse/PalletsWarehouse.vue';

export default {
    name: 'Content-Drawer',

    methods: {
        async createTables() {
            try {
                const db = await createTable()
                alert({
                    title: 'Inicializando DB',
                    message: 'Actualizando Tablas...',
                    okButtonText: "aceptar"
                })
                console.log(db)
            } catch (error) {
                console.log('error intentando crear las tablas...')
            }
        },

        home() {
            try {
                this.$router.push('ship.index')
                utils.closeDrawer()
            } catch (error) {
                console.log("error al dirigirme a la ruta ",error)
            }
        },

        createTabless() {
            try {
                //this.$navigateTo(PalletsWarehouse)
                this.$router.push('palletswarehouse.index')
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

        async deleteDB() {
            try {
                const db = await DBdelete()
                console.log("... ", db)
            } catch (error) {
                console.log('delete exitoso!')
            }
        }
    },
}
</script>
