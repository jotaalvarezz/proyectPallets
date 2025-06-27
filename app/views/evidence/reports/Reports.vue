<template>
  <ViewFlipper ref="flipper" v-model="position" :steps="2" :operation="mostrar">
    <FlipperItem ref="item1" v-show="position == 0">
      <ContainerReport v-model="reportModel" :validations="errors" />
    </FlipperItem>
    <FlipperItem ref="item2" v-show="position == 1">
      <DamagedItems v-model="damageModel" />
    </FlipperItem>
  </ViewFlipper>
</template>

<script>
const { storeContainerReport, getContainerReport } = require("~/sqlite/database");
const { getManagementAll, getReportsAll } = require("~/sqlite/queries/management")
const { storeContainerReportYard, getRepairs, getRepairDamage } = require("~/sqlite/queries/evidence")
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import { Toasty } from "@triniwiz/nativescript-toasty";
import { mapState } from "vuex";

export default {
  components: {
    ContainerReport,
    DamagedItems,
  },
  data() {
    return {
      position: 0,
      model:{
        type_management_id:null,
        name:"patio",
        journey:"",
        titular_name:"jesus alvarez",
        signature:"",
      },
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
    ...mapState("managementStore", ["StoreTypeManagementId"]),
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

    async mostrar() {
      try {
        console.log("type ",this.StoreTypeManagementId)
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

        this.reportModel.repairs = this.damageModel
        this.model.type_management_id = this.StoreTypeManagementId;
        const modelComple = Object.assign({},this.model,this.reportModel)
        console.log("logger ", modelComple)
        const post = await storeContainerReportYard(modelComple)
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
        console.log("errores ",error)
      }
    },
  },

  created() {
    //console.log("posicion: ", this.position);
  },
};
</script>
