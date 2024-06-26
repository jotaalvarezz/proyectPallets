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
      default: 0,
    },

    iconColor: {
      type: String,
      default: "#3c495e",
    },

    iconBackground: {
      type: String,
      default: "transparent",
    },

    rotate: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    action() {
      this.handleEvent();
    },

    onTouch(event) {
      const hoverLabel = this.$refs.hoverLabel.nativeView;
      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          this.isAnimating = true;
          hoverLabel.animate({
            backgroundColor: "lightgray", // Cambiar el color de fondo
            rotate: this.rotate,
            duration: 1000,
          });
          break;
        case "up":
        case "cancel":
          // El usuario ha levantado el dedo de la pantalla o el toque ha sido cancelado
          setTimeout(() => {
            hoverLabel.animate({
              backgroundColor: this.iconBackground, // Revertir al color original
              /* rotate: 0, */
              duration: 500,
            });
          }, 1000); // Retrasar hasta que la animación down termine
          break;
      }
    },
  },
};
</script>

<style scoped>
.animated {
  /* background-color: #d8e2e8; */
  padding: 20px;
  margin: 24px 20px 20px 20px;
}
</style>
