<template>
  <page @loaded="index">
    <Header :search="false" />
    <GridLayout rows="auto, *" backgroundColor="#F4F6F8">
      <Collapse row="0" title="Gestion de Contenedor">
        <!-- Contenido que se insertará dentro del componente -->
        <GridLayout
          rows="auto,auto,auto,auto,auto,auto,auto,auto,auto"
          class="shadow"
          backgroundColor="#F4F6F8"
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
            v-if="management_id === 1"
            row="2"
            label="Buque:"
            placeholder="nombre de barco..."
            fontsize="14"
            v-model="model.name"
          />
          <FormGroupTextField
            v-if="management_id === 2"
            row="2"
            label="Patio:"
            placeholder="nombre del patio..."
            fontsize="14"
            v-model="model.name"
          />
          <FormGroupTextField
            v-if="management_id === 1"
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
          <!-- <GridLayout
            row="4"
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
          </GridLayout> -->
          <!-- <Signature row="4" /> -->
          <Stripe row="5" color="#3c495e" mt="20" mb="20" />
          <!-- Boton para Crear -->
          <Button
            row="6"
            text="Agregar"
            backgroundColor="#F4F6F8"
            color="#222a37"
            style="width: 80%; margin-bottom: 20px"
            @tap="addManagement"
            borderWidth="1"
            borderColor="#222a37"
            borderRadius="30"
          />
          <!-- <Image row="7" ref="imageRef" margin="25" src="" loadMode="sync" /> -->
        </GridLayout>
      </Collapse>
      <Label
        row="1"
        textWrap="true"
        class="info"
        v-if="managments.length == 0"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fas" text.decode="&#x1f6e0; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        row="1"
        ref="listView"
        for="item in managments"
        @itemTap="onItemTap"
      >
        <v-template>
          <!-- Shows the list item label in the default color and style. -->
          <GridLayout columns="*, 40">
            <StackLayout orientation="horizontal" col="0" @tap="navigate(item)">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-file-alt' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth" width="75%">
                <Label
                  text="Gestion de reporte:"
                  class="subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="15"
                />
                <Label textWrap="true">
                  <!-- en barco -->
                  <FormattedString v-if="management_id === 1">
                    <Span text="Barco: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.name + '\n'" fontSize="15" />
                    <Span text="Viaje: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.journey + '\n'" fontSize="15" />
                    <Span text="Nombre del Capitan: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.titular_name + '\n'" fontSize="15" />
                    <Span
                      text="Contenedores: "
                      fontWeight="bold"
                      fontSize="15"
                    />
                  </FormattedString>
                  <!-- en patio -->
                  <FormattedString v-if="management_id === 2">
                    <Span text="Patio: " fontWeight="bold" fontSize="15" />
                    <Span :text="'Alieva' + '\n'" fontSize="15" />
                    <Span text="Nombre del Conductor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.titular_name + '\n'" fontSize="15" />
                    <Span
                      text="Contenedores: "
                      fontWeight="bold"
                      fontSize="15"
                    />
                  </FormattedString>
                </Label>
                <!-- <StackLayout style="padding: 0px 5px 5px 8px">
                  <Label text="Contenedores:" class="subTittle" fontSize="12" /> -->
                <Tag :items="item.container_reports" labelIterator="code" />
                <!-- </StackLayout> -->
              </StackLayout>
            </StackLayout>
            <Label
              :text="'fa-ellipsis-v' | fonticon"
              class="fas iconOptions"
              fontSize="14"
              col="1"
              style="text-align: center"
              @tap="navigateOptions(item, index)"
            />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </page>
</template>

<script>
const {
  getTypesManagement,
  storeManagement,
  getManagements,
  deleteManagement,
} = require("~/sqlite/database");
import Header from "~/components/header/Header.vue";
import Stripe from "~/components/stripe/Stripe";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import Signature from "~/components/signature/Signature.vue";
import Collapse from "~/components/collapse/Collapse";
import NavViews from "~/views/evidence/tabview/NavViews";
import Tag from "~/components/tag/Tag.vue";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import mixinMasters from "~/mixins/Master";
import { ImageSource, Utils } from "@nativescript/core";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Management",
  components: {
    Header,
    Stripe,
    FormGroupTextField,
    Signature,
    Collapse,
    Tag,
    ButtomSheet,
  },

  props: {
    management_id: {
      type: Number,
    },
  },

  data() {
    return {
      message: "No hay registros para mostrar",
      model: {
        type_management_id: null,
        name: "Cala Pino",
        journey: "U.S.A",
        titular_name: "Gerson Calvo",
        signature: "",
      },
      managments: [],
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel"]),
  },

  methods: {
    ...mapMutations("evidenceStore", ["setManagementModel"]),

    index() {
      this.model.type_management_id = this.management_id;
      this.getManagements(this.model.type_management_id);
      /* this.loadingCharge(true);
      setTimeout(() => {
        this.loadingCharge();
      }, 2000); */
    },

    signatureCaptain() {
      this.$showModal(Signature, {
        props: {
          signature: this.model.signature,
        },
        animated: true,
        cancelable: true,
      }).then((res) => {
        this.model.signature = res.signature;
      });
    },

    async getManagements(id) {
      try {
        this.loadingCharge(true);
        const res = await getManagements(id);
        this.managments = res.data;
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
        /* this.loadingCharge(); */
      } finally {
        this.loadingCharge();
      }
    },

    async addManagement() {
      try {
        if (this.model.titular_name.trim() !== "" || this.model.name.trim() !== "") {
          this.loadingCharge(true);
          const res = await storeManagement(this.model);
          this.managments.push(res.data);
        } else {
          Alert.info("¡Por favor firmar!", 1);
        }
        this.model = {
          type_management_id: this.management_id,
          name: "",
          journey: "",
          signature: "",
        };
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    navigate(item) {
      this.setManagementModel(item);
      this.$showModal(NavViews, {
        fullscreen: true,
        animated: true,
      });
    },

    navigateOptions(item, index) {
      item.action = true;
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: true,
          deleteRow: () => this.deleteRow(item.id, index),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {
            console.log(value);
          },
        },
      };
      this.$showBottomSheet(ButtomSheet, options);
    },

    async deleteRow(id, index) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteManagement(id);
          this.managments.splice(index, 1);
        } catch (error) {
          Alert.danger("eleminacion fallida ", error.message);
        }
      }
    },

    desencriptarImagen(base64Encriptado) {
      const imageData = ImageSource.fromBase64Sync(this.model.signature);
      console.log("desencriptando ", imageData);
      let myImg = this.$refs.imageRef.nativeView;
      myImg.src = imageData;
    },
  },
};
</script>
<style>
.colorIcons {
  color: #222a37;
}

.my-card {
  border-width: 2;
  border-color: #000000;
  border-radius: 5;
}

.shadow {
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.19);
}

.info {
  font-size: 16px;
  horizontal-align: center;
  vertical-align: center;
}
</style>
