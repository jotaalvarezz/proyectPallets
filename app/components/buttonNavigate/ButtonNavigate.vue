<template>
  <Label
    ref="hoverLabel"
    :text="icon | fonticon"
    :fontSize="size"
    class="fas text-center animated"
    :backgroundColor="iconBackground"
    :color="iconColor"
    :borderRadius="radius"
    @touch="onTouch"
    @tap="action"
  />
</template>

<script>
export default {
  name: "ButtonNavigate",
  props: {
    icon: {
      type: String,
      default: "fa-chevron-left",
    },

    handleEvent: {
      type: Function,
      default: () => {},
    },

    size: {
      type: Number,
      default: 16,
    },

    radius: {
      type: Number,
      default: 0
    },

    iconColor:{
      type: String,
      default: "#3c495e"
    },

    iconBackground: {
      type: String,
      default: "transparent"
    }
  },

  methods:{
    action(){
        this.handleEvent()
    },

    onTouch(event) {
      const hoverLabel = this.$refs.hoverLabel.nativeView;
      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          hoverLabel.animate({
            backgroundColor: "lightgray", // Cambiar el color de fondo
            duration: 500,
          });
          break;
        case "up":
          // El usuario ha levantado el dedo de la pantalla
          hoverLabel.animate({
            backgroundColor: this.iconBackground, // Revertir al color original
            duration: 500,
          });
          break;
        case "cancel":
          // El toque ha sido cancelado
          hoverLabel.animate({
            backgroundColor: this.iconBackground, // Revertir al color original
            duration: 500,
          });
          break;
      }
    },
  }
};
</script>

<style scoped>
.animated {
  /* background-color: #d8e2e8; */
  padding: 20px;
  margin: 24px 20px 20px 20px;
}
</style>
