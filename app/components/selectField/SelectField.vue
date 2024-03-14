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
      style="background-color: #c0c9d7; width: 90%; opacity: 0.9;"
    >
      <Label
        :text="icon | fonticon"
        fontSize="18"
        class="fas"
        col="0"
        color="#3c495e"
      />
      <Label
        :text="itemLabel"
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
      default: 14,
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
    labelIterator: {
      type: String,
      default:'name',
    },
  },

  data() {
    return {
      object:{},
    };
  },

  computed:{
    itemLabel(){
      if(this.items.length !== 0 && this.value != null){
        const label = this.items.find(item => item.id === this.value);
        return label[this.labelIterator];
      }
    }
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
          labelIterator: this.labelIterator
        },
      }).then((res) => {
        this.value = res.selectedItem;
        console.log("select <=> ",this.value)
        this.$emit("value", this.value);
      });
    },
  },
};
</script>
