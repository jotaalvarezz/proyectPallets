<template>
  <page>
    <Header :data="info" :icons="icons" :search="false" />
    <MDTabs :selectedIndex="selectedIndex" tabsPosition="bottom">
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

        <GridLayout rows="*" style="background-color: red">
          <Evidence />
        </GridLayout>
      </MDTabContentItem>
      <MDTabContentItem>
        <GridLayout>
          <Label text="Account Page" class="h2 text-center"></Label>
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

export default {
  components: {
    Header,
    Evidence,
  },
  data() {
    return {
      selectedIndex: 1,
      bandera: 0,
    };
  },
  methods: {
    onSelectedIndexChanged(args) {
      const index = args.value;
      this.selectedIndex = index;
    },
  },
};
</script>

<style scoped></style>
