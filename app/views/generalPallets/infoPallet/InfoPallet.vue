<template>
    <Page>
        <GridLayout rows="auto,auto,auto,auto,auto,auto,auto,auto" padding="30" backgroundColor="#F4F6F8">
            <Label row="0" text="Codigo de Pallet:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
            <Label row="1" :text="infoPallet.code" fontSize="18" textWrap="true" style=" color: #3c495e; width: 80%;" />

            <Label row="2" text="Obsevacion:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
            <Label row="3" :text="infoPallet.observation" fontSize="18" textWrap="true" style=" color: #3c495e; width: 80%;" />

            <Label row="4" text="Barco:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
            <Label row="5" :text="infoPallet.ship_id" fontSize="18" style=" color: #3c495e; width: 80%;" />

            <Label row="6" text="Bodega:" fontSize="18" fontWeight="bold" style=" color: #3c495e; width: 80%;" />
            <Label row="7" :text="infoPallet.warehouse_id" fontSize="18" style=" color: #3c495e; width: 80%;" />
        </GridLayout>
    </Page>
</template>

<script>
export default{
props:{
    infoPallet:{
        type:Object,
    }
}
}
</script>
