<template>
    <!-- https://github.com/nstudio/nativescript-floatingactionbutton -->
    <fab @tap="fabTap" :text="icon | fonticon" class="fab-button fas" rippleColor="#f1f1f1"></fab>
</template>
<script>
import { fonticon } from 'nativescript-fonticon';

export default {
    props:{
        method:{
            type:Function,
            required:true
        },

        icon:{
            type:String,
            required: true
        }
    },
    data() {
        return {

        }
    },

    methods: {
        fabTap() {
            this.method()
        }
    },
}
</script>
<style lang="scss">
.fab-button {
    height: 70;
    width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
    margin: 15;
    font-size: 20px;
    background-color: 	#EAB14D;
    color: #F4F6F8;
    horizontal-align: right;
    vertical-align: bottom;
}
</style>
