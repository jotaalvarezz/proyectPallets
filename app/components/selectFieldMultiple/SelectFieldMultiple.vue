<template>
  <StackLayout marginTop="10">
    <Label
      colSpan="2"
      :text="label"
      :fontSize="fontsize"
      fontWeight="bold"
      style="color: #3c495e; width: 90%"
    />
    <GridLayout
      height="45"
      columns="auto, *,auto"
      padding="10"
      borderRadius="2"
      @tap="infoSelect"
      style="background-color: #c0c9d7; width: 90%; opacity: 0.9"
    >
      <Label
        :text="icon | fonticon"
        fontSize="18"
        class="fas"
        col="0"
        color="#3c495e"
      />
      <WrapLayout col="1" style="margin-left: 15px" v-if="items.length > 0">
        <Label
          v-for="(item, index) in itemLabel"
          :key="index"
          class="tag"
          :text="item[labelIterator]"
          fontWeight="none"
          :fontSize="fontsize"
        />
      </WrapLayout>
      <!-- <Label
        :text="itemLabel"
        class="p-l-10 tag"
        :fontSize="fontsize"
        fontWeight="none"
        col="1"
        color="#3c495e"
      /> -->
      <Label
        :text="'fa-sort-down' | fonticon"
        fontSize="18"
        class="fas"
        col="2"
        color="#3c495e"
      />
    </GridLayout>
  </StackLayout>
</template>

<script>
import ListOptions from "~/components/listOptionsMul/ListOptionsMul.vue";

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    fontsize: {
      type: Number,
      default: 14,
    },
    icon: {
      type: String,
      default: "fa-list-ul",
    },
    value: {
      type: String,
      default: [],
    },
    items: {
      type: Array,
      default: [],
    },
    labelIterator: {
      type: String,
      default: "name",
    },
  },

  data() {
    return {
      object: {},
    };
  },

  computed: {
    itemLabel() {
      console.log("value label ", this.value + " " + this.value.length);
      console.log("item label ", this.items + " " + this.items.length);
      if (this.items.length !== 0 && this.value.length !== 0) {
        let label = {};
        let labels = [];
        for (let i = 0; i < this.value.length; i++) {
          label = this.items.find((item) => item.id === this.value[i]);
          labels.push(label);
        }
        console.log("labelss ", label);
        return labels;
      }
    },
  },

  methods: {
    onTextChange(args) {
      const newValue = args.object.text;
      /* console.log("selected <=> ",newValue) */
      this.$emit("input", newValue);
    },

    infoSelect() {
      this.$showModal(ListOptions, {
        props: {
          listOfItems: this.items,
          value: this.value,
          labelIterator: this.labelIterator,
        },
      }).then((res) => {
        this.value = res.selectedItem;
        console.log("select <=> ", this.value);
        this.$emit("value", this.value);
      });
    },
  },
};
</script>

<style scoped>
.tag {
  height: 23rem;
  margin: 3px 6px 3px 0px;
  border-radius: 5px;
  border-width: 1px;
  /* background-color: rgba(60, 73, 94, 0.19); */
  border-color: #3c495e;
  color: #3c495e;
}
</style>
