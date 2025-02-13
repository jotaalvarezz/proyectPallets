<template>
  <GridLayout rows="auto,*" style="max-height: 300px" backgroundColor="white">
    <GridLayout margin="5" row="0" rows="*" columns="*">
      <SearchBar
        ref="searchBar"
        row="0"
        col="0"
        height="50"
        margin="10"
        class="search-bar"
        hint="Buscar..."
        v-model="search"
        @loaded="focus"
        @textChange="filter"
        @submit="filter"
        @clear="clear"
      />
    </GridLayout>
    <!-- ************************************************* -->
    <Label
      row="1"
      textWrap="true"
      class="info"
      v-if="array_filter.length == 0"
      verticalAlignment="center"
    >
      <FormattedString>
        <Span class="fas" text.decode="&#x1f6e0; " />
        <Span :text="message" />
      </FormattedString>
    </Label>
    <StackLayout row="1">
      <ListView
        ref="listView"
        height="60%"
        for="(item, index) in array_filter "
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
            />
          </GridLayout>
        </v-template>
      </ListView>
    </StackLayout>
  </GridLayout>
</template>

<script>
import { onSearchBarLoaded } from "~/shared/helpers";

export default {
  name: "ListItems",
  props: {
    listOfItems: {
      type: Array,
      required: true,
    },
    labelIterator: {
      type: String,
      default: "name",
    },
    value: {
      type: Array,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      selectedItem: null,
      selectedsItem: [],
      array_filter: [],
      message: "No se encontraron coincidencias...",
    };
  },
  computed: {
    listOfItemsLocal() {
      let newCollection = [];
      let item;
      for (let i = 0; i < this.array_filter.length; i++) {
        item = this.array_filter[i];
        item.check = false;
        if (!this.multiple) {
          if (this.array_filter[i].id === this.value) {
            item.check = true;
          }
        } else {
          for (let j = 0; j < this.value.length; j++) {
            if (this.array_filter[i].id === this.value[j]) {
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
    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.listOfItems.filter(
          (data) =>
            !this.search ||
            data[this.labelIterator].toLowerCase().includes(this.search.toLowerCase())
        );
      } else if (this.search.length === 0) {
        this.array_filter = this.listOfItems;
      }
    },

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

    //evento para quitarle foco al searhBar cuando se carga la vista
    focus(event) {
      onSearchBarLoaded(event);
    },
  },
  created() {
    this.array_filter = this.listOfItems;
    if (this.multiple) {
      this.selectedsItem = this.value;
    } else {
      this.selectedItem = this.value;
    }
  },
};
</script>

<style>
.suggestion-item {
  padding: 10px;
  border-bottom-width: 1px;
  border-color: #ccc;
}

.search-bar {
  font-size: 15; /* Cambia el tamaño del texto aquí */
}
</style>
