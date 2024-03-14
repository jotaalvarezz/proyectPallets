<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <GridLayout
        height="65"
        rows="*"
        columns="50, 3*, 50"
        backgroundColor="#00acc1"
      >
        <Label
          row="0"
          col="0"
          :text="'fa-reply' | fonticon"
          fontSize="16"
          class="fas text-center"
          color="#F4F6F8"
          @tap="$modal.close"
        />
        <Label
          row="0"
          col="1"
          class="text-center"
          :text="textBar"
          fontSize="15"
          color="#F4F6F8"
          fontWeight="bold"
        ></Label>
      </GridLayout>
      <GridLayout
        rows="auto,auto,auto,auto,auto"
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="20"
        borderWidth="1"
        borderColor="#c0c9d7"
        borderRadius="5"
        padding="30"
      >
        <Image
          row="0"
          src="~/assets/images/logobarco.png"
          stretch="aspectFit"
          height="30%"
          width="60%"
        />
        <FormGroupTextField
          row="1"
          label="Bodega:"
          placeholder="nombre de bodega..."
          fontsize="14"
          v-model="model.nameWarehouse"
        />
        <FormGroupTextField
          row="2"
          label="Barco:"
          placeholder="nombre de barco..."
          fontsize="14"
          v-model="nameShip"
          enable="false"
        />
        <!-- <GridLayout
          row="2"
          height="50"
          columns="auto, *,auto"
          padding="10"
          @tap="modalOption"
          style="background-color: #c0c9d7; width: 80%"
        >
          <Label
            :text="'fa-ship' | fonticon"
            fontSize="18"
            class="fas"
            col="0"
            color="#3c495e"
          />
          <Label
            :text="nameShip"
            ccolor="white"
            class="p-l-10"
            fontSize="15"
            col="1"
            color="#3c495e"
          />
          <Label
            :text="'fa-sort-down' | fonticon"
            fontSize="18"
            class="fas"
            col="2"
            color="#3c495e"
          />
        </GridLayout> -->
        <Stripe
          row="3"
          class="stripe"
          color="#3c495e"
          marginTop="20"
          marginBottom="20"
        />
        <Button
          row="4"
          text="Agregar"
          backgroundColor="#F4F6F8"
          color="#222a37"
          style="width: 80%; margin-bottom: 20px"
          @tap="addWarehouse"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import SelectField from "~/components/selectField/SelectField";
import Stripe from "~/components/stripe/Stripe";
const { insertWarehuse, getShips } = require("~/sqlite/database");
import Alerts from "~/alerts/Alerts";
import { mapState } from "vuex";

export default {
  components: {
    Header,
    FormGroupTextField,
    SelectField,
    Stripe,
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
    shipName: {
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
      model: {
        nameWarehouse: "",
        ship_id: "",
      },
      options: [],
      selectedIndex: "",
    };
  },
  computed: {
    ...mapState(["ship"]),
    nameShip() {
      this.model.ship_id = this.ship.id;
      return this.ship.text;
    },
  },
  methods: {
    modalOption() {
      /* this.$showModal(ListOptions); */
    },

    onSelectedIndexChanged(event) {
      this.selectedIndex = event.value;
      this.model.nameShip = this.options[this.selectedIndex];
    },

    async addWarehouse() {
      try {
        if (this.model.nameWarehouse.length > 0) {
          const warehouse = await insertWarehuse(this.model);
          console.log("save ", warehouse);
          this.model.nameWarehouse = "";
          this.$modal.close();
        } else {
          Alerts.info("El campo nombre de Bodega esta vacio...", 1);
        }
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },

    async getShips() {
      try {
        this.ships = [];
        const ships = await getShips();
        console.log(ships);
        for (let i = 0; i < ships.length; i++) {
          this.options.push(ships[i][1]);
        }
      } catch (error) {
        console.error("error al traer lo datos ", error);
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
