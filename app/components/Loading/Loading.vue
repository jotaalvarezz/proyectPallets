<template>
    <Page>
        <GridLayout rows="auto, auto" margin="15">
            <ActivityIndicator row="0" busy="true" @busyChange="onBusyChanged" />
            <Label row="1" text="Cargando Informacion..." style="text-align: center;" textWrap="true"/>
        </GridLayout>
    </Page>
</template>

<script>
export default {
    props:{
        control:{
            type:Boolean,
        }
    },
    methods:{
        onBusyChanged(){
            console.log("charge tamplate")
        },

        stop(){
            setTimeout(() => {
                this.$modal.close()
            },2000)
        }
    },

    created(){
        console.log("control => ",this.control)
        /* this.stop() */
        /* if(this.control){ */
            /* this.$modal.close() */
        /* } */
    }
}
</script>

