<template>
    <TabView :selectedIndex="selectedIndex" @selectedIndexChange="indexChange" androidTabsPosition="buttom"
                tabBackgroundColor="#222A37">
        <TabViewItem :title="'fa-list' | fonticon" class="fas" style="font-size: 24;">
            <Ships/>
        </TabViewItem>
        <TabViewItem :title="'fa-list' | fonticon" class="fas" style="font-size: 24;">
            <label text="page 2"></label>
        </TabViewItem>
    </TabView>
</template>

<script>
import Ships from './ships/Ships.vue';
export default {
    components:{
        Ships
    }
}
</script>