<template>
  <StackLayout backgroundColor="#F4F6F8">
    <HeaderComponent title="Actualizar Gestion" :handleback="$modal.close"/>
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
        rows="auto"
        columns="auto"
        style="margin-top: 20px; width: 85%;"
      >
        <StackLayout
          row="0"
          marginLeft="5"
          padding="10"
          orientation="horizontal"
          borderWidth="1"
          backgroundColor="#F4F6F8"
          borderColor="#222a37"
          borderRadius="30"
          @tap="signatureCaptain"
        >
          <Label
            col="0"
            :text="'fa-signature' | fonticon"
            class="fas colorIcons"
            fontSize="22"
            marginRight="2"
          />
          <Label
            col="1"
            textWrap="true"
            text="Firmar"
            fontSize="14"
            class="colorIcons"
          />
        </StackLayout>
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
        if (this.propsSignature.fileExists) {
          for (let i = 0; i < this.propsSignature.deleteImages.length; i++) {
            // Eliminar el archivo existente
            fs.File.fromPath(this.propsSignature.deleteImages[i]).remove();
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
        animated: true,
        props: {
          id: this.model.id,
          signature: this.model.signature,
        },
        animated: true,
        cancelable: true,
      }).then((res) => {
        this.propsSignature = res;
        this.model.signature = res.signature;
        let myImg = this.$refs.imageRef.nativeView;
        myImg.src = this.model.signature;
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
