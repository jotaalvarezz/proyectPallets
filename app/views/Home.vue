<template>
    <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
        <!-- Contenido principal -->
        <StackLayout ~mainContent>
            <!-- Agrega tus elementos de contenido principal aquí -->
            <Frame>
                <Ships/>
            </Frame>
        </StackLayout>
        <!-- Contenido del Drawer -->
        <StackLayout ~drawerContent>
            <!-- Agrega tus elementos de contenido del Drawer aquí -->
            <ContentDrawer></ContentDrawer>
        </StackLayout>
    </RadSideDrawer>
</template>

<script>
import axios from 'axios';
import Header from '~/components/header/Header.vue';
import ContentDrawer from '~/components/contentDrawer/ContentDrawer.vue';
import Ships from './ships/Ships.vue';

export default {
    components: {
        Header,
        ContentDrawer,
        Ships
    },

    data() {
        return {
            drawer: []
        }
    },

    computed: {
        message() {
            return this.$refs
        }
    },

    methods: {
        /* async getShipsWarehouses() {
            try {
                const shipsWarehouses = await axios.get('http://172.70.8.122/mcp-backend/public/api/mobile/ships');
                console.log(shipsWarehouses)
            } catch (error) {
                console.log(error)
            }
        }, */

        /* openDrawer() {
            const drawer = this.$refs.drawer
            drawer.showDrawer()
        } */
    },

    created(){
        /* this.getShipsWarehouses() */
    }
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
