<template>
  <StackLayout :padding="paddinAll">
    <DockLayout @tap="activated" marginBottom="15">
      <StackLayout
        dock="top"
        :backgroundColor="color"
        :marginTop="mt"
        :marginRight="mr"
        :marginBottom="mb"
        :marginLeft="ml"
        style="height: 1px"
      ></StackLayout>
      <Label :text="title" dock="left" width="auto" />
      <Label
        ref="hoverLabel"
        :text="value ? 'fa-angle-down' : 'fa-angle-right' | fonticon"
        class="fas text-center animated"
        fontSize="20"
        dock="right"
        height="45"
        width="45"
        @touch="onTouch"
      />
      <Label dock="bottom" height="auto" />
    </DockLayout>
    <!-- <StackLayout v-if="value === true"> -->
    <ScrollView>
      <slot v-if="value === true"></slot>
    </ScrollView>
    <!-- </StackLayout> -->
  </StackLayout>
</template>

<script>
export default {
  name: "Collapse",
  props: {
    title: String,
    color: {
      type: String,
      default: "#3c495e",
    },
    mt: {
      type: Number,
      default: 10,
    },
    mr: {
      type: Number,
      default: 0,
    },
    mb: {
      type: Number,
      default: 5,
    },
    ml: {
      type: Number,
      default: 0,
    },
    paddinAll: {
      type: Number,
      default: 15,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    iconValue() {
      return {
        "fa-angle-right": this.value === false,
        "fa-angle-down": this.value === true,
      };
    },
  },

  methods: {
    activated() {
      if (this.value === true) {
        this.$emit("value", false);
        return (this.value = false);
      }
      this.$emit("value", true);
      return (this.value = true);
    },

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

<style scoped>
.base-component {
}

.animated {
  /* background-color: #d8e2e8; */
  border-radius: 60px;
  padding: 15px;
}
</style>
