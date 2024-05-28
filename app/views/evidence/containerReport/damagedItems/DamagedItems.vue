<template>
  <StackLayout @loaded="InfoSelect" backgroundColor="#F4F6F8">
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
        text="Registro de Daños/Reparaciones"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout>
    <ScrollView>
      <StackLayout
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="20"
        borderWidth="1"
        borderColor="#c0c9d7"
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
        <SelectField
          :value="model.location"
          :items="locations"
          label="UBICACION:"
          labelIterator="location"
          fontsize="14"
          icon="fa-arrows-alt-h"
          @value="model.location = $event"
        />
        <SelectField
          :value="model.position"
          :items="positions"
          label="POSICION:"
          labelIterator="position"
          fontsize="14"
          icon="fa-arrows-alt-v"
          @value="model.position = $event"
        />
        <Label
          text="DAÑO:"
          marginTop="10"
          fontsize="14"
          fontWeight="bold"
          style="color: #3c495e; width: 90%"
        />
        <FlexboxLayout flexWrap="wrap" style="width: 90%">
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
        <FloatingButton
          style="margin: 60px"
          :icon="'fa-camera'"
          alignX="center"
          iconSize="md"
          :method="onTakePictureTap"
        />
        <DockLayout
          v-if="namePhoto.length > 0"
          stretchLastChild="true"
          backgroundColor="#F4F6F8"
        >
          <GridLayout
            dock="left"
            width="50%"
            marginLeft="20"
            columns="auto, auto"
            backgroundColor="#F4F6F8"
            class="picture"
            @tap="showPhoto"
          >
            <Label
              col="0"
              class="fas"
              fontSize="20"
              :text="'fa-image' | fonticon"
            />
            <Label col="1" fontSize="14" :text="namePhoto" color="#3c495e" />
          </GridLayout>
          <Label dock="bottom" height="auto" />
        </DockLayout>
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
    };
  },

  mixins: [mixinMasters],

  computed: {},

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

    unCheckAll() {
      const checkbox = this.$refs.checkbok;
      for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].nativeView.checked = false;
      }
    },

    async addRepair() {
      try {
        if (
          this.model.container_element_id !== null ||
          this.model.location !== null ||
          this.model.position !== null
        ) {
          const res = await storeRepair({
            container_report_id: this.container_report_id,
            repair: this.model,
          });
          Alert.success("Reparacion agrgada");
        }

        this.model = {
          container_element_id: null,
          location: null,
          position: null,
          damage_id: [],
          photo: "",
        };
        this.unCheckAll();
        this.$modal.close();
      } catch (error) {}
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

    showPhoto() {},

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
</style>
