<template>
  <StackLayout style="padding: 0px">
    <Label textWrap="true" v-if="label">
      <FormattedString>
        <Span :text="label + ': '" fontWeight="bold" fontSize="14" :color="labelColor" />
      </FormattedString>
    </Label>
    <Label
      v-if="items.length === 0"
      text="No hay elementos..."
      fontSize="13"
      style="margin-left: 15px"
    />
    <!-- <Stripe /> -->
    <WrapLayout style="margin-left: 15px" v-if="items.length > 0">
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
  name: "Tag",
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
      default: null,
    },
    labelIterator: {
      type: String,
      default: "name",
    },
    labelColor: {
      type: String,
      default: "#666",
    },
  },
};
</script>

<style scoped>
.tag {
  height: auto;
  min-height: 28rem;
  margin: 4px 8px 4px 0px;
  border-radius: 12px;
  border-width: 0px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12;
  background-color: #00acc1;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 172, 193, 0.2);
  text-align: center;
  vertical-align: center;
}
</style>
