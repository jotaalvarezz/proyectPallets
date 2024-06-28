<template>
  <StackLayout @loaded="InfoSelect" backgroundColor="#F4F6F8">
    <HeaderComponent title="Registro de Daños/Reparaciones" :handleback="$modal.close"/>
    <ScrollView>
      <StackLayout
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="10"
        borderWidth="1"
        borderColor="#c0c9d7"
        borderRadius="5"
        padding="30"
      >
        <SelectField
          row="4"
          :value="model.container_element_id"
          :items="elements"
          label="ELEMENTO:"
          fontsize="14"
          icon="fa-toolbox"
          @value="model.container_element_id = $event"
          :required="errors.container_element_id"
        />
        <SelectField
          :value="model.location"
          :items="locations"
          label="UBICACION:"
          labelIterator="location"
          fontsize="14"
          icon="fa-arrows-alt-h"
          @value="model.location = $event"
          :required="errors.location"
        />
        <SelectField
          :value="model.position"
          :items="positions"
          label="POSICION:"
          labelIterator="position"
          fontsize="14"
          icon="fa-arrows-alt-v"
          @value="model.position = $event"
          :required="errors.position"
        />
        <Label
          text="DAÑO:"
          marginTop="10"
          fontSize="14"
          fontWeight="bold"
          style="color: #3c495e; width: 80%"
        />
        <FlexboxLayout flexWrap="wrap" style="width: 80%">
          <check-box
            v-for="item in damages"
            ref="checkbok"
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
        <Label
          v-if="errors.damage_id"
          class="label-error"
          style="width: 80%"
          :text="'*debe selecionar los daños, oblogatorio'"
        />
        <FloatingButton
          style="margin: 60px"
          :icon="'fa-camera'"
          alignX="center"
          iconSize="md"
          :method="onTakePictureTap"
        />
        <GridLayout
          v-if="namePhoto.length > 0"
          dock="left"
          width="80%"
          columns="auto, auto"
          backgroundColor="#F4F6F8"
          class="picture"
          @tap="showPhoto(namePhoto)"
        >
          <Label
            col="0"
            class="fas"
            fontSize="20"
            :text="'fa-image' | fonticon"
            color="#00acc1"
          />
          <Label
            col="1"
            fontSize="14"
            marginLeft="10"
            :text="namePhoto"
            color="#3c495e"
          />
        </GridLayout>
        <Label
          v-if="errors.photo"
          class="label-error"
          style="width: 80%"
          :text="'*debe tomar la foto, para la evidencia'"
        />
        <Stripe color="#3c495e" mr="40" ml="40" mt="20" mb="20" />
        <Button
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="Agregar"
          @tap="addRepair"
          style="width: 80%"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
        <!-- <Button
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="En Memoria"
          @tap="cleanImage"
          style="width: 80%; margin-bottom: 20px"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        /> -->
      </StackLayout>
    </ScrollView>
  </StackLayout>
</template>

