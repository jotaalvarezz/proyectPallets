<template>
  <Page>
    <StackLayout backgroundColor="#3c495e">
      <StackLayout
        orientation="horizontal"
        style="background-color: #222a37; text-align: center"
        height="70"
      >
        <Label
          :text="'fa-reply' | fonticon"
          fontSize="18"
          class="fas"
          width="20%"
          @tap="$modal.close"
        ></Label>
        <Label
          :text="textBar"
          fontSize="18"
          fontWeight="bold"
          width="60%"
        ></Label>
        <!-- <Image src="~/assets/images/logobarco.png" stretch="aspectFit" width="60%"/> -->
        <!-- <Label text="Nuevo Barco" width="20%"></Label> -->
      </StackLayout>
      <card-view margin="10" elevation="40" radius="15">
        <GridLayout rows="auto,auto,auto,auto" padding="30">
          <Image
            row="0"
            src="~/assets/images/logobarco.png"
            stretch="aspectFit"
            height="30%"
            width="60%"
          />
          <!-- <TextField row="1" v-model="nameShip" :hint="textHint1" height="40" fontSize="15" borderColor="#3c495e"
            style="placeholder-color: #3c495e; color: #3c495e;" /> -->
          <StackLayout row="1" height="40" padding="10" style="background-color: #c0c9d7; width: 80%;">
            <DropDown
              v-model="selectedOption"
              :items="options"
              :hint="textHint1"
              color="#3c495e"
              style="font-size: 15px;"
            />
          </StackLayout>

          <TextField
            row="2"
            padding="10"
            v-model="setJourney"
            :hint="textHint2"
            height="40"
            fontSize="15"
            boder="none"
            style="placeholder-color: #3c495e; color: #3c495e; background-color: #c0c9d7; width: 80%;"
          />
          <Button
            row="3"
            marginTop="14"
            backgroundColor="#081a36"
            text="Agregar"
            @tap="addShip"
            style="width: 80%;"
          />
        </GridLayout>
      </card-view>
    </StackLayout>
  </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
const { insertData } = require("~/sqlite/database");

export default {
  components: {
    Header,
  },
  props: {
    textBar: {
      type: String,
      required: true,
    },
    textHint1: {
      type: String,
      required: true,
    },
    textHint2: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
    },
    update: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      nameShip: "",
      journey: "",
      options: ["Opción 1", "Opción 2", "Opción 3"],
      selectedOption: "",
    };
  },
  computed: {
    setJourney() {
      this.journey = this.item.text;
      return this.journey;
    },
  },
  methods: {
    async addShip() {
      try {
        const ship = await insertData(this.nameShip);
        console.log("save ", ship);
        this.nameShip = "";
        this.journey = "";
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },
  },
};
</script>
<style>
.custom-dropdown {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 8px;
}
</style>
