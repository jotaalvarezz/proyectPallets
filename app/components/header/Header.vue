<template>
  <ActionBar backgroundColor="#00acc1" flat="true">
    <GridLayout rows="*" columns="60, 3*, 60" height="65">
      <ButtonNavigate
        col="0"
        height="60"
        width="60"
        icon="fa-bars"
        size="20"
        iconColor="#F4F6F8"
        radius="50"
        :handleEvent="() => openDrawer()"
      />
      <StackLayout col="1" padding="10" style="width: 100%">
        <Image
          src="~/assets/images/logobarco.png"
          width="30"
          height="30"
          horizontalAlignment="center"
        />
        <Label
          text="WSP"
          fontSize="12"
          padding="0"
          color="#F4F6F8"
          fontWeight="bold"
          horizontalAlignment="center"
        />
      </StackLayout>
      <ButtonNavigate
        v-show="search"
        col="2"
        height="60"
        width="60"
        icon="fa-search"
        size="20"
        iconColor="#F4F6F8"
        radius="50"
        :handleEvent="() => modalSearch()"
      />
      <!-- <Label
        v-show="search"
        rowSpan="2"
        col="2"
        class="fas iconSearch"
        :text="'fa-search' | fonticon"
        color="white"
        fontSize="20"
        @tap="modalSearch"
      /> -->
    </GridLayout>
  </ActionBar>
</template>

<script>
import * as util from "~/shared/util";
import searchView from "../search/searchView.vue";

export default {
  name: "Header",
  props: {
    data: {
      type: Array,
      default: [],
    },
    icons: {
      type: Object,
      default: {
        iconLogo: "fa-exclamation-triangle",
        iconOperations: "fa-ellipsis-v",
      },
    },
    operation1: {
      type: Function,
    },
    operation2: {
      type: Function,
    },
    search: {
      type: Boolean,
    },
  },
  computed: {},
  methods: {
    openDrawer() {
      util.showDrawer();
    },

    modalSearch() {
      this.$showModal(searchView, {
        fullscreen: true,
        props: {
          data: this.data,
          icons: this.icons,
          operation1: this.operation1,
          operation2: this.operation2,
        },
      });
    },
  },

  created() {},
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}

.iconSearch {
  padding-right: 0px;
  margin-left: 5px;
  opacity: 0.8;
}
</style>
