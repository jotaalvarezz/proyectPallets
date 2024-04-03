<template>
  <StackLayout @loaded="index">
    <Label
      v-if="label.length > 0"
      text="Firma: "
      fontWeight="bold"
      fontSize="15"
    />
    <Image
      v-if="url.length > 0"
      ref="imageRef"
      margin="5"
      stretch="aspectFill"
      backgroundColor="#D8E2E8"
      src=""
      loadMode="sync"
    />
    <Label
      v-if="url.length === 0"
      text="No hay imagen para mostrar..."
      fontSize="13"
      style="margin-left: 15px"
    />
  </StackLayout>
</template>

<script>
import { ImageSource, Utils } from "@nativescript/core";

export default {
  name: "ViewImage",
  props: {
    url: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    encrypted: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    image() {
      if (this.encrypted && this.url.length > 0) {
        return this.desencriptarImagen(this.url);
      }

      return this.url;
    },
  },

  methods: {
    index() {
      console.log("signature ", this.url);
      if (this.encrypted && this.url.length > 0) {
        this.desencriptarImagen(this.url);
      } else if (!this.encrypted && this.url.length > 0) {
        let myImg = this.$refs.imageRef.nativeView;
        myImg.src = this.url;
      }
    },

    async desencriptarImagen(base64Encriptado) {
      const imageData = ImageSource.fromBase64Sync(base64Encriptado);
      console.log("desencriptando en componente ", imageData);
      let myImg = await this.$refs.imageRef.nativeView;
      myImg.src = imageData;
    },
  },
};
</script>
