<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <HeaderComponent :title="textBar" :handleback="$modal.close"/>
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
          label="Bodega:"
          placeholder="nombre de bodega..."
          fontsize="14"
          v-model="model.name"
          :required="errors.name"
        />
        <FormGroupTextField
          row="2"
          label="Barco:"
          placeholder="nombre de barco..."
          fontsize="14"
          v-model="nameShip"
          enable="false"
        />
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
const { insertWarehuse } = require("~/sqlite/database");
import Alerts from "~/alerts/Alerts";
import { mapState } from "vuex";

export default {
  components: {},
  props: {
    textBar: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
    }
  },
  data() {
    return {
      model: {
        name: "",
        ship_id: "",
      },

      errors: {
        name: false,
      },
    };
  },
  computed: {
    ...mapState(["ship"]),
    nameShip() {
      this.model.ship_id = this.ship.id;
      return this.ship.name;
    },
  },
  methods: {
    validateField(fields) {
      this.errors.name = !this.model.name.trim();
      let fullfield = "";
      for (const key in this.errors) {
        if (this.errors.hasOwnProperty(key) && this.errors[key] != false) {
          return !this.errors[key];
        }
        fullfield = !this.errors[key];
      }
      return fullfield;
    },

    async addWarehouse() {
      const isValid = this.validateField();
      if (!isValid) {
        // Detener la ejecución si la validación falla
        return;
      }

      try {
        if (this.model.name.length > 0) {
          const warehouse = await insertWarehuse(this.model);
          this.model.name = "";
          this.$modal.close();
        } else {
          Alerts.info("El campo nombre de Bodega esta vacio...", 1);
        }
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
