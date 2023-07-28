<template>
  <StackLayout style="text-align: center" height="300" backgroundColor="#F4F6F8">
    <!-- <ScrollView> -->
    <GridLayout rows="auto,auto,auto" margin="15" padding="5" style="width: 100%; height:65%;">
      <GridLayout row="0" v-if="generalOptions" columns="50,*" @tap="infoItem" height="33%" width="50%">
        <Label col="0" :text="'fa-eye' | fonticon" class="fas iconDetalles" fontSize="30" />
        <Label col="1" text="Detalles" fontSize="22" class="p-l-10 colorIcons" />
      </GridLayout>
      <GridLayout row="1" columns="50,*" @tap="navigate()" height="33%" width="50%" >
        <Label col="0" :text="'fa-edit' | fonticon" class="fas iconEdit" fontSize="30" />
        <Label col="1" text="Editar" fontSize="22" class="p-l-10 colorIcons" />
      </GridLayout>
      <GridLayout row="2" columns="50,*" height="33%" width="50%" @tap="deleteItem"
        style="text-align: center">
        <Label col="0" :text="'fa-times' | fonticon" class="fas iconDelete" fontSize="30" />
        <Label col="1" text="Eliminar" fontSize="22" class="p-l-10 colorIcons" />
      </GridLayout>
    </GridLayout>
    <GridLayout columns="*" style="height: 25%;">
      <Button text="CERRAR" backgroundColor="#F4F6F8" color="#222a37" fontSize="22" @tap="$closeBottomSheet()"
        borderWidth="1" borderColor="#222a37" borderRadius="30" />
    </GridLayout>
    <!-- </ScrollView> -->
  </StackLayout>
</template>

<script>
const { getPalletsAll, deletePallet, getPallet } = require("~/sqlite/database");
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue";
import Alert from "~/alerts/Alerts";

export default {
  name: 'ButtonSheet',
  props: {
    generalOptions:{
      type: Boolean
    },
    item: {
      type: Object,
    },
    getInfo: {
      type: Function
    },
    deleteRow: {
      type: Function
    },
    component:{
      type: Object
    },
    componentInfo: {
      type: Object
    }
  },
  data() {
    return {
      info: {}
    }
  },
  methods: {
    infoItem(){
      this.$showModal(this.componentInfo, { props: { info: this.item } })
    },

    navigate() {
      this.$closeBottomSheet()
      this.$showModal(this.component, { fullscreen: true, props: { info: this.item } })
      //this.$router.push('editpallets.index')
      /* this.$closeBottomSheet()
      this.$navigateTo(CreateEditPallet) */
    },

    /* async palletInfo() {
      try {
        console.log("item ", this.item)
        const pallet = await getPallet(this.item)
        console.log("info ", pallet)
        for (let i = 0; i < pallet.length; i++) {
          this.infoPallet = Object.assign({},
            {
              id: pallet[i][0],
              code: pallet[i][1],
              observation: pallet[i][2],
              ship_id: pallet[i][3],
              warehouse_id: pallet[i][4]
            })
        }
      } catch (error) {
        console.log("error al traer los datos ", error)
      }
    }, */

    deleteItem(){
      this.deleteRow()
      this.$closeBottomSheet()
    },

  },

  created() {
    /* this.palletInfo() */
  }
}
</script>

<style scoped>
.colorIcons {
  color: #222a37;
}

.iconDelete{
  color:#FB404B;
}

.iconEdit{
  color: #EAB14D;
}

.iconDetalles{
  color: #0096b7;
}
</style>
