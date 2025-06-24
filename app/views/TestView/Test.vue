<template>
  <ViewFlipper ref="flipper" v-model="position" :steps="2" :operation="mostrar">
    <FlipperItem ref="item1" v-show="position == 0">
      <ContainerReport v-model="reportModel" />
    </FlipperItem>
    <FlipperItem ref="item2" v-show="position == 1">
      <DamagedItems v-model="damageModel" />
    </FlipperItem>
  </ViewFlipper>
</template>

<script>
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";

export default {
  components: {
    ContainerReport,
    DamagedItems,
  },
  data() {
    return {
      position: 0,
      reportModel: {},
      damageModel: {},
    };
  },

  methods: {
    mostrar() {
      console.log("model ", this.reportModel);
      console.log("model ", this.damageModel);
    },
  },

  created() {
    //console.log("posicion: ", this.position);
  },
};
</script>
