<template>
  <Page>
    <StackLayout backgroundColor="#3c495e">
      <StackLayout orientation="horizontal" style="background-color: #222A37; text-align: center;" height="70">
        <Label :text="'fa-reply' | fonticon" fontSize="18" class="fas" width="20%" @tap="$modal.close"></Label>
        <Label text="Nuevo Barco" fontSize="18" fontWeight="bold" width="60%"></Label>
        <!-- <Label text="Nuevo Barco" width="20%"></Label> -->
      </StackLayout>
      <card-view margin="10" elevation="40" radius="15">
        <GridLayout rows="auto,auto,auto" padding="30">
          <TextField
            row="0"
            v-model="nameShip"
            hint="Nombra de Barco..."
            height="40"
            fontSize="15"
            borderColor="#3c495e"
            style="placeholder-color: #3c495e; color: #3c495e;"
          />
          <TextField
            row="1"
            v-model="journey"
            hint="Viaje..."
            height="40"
            fontSize="15"
            borderColor="#3c495e"
            style="placeholder-color: #3c495e; color: #3c495e;"
          />
        <Button row="2" marginTop="14" backgroundColor="#081a36" text="Agregar" @tap="addShip"/>
      </GridLayout>
      </card-view>
    </StackLayout>
  </Page>
</template>
<script>
import { fonticon } from 'nativescript-fonticon';
import Header from '~/components/header/Header.vue';
const {insertData} = require('~/sqlite/database')

export default {
    components:{
        Header
    },
    data() {
        return {
            nameShip:'',
            journey:''
        }
    },

    methods: {
        async addShip(){
            try {
                const ship = await insertData(this.nameShip)
                console.log("save ",ship)
                this.nameShip = ''
                this.journey = ''
            } catch (error) {
                console.log("al insertar error ",error)
            }
        }
    },
};
</script>
