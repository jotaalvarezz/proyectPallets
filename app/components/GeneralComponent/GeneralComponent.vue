<template>
  <StackLayout>
    <Label
      v-if="label.length > 0"
      :text="label"
      fontWeight="bold"
      fontSize="14"
    />
    <StackLayout v-for="(item, index) in data" :key="index" marginLeft="10">
      <Tag
        :label="item[labelTag]"
        :items="item[itemsKey]"
        :labelIterator="labelIterator"
      />
      <Collapse :title="titleCollapse + (index + 1)">
        <ViewImage
          ref="viewImage"
          :label="labelViewImage"
          :url="item[viewImageKey]"
        />
      </Collapse>
    </StackLayout>
  </StackLayout>
</template>
<script>
export default {
  name: "GeneralComponent",
  props: {
    data: {
      type: Array,
      deafaul: [],
    },
    label: {
      type: String,
      deafaul: "",
    },
    labelTag: {
      type: String,
      deafaul: "",
    },
    itemsKey:{
      type: Array,
      default: []
    },
    labelIterator:{
      type:String,
      default:""
    },
    titleCollapse:{
      type: String,
      default: ""
    },
    labelViewImage:{
      type: String,
      default: ""
    },
    viewImageKey:{
      type: String,
      default: ""
    }
  },

  created() {

  },
};
</script>
