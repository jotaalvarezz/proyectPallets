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
      icon="fa-chevron-left"
      iconColor="#F4F6F8"
      radius="50"
      :handleEvent="() => back()"
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
      default: 15,
    },
  },

  methods: {
    back() {
      this.handleback();
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
