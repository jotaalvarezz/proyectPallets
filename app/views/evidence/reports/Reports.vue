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
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import { Toasty } from "@triniwiz/nativescript-toasty";

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

    mostrar() {
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

      this.reportModel.repairs = this.damageModel;
      console.log("data completa ", this.reportModel);
    },
  },

  created() {
    //console.log("posicion: ", this.position);
  },
};
</script>
