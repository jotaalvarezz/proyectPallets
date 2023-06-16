<template>
  <Page>
    <GridLayout rows="auto,auto" padding="30">
      <TextField
        row="0"
        v-model="nameShip"
        hint="Nombra de Barco..."
        height="40"
        fontSize="15"
        style="placeholder-color: #f4f6f8"
      />
      <Button row="1" backgroundColor="#081a36" text="Agregar" @tap="addShip"/>
    </GridLayout>
  </Page>
</template>
<script>
import Header from '~/components/header/Header.vue';
const {insertData} = require('~/sqlite/database')

export default {
    components:{
        Header
    },
    data() {
        return {
            nameShip:''
        }
    },

    methods: {
        async addShip(){
            try {
                const ship = await insertData(this.nameShip)
                console.log("save ",ship)
            } catch (error) {
                console.log("al insertar error ",error)
            }
        }
    },
};
</script>