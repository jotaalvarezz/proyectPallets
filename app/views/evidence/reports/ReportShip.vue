<template>
  <ViewFlipper
    ref="flipper"
    v-model="position"
    :steps="2"
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
  </ViewFlipper>
</template>

<script>
const {
  storeContainerReport,
  updateContainerReport,
  getContainerReport,
  updateRepaairs,
} = require("~/sqlite/database");
const {
  getManagementAll,
  getReportsAll,
} = require("~/sqlite/queries/management");
const {
  storeContainerReportYard,
  getRepairs,
  getRepairDamage,
} = require("~/sqlite/queries/evidence");
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import { Toasty } from "@triniwiz/nativescript-toasty";
import { mapState } from "vuex";
import Alert from "~/alerts/Alerts";
import mixinMasters from "~/mixins/Master";

export default {
  name: "reportShip",
  components: {
    ContainerReport,
    DamagedItems,
  },
  data() {
    return {
      position: 0,
      reportModel: {},
      damageModel: [],

      errors: {
        prefix: false,
        code: false,
        role: false,
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
    validateField(fields) {
      this.errors.prefix = this.reportModel.prefix === null ? true : false;
      this.errors.code = !this.reportModel.code.trim();
      this.errors.role = !this.reportModel.role.trim();
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

        let confirmated = await Alert.info(this.msgTask, 3, "Guardar reporte");

        if (confirmated) {
          this.reportModel.repairs = this.damageModel;
          const model = this.reportModel;
          this.loadingCharge(true);
          const res = await storeContainerReport(model);
          this.loadingCharge();
          if (res.status === 500) {
            Alert.info(res.message, 1, "Ya existe");
            return;
          }

          this.$refs.containerReport.clean();
          this.$refs.damagedItems.clean();

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

        let confirmated = await Alert.info(
          this.msgTask,
          3,
          "Actualizar reporte"
        );

        if (confirmated) {
          this.reportModel.repairs = this.damageModel;
          const model = this.reportModel;
          this.loadingCharge(true);
          const res = await updateContainerReport(model);
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

  created() {

  },
};
</script>
