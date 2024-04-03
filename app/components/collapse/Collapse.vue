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
        :text="value ? 'fa-angle-down' : 'fa-angle-right' | fonticon"
        class="fas"
        fontSize="20"
        dock="right"
        width="auto"
      />
      <Label dock="bottom" height="auto" />
    </DockLayout>
    <!-- <StackLayout v-if="value === true"> -->
    <slot v-if="value === true"></slot>
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
  },
};
</script>

<style scoped>
.base-component {
}
</style>
