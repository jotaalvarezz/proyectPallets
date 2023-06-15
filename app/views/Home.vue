<template>
    <Page>
        <Header :open="openDrawer"/>
        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            <!-- Contenido principal -->
            <StackLayout ~mainContent>
                <!-- Agrega tus elementos de contenido principal aquí -->
                <NavViews/>
            </StackLayout>
            <!-- Contenido del Drawer -->
            <StackLayout ~drawerContent>
                <!-- Agrega tus elementos de contenido del Drawer aquí -->
                <ContentDrawer></ContentDrawer>
            </StackLayout>
        </RadSideDrawer>
    </Page>
</template>

<script>
import axios from 'axios';
import Header from '~/components/header/Header.vue';
import ContentDrawer from '~/components/contentDrawer/ContentDrawer.vue';
import NavViews from './tabview/NavViews.vue';

export default {
    components: {
        Header,
        ContentDrawer,
        NavViews
    },

    data() {
        return {
            drawer:[]
        }
    },

    computed: {
        message() {
            return this.$refs
        }
    },
    methods: {
        async getAnimes() {
            try {
                const animes = await axios.get('https://api.jikan.moe/v4/anime');
                console.log(animes)
                this.animes = animes.data.data
                this.save_anime(this.animes)
                this.popularities(this.animes)
            } catch (error) {
                console.log(error)
            }
        },

        openDrawer(){
            const drawer = this.$refs.drawer
            drawer.showDrawer()
        }
    },

    created() {
        this.getAnimes()
    },
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
