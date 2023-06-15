<template>
    <StackLayout>
        <!-- <Label text="Contenido de la página" /> -->
        //https://github.com/nstudio/nativescript-floatingactionbutton
        <fab @tap="fabTap" row="0" icon="res://ic_add_white" rippleColor="#f1f1f1" class="fab-button"></fab>
    </StackLayout>
</template>
<script>
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
    background-color: #ff4081;
    horizontal-align: left;
    vertical-align: bottom;
}
</style>
