<template>
  <GridLayout
    v-if="hidden === false"
    margin="5"
    row="1"
    rows="auto"
    columns="*, 65"
  >
    <SearchBar
      ref="mySearchBar"
      row="0"
      col="0"
      margin="10"
      hint="Buscar..."
      v-model="search"
      @textChange="submit"
      @submit="submit"
      @clear="clear"
    />
    <Label
      ref="hoverLabel"
      row="0"
      col="1"
      margin="10"
      :text="'fa-sync-alt' | fonticon"
      class="fas text-center animated"
      color="#222a37"
      fontSize="22"
      @touch="onTouch"
      @tap="refresh"
    />
  </GridLayout>
</template>

<script>
export default {
  name: "FilterSearhBar",
  props: {
    search:{
        type: String,
        required: true
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    submit: {
      type: Function,
      default: () => {},
    },

    clear: {
      type: Function,
      default: () => {},
    },

    refresh: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    onTouch(event) {
      const hoverLabel = this.$refs.hoverLabel.nativeView;
      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          hoverLabel.animate({
            backgroundColor: "#D8E2E8", // Cambiar el color de fondo
            duration: 200,
          });
          break;
        case "up":
          // El usuario ha levantado el dedo de la pantalla
          hoverLabel.animate({
            backgroundColor: "#F4F6F8", // Revertir al color original
            duration: 200,
          });
          break;
        case "cancel":
          // El toque ha sido cancelado
          hoverLabel.animate({
            backgroundColor: "#F4F6F8", // Revertir al color original
            duration: 200,
          });
          break;
      }
    },
  },
};
</script>
