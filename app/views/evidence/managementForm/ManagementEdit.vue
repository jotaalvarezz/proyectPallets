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
        col="0"
        :text="'fa-arrow-left' | fonticon"
        fontSize="16"
        class="fas text-center"
        color="#F4F6F8"
        @tap="$modal.close"
      />
      <Label
        row="0"
        col="1"
        class="text-center"
        text="Actualizar Gestion"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout>
    <GridLayout
      @loaded="index"
      rows="auto,auto,auto,auto,auto,auto,auto,auto,auto"
      class="shadow"
      backgroundColor="#F4F6F8"
      margin="10"
      borderWidth="1"
      borderColor="#c0c9d7"
      borderRadius="5"
      padding="20"
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
        v-if="info.type_management_id === 1"
        row="2"
        label="Buque:"
        placeholder="nombre de barco..."
        fontsize="14"
        v-model="model.name"
      />
      <FormGroupTextField
        v-if="info.type_management_id === 2"
        row="2"
        label="Patio:"
        placeholder="nombre del patio..."
        fontsize="14"
        v-model="model.name"
      />
      <FormGroupTextField
        v-if="info.type_management_id === 1"
        row="3"
        label="Viaje:"
        placeholder="viaje..."
        fontsize="14"
        v-model="model.journey"
      />
      <FormGroupTextField
        row="4"
        label="Titular:"
        placeholder="nombre de titular..."
        fontsize="14"
        v-model="model.titular_name"
      />
      <GridLayout
        row="5"
        columns="35,auto"
        style="width: 80%; margin-top: 15px"
      >
        <Label
          col="0"
          :text="'fa-signature' | fonticon"
          class="fas colorIcons"
          fontSize="22"
        />
        <Label
          col="1"
          textWrap="true"
          text="Firmar"
          fontSize="14"
          class="colorIcons"
          @tap="signatureCaptain"
        />
      </GridLayout>
      <!-- <Signature row="5" /> -->
      <Stripe row="6" color="#3c495e" mt="20" mb="20" />
      <!-- Boton para Crear -->
      <Button
        row="7"
        text="Actualizar"
        backgroundColor="#F4F6F8"
        color="#222a37"
        style="width: 80%; margin-bottom: 20px"
        @tap="editManagement"
        borderWidth="1"
        borderColor="#222a37"
        borderRadius="30"
      />
      <Image row="8" ref="imageRef" margin="25" src="" loadMode="sync" />
    </GridLayout>
  </StackLayout>
</template>

<script>
const { updateManagement } = require("~/sqlite/database");
import Signature from "~/components/signature/Signature.vue";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import Stripe from "~/components/stripe/Stripe";
import mixinMasters from "~/mixins/Master";
import { ImageSource, Utils } from "@nativescript/core";
import * as fs from "@nativescript/core/file-system";
import Alert from "~/alerts/Alerts";

export default {
  components: {
    Stripe,
    FormGroupTextField,
    Signature,
  },

  props: {
    info: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      model: {
        type_management_id: null,
        name: "Cala Pino",
        journey: "U.S.A",
        titular_name: "Gerson Calvo",
        signature: "",
      },
      propsSignature: {},
    };
  },

  mixins: [mixinMasters],

  methods: {
    index() {
      console.log("info ", this.info);
      this.model = {
        id: this.info.id,
        type_management_id: this.info.type_management_id,
        name: this.info.name,
        journey: this.info.journey,
        titular_name: this.info.titular_name,
        signature: this.info.signature,
      };
    },

    async editManagement() {
      try {
        this.loadingCharge(true);
        const res = await updateManagement(this.model);
        /* console.log("res edit ", res);
        console.log("propsSignature ", this.propsSignature.fileExists); */
        if (this.propsSignature.fileExists) {
          for (let i = 0; i < this.propsSignature.deleteImages.length; i++) {
            // Eliminar el archivo existente
            fs.File.fromPath(this.propsSignature.deleteImages[i]).remove();
            console.log(
              "Imagen anterior eliminada:",
              this.propsSignature.deleteImages[i]
            );
          }
        }
        this.$modal.close({
          model: res.data,
        });
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    signatureCaptain() {
      this.$showModal(Signature, {
        props: {
          id: this.model.id,
          signature: this.model.signature,
        },
        animated: true,
        cancelable: true,
      }).then((res) => {
        this.propsSignature = res;
        /* console.log("props ", this.propsSignature); */
        this.model.signature = res.signature;
        /* console.log("signature edit ", this.model.signature); */
        /* const imageData = ImageSource.fromBase64Sync(this.model.signature); */
        let myImg = this.$refs.imageRef.nativeView;
        myImg.src = this.model.signature;
        /* console.log("final"); */
      });
    },
  },
};
</script>

<style scoped>
.shadow {
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.19);
}
</style>
