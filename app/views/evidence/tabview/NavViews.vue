<template>
  <StackLayout @loaded="index">
    <!-- <Header :search="false" /> -->
    <GridLayout
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
    </GridLayout>
    <MDTabs
      :selectedIndex="selectedIndex"
      tabsPosition="bottom"
      @selectedIndexChanged="onSelectedIndexChanged"
    >
      <!-- The bottom tab UI is created via TabStrip (the containier) and TabStripItem (for each tab)-->
      <MDTabStrip>
        <MDTabStripItem>
          <Label text="Home"></Label>
          <Image src="~/assets/images/evidenceForm.png" class="fas"></Image>
        </MDTabStripItem>
        <MDTabStripItem class="special">
          <Label text="Account"></Label>
          <Image src="~/assets/images/contenedores.png" class="fas"></Image>
        </MDTabStripItem>
        <MDTabStripItem class="special">
          <Label text="Search"></Label>
          <Image src="~/assets/images/instrucciones.png" class="fas"></Image>
        </MDTabStripItem>
      </MDTabStrip>

      <!-- The number of TabContentItem components should corespond to the number of TabStripItem components -->
      <MDTabContentItem>
        <GridLayout>
          <ContainerReport v-if="selectedIndex === 0" />
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <ContainerReportList />
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <Label text="Search Page" class="h2 text-center"></Label>
        </GridLayout>
      </MDTabContentItem>
    </MDTabs>
  </StackLayout>
</template>

<script>
import Header from "~/components/header/Header.vue";
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import ContainerReportList from "~/views/evidence/containerReport/ContainerReportList.vue";
import mixinMasters from "~/mixins/Master";

export default {
  name: "Reports",
  components: {
    Header,
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
      /* this.loadingCharge(true);
      this.loadingCharge();
      setTimeout(() => {
      }, 2000); */
    },

    onSelectedIndexChanged(arg) {
      const index = arg.object;
      this.selectedIndex = index.selectedIndex;
    },
  },
};
</script>

<style scoped></style>
