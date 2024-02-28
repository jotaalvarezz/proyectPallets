<template>
  <!-- <Page> -->
  <grid-layout
    rows="*"
    columns="300,auto"
    style="max-height: 300px"
    backgroundColor="white"
  >
    <ListView
      ref="listView"
      for="(item, index) in listOfItems"
      @itemTap="onItemTap"
      :selectedItem="selectedItem"
    >
      <v-template>
        <GridLayout columns="*,auto">
          <Label
            :text="item[labelIterator]"
            class="p-l-10"
            color="black"
            fontSize="18"
            col="0"
          />
          <Label
            col="1"
            :text="selectedItem === item.id && 'fa-check' | fonticon"
            class="fas"
            :class="item.id === selectedItem ? 'check' : 'nocheck'"
            color="#F4F6F8"
          />
        </GridLayout>
      </v-template>
    </ListView>
  </grid-layout>
  <!-- </Page> -->
</template>
<script>
const { getShips } = require("~/sqlite/database");

export default {
  components: {},

  props: {
    listOfItems: {
      type: Array,
      required: true,
    },
    item: {
      type: Array,
      required: true,
    },
    labelIterator: {
      type: String,
      default:'name',
    },
  },

  data() {
    return {
      ships: [],
      selectedItem: null,
    };
  },
  computed: {
    selected() {
      return {};
    },
  },
  methods: {
    onItemTap(event) {
      this.selectedItem = event.item;
      this.$refs.listView.nativeView.refresh();
      this.$modal.close({
        selectedItem: this.selectedItem
      });
    },

    async getShips() {
      try {
        this.ships = [];
        const ships = await getShips();
        for (let i = 0; i < ships.length; i++) {
          this.ships.push(ships[i][1]);
        }
      } catch (error) {
        console.error("error al traer lo datos ", error);
      }
    },
  },

  created() {
    this.selectedItem = this.item
    /* this.$refs.listView.nativeView.refresh(); */
  },
};
</script>
<style lang="scss">
.nocheck {
  display: inline-block;
  height: 26rem;
  width: 26rem;
  flex: none;
  border-radius: 9999px;
  border-width: 1px;
}

.check {
  display: inline-block;
  flex: none;
  height: 26rem;
  width: 26rem;
  padding: 6;
  border-radius: 9999px;
  border-width: 1px;
  background-color: #EAB14D;
}

.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #081a36;
  horizontal-align: right;
  vertical-align: bottom;
}
</style>
