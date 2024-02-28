<template>
  <ActionBar backgroundColor="#00acc1">
    <GridLayout columns="50, *">
      <StackLayout
        col="1"
        orientation="horizontal"
        class="action-bar-title cardtitle"
        colSpan="2"
        style="margin-left: 27%"
      >
        <Image
          src="~/assets/images/logobarco.png"
          width="40"
          height="40"
          verticalAlignment="center"
        />
        <Label
          text="WSP"
          fontSize="24"
          color="#F4F6F8"
          fontWeight="bold"
          verticalAlignment="center"
        />
      </StackLayout>
      <Label
        col="0"
        class="fas"
        text.decode="&#xf0c9;"
        color="white"
        @tap="openDrawer"
        fontSize="25"
      />
    </GridLayout>
    <!-- <ActionItem android.systemIcon="ic_menu_camera" ios.position="left" text="scan code" @tap="readCode" /> -->
    <ActionItem
      v-show="search"
      android.systemIcon="ic_menu_search"
      ios.position="right"
      text="delete"
      @tap="modalSearch"
    />
  </ActionBar>
</template>

<script>
import * as util from "~/shared/util";
import searchView from "../search/searchView.vue";

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    icons: {
      type: Object,
      required: true,
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

  created() {

  },
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
</style>
