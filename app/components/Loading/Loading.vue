<template>
    <Page>
        <GridLayout rows="auto, auto" columns="130" margin="20">
            <ActivityIndicator row="0" :busy="controlIndicator" color="#00acc1" width="55" height="55"  @busyChange="onBusyChanged" />
            <Label row="1" :text="msg" style="text-align: center;" fontSize="14" textWrap="true"/>
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
                //this.indicatorState(this.indicator)
                this.$modal.close()
            }else{
                return true
            }
        }
    },

    methods:{
        ...mapMutations(['indicatorState']),

        onBusyChanged(){

        },

        stop(){
            setTimeout(() => {
                this.$modal.close()
            },2000)
        }
    },

    created(){
        this.indicatorState(this.state)
    }
}
</script>

