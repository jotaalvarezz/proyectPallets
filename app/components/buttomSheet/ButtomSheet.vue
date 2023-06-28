<template>
  <StackLayout style="text-align: center" height="300">
    <!-- <ScrollView> -->
    <GridLayout rows="auto,auto,auto" margin="15" style="width: 100%; height:65%;">
      <GridLayout row="0" columns="auto,*" @tap="navigate()" height="40%" width="40%">
        <Label col="0" :text="'fa-edit' | fonticon" class="fas colorIcons" fontSize="30"/>
        <Label col="1" text="Editar" fontSize="22" class="p-l-10 colorIcons"/>
      </GridLayout>
      <GridLayout row="1" marginTop="15" columns="auto,*" height="40%" width="40%" @tap="removePallet" style="text-align: center">
        <Label col="0" :text="'fa-times' | fonticon" class="fas colorIcons" fontSize="30" />
        <Label col="1" text="Eliminar" fontSize="22" class="p-l-10 colorIcons" />
      </GridLayout>
    </GridLayout>
    <GridLayout columns="*" style="height: 25%;">
      <Button text="CERRAR" class="colorIcons" fontSize="22" @tap="$closeBottomSheet()" borderWidth="1" borderColor="#222a37" borderRadius="30" />
    </GridLayout>
    <!-- </ScrollView> -->
  </StackLayout>
</template>

<script>
const { getPalletsAll, deletePallet, getPallet } = require("~/sqlite/database");
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue";

export default {
  name:'ButtonSheet',
  props:{
    item:{
      type: Object,
    }
  },
  data() {
    return {
      infoPallet:[]
    }
  },
  methods: {
    navigate(){
      this.$closeBottomSheet()
      this.$showModal(CreateEditPallet,{fullscreen: true, props:{infoPallet:this.infoPallet}})
      //this.$router.push('editpallets.index')
      /* this.$closeBottomSheet()
      this.$navigateTo(CreateEditPallet) */
    },

    async palletInfo(){
      try {
        const pallet = await getPallet(this.item)
        console.log("info ",pallet)
        for (let i = 0; i < pallet.length; i++) {
          this.infoPallet.push({
                    id: pallet[i][0],
                    code: pallet[i][1],
                    observation: pallet[i][2],
                    ship_id: pallet[i][3],
                    warehouse_id: pallet[i][4]
                  })
        }
        console.log(this.infoPallet)
      } catch (error) {

      }
    },

    async removePallet(){
      try {
        const pallet = await deletePallet(this.item.id)
        console.log("delete ",pallet)
        this.$closeBottomSheet()
      } catch (error) {
        console.log("hubo un error al eliminar")
      }
    },
  },

  created(){
    this.palletInfo()
  }
}
</script>

<style>
.colorIcons {
  color: #222a37;
}
</style>
