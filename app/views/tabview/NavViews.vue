<template>
  <page>
    <Header :data="info" :icons="icons" :search="false" />
    <TabView
      :selectedIndex="selectedIndex"
      androidTabsPosition="buttom"
      tabBackgroundColor="#F4F6F8"
      @selectedIndexChange="onSelectedIndexChanged"
    >
      <TabViewItem :title="'fa-file-invoice' | fonticon" class="fas">
        <!-- :title="'fa-file-invoice' | fonticon" class="fas" -->
        <Evidence v-show="selectedIndex === 0" />
      </TabViewItem>
      <TabViewItem :title="'fa-mosque' | fonticon" class="fas">
        <Label text="Tab 2" v-show="selectedIndex === 1" />
      </TabViewItem>
      <TabViewItem :title="'fa-layer-group' | fonticon" class="fas">
        <Label text="Tab 3" v-show="selectedIndex === 2" />
      </TabViewItem>
    </TabView>
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
      selectedIndex: null,
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

<style scoped>

</style>
