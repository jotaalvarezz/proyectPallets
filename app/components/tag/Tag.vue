<template>
  <StackLayout style="padding: 0px">
    <Label
    v-if="items.length === 0"
      text="No hay elementos..."
      fontSize="13"
      style="margin-left: 15px;"
    />
    <!-- <Stripe /> -->
    <WrapLayout style="margin-left: 15px;" v-if="items.length > 0">
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
  background-color: rgba(0, 172, 193, 0.19);
  border-color: #00acc1;
  color: #00acc1;
}
</style>
