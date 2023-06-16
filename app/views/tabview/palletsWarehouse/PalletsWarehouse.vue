<template>
    <page>
        <FloatingButton/>
    </page>
</template>
<script>
import FloatingButton from '~/components/floatingButton/FloatingButton.vue';

export default {
    components:{
        FloatingButton
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
