<template>
  <ActionBar backgroundColor="#00acc1" flat="true">
    <GridLayout rows="auto, *" columns="auto, 3*, auto" height="100%">
      <!-- Contenido de tu GridLayout aquí -->
      <Label
        row="1"
        col="1"
        text="label de prueba"
        fontSize="12"
        padding="0"
        color="#F4F6F8"
        fontWeight="bold"
      />
      <Label
        col="0"
        rowSpan="2"
        class="fas text-left"
        text.decode="&#xf0c9;"
        color="white"
        @tap="openDrawer"
        fontSize="20"
      />
      <StackLayout row="0" col="1" style="width: 100%">
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
      <Label
        v-show="search"
        rowSpan="2"
        col="2"
        class="fas iconSearch"
        :text="'fa-search' | fonticon"
        color="white"
        fontSize="20"
        @tap="modalSearch"
      />
    </GridLayout>
  </ActionBar>
</template>

<script>
import * as util from "~/shared/util";
import searchView from "../search/searchView.vue";

export default {
  name:"Header",
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