<script>
const {
  getDamage,
  getContainerElements,
  storeRepair,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { requestPermissions } from "@nativescript/camera";
import * as camera from "@nativescript/camera";
import { ImageSource, knownFolders, path, Folder } from "@nativescript/core";
import * as fs from "@nativescript/core/file-system";
import { mapMutations, mapState } from "vuex";

export default {
  props: {
    container_elements: {
      type: Array,
      default: [],
    },
    repairs: {
      type: Array,
      default: [],
    },
    container_report_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      row: 1,
      col: 0,
      model: {
        container_element_id: null,
        location: null,
        position: null,
        damage_id: [],
        photo: "",
      },
      isChecked: false,
      damages: [],
      elements: [],
      locations: [
        { id: 1, location: "Izquierda" },
        { id: 2, location: "Derecha" },
      ],
      positions: [
        { id: 1, position: "Arriba" },
        { id: 2, position: "Abajo" },
      ],
      imagenCapturada: null,
      saveToGallery: false,
      allowsEditing: false,
      keepAspectRatio: true,
      width: 320,
      height: 240,
      cameraImage: "",
      namePhoto: "",

      errors: {
        container_element_id: false,
        location: false,
        position: false,
        photo: false,
        damage_id: false
      },
    };
  },

  mixins: [mixinMasters],

  computed: {},

  methods: {
    /* ****************************************************************** */
    validateField(fields) {
      this.errors.container_element_id = this.model.container_element_id === null ? true : false;
      this.errors.position = this.model.position === null ? true : false;
      this.errors.location = this.model.location === null ? true : false;
      this.errors.photo = this.model.photo === "" ? true : false;
      this.errors.damage_id = this.model.damage_id.length === 0 ? true : false;
      let fullfield = "";
      for (const key in this.errors) {
        if (this.errors.hasOwnProperty(key) && this.errors[key] != false) {
          return !this.errors[key];
        }
        fullfield = !this.errors[key];
      }
      return fullfield;
    },

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

    unCheckAll() {
      const checkbox = this.$refs.checkbok;
      for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].nativeView.checked = false;
      }
    },

    async addRepair() {
      const isValid = this.validateField();
      if (!isValid) {
        // Detener la ejecución si la validación falla
        return;
      }
      try {
        this.loadingCharge(true);
        const res = await storeRepair({
          container_report_id: this.container_report_id,
          repair: this.model,
        });
        Alert.success("Reparacion agrgada");

        this.model = {
          container_element_id: null,
          location: null,
          position: null,
          damage_id: [],
          photo: "",
        };
        this.unCheckAll();
        this.$modal.close();
      } catch (error) {
        Alert.danger("Hubo un error al guardar ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    async InfoSelect() {
      try {
        this.loadingCharge(true);
        const res = await getDamage();
        const containerElements = await getContainerElements();
        this.damages = res.data;
        this.elements = containerElements.data;
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
        this.namePhoto = photo;
        const imageSource = await ImageSource.fromAsset(imageAsset);
        const folderPath = knownFolders.documents().path;
        this.cleanImage(folderPath);
        const filePath = fs.path.join(folderPath, photo);
        const saved = imageSource.saveToFile(filePath, "jpg");
        this.model.photo = filePath;
      } catch (error) {
        console.log("Error -> " + error.message);
      }
    },

    showPhoto(photo) {
      const folderPath = knownFolders.documents().path
      const folder = Folder.fromPath(folderPath);
      const fileList = folder.getEntitiesSync();
      const imageFiles = fileList.filter(
        (file) => file["_name"] === photo
      );
      const path = imageFiles[0]
      this.$showModal({
        template: `
            <Page>
              <StackLayout>
                <Image
                  src="${path['_path']}"
                  stretch="aspectFit"
                  width="700px"
                />
              </StackLayout>
            </Page>
        `,
      },{animated: true,});
    },

    cleanImage(folderPath) {
      // Crear una carpeta si no existe para guardar la imagen
      const folder = Folder.fromPath(folderPath);
      if (!folder) {
        console.error("Error al obtener la carpeta de documentos");
        return;
      }

      // Verificar si el archivo de imagen ya existe
      const fileExists = fs.File.exists(this.model.photo);

      // Obtener la lista de archivos en el directorio
      const fileList = folder.getEntitiesSync();

      // Filtrar solo los archivos de imagen (por ejemplo, con extensión .jpg)
      const imageFiles = fileList.filter(
        (file) => file["_path"] === this.model.photo
      );

      const deleteImages = imageFiles.map((file) => file["_path"]);

      if (fileExists) {
        for (let i = 0; i < deleteImages.length; i++) {
          // Eliminar el archivo existente
          fs.File.fromPath(deleteImages[i]).remove();
        }
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

.picture {
  width: auto;
  text-align: left;
}

.label-error {
  color: #e92222;
  width: 90%;
  text-align: left;
}
</style>
