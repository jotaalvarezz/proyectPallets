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
      columns="25, *,auto"
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
      <Label
        v-if="multiple === false"
        :text="itemLabel"
        class="p-l-10"
        :fontSize="fontsize"
        fontWeight="none"
        col="1"
        color="#3c495e"
      />
      <WrapLayout v-if="multiple === true" col="1" style="margin-left: 15px">
        <Label
          v-for="(item, index) in itemLabel"
          :key="index"
          class="tag"
          :text="item[labelIterator]"
          fontWeight="none"
          padding="2"
          :fontSize="fontsize"
        />
      </WrapLayout>
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
  name:"SelectField",
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
      default: "name",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      object: {},
    };
  },

  computed: {
    itemLabel() {
      let label = {};
      let labels = [];
      if (this.items.length !== 0) {
        if (!this.multiple && this.value != null) {
          label = this.items.find((item) => item.id === this.value);
          return label[this.labelIterator];
        } else if(!this.multiple && this.value === null){
          return ' ';
        }
        for (let i = 0; i < this.value.length; i++) {
          label = this.items.find((item) => item.id === this.value[i]);
          labels.push(label);
        }
        return labels;
      }
      /* if (this.items.length !== 0 && this.value != null) {
        const label = this.items.find((item) => item.id === this.value);
        return label[this.labelIterator];
      } */
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
          multiple: this.multiple,
        },
      }).then((res) => {
        this.value = res.selectedItem;
        this.$emit("value", this.value);
      });
    },
  },

  created(){
    /* console.log("mull ", this.multiple) */
  }
};
</script>
<style scoped>
.tag {
  height: 23rem;
  margin: 3px 6px 3px 0px;
  border-radius: 5px;
  border-width: 1px;
  background-color: rgba(60, 73, 94, 0.2);
  border-color: #3c495e;
  color: #3c495e;
}
</style>
