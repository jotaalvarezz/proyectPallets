<template>
  <GridLayout
    height="65"
    rows="*"
    columns="60, *, 60"
    backgroundColor="#00acc1"
  >
    <ButtonNavigate
      height="60"
      width="60"
      icon="fa-bars"
      size="20"
      iconColor="#F4F6F8"
      radius="50"
      :handleEvent="() => openDrawer()"
    />
    <Label
      row="0"
      col="1"
      class="text-center"
      :text="title"
      :fontSize="textSize"
      color="#F4F6F8"
      fontWeight="bold"
    ></Label>
  </GridLayout>
</template>

<script>
import * as util from "~/shared/util";

export default {
  name: "HeaderComponent",
  props: {
    title: {
      type: String,
      default: "Sin Titulo",
    },

    handleback: {
      type: Function,
      default: () => {},
    },

    textSize: {
      type: Number,
      default: 20,
    },
  },

  methods: {
    back() {
      this.handleback();
    },

    openDrawer() {
      util.showDrawer();
    },
  },

  created() {},
};
</script>

<style scoped>
.animated {
  /* background-color: #d8e2e8; */
  border-radius: 60px;
  padding: 20px;
  margin: 24px 20px 20px 20px;
}
</style>
