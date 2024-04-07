<template>
  <!-- https://github.com/nstudio/nativescript-floatingactionbutton -->
  <fab
    @tap="fabTap"
    :text="icon | fonticon"
    :class="['fab-button', 'fas', iconSize]"
    rippleColor="#f1f1f1"
    :horizontalAlignment="alignX"
    :verticalAlignment="alignY"
  ></fab>
</template>
<script>
import { fonticon } from "nativescript-fonticon";

export default {
  name:"FloatingButton",
  props: {
    method: {
      type: Function,
      required: true,
    },

    icon: {
      type: String,
      required: true,
    },
    alignX: {
      type: String,
      default: "right",
    },
    alignY: {
      type: String,
      default: "bottom",
    },
    iconSize: {
        type: String,
        default: 'sm',
    },
  },
  data() {
    return {};
  },

  methods: {
    fabTap() {
      this.method();
    },
  },
};
</script>
<style lang="scss">

.fab-button {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #eab14d;
  color: #f4f6f8;
  opacity: 0.8;
}

.sm{
    font-size: 20px;
}

.md{
    font-size: 40px;
}

.lg{
    font-size: 50px;
}
</style>
