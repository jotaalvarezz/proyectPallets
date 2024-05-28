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
          :text="'fa-chevron-left' | fonticon"
          fontSize="16"
          class="fas text-center"
          color="#F4F6F8"
          @tap="$modal.close"
        />
        <Label
          row="0"
          col="1"
          class="text-center"
          text="Registro de Barco"
          fontSize="15"
          color="#F4F6F8"
          fontWeight="bold"
        ></Label>
      </GridLayout>
      <GridLayout
        rows="auto,auto,auto,auto,auto"
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="10"
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
          label="Barco:"
          placeholder="nombre de barco..."
          fontsize="14"
          v-model="model.nameShip"
          :enable="model.action == false ? 'true' : 'false'"
        />
        <!-- <TextField
            row="1"
            v-model="model.nameShip"
            padding="10"
            hint="Nombre de Barco..."
            height="45"
            fontSize="18"
            boder="none"
            style="
              placeholder-color: #3c495e;
              color: #3c495e;
              background-color: #c0c9d7;
              width: 80%;
            "
            :isEnabled="model.action == false ? 'true' : 'false'"
          /> -->
        <FormGroupTextField
          row="2"
          label="Viaje:"
          placeholder="viaje..."
          fontsize="14"
          v-model="model.journey"
        />
        <!-- <TextField
            row="2"
            padding="10"
            v-model="model.journey"
            hint="Viaje..."
            height="45"
            fontSize="18"
            boder="none"
            style="
              placeholder-color: #3c495e;
              color: #3c495e;
              background-color: #c0c9d7;
              width: 80%;
            "
          /> -->
        <Stripe
          row="3"
          class="stripe"
          color="#3c495e"
          marginTop="20"
          marginBottom="20"
        />
        <!-- Boton para Crear -->
        <Button
          v-if="model.action == false"
          row="4"
          text="Agregar"
          backgroundColor="#F4F6F8"
          color="#222a37"
          style="width: 80%; margin-bottom: 20px"
          @tap="addShip"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
        <!-- ******************* -->
        <!-- Boton para Editar -->
        <Button
          v-if="model.action == true"
          row="4"
          text="Actualizar"
          backgroundColor="#F4F6F8"
          color="#222a37"
          style="width: 80%; margin-bottom: 20px"
          @tap="updateShip"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
        <!-- ******************* -->
      </GridLayout>
    </StackLayout>
  </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import Stripe from "~/components/stripe/Stripe";
const { insertShip, getShips, updateShip } = require("~/sqlite/database");
import Alerts from "~/alerts/Alerts";

export default {
  components: {
    Header,
    FormGroupTextField,
    Stripe,
  },
  props: {
    textBar: {
      type: String,
      required: true,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {
      model: {},
      options: ["Cala Pedra", "Cala Pino", "Cala Pula"],
      selectedIndex: 1,
    };
  },
  computed: {
    setJourney() {
      this.journey = this.item.text;
      return this.journey;
    },
  },
  methods: {
    onSelectedIndexChanged(event) {
      this.selectedIndex = event.value;
      this.model.nameShip = this.options[this.selectedIndex];
    },

    modalOption() {
      this.$showModal(ListOptions);
    },

    async addShip() {
      try {
        if (this.model.nameShip.length > 0) {
          const ship = await insertShip(this.model);
          const newShip = this.model;
          this.model.nameShip = "";
          this.model.journey = "";
          this.$modal.close();
        } else {
          Alerts.info("La campo nombre de Barco vacio...", 1);
        }
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },

    async updateShip() {
      let confirmated = await Alerts.confirmation();
      if (confirmated) {
        try {
          if (this.model.journey.length > 0) {
            const ship = await updateShip(this.model);
            this.$modal.close();
          } else {
            Alerts.info("Debe llenar el campo ' Viaje... ' ", 1);
          }
        } catch (error) {
          console.error("Hubo un error al editar ", error);
        }
      }
    },
  },

  created() {
    this.model = this.info;
    this.model.nameShip = this.model.text;
  },
};
</script>
<style>
.custom-dropdown {
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 8px;
}

.btn:focus {
  background-color: red;
}

.shadow {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.stripe {
  width: 80%;
}
</style>
