<template>
  <!-- <StackLayout @loaded="index"> -->
  <page @loaded="index">
    <Header :search="false" />
    <!-- <GridLayout
      height="65"
      rows="*"
      columns="50, 3*, 50"
      backgroundColor="#00acc1"
    >
      <Label
        row="0"
        col="0"
        :text="'fa-arrow-left' | fonticon"
        fontSize="16"
        class="fas text-center"
        color="#F4F6F8"
        @tap="$modal.close"
      />
      <Label
        row="0"
        col="1"
        class="text-center"
        text="Registro de Reportes"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout> -->
    <TabView
      :selectedIndex="selectedIndex"
      androidTabsPosition="bottom"
      @selectedIndexChange="onSelectedIndexChanged"
    >
      <TabViewItem
        title="Gestionar"
        iconSource="~/assets/images/instrucciones.png"
        style="text-transform: capitalize"
        fontSize="11"
      >
        <ContainerReport />
      </TabViewItem>
      <TabViewItem
        title="Ver"
        iconSource="~/assets/images/contenedores.png"
        style="text-transform: capitalize"
        fontSize="11"
      >
        <ContainerReportList />
      </TabViewItem>
      <TabViewItem
        title="Instrucciones"
        iconSource="~/assets/images/evidenceForm.png"
        style="text-transform: capitalize"
        fontSize="11"
      >
        <Label text="Content for Tab 3" />
      </TabViewItem>
    </TabView>
  </page>
</template>

<script>
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import ContainerReportList from "~/views/evidence/containerReport/ContainerReportList.vue";
import mixinMasters from "~/mixins/Master";

export default {
  name: "reportsnav",
  components: {
    ContainerReport,
    ContainerReportList,
  },
  data() {
    return {
      selectedIndex: 0,
      bandera: 0,
    };
  },

  mixins: [mixinMasters],

  methods: {
    index() {
      console.log("routssee ", this.$router);
      /* this.loadingCharge(true);
      this.loadingCharge();
      setTimeout(() => {
      }, 2000); */
    },

    unload(arg) {
      console.log("descargado ", arg);
    },

    onSelectedIndexChanged(arg) {
      const index = arg.object;
      this.selectedIndex = index.selectedIndex;
    },
  },
};
</script>

<style scoped></style>
