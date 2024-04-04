<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <GridLayout
        height="55"
        rows="*"
        columns="50, 3*, 50"
        backgroundColor="#00acc1"
      >
        <Label
          row="0"
          col="2"
          :text="'fa-times' | fonticon"
          fontSize="16"
          class="fas text-center"
          color="#F4F6F8"
          @tap="$modal.close"
        />
        <Label
          row="0"
          col="1"
          class="text-center text-decoration"
          :text="title"
          fontSize="15"
          color="#F4F6F8"
          fontWeight="bold"
        ></Label>
      </GridLayout>
      <ScrollView>
        <StackLayout
          padding="20"
          backgroundColor="#F4F6F8"
          margin="20"
          borderWidth="1"
          borderColor="#3c495e"
          borderRadius="5"
        >
          <StackLayout v-for="(item, index) in listRows" :key="index">
            <Label textWrap="true" v-if="item.prop !== 'signature' && item.prop !== showTags">
              <FormattedString>
                <Span
                  :text="item.label + ': '"
                  fontWeight="bold"
                  fontSize="14"
                />
                <Span :text="info[item.prop]" fontSize="14" />
              </FormattedString>
            </Label>
            <Tag
              v-if="item.prop === showTags"
              :label="item.label"
              :items="info[item.prop]"
              :labelIterator="iteratorTags"
            />
            <ViewImage
              v-if="item.prop === 'signature'"
              ref="viewImage"
              label="Firma: "
              encrypted="true"
              :url="info[item.prop]"
            />
            <Stripe color="#3c495e" ml="0" mr="0" />
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  name: "ListModal",
  props: {
    info: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: "Sin titulo",
    },
    listRows: {
      type: Array,
      default: [],
    },
    showTags: {
      type: String,
      default: "",
    },
    iteratorTags: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      row: {
        prop: "name",
        label: "Gestion",
      },
    };
  },

  created() {},
};
</script>
