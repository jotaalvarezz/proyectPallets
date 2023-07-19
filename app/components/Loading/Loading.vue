<template>
    <Page>
        <GridLayout rows="auto, auto" margin="15">
            <ActivityIndicator row="0" :busy="controlIndicator"  @busyChange="onBusyChanged" />
            <Label row="1" text="Cargando Informacion" style="text-align: center;" textWrap="true"/>
        </GridLayout>
    </Page>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name:"loading",
    props:{
        control:{
            type:Boolean,
        },
        msg:{
            type:String
        },
        state:{
            type:Boolean,
            required: true,
        }
    },

    computed:{
        ...mapState(['indicator']),

        controlIndicator(){
            if(this.indicator == false){
                console.log("dasctivate ",this.indicator)
                this.indicatorState(this.indicator)
                this.$modal.close()
            }else{
                return true
            }
        }
    },

    methods:{
        ...mapMutations(['indicatorState']),

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
        this.indicatorState(this.state)
        console.log("control => ",this.indicator)
    }
}
</script>

