<template>
    <ActionBar backgroundColor="#222A37">
        <!-- <NavigationButton /> -->
        <GridLayout columns="50, *">
            <Label text="WSP" class="action-bar-title cardtitle" fontSize="18" colSpan="2" />
            <Label class="fas" text.decode="&#xf0c9;" color="white" @tap="openDrawer" fontSize="25"/>
        </GridLayout>
        <!-- <ActionItem android.systemIcon="ic_menu_camera" ios.position="left" text="scan code" @tap="readCode" /> -->
        <ActionItem android.systemIcon="ic_menu_search" ios.position="right" text="delete" @tap="modalSearch" />
    </ActionBar>
</template>

<script>
import * as util from "~/shared/util"
import searchView from "../search/searchView.vue";

export default {
    /* props:{
        open:{
            type:Function,
            required:true
        }
    }, */
    computed: {

    },
    methods: {
        modalSearch() {
            cosnole.log('searh')
            //this.$showModal(searchView, { fullscreen: true, props: { animes: this.animes_store } });
        },

        openDrawer(){
            util.showDrawer();
        },

        modalSearch(){
            this.$showModal(searchView,{fullscreen:true})
        }
        /*  async getAnimes() {
             try {
                 const animes = await axios.get('https://api.jikan.moe/v4/anime');
                 console.log(animes)
                 this.animes = animes.data.data
                 this.save_anime(this.animes)
                 this.popularities(this.animes)
             } catch (error) {
                 console.log(error)
             }
         }, */
    },

    /* created() {
        this.getAnimes()
    }, */
};
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

// Custom styles
.fas {
    @include colorize($color: accent);
}

.info {
    font-size: 20;
    horizontal-align: center;
    vertical-align: center;
}
</style>
