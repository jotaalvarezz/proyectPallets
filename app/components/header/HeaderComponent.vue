<template>
    <ActionBar backgroundColor="#00acc1" flat="true">
      <GridLayout
        rows="*"
        columns="auto, 3*, auto"
        height="100%"
      >
        <!-- Contenido de tu GridLayout aquí -->
        <Label
          row="0"
          col="0"
          class="fas text-left"
          text.decode="&#xf0c9;"
          color="white"
          @tap="openDrawer"
          fontSize="20"
        />
        <StackLayout
          row="0"
          col="1"
          style="width: 100%"
        >
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
      </GridLayout>
    </ActionBar>
  </template>

  <script>
  import * as util from "~/shared/util";
  import searchView from "../search/searchView.vue";

  export default {
    props: {

    },
    computed: {},
    methods: {

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
