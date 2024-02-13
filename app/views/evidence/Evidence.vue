<template>
    <page>
        <Header :data="info" :icons="icons" :search="false" />
        <!-- <Label text="HOLA MUNDO" color="#EAB14D" fontSize="30" /> -->
        <Signature/>
    </page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import Signature from "~/components/signature/Signature.vue";

export default {
    components:{
        Header,
        Signature
    },

    data() {
        return {
            info:[],
            icons:{}
        }
    },
}
</script>
