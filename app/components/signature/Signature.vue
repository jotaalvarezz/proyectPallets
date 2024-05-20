<template>
  <StackLayout backgroundColor="#F4F6F8">
    <GridLayout
      height="55"
      rows="*"
      columns="50, 3*, 50"
      backgroundColor="#00acc1"
    >
      <Label
        row="0"
        col="2"
        :text="'fa-times' | fonticon"
        fontSize="16"
        class="fas text-center"
        color="#F4F6F8"
        @tap="$modal.close"
      />
      <Label
        row="0"
        col="1"
        class="text-center"
        text="Firmar"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout>
    <StackLayout margin="10" backgroundColor="#F4F6F8">
      <Label
        text="Firma :"
        fontSize="14"
        fontWeight="bold"
        style="color: #3c495e; width: 90%"
      />
      <DrawingPad
        ref="drawingPad"
        height="200"
        width="90%"
        penWidth="3"
        borderWidth="1"
        borderRadius="5"
        borderColor="#3c495e"
      >
      </DrawingPad>
      <Stripe color="#3c495e" mt="10" mb="10" />
      <Button
        text="Guardar"
        backgroundColor="#F4F6F8"
        color="#222a37"
        style="width: 90%; margin-bottom: 5px"
        @tap="getMyDrawing"
        borderWidth="1"
        borderColor="#222a37"
        borderRadius="30"
      />
      <Button
        text="Limpiar"
        backgroundColor="#F4F6F8"
        color="#222a37"
        style="width: 90%"
        @tap="clean"
        borderWidth="1"
        borderColor="#222a37"
        borderRadius="30"
      />
    </StackLayout>
  </StackLayout>
</template>

<script>
import { ImageSource, knownFolders, path, Folder } from "@nativescript/core";
import * as fs from "@nativescript/core/file-system";
import Stripe from "~/components/stripe/Stripe";

export default {
  name: "Signature",
  components: {
    Stripe,
  },

  props: {
    signature: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      isDrawing: false,
      previousPoint: null,
      points: [],
      currentPoint: [],
    };
  },
  methods: {
    clean() {
      this.$refs.drawingPad.nativeView.clearDrawing();
    },

    async getMyDrawing(args) {
      // get reference to the drawing pad
      try {
        const pad = this.$refs.drawingPad.nativeView;
        const res = await pad.getDrawing();
        const img = new ImageSource(res);
        /* const base64imageString = img.toBase64String("jpg"); */
        // Obtener la ruta del directorio de documentos de la aplicación
        const folderPath = knownFolders.documents().path;

        const validatorSignature = this.validatorSignature(folderPath);

        /* // Mostrar por consola los nombres de las imágenes encontradas
        console.log(
          "Imágenes en la carpeta:",
          validatorSignature.imageFiles.map((file) => file["_path"])
        ); */
        const deleteImages = validatorSignature.imageFiles.map(
          (file) => file["_path"]
        );

        // Guardar la imagen en el dispositivo
        const saved = img.saveToFile(validatorSignature.filePath, "jpg");

        /* if (saved) {
          console.log("Imagen de firma guardada correctamente en:", validatorSignature.filePath);
          // Aquí puedes hacer algo con la ruta del archivo guardado, como mostrarla en la interfaz
        } else {
          console.error("Error al guardar la imagen de firma");
        } */
        this.$modal.close({
          signature: validatorSignature.filePath,
          deleteImages: deleteImages,
          fileExists: validatorSignature.fileExists,

        });
      } catch (error) {
        this.$modal.close({
          signature: "",
        });
        console.log("err ", error);
      }
    },

    validatorSignature(folderPath) {
      // Crear una carpeta si no existe para guardar la imagen
      const folder = Folder.fromPath(folderPath);
      /* console.log("folder path ",folderPath) */
      if (!folder) {
        console.error("Error al obtener la carpeta de documentos");
        return;
      }

      const fileName = "firma_usuario" + "_" + Date.now() + ".jpg";
      /* console.log("folder fileName ",fileName) */
      let filePath = fs.path.join(folderPath, fileName);
      /* console.log("folder filePath ",filePath) */
      let signature = "";
      let signatureName = ""
      let oldfilePath = ""
      if (this.signature.length > 0) {
        /* console.log("siganture lleno ",this.signature) */
        signature = this.signature.split("/");
        signatureName = signature[signature.length - 1];
        oldfilePath = fs.path.join(folderPath, signatureName);
      } else {
        /* console.log("siganture vacio ",this.signature) */
        signature = this.signature;
      }

      // Verificar si el archivo de imagen ya existe
      const fileExists = fs.File.exists(oldfilePath);

      // Obtener la lista de archivos en el directorio
      const fileList = folder.getEntitiesSync();
      console.log("fileList ", fileList);
      // Filtrar solo los archivos de imagen (por ejemplo, con extensión .jpg)
      const imageFiles = fileList.filter(
        (file) => file["_name"] === signatureName
      );

      /* const imageFiles = fileList.filter(
        (file) => file["_extension"] === ".jpg"
      ); */

      return {
        imageFiles,
        fileExists,
        filePath
      };
    },
  },
};
</script>
