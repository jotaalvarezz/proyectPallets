<template>
  <ScrollView>
    <StackLayout @loaded="InfoSelect" backgroundColor="#F4F6F8">
      <StackLayout
        orientation="horizontal"
        style="background-color: #00acc1; text-align: center"
        height="70"
      >
        <Label
          :text="'fa-reply' | fonticon"
          fontSize="15"
          color="#F4F6F8"
          class="fas"
          width="15%"
          @tap="$modal.close"
        ></Label>
        <Label
          text="Registro de Daños/Reparaciones"
          fontSize="18"
          color="#F4F6F8"
          fontWeight="bold"
          width="70%"
        ></Label>
        <Label
          :text="'fa-tools' | fonticon"
          fontSize="18"
          color="#F4F6F8"
          class="fas"
          width="15%"
        ></Label>
      </StackLayout>
      <StackLayout
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="20"
        borderWidth="1"
        borderColor="#3c495e"
        borderRadius="5"
      >
        <SelectField
          row="4"
          :value="model.container_element_id"
          :items="elements"
          label="ELEMENTO:"
          icon="fa-toolbox"
          @value="model.container_element_id = $event"
        />
        <FormGroupTextField
          label="UBICACION:"
          placeholder="ubicacion..."
          validate="true"
          v-model="model.location"
        />
        <FormGroupTextField
          label="POSICION:"
          placeholder="posicion..."
          v-model="model.position"
        />
        <Label
          text="DAÑO:"
          textWrap="true"
          marginTop="5"
          fontSize="18"
          fontWeight="bold"
          style="color: #3c495e; width: 90%"
        />
        <FlexboxLayout flexWrap="wrap" style="width: 90%">
          <check-box
            v-for="item in damages"
            height="30"
            :key="item.id"
            :id="item.id"
            :text="item.name"
            :checked="isChecked"
            @checkedChange="onCheckedChange"
            style="color: #3c495e; width: 45%"
          />
        </FlexboxLayout>
        <Image
          margin="25"
          backgroundColor="#D8E2E8"
          class="nt-drawer__header-image fas"
          src="~/assets/images/camara.png"
          @tap="onTakePictureTap"
        />
        <Label
          row="1"
          text="REPARACION :"
          fontSize="18"
          fontWeight="bold"
          style="color: #3c495e; margin-top: 25px; width: 90%"
        />
        <Switch
          horizontalAlignment="left"
          :class="model.state"
          width="50"
          height="auto"
          v-model="model.state"
        />
        <Stripe color="#3c495e" margin="20" />
        <Button
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="Agregar"
          @tap="addRepair"
          style="width: 80%; margin-bottom: 20px"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
      </StackLayout>
    </StackLayout>
  </ScrollView>
</template>

<script>
const { getDamage } = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import SelectField from "~/components/selectField/SelectField";
import Stripe from "~/components/stripe/Stripe";
import Alert from "~/alerts/Alerts";
import { requestPermissions } from "@nativescript/camera";
import * as camera from "@nativescript/camera";
import { Image } from "@nativescript/core";

export default {
  components: { FormGroupTextField, SelectField, Stripe },
  props: {
    container_elements: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      row: 1,
      col: 0,
      model: {
        container_element_id: null,
        location: "",
        position: "",
        damage_id: [],
        state: false,
      },
      isChecked: null,
      damages: [],
      elements: [],
      imagenCapturada: null,
      saveToGallery: false,
      allowsEditing: false,
      keepAspectRatio: true,
      width: 320,
      height: 240,
      cameraImage: null,
      labelText: "",
    };
  },

  mixins: [mixinMasters],

  methods: {
    onCheckedChange(args) {
      const checkbox = args.object;
      if (checkbox.checked) {
        this.model.damage_id.push({
          id: checkbox.id,
          text: checkbox.text,
          checked: checkbox.checked,
        });
      } else {
        const index = this.model.damage_id.findIndex(
          (prev) => prev.text === checkbox.text
        );
        this.model.damage_id.splice(index, 1);
      }
    },

    async addRepair() {
      try {
        let confirmated = await Alert.info(
          "¡¿Desea sequir añadiendo daños?!",
          3
        );
        if (confirmated) {
          this.$modal.close({
            model: this.model,
            elements: this.elements,
          });
        }
      } catch (error) {}
    },

    async InfoSelect() {
      console.log("damages items");
      try {
        this.loadingCharge(true);
        const res2 = await getDamage();
        this.damages = res2.data;
        this.elements = this.container_elements;
      } catch (error) {
        console.log("solucion de errores ", error);
      } finally {
        this.loadingCharge();
      }
    },

    onTakePictureTap() {
      requestPermissions().then(
        function success() {
          camera.takePicture()
          .then((imageAsset) => {
            console.log("Result is an image asset instance");
            var image = new Image();
            image.src = imageAsset;
          })
          .catch((err) => {
            console.log("Error -> " + err.message);
          });
        },
        function failure() {
          // permission request rejected
          // ... tell the user ...
          console.log("denegado");
        }
      );
    },
  },
};
</script>

<style scoped>
.switchEnable {
  color: #0dcaf0;
  background-color: #cef4fc;
}

.switchDisable {
  color: #e92222;
  background-color: #fad2d2;
}

.shadow {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
