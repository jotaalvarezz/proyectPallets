<template>
    <!-- https://github.com/nstudio/nativescript-floatingactionbutton -->
    <fab @tap="fabTap" :text="'fa-plus' | fonticon" class="fab-button fas" rippleColor="#f1f1f1"></fab>
</template>
<script>
import { fonticon } from 'nativescript-fonticon';

export default {
    data() {
        return {

        }
    },

    methods: {
        fabTap() {
            console.log('fotante activo...')
        }
    },
}
</script>
<style lang="scss">
.fab-button {
    height: 70;
    width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
    margin: 15;
    background-color: #081a36;
    horizontal-align: right;
    vertical-align: bottom;
}
</style>
