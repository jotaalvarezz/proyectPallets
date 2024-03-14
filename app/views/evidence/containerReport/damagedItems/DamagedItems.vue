<template>
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
    <ScrollView>
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
          fontsize="14"
          icon="fa-toolbox"
          @value="model.container_element_id = $event"
        />
        <FormGroupTextField
          label="UBICACION:"
          placeholder="ubicacion..."
          fontsize="14"
          validate="true"
          v-model="model.location"
        />
        <FormGroupTextField
          label="POSICION:"
          placeholder="posicion..."
          fontsize="14"
          v-model="model.position"
        />
        <Label
          text="DAÑO:"
          marginTop="5"
          fontsize="14"
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
            fontsize="14"
            :checked="isChecked"
            @checkedChange="onCheckedChange"
            style="color: #3c495e; width: 45%"
          />
        </FlexboxLayout>
        <!-- <Label
          margin="25"
          backgroundColor="#D8E2E8"
          class="nt-drawer__header-image fas"
          fontSize="55"
          :text="'fa-camera' | fonticon"
          color="#EAB14D"
          @tap="onTakePictureTap"
        /> -->
        <FloatingButton
          style="margin: 60px"
          :icon="'fa-camera'"
          alignX="center"
          iconSize="md"
          :method="onTakePictureTap"
        />
        <Image
          ref="imageRef"
          v-if="cameraImage.length > 0"
          margin="25"
          backgroundColor="#D8E2E8"
          :src="cameraImage"
          loadMode="sync"
        />
        <Label
          text="REPARACION:"
          fontsize="14"
          fontWeight="bold"
          style="color: #3c495e; width: 90%"
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
    </ScrollView>
  </StackLayout>
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
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import { ImageSource, knownFolders, path } from "@nativescript/core";

export default {
  components: { FormGroupTextField, SelectField, Stripe, FloatingButton },
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
      saveToGallery: true,
      allowsEditing: false,
      keepAspectRatio: true,
      width: 320,
      height: 240,
      cameraImage: "",
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
      requestPermissions().then(this.takePhoto(), function failure() {
        // permission request rejected
        // ... tell the user ...
      });
    },

    async takePhoto() {
      const options = {
        saveToGallery: this.saveToGallery,
        allowsEditing: this.allowsEditing,
        keepAspectRatio: this.keepAspectRatio,
        width: this.width,
        height: this.height,
      };

      try {
        const imageAsset = await camera.takePicture(options);
        let pathSplit = imageAsset._android.split("/");
        let photo = pathSplit[pathSplit.length - 1];
        const imageSource = await ImageSource.fromAsset(imageAsset);
        const folderPath = knownFolders.documents().path;
        const filePath = path.join(folderPath, photo);
        const saved = imageSource.saveToFile(filePath, "jpg");
        this.cameraImage = filePath;
        if (saved) {
          console.log("Gallery: " + this._dataItem);
          console.log("Saved: " + filePath);
          console.log("Image saved successfully!");
        }
      } catch (error) {
        console.log("Error -> " + error.message);
      }
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
