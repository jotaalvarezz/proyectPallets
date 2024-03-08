<template>
  <StackLayout style="padding: 0px">
    <!-- <Label
      :text="label"
      fontWeight="bold"
      fontSize="13"
      style="padding: 0px;"
    /> -->
    <!-- <Stripe /> -->
    <WrapLayout>
      <Label
        v-for="(item, index) in items"
        :key="index"
        class="tag"
        :text="item[labelIterator]"
      />
    </WrapLayout>
    <!-- <Stripe /> -->
  </StackLayout>
</template>

<script>
import Stripe from "~/components/stripe/Stripe";

export default {
  components: {
    Stripe,
  },

  props: {
    items: {
      type: Array,
      default: [],
    },
    label: {
      type: String,
      default: "cucho:",
    },
    labelIterator: {
      type: String,
      default: "name",
    },
  },
};
</script>

<style scoped>
.tag {
  height: 26rem;
  margin: 3px 6px 3px 0px;
  border-radius: 5px;
  border-width: 1px;
  /* background-color: #eab14d; */
  border-color: #00acc1;
  color: #00acc1;
}
</style>
