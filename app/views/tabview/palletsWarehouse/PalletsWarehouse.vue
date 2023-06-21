<template>
    <page>
        <Header/>
        <FloatingButton/>
    </page>
</template>
<script>
import FloatingButton from '~/components/floatingButton/FloatingButton.vue';
import Header from '~/components/header/Header.vue';

export default {
    components:{
        FloatingButton,
        Header
    },
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

</style>
