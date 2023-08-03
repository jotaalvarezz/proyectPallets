<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <StackLayout orientation="horizontal" style="background-color: #00acc1; text-align: center" height="70">
        <Label :text="'fa-reply' | fonticon" fontSize="18" class="fas" color="#F4F6F8" width="20%"
          @tap="$modal.close"></Label>
        <Label text="Registro de Barco" fontSize="18" color="#F4F6F8" fontWeight="bold" width="60%"></Label>
        <!-- <Image src="~/assets/images/logobarco.png" stretch="aspectFit" width="60%"/> -->
        <!-- <Label text="Nuevo Barco" width="20%"></Label> -->
      </StackLayout>
      <card-view margin="10" elevation="40" radius="15">
        <GridLayout rows="auto,auto,auto,auto" padding="30">
          <Image row="0" src="~/assets/images/logobarco.png" stretch="aspectFit" height="30%" width="60%" />
          <TextField row="1" v-model="model.nameShip" padding="10" hint="Nombre de Barco..." height="45" fontSize="18"
            boder="none" style="
              placeholder-color: #3c495e;
              color: #3c495e;
              background-color: #c0c9d7;
              width: 80%;
            "
            :isEnabled="model.action == false ? 'true' : 'false'" />

          <TextField row="2" padding="10" v-model="model.journey" hint="Viaje..." height="45" fontSize="18" boder="none"
            style="
              placeholder-color: #3c495e;
              color: #3c495e;
              background-color: #c0c9d7;
              width: 80%;
            " />
          <!-- Boton para Crear -->
          <Button v-if="model.action == false" row="3" text="Agregar" backgroundColor="#F4F6F8" color="#222a37"
            fontSize="22" @tap="addShip" borderWidth="1" borderColor="#222a37" borderRadius="30" marginTop="14" />
          <!-- ******************* -->
          <!-- Boton para Editar -->
          <Button v-if="model.action == true" row="3" text="Actualizar" backgroundColor="#F4F6F8" color="#222a37"
            fontSize="22" @tap="updateShip" borderWidth="1" borderColor="#222a37" borderRadius="30" marginTop="14" />
          <!-- ******************* -->
        </GridLayout>
      </card-view>
    </StackLayout>
  </Page>
</template>
<script>
import { fonticon } from "nativescript-fonticon";
import Header from "~/components/header/Header.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
const { insertShip, getShips, updateShip } = require("~/sqlite/database");
import Alerts from "~/alerts/Alerts";

export default {
  components: {
    Header,
  },
  props: {
    textBar: {
      type: String,
      required: true,
    },
    info: {
      type: Object
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
        console.log(this.model.nameShip)
        if (this.model.nameShip.length > 0) {
          const ship = await insertShip(this.model);
          console.log("save ", ship);
          const newShip = this.model
          this.model.nameShip = "";
          this.model.journey = "";
          this.$modal.close()
        } else {
          Alerts.info("La campo nombre de Barco vacio...",1)
        }
      } catch (error) {
        console.log("al insertar error ", error);
      }
    },

    async updateShip() {
      let confirmated = await Alerts.confirmation()
      if (confirmated) {
        try {
          if (this.model.journey.length > 0) {
            const ship = await updateShip(this.model);
            console.log("update ", ship)
            this.$modal.close()
          }
        } catch (error) {
          console.error("Hubo un error al editar ", error)
        }
      }
    }
  },

  created() {
    this.model = this.info
    this.model.nameShip = this.model.text
  }
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
</style>
