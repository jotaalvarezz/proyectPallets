<template>
  <Page>
    <Header/>
    <TabView :selectedIndex="selectedIndex" @selectedIndexChange="indexChange" androidTabsPosition="buttom"
      tabBackgroundColor="#222A37">
      <TabViewItem :title="'fa-list' | fonticon" class="fas" style="font-size: 24">
        <!-- <Frame> -->
          <Ships/>
        <!-- </Frame> -->
      </TabViewItem>
      <TabViewItem :title="'fa-list' | fonticon" class="fas" style="font-size: 24">
        <Frame>
          <PalletsWarehouse/>
        </Frame>
        <!-- <label text="laksjdlajds"/> -->
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import Ships from "./ships/Ships.vue";
import Header from "~/components/header/Header.vue";
import PalletsWarehouse from "./palletsWarehouse/PalletsWarehouse.vue";

export default {
  components: {
    Ships,
    Header,
    PalletsWarehouse
},
  data() {
    return {

    }
  },
  methods: {
    onButtonTap() {
      this.$navigateTo(Ships);
    },

    /* evento(){
      const rootView = getRootView();
      console.log("=> ",rootView.mainContent)
    } */
  },
};
</script>
