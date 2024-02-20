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
      @tap="infoSelect"
      style="background-color: #c0c9d7; width: 90%"
    >
      <Label
        :text="icon | fonticon"
        fontSize="18"
        class="fas"
        col="0"
        color="#3c495e"
      />
      <Label
        :text="value"
        class="p-l-10"
        :fontSize="fontsize"
        fontWeight="none"
        col="1"
        color="#3c495e"
      />
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
import ListOptions from "~/components/listOptions/ListOptions.vue";

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    fontsize: {
      type: Number,
      default: 18,
    },
    icon: {
      type: String,
      default: "fa-list-ul",
    },
    value: {
      type: String,
      default: null,
    },
    items: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      model: {},
    };
  },

  methods: {
    onTextChange(args) {
      const newValue = args.object.text;
      console.log("Nuevo valor:", newValue);
      this.$emit("input", newValue);
    },

    infoSelect() {
      this.$showModal(ListOptions, {
        props: {
          listOfItems: this.items,
          item: this.value,
        },
      }).then((res) => {
        this.value = res.selectedItem;
        this.$emit("value", this.value);
      });
    },
  },
};
</script>
