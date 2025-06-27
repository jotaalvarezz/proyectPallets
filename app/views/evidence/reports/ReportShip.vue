<template>
  <ViewFlipper
    ref="flipper"
    v-model="position"
    :steps="2"
    :operation="saveReport"
  >
    <FlipperItem ref="item1" v-show="position == 0">
      <ContainerReport v-model="reportModel" :validations="errors" />
    </FlipperItem>
    <FlipperItem ref="item2" v-show="position == 1">
      <DamagedItems v-model="damageModel" />
    </FlipperItem>
  </ViewFlipper>
</template>

<script>
const {
  storeContainerReport,
  getContainerReport,
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

export default {
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

  computed: {
    ...mapState("managementStore", ["StoreTypeManagementId", "type"]),
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
      console.log("fullfield ", fullfield);
      return fullfield;
    },

    async store() {},

    async saveReport() {
      try {
        console.log("type ", this.StoreTypeManagementId);
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

        this.reportModel.repairs = this.damageModel;
        console.log("logger ", this.type);
        const res = await storeContainerReport(this.reportModel);

        if (res.status === 500) {
          Alert.info(res.message, 1, "Ya existe");
        } else {
          Alert.success("Reporte creado");
        }
        /* console.log("post ",post)
        const res = await getReportsAll()
        console.log("respuesta ", res)
        const res2 = await getManagementAll();
        console.log("respuesta2 ", res2);
        const res3 = await getRepairs();
        console.log("repairs ",res3)
        const res4 = await getRepairDamage();
        console.log("damages ", res4) */
      } catch (error) {
        Alert.danger("Hubo un error al guardar ", error.message);
      }
    },
  },

  created() {
    //console.log("posicion: ", this.position);
  },
};
</script>
