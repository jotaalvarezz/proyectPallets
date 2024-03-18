<template>
  <page @loaded="verification">
    <Header :search="false" />
    <StackLayout backgroundColor="#F4F6F8">
      <GridLayout
        rows="auto,auto,auto,auto,auto,auto,auto,auto"
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="10"
        borderWidth="1"
        borderColor="#c0c9d7"
        borderRadius="5"
        padding="30"
      >
        <Label
        row="0"
          class="text-center"
          text="GESTION DE CONTENEDOR"
          fontSize="18"
          color="#3c495e"
          fontWeight="bold"
        ></Label>
        <Stripe row="1" color="#3c495e" mt="20" mb="20" />
        <FormGroupTextField
            v-if="management_id ===1"
          row="2"
          label="Buque:"
          placeholder="nombre de barco..."
          fontsize="14"
          v-model="model.name"
        />
        <FormGroupTextField
        v-if="management_id ===1"
          row="3"
          label="Viaje:"
          placeholder="viaje..."
          fontsize="14"
          v-model="model.journey"
        />
        <Signature row="4" />
        <Stripe row="5" color="#3c495e" mt="20" mb="20" />
        <!-- Boton para Crear -->
        <Button
          row="6"
          text="Agregar"
          backgroundColor="#F4F6F8"
          color="#222a37"
          style="width: 80%; margin-bottom: 20px"
          @tap="addShip"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
const { getTypesManagement } = require("~/sqlite/database");
import Header from "~/components/header/Header.vue";
import Stripe from "~/components/stripe/Stripe";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import Signature from "~/components/signature/Signature.vue";
import Alert from "~/alerts/Alerts";

export default {
  name: "Management",
  components: {
    Header,
    Stripe,
    FormGroupTextField,
    Signature,
  },

  props: {
    management_id: {
      type: Number,
    },
  },

  data() {
    return {
      model: {
        vessel: "Cala Pino",
        journey: "U.S.A",
      },
    };
  },

  methods: {
    verification() {
      console.log("verification ", this.management_id);
    },
  },

  mounted() {
    console.log("router ", this.$router);
  },
};
</script>
<style>
.colorIcons {
  color: #222a37;
}

.my-card {
  border-width: 2;
  border-color: #000000;
  border-radius: 5;
}

.shadow {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
