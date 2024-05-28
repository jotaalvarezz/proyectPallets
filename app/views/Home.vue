<template>
    <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
        <!-- Contenido principal -->
        <StackLayout ~mainContent>
            <!-- Agrega tus elementos de contenido principal aquí -->
            <Frame>
                <LoginIndex/>
            </Frame>
        </StackLayout>
        <!-- Contenido del Drawer -->
        <StackLayout ~drawerContent style="opacity: 0.9;">
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
import LoginIndex from './Login.vue';

export default {
    components: {
        Header,
        ContentDrawer,
        Ships,
        LoginIndex
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
