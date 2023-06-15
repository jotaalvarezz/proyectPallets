<template>
  <Page>
    <TabView
      :selectedIndex="selectedIndex"
      @selectedIndexChange="indexChange"
      androidTabsPosition="buttom"
      tabBackgroundColor="#222A37"
    >
      <TabViewItem
        :title="'fa-list' | fonticon"
        class="fas"
        style="font-size: 24"
      >
         <Ships/>
        <!-- <Button text="Button" backgroundColor="#366233" @tap="onButtonTap" /> -->
      </TabViewItem>
      <TabViewItem
        :title="'fa-list' | fonticon"
        class="fas"
        style="font-size: 24"
      >
        <label text="page 2"></label>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script>
import Ships from "./ships/Ships.vue";
export default {
  components: {
    Ships,
  },
  methods: {
    onButtonTap() {
      this.$navigateTo(Ships);
    },
  },
};
</script>