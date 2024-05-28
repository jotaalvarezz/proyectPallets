<template>
  <StackLayout backgroundColor="#F4F6F8"
    ><!-- backgroundColor="#F4F6F8" -->
    <!-- <ScrollView> -->
    <!-- <GridLayout rows="auto,auto,auto" margin="15" padding="5" style="width: 100%; height:65%;" backgroundColor="#3c495e"> -->
    <!-- **** -->
    <GridLayout
      id="1"
      row="0"
      v-if="generalOptions"
      columns="*,50,120,*"
      @tap="infoItem"
      @touch="onTouch(1)"
      height="70"
      width="100%"
      class="hover-label"
      :class="isHovered && itemSelector == 1 ? 'hovered' : ''"
    >
      <Label
        col="1"
        :text="'fa-eye' | fonticon"
        class="fas icon"
        fontSize="20"
      />
      <Label
        col="2"
        text="Detalles"
        fontSize="14"
        class="colorIcons"
        :class="isHovered && itemSelector == 1 ? 'underline' : ''"
      />
    </GridLayout>
    <!-- **** -->
    <GridLayout
      id="2"
      row="1"
      columns="*,50,120,*"
      @tap="update()"
      height="70"
      width="100%"
      @touch="onTouch(2)"
      class="hover-label"
      :class="isHovered && itemSelector == 2 ? 'hovered' : ''"
    >
      <Label
        col="1"
        :text="'fa-redo' | fonticon"
        class="fas icon"
        fontSize="20"
      />
      <Label
        col="2"
        text="Editar"
        fontSize="14"
        class="colorIcons"
        :class="isHovered && itemSelector == 2 ? 'underline' : ''"
      />
    </GridLayout>
    <!-- **** -->
    <GridLayout
      id="3"
      row="2"
      columns="*,50,120,*"
      height="70"
      width="100%"
      @tap="deleteItem"
      @touch="onTouch(3)"
      class="hover-label"
      :class="isHovered && itemSelector == 3 ? 'hovered' : ''"
    >
      <Label
        col="1"
        :text="'fa-times' | fonticon"
        class="fas icon"
        fontSize="20"
      />
      <Label
        col="2"
        text="Eliminar"
        fontSize="14"
        class="colorIcons"
        :class="isHovered && itemSelector == 3 ? 'underline' : ''"
      />
    </GridLayout>
    <!-- </GridLayout> -->
    <!-- <GridLayout columns="*" style="height: 25%;"> -->
    <Button
      text="CERRAR"
      row="3"
      backgroundColor="#F4F6F8"
      color="#222a37"
      @tap="$closeBottomSheet()"
      borderWidth="1"
      borderColor="#222a37"
      borderRadius="30"
    />
    <!-- </GridLayout> -->
    <!-- </ScrollView> -->
  </StackLayout>
</template>

<script>
const { getPalletsAll, deletePallet, getPallet } = require("~/sqlite/database");
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue";
import Alert from "~/alerts/Alerts";

export default {
  name: "ButtonSheet",
  props: {
    generalOptions: {
      type: Boolean,
    },
    item: {
      type: Object,
    },
    updateRegister: {
      type: Function,
      default : () => {Alert("En construccion...!")}
    },
    infoRegister:{
      type: Function,
      default : () => {Alert("En construccion...!")}
    },
    deleteRow: {
      type: Function,
    },
    component: {
      type: Object,
      default: {}
    },
    componentInfo: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      info: {},
      isHovered: false,
      itemSelector: 0,
    };
  },
  methods: {
    infoItem() {
      this.infoRegister()
    },

    navigate() {
      /* this.$closeBottomSheet(); */
      this.$showModal(this.component, {
        fullscreen: true,
        props: { info: this.item },
      }).then(() => {
        this.$emit('someEvent', 'Valor de ejemplo');
        this.$closeBottomSheet();
      });
      //this.$router.push('editpallets.index')
      /* this.$closeBottomSheet()
      this.$navigateTo(CreateEditPallet) */
    },

    update(){
      this.updateRegister()
      this.$closeBottomSheet();
    },

    onTouch(n) {
      this.itemSelector = n;
      if (!this.isHovered) {
        this.isHovered = true;
      } else {
        this.isHovered = false;
      }
    },

    deleteItem() {
      this.deleteRow();
      this.$closeBottomSheet();
    },
  },

  created() {},
};
</script>

<style scoped>
.colorIcons {
  color: #222a37;
}

.iconDelete {
  color: #fb404b;
}

.iconEdit {
  color: #eab14d;
}

.iconDetalles {
  color: #0096b7;
}

.icon{
  color: #3c495e;
}

.underline {
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
