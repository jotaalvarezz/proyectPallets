<template>
    <GridLayout rows="auto, auto, auto" padding="30">
        <Label text="Observacion:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" row="0" />
        <TextField ref="field" v-model="observation" padding="10" hint="cantidad" class="fas" height="45" fontSize="18"
            keyboardType="number" boder="none" style="
                        placeholder-color: #3c495e;
                        color: #3c495e;
                        background-color: #c0c9d7;
                        width: 80%;
                    " row="1" />
        <StackLayout row="2" marginTop="10">
            <Button text="Aceptar" backgroundColor="#F4F6F8" color="#222a37" borderWidth="1"
                        borderColor="#222a37" borderRadius="30" width="auto" @tap="onAccept" />
            <Button text="Cancelar" backgroundColor="#F4F6F8" color="#222a37" borderWidth="1"
                        borderColor="#222a37" borderRadius="30" width="auto" @tap="onCancel" />
        </StackLayout>
    </GridLayout>
</template>
<script>
import Alerts from '~/alerts/Alerts'

export default {
    data() {
        return {
            observation: null,
            validar:false
        }
    },

    methods: {
        onAccept() {
            if (this.observation != null) {
                this.$modal.close(
                    {
                        option: true,
                        observation: this.observation
                    }
                )
            }else{
                Alerts.info("La observacion esta vacia...")
            }
        },

        onCancel() {
            this.$modal.close(
                {
                    option: false,
                    observation: this.observation
                }
            )
        }
    }
}
</script>
