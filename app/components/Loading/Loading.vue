<template>
    <Page>
        <ActivityIndicator busy="true" @busyChange="onBusyChanged" />
    </Page>
</template>

<script>
export default {
    props:{

    },
    methods:{
        onBusyChanged(){
            console.log("charge tamplate")
        }
    }
}
</script>

