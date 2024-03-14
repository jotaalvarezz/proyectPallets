<template>
  <Page>
    <Header :search="false" />
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
          <ContainerReport v-if="selectedIndex === 0"/>
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <ContainerReportList/>
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <Label text="Search Page" class="h2 text-center"></Label>
        </GridLayout>
      </MDTabContentItem>
    </MDTabs>
  </Page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import ContainerReportList from "~/views/evidence/containerReport/ContainerReportList.vue";

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
      bandera: 0
    };
  },
  methods: {
    onSelectedIndexChanged(arg) {
      const index = arg.object;
      this.selectedIndex = index.selectedIndex;
    },
  },
};
</script>

<style scoped></style>
