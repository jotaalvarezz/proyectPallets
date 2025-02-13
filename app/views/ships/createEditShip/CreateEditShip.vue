<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <HeaderComponent :title="textBar" :handleback="$modal.close" />
      <GridLayout
        ref="form"
        class="shadow"
        rows="*"
        backgroundColor="#F4F6F8"
        margin="10"
        borderWidth="1"
        borderColor="#c0c9d7"
        borderRadius="5"
      >
        <ScrollView>
          <GridLayout rows="auto,auto,auto" padding="30">
            <Image
              row="0"
              src="~/assets/images/logobarco.png"
              stretch="aspectFit"
              height="10%"
              width="50%"
            />
            <FormGroupTextField
              row="1"
              label="Barco:"
              placeholder="nombre de barco..."
              fontsize="14"
              v-model="model.name"
              :enable="model.action == false ? 'true' : 'false'"
              :required="errors.name"
            />
            <FormGroupTextField
              row="2"
              label="Viaje:"
              placeholder="viaje..."
              fontsize="14"
              v-model="model.journey"
            />
            <!-- <Stripe
              row="3"
              class="stripe"
              color="#3c495e"
              marginTop="20"
              marginBottom="20"
            /> -->
            <!-- Boton para Crear -->
            <!-- <Button
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
            /> -->
            <!-- ******************* -->
            <!-- Boton para Editar -->
            <!-- <Button
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
            /> -->
            <!-- ******************* -->
          </GridLayout>
        </ScrollView>
        <FloatingButton
          :icon="'fa-save'"
          iconSize="sm"
          :method="model.action == false ? addShip : updateShip"
        />
      </GridLayout>
    </StackLayout>
  </Page>
</template>
<script>
const { insertShip, getShips, updateShip } = require("~/sqlite/database");
import Alerts from "~/alerts/Alerts";

export default {
  components: {},
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
      model: {
        name: "",
        journey: "",
        action: false,
      },

      errors: {
        name: false,
      },
    };
  },
  computed: {},
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

    async addShip() {
      const isValid = this.validateField();
      if (!isValid) {
        // Detener la ejecución si la validación falla
        return;
      }

      try {
        const ship = await insertShip(this.model);
        this.model.name = "";
        this.model.journey = "";
        this.$modal.close();
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },

    async updateShip() {
      let confirmated = await Alerts.confirmation();
      if (confirmated) {
        try {
          if (this.model.journey.length > 0) {
            const res = await updateShip(this.model);
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
    if (this.info.action) {
      this.model = this.info;
    }
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
