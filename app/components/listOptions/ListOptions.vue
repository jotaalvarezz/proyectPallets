<template>
  <!-- <Page> -->
  <GridLayout
    rows="auto, *"
    columns="auto,auto"
    style="max-height: 300px"
    backgroundColor="white"
  >
    <ListView
      row="1"
      ref="listView"
      for="(item, index) in listOfItemsLocal "
      @itemTap="onItemTap"
      :selectedItem="selectedItem"
    >
      <v-template>
        <GridLayout columns="250,auto">
          <Label
            :text="item[labelIterator]"
            textWrap="true"
            class="p-l-10"
            color="black"
            fontSize="18"
            col="0"
          />
          <Label
            col="1"
            :text="item.check && 'fa-check' | fonticon"
            class="fas"
            :class="item.check ? 'check' : 'nocheck'"
            color="#F4F6F8"
          />
        </GridLayout>
      </v-template>
    </ListView>
    <Label
      v-if="multiple === true"
      row="0"
      :text="'fa-times' | fonticon"
      margin="10"
      class="fas text-right"
      color="#3c495e"
      fontSize="18"
      @tap="successSelecteds"
    />
  </GridLayout>
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
    value: {
      type: Array,
      required: true,
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
      ships: [],
      selectedItem: null,
      selectedsItem: [],
    };
  },
  computed: {
    selected() {
      return {};
    },

    listOfItemsLocal() {
      let newCollection = [];
      let item;
      for (let i = 0; i < this.listOfItems.length; i++) {
        item = this.listOfItems[i];
        item.check = false;
        if (!this.multiple) {
          if (this.listOfItems[i].id === this.value) {
            item.check = true;
          }
        } else {
          for (let j = 0; j < this.value.length; j++) {
            if (this.listOfItems[i].id === this.value[j]) {
              item.check = true;
            }
          }
        }
        newCollection.push(item);
      }
      return newCollection;
    },
  },
  methods: {
    onItemTap(event) {
      if (!this.multiple) {
        this.selectedItem = event.item;
        this.$refs.listView.nativeView.refresh();
        this.$modal.close({
          selectedItem: this.selectedItem.id,
        });
      } else {
        if (event.item.check) {
          event.item.check = false;
          let index = this.selectedsItem.findIndex(
            (prev) => prev === event.item.id
          );
          this.selectedsItem.splice(index, 1);
        } else {
          this.selectedsItem.push(event.item.id);
        }
        this.$refs.listView.nativeView.refresh();
      }
    },

    successSelecteds() {
      this.$modal.close({
        selectedItem: this.selectedsItem,
        mensaje: "cerrado sin botton",
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
    if (this.multiple) {
      this.selectedsItem = this.value;
    } else {
      this.selectedItem = this.value;
    }
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
  background-color: rgba(0, 172, 193, 0.8);
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
