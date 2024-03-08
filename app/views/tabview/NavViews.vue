<template>
  <page>
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
          <Evidence v-if="selectedIndex === 0"/>
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <EvidenceList/>
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <Label text="Search Page" class="h2 text-center"></Label>
        </GridLayout>
      </MDTabContentItem>
    </MDTabs>
  </page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import Evidence from "~/views/evidence/Evidence";
import EvidenceList from "~/views/evidence/EvidenceList.vue";

export default {
  components: {
    Header,
    Evidence,
    EvidenceList,
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
