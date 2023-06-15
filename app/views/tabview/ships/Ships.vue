<template>
  <!-- <Page> -->
    <ListView for="(item, index) in listOfItems" @itemTap="onItemTap">
      <v-template>
        <FlexboxLayout>
          <Label
            :text="'fa-ship' | fonticon"
            class="fas"
            width="110"
            fontSize="70"
            backgroundColor="#222A37"
            color="white"
          />
          <Label
            :text="item.text"
            class="p-l-10"
            width="auto"
            color="white"
            fontSize="25"
          />
        </FlexboxLayout>
      </v-template>
    </ListView>
  <!-- </Page> -->
</template>

<script>
/* import { GridLayout } from "@nativescript/core"; */

export default {
  name: "Ships",
  data() {
    return {
      listOfItems: [
        { text: "first" },
        { text: "second" },
        { text: "three" },
        { text: "four" },
      ],
    };
  },
  methods: {
    onItemTap() {
      console.log("success");
    },
  },
  /* components: { GridLayout }, */
};
</script>
