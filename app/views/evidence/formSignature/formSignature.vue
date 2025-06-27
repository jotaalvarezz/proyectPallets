<template>
  <StackLayout backgroundColor="#F4F6F8">
    <!-- GridLayout
      ref="form"
      class="form-container"
      rows="*"
      backgroundColor="#F4F6F8"
      margin="10"
      borderRadius="5"
    > -->
      <ScrollView>
        <GridLayout
          rows="auto, auto, auto, auto, auto, auto, auto"
          padding="20"
        >
          <!-- Card de Firma - Versión Mejorada -->
          <GridLayout
            row="5"
            rows="auto, auto"
            columns="*"
            marginTop="20"
            marginBottom="20"
            borderRadius="10"
            backgroundColor="white"
            class="signature-card elevation"
          >
            <StackLayout
              row="0"
              orientation="horizontal"
              padding="15"
              backgroundColor="#00acc1"
              borderTopLeftRadius="10"
              borderTopRightRadius="10"
            >
              <Label
                text="FIRMA DE AUTORIZACIÓN"
                color="white"
                fontSize="16"
                fontWeight="bold"
                horizontalAlignment="center"
                width="100%"
              />
            </StackLayout>

            <!-- Contenido de la tarjeta -->
            <StackLayout
              row="1"
              padding="25"
              @tap="signatureCaptain"
              class="signature-content"
            >
              <GridLayout
                v-if="!model.signature"
                rows="*"
                columns="*"
                height="150"
                verticalAlignment="center"
                horizontalAlignment="center"
              >
                <Label
                  text="Toque aquí para firmar"
                  fontSize="14"
                  color="#666"
                  textAlignment="center"
                  marginBottom="10"
                />
                <Label
                  :text="'fa-signature' | fonticon"
                  class="fas"
                  fontSize="50"
                  color="#00acc1"
                  opacity="0.6"
                  textAlignment="center"
                />
              </GridLayout>

              <Image
                v-else
                :src="model.signature"
                stretch="aspectFit"
                height="150"
                borderRadius="5"
                class="signature-image"
                backgroundColor="#f8f9fa"
              />
            </StackLayout>
          </GridLayout>
        </GridLayout>
      </ScrollView>
  <!--   </GridLayout> -->
  </StackLayout>
</template>

<script>
const { updateManagement } = require("~/sqlite/database");
import Signature from "~/components/signature/Signature.vue";
import mixinMasters from "~/mixins/Master";
import * as fs from "@nativescript/core/file-system";
import Alert from "~/alerts/Alerts";

export default {
  components: {
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
        name: "",
        journey: "",
        titular_name: "",
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
            fs.File.fromPath(this.propsSignature.deleteImages[i]).remove();
          }
        }
        this.$modal.close({
          model: res.data,
        });
      } catch (error) {
        Alert.danger("Hubo un error al actualizar", error.message);
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
        cancelable: true,
      }).then((res) => {
        if (res) {
          this.propsSignature = res;
          this.model.signature = res.signature;
        }
      });
    },
  },
};
</script>

<style scoped>
.form-container {
  border-width: 1;
  border-color: #c0c9d7;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}

.signature-card {
  border-width: 1;
  border-color: #e0e0e0;
}

.signature-content {
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
}

.signature-image {
  border-width: 1;
  border-color: #e0e0e0;
  border-style: dashed;
}

.btn-primary {
  background-color: #00acc1;
  color: white;
  border-radius: 25;
  padding: 15;
  font-size: 16;
  font-weight: bold;
}

.elevation {
  elevation: 4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.fas {
  font-family: "Font Awesome 5 Free", "fa-solid-900";
  font-weight: 900;
}
</style>
