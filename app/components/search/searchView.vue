<template>
  <page>
    <StackLayout backgroundColor="#F4F6F8">
      <StackLayout
        backgroundColor="#00acc1"
        orientation="horizontal"
        padding="4"
        height="70"
      >
        <ButtonNavigate
          height="60"
          width="60"
          icon="fa-chevron-left"
          iconColor="#F4F6F8"
          radius="50"
          :handleEvent="() => close()"
        />
        <TextField
          v-model="textFieldValue"
          height="40"
          borderWidth="1"
          backgroundColor="#F4F6F8"
          width="80%"
          borderRadius="5"
          borderColor="#F4F6F8"
          horizontalAlignment="left"
          style="placeholder-color: #3c495e; color: #3c495e"
          hint="Buscar..."
          paddingLeft="10"
          fontSize="15"
          @textChange="filter"
        />
      </StackLayout>
      <GridLayout rows="*" backgroundColor="#F4F6F8">
        <Label
          row="0"
          textWrap="true"
          class="info"
          v-if="array_filter.length == 0"
          verticalAlignment="center"
        >
          <FormattedString>
            <Span class="fas" text.decode="&#x1F6A2;" />
            <Span :text="message" />
          </FormattedString>
        </Label>
        <ListView
          v-if="array_filter.length > 0"
          for="(item, index) in array_filter"
          @itemTap="navegate"
        >
          <v-template>
            <GridLayout columns="*,50">
              <StackLayout
                orientation="horizontal"
                col="0"
              >
                <Label
                  backgroundColor="#D8E2E8"
                  :text="icons.iconLogo | fonticon"
                  class="nt-drawer__header-image fas"
                  fontSize="45"
                  color="#EAB14D"
                />
                <StackLayout class="heigth">
                  <Label
                    text="Barco:"
                    class="p-l-10 subTittle"
                    textWrap="true"
                    width="auto"
                    fontSize="14"
                  />
                  <Label
                    :text="item.text"
                    class="p-l-10 colorIcons"
                    fontSize="14"
                  />
                </StackLayout>
              </StackLayout>
              <Label
                :text="icons.iconOperations | fonticon"
                class="fas colorIcons"
                fontSize="18"
                col="1"
                style="text-align: center"
                @tap="operation2(item, index)"
              />
            </GridLayout>
          </v-template>
        </ListView>
        <!-- <fab
          @tap="getAll"
          :text="'fa-sync' | fonticon"
          class="fab-sync fas"
          rippleColor="#f1f1f1"
        >
        </fab> -->
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
export default {
  name: "searchView",
  props: {
    data: {
      type: Array,
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
  },
  data() {
    return {
      textFieldValue: "",
      array_filter: [],
      datos: [
        { name: "primer registro" },
        { name: "segundo registro" },
        { name: "tercer registro" },
        { name: "cuarto registro" },
        { name: "quinto registro" },
      ],
      message: "No hay barcos para mostrar",
    };
  },

  methods: {
    filter() {
      if (this.textFieldValue.length > 0) {
        this.array_filter = this.data.filter((prev) =>
          prev.text.toLowerCase().includes(this.textFieldValue.toLowerCase())
        );
      } else if (this.textFieldValue.length === 0) {
        this.array_filter = [];
      }
    },

    navegate(event) {
      this.operation1(event.item);
      this.$modal.close();
    },

    close() {
      this.$modal.close();
    },
  },

  created() {
    console.log("search ", this.data);
  },
};
</script>
<style scoped>
.exitIcon {
  opacity: 0.8;
}
</style>
