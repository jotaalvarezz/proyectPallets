<template>
    <Page>
        <GridLayout rows="auto,auto,auto,auto,auto" padding="30" backgroundColor="#F4F6F8">
            <Label row="0" text="Infomacion del Barco" fontWeight="bold" fontSize="18" textWrap="true"
                    style=" text-align: center; color: #3c495e; width: 80%;" marginBottom="15" />

            <Label row="1" text="Barco:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
            <Label row="2" :text="info.text" fontSize="18" textWrap="true" style=" color: #3c495e; width: 80%;" />

            <Label row="3" text="Viaje:" marginTop="10" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
            <Label row="4" :text="info.journey" fontSize="18" textWrap="true" style=" color: #3c495e; width: 80%;" />
        </GridLayout>
    </Page>
</template>

<script>
export default{
props:{
    info:{
        type:Object,
    }
}
}
</script>
