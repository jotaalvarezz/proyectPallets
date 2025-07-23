<template>
  <Page @loaded="initialPosition">
    <ActionBar backgroundColor="#00acc1" flat="true">
      <GridLayout rows="*" columns="60, *" height="65">
        <ButtonNavigate
          col="0"
          height="60"
          width="60"
          icon="fa-bars"
          size="20"
          iconColor="#F4F6F8"
          radius="50"
          :handleEvent="() => openDrawer()"
        />
        <Label
        col="1"
          text="INFORME DE DAÑOS DEL CONTENEDOR"
          fontSize="18"
          color="#F4F6F8"
          fontWeight="bold"
        />
      </GridLayout>
      <ActionItem
        @tap="prevFlipper"
        ios.position="left"
        android.position="actionBar"
      >
        <Label
          ref="hoverLabelLeft"
          @touch="onTouchLft"
          class="fas animated"
          :text="'fa-arrow-left' | fonticon"
          color="#F4F6F8"
          :opacity="currentIndex === 0 ? 0.5 : 1"
          fontSize="20"
          borderRadius="50"
        />
      </ActionItem>
      <!-- Espaciadores -->
      <ActionItem ios.position="left" android.position="actionBar">
        <Label text="" width="20" />
      </ActionItem>

      <ActionItem
        @tap="nextFlipper"
        ios.position="right"
        android.position="actionBar"
      >
        <Label
          ref="hoverLabelRight"
          @touch="onTouchRht"
          class="fas animated"
          :text="'fa-arrow-right' | fonticon"
          color="#F4F6F8"
          :opacity="currentIndex === (this.steps - 1) ? 0.5 : 1"
          fontSize="20"
          borderRadius="50"
        />
      </ActionItem>
    </ActionBar>
    <GridLayout ref="form" rows="*">
      <!-- <ScrollView> -->
        <StackLayout>
          <slot></slot>
        </StackLayout>
      <!-- </ScrollView> -->
      <FloatingButton :icon="'fa-save'" iconSize="sm" :method="flipperSave"/>
    </GridLayout>
  </Page>
</template>
<script>
import * as util from "~/shared/util";
export default {
  name: "ViewFlipper",
  data() {
    return {
      currentIndex: this.index,
      currentSteps: this.steps,
      oldIndex: this.index,
    };
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    steps: {
      type: Number,
      required: true,
    },
    next: {
      type: Function,
    },
    operation:{
      type:Function,
      default: () => ""
    }
  },
  computed: {
    defaultIndex() {
      return this.currentIndex;
    },
  },

  watch: {
    currentIndex(newVal, oldVal) {
      this.oldIndex = oldVal;
      this.$emit("input", newVal);
    },
  },

  methods: {
    openDrawer() {
      util.showDrawer();
    },

    initialPosition() {
      this.$emit("value", this.currentIndex);
    },

    pageFlipper(index){
      if (index >= 0 && index < this.currentSteps) {
        this.index = index;
        this.currentIndex = this.index
        this.$emit("input", index);
      }
    },

    nextFlipper() {
      if (this.currentIndex < this.currentSteps - 1) {
        this.currentIndex++;
      }
    },

    prevFlipper() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },

    flipperSave(){
      this.operation()
    },

    onTouchLft(event) {
      const hoverLabel = this.$refs.hoverLabelLeft.nativeView;

      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          this.isAnimating = true;
          hoverLabel.animate({
            backgroundColor: "lightgray", // Cambiar el color de fondo
            rotate: 0,
            duration: 300,
          });
          break;
        case "up":
        case "cancel":
          // El usuario ha levantado el dedo de la pantalla o el toque ha sido cancelado
          setTimeout(() => {
            hoverLabel.animate({
              backgroundColor: "transparent", // Revertir al color original
              rotate: 0,
              duration: 300,
            });
          }, 300); // Retrasar hasta que la animación down termine
          break;
      }
    },

    onTouchRht(event) {
      const hoverLabel = this.$refs.hoverLabelRight.nativeView;
      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          this.isAnimating = true;
          hoverLabel.animate({
            backgroundColor: "lightgray", // Cambiar el color de fondo
            rotate: 0,
            duration: 300,
          });
          break;
        case "up":
        case "cancel":
          // El usuario ha levantado el dedo de la pantalla o el toque ha sido cancelado
          setTimeout(() => {
            hoverLabel.animate({
              backgroundColor: "transparent", // Revertir al color original
              rotate: 0,
              duration: 300,
            });
          }, 300); // Retrasar hasta que la animación down termine
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
