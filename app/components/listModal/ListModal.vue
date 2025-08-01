<template>
  <Page>
    <StackLayout backgroundColor="#FFFFFF">
      <GridLayout
        height="55"
        rows="*"
        columns="60, 3*, 60"
        backgroundColor="#00acc1"
      >
        <ButtonNavigate
          row="0"
          col="2"
          height="50"
          width="50"
          icon="fa-times"
          iconColor="#F4F6F8"
          radius="50"
          :handleEvent="() => {$modal.close()}"
        />
        <Label
          row="0"
          col="1"
          class="text-center text-decoration"
          :text="title"
          fontSize="20"
          color="#F4F6F8"
          fontWeight="bold"
        ></Label>
      </GridLayout>
      <ScrollView>
        <StackLayout
          padding="20"
          backgroundColor="#FFFFFF"
          margin="20"
          borderWidth="1"
          borderColor="#3c495e"
          borderRadius="5"
        >
          <StackLayout v-for="(item, index) in listRows" :key="index">
            <Label
              textWrap="true"
              v-if="
                item.prop !== 'signature' &&
                item.prop !== showTags &&
                item.prop !== showMulTags
              "
            >
              <FormattedString>
                <Span
                  :text="item.label + ': '"
                  fontWeight="bold"
                  fontSize="14"
                />
                <Span :text="info[item.prop]" fontSize="14" />
              </FormattedString>
            </Label>
            <GeneralComponent
              v-if="item.prop === showMulTags"
              :label="item.label + ':'"
              :data="info[item.prop]"
              :labelTag="propsGeneralComponent.labelTag"
              :itemsKey="propsGeneralComponent.itemsKey"
              :labelIterator="propsGeneralComponent.labelIterator"
              :titleCollapse="propsGeneralComponent.titleCollapse"
              :labelViewImage="propsGeneralComponent.labelViewImage"
              :viewImageKey="propsGeneralComponent.viewImageKey"
            />
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
    showMulTags: {
      type: String,
      default: "",
    },
    propsGeneralComponent: {
      type: Object,
      default: {},
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
