<template>
  <ViewFlipper
    title="Reporte de Contenedor en Patio"
    ref="flipper"
    v-model="position"
    :steps="3"
    :operation="containerReportEdit == false ? saveReport : updateReport"
  >
    <FlipperItem ref="item1" v-show="position == 0">
      <ContainerReport
        ref="containerReport"
        v-model="reportModel"
        :validations="errors"
      />
    </FlipperItem>
    <FlipperItem ref="item2" v-show="position == 1">
      <DamagedItems ref="damagedItems" v-model="damageModel" />
    </FlipperItem>
    <FlipperItem ref="item3" v-show="position == 2">
      <formSignature ref="signature" v-model="signature" />
    </FlipperItem>
  </ViewFlipper>
</template>

<script>
const {
  updateContainerReport
} = require("~/sqlite/database");
const {
  getManagementAll,
  getReportsAll,
} = require("~/sqlite/queries/management");
const {
  storeContainerReportYard,
  updateContainerReportYard
} = require("~/sqlite/queries/evidence");
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import formSignature from "~/views/evidence/formSignature/formSignature.vue";
import { Toasty } from "@triniwiz/nativescript-toasty";
import { mapState } from "vuex";
import Alert from "~/alerts/Alerts";
import mixinMasters from "~/mixins/Master";

export default {
  name: "reportYard",
  components: {
    ContainerReport,
    DamagedItems,
    formSignature,
  },
  data() {
    return {
      position: 0,
      signature: "",
      model: {
        type_management_id: null,
        name: "patio",
        journey: "",
        titular_name: "",
        signature: "",
      },
      reportModel: {},
      damageModel: [],

      errors: {
        prefix: false,
        code: false,
        role: false,
        titular_name: false,
        type_id: false,
      },
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", [
      "managementModel",
      "containerReport",
      "containerReportEdit",
    ]),
    ...mapState("managementStore", ["StoreTypeManagementId", "type"]),
    msgTask() {
      const msg =
        "Contenedor: " +
        (this.reportModel.prefixCode + this.reportModel.code) +
        "\nTipo: " +
        this.reportModel.typeName +
        "\nTecnico: " +
        this.reportModel.role +
        "\nObservacion: " +
        this.reportModel.observation;
      return msg;
    },
  },

  methods: {
    validateField() {
      this.errors.prefix = this.reportModel.prefix === null ? true : false;
      this.errors.code = !this.reportModel.code.trim();
      this.errors.role = !this.reportModel.role.trim();
      this.errors.titular_name = !this.reportModel.titular_name.trim();
      this.errors.type_id = this.reportModel.type_id === null ? true : false;
      let fullfield = "";
      for (const key in this.errors) {
        if (this.errors.hasOwnProperty(key) && this.errors[key] != false) {
          return !this.errors[key];
        }
        fullfield = !this.errors[key];
      }
      return fullfield;
    },

    async store() {},

    async saveReport() {
      try {
        const isValid = this.validateField();
        if (!isValid) {
          this.$refs.flipper.pageFlipper(0);
          // Detener la ejecución si la validación falla
          return;
        }

        if (this.damageModel.length === 0) {
          this.$refs.flipper.pageFlipper(1);
          new Toasty({ text: "No hay reparaciones agregadas" }).show();
          return;
        }

        if (!this.signature || this.signature === null) {
          this.$refs.flipper.pageFlipper(2);
          new Toasty({ text: "Firma vacia" }).show();
          return;
        }

        let confirmated = await Alert.info(this.msgTask, 3, "Guardar reporte");

        if (confirmated) {
          this.model.signature = this.signature;
          this.reportModel.repairs = this.damageModel;
          this.model.type_management_id = this.StoreTypeManagementId;
          const modelComple = Object.assign({}, this.model, this.reportModel);
          this.loadingCharge(true);
          const res = await storeContainerReportYard(modelComple);
          this.loadingCharge();
          if (res.status === 500) {
            Alert.info(res.message, 1, "Ya existe");
            return;
          }

          this.$refs.containerReport.clean();
          this.$refs.damagedItems.clean();
          this.$refs.signature.clean();

          let continueModule = await Alert.info(
            "¿Desea seguir creando reportes?",
            3,
            "Reporte creado"
          );
          if (continueModule) {
            this.$refs.flipper.pageFlipper(0);
          } else {
            this.$router.back();
          }
        }
      } catch (error) {
        Alert.danger("Hubo un error al guardar ", error.message);
      }
    },

    async updateReport() {
      try {
        this.reportModel.repairs = this.damageModel;
        const isValid = this.validateField();
        if (!isValid) {
          // Detener la ejecución si la validación falla
          return;
        }

        if (this.damageModel.length === 0) {
          this.$refs.flipper.pageFlipper(1);
          new Toasty({ text: "No hay reparaciones agregadas" }).show();
          return;
        }

        if (!this.signature || this.signature === null) {
          this.$refs.flipper.pageFlipper(2);
          new Toasty({ text: "Firma vacia" }).show();
          return;
        }

        let confirmated = await Alert.info(
          this.msgTask,
          3,
          "Actualizar reporte"
        );

        if (confirmated) {
          this.model.signature = this.signature;
          this.reportModel.repairs = this.damageModel;
          this.model.type_management_id = this.StoreTypeManagementId;
          const modelComple = Object.assign({}, this.model, this.reportModel);
          this.loadingCharge(true);
          const res = await updateContainerReportYard(modelComple);
          this.loadingCharge();

          this.$refs.containerReport.clean();
          this.$refs.damagedItems.clean();

          let continueModule = await Alert.info(
            "Se actualizo el reporte de forma exitosa.",
            3,
            "Reporte actualizado"
          );
          if (continueModule) {
            this.$router.back();
          } else {
            this.$router.back();
          }
        }
      } catch (error) {
        Alert.danger(
          "Hubo un error al intentar actualizar el registro ",
          error.message
        );
      }
    },
  },

  created() {},
};
</script>
