<template>
  <StackLayout style="text-align: center" height="300" backgroundColor="#F4F6F8">
    <!-- <ScrollView> -->
    <GridLayout rows="auto,auto,auto" margin="15" padding="5" style="width: 100%; height:65%;">
      <!-- **** -->
      <GridLayout id="1" row="0" v-if="generalOptions" columns="*,50,*,*" @tap="infoItem" @touch="onTouch(1)"
                  height="33%" width="100%" class="hover-label"
                  :class="isHovered && itemSelector == 1 ? 'hovered' : ''">
        <Label col="1" :text="'fa-eye' | fonticon" class="fas iconDetalles" fontSize="30"/>
        <Label col="2" text="Detalles" fontSize="22" class="p-l-10 colorIcons"
              :class="isHovered && itemSelector == 1 ? 'underline' : ''"/>
      </GridLayout>
      <!-- **** -->
      <GridLayout id="2" row="1" columns="*,50,*,*" @tap="navigate()" height="33%" width="100%"
                  @touch="onTouch(2)" class="hover-label"
                  :class="isHovered && itemSelector == 2 ? 'hovered' : ''">
        <Label col="1" :text="'fa-edit' | fonticon" class="fas iconEdit" fontSize="30"/>
        <Label col="2" text="Editar" fontSize="22" class="p-l-10 colorIcons"
              :class="isHovered && itemSelector == 2 ? 'underline' : ''"/>
      </GridLayout>
      <!-- **** -->
      <GridLayout id="3" row="2" columns="*,50,*,*" height="33%" width="100%" @tap="deleteItem"
                  style="text-align: center" @touch="onTouch(3)" class="hover-label"
                  :class="isHovered && itemSelector == 3 ? 'hovered' : ''">
        <Label col="1" :text="'fa-times' | fonticon" class="fas iconDelete" fontSize="30"/>
        <Label col="2" text="Eliminar" fontSize="22" class="p-l-10 colorIcons"
              :class="isHovered && itemSelector == 3 ? 'underline' : ''"/>
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
      info: {},
      isHovered: false,
      itemSelector: 0
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

    onTouch(n){
        this.itemSelector = n
        if(!this.isHovered){
            this.isHovered = true;
        }else{
            this.isHovered = false;
        }
    },

    deleteItem(){
      this.deleteRow()
      this.$closeBottomSheet()
    },

  },

  created() {

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

.underline{
  text-decoration: underline;
}
.hover-label {
  /* padding-left: 120%; */
  font-size: 24;
  color: #222a37;
}

.hovered {
  background-color: lightgray;
  text-decoration: underline;
}
</style>
