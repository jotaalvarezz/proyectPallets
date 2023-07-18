<template>
    <!-- <Page> -->
        <GridLayout rows="auto, auto" margin="15" style="background-color: blue;">
            <ActivityIndicator row="0" busy="true" :visibility="show ? 'visible' : 'collapse'" @busyChange="onBusyChanged" />
            <Label row="1" text="Cargando Informacion" :visibility="show ? 'visible' : 'collapse'" style="text-align: center;" textWrap="true"/>
        </GridLayout>
   <!--  </Page> -->
</template>

<script>
export default {
    name:"loading",
    props:{
        control:{
            type:Boolean,
        },
        msg:{
            type:String
        },
        show:{
            type:Boolean,
            required: true,
        }
    },
    methods:{
        onBusyChanged(){
            /* console.log("charge tamplate") */
        },

        stop(){
            setTimeout(() => {
                this.$modal.close()
            },2000)
        }
    },

    created(){
        console.log("control => ",this.control)
    }
}
</script>

