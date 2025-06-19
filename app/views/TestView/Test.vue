<template>
  <ViewFlipper ref="flipper" v-model="position" :steps="2">
    <FlipperItem ref="item1" v-show="position == 0">
      <ContainerReport />
    </FlipperItem>
    <FlipperItem ref="item2" v-show="position == 1">
      <DamagedItems />
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
      stores: [""],
    };
  },

  methods: {},

  updated() {
    console.log("CAMBIO ", this.position);
  },

  mounted() {
    //console.log(this.$refs.item1.$slots.default[0]);  // Contenido del slot en item1
    //console.log(this.$refs.item2.$slots.default);  // Contenido del slot en item2
  },

  created() {
    //console.log("posicion: ", this.position);
  },
};
</script>
