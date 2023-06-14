<template>
    <GridLayout rows="auto,*" class="nt-drawer__content">
        <StackLayout row="0" class="nt-drawer__header">
            <Image class="nt-drawer__header-image fas t-36" src.decode="font://&#xf2bd;" />
            <Label class="nt-drawer__header-brand" text="User Name" />
            <Label class="nt-drawer__header-footnote" text="username@mail.com" />
        </StackLayout>
        <ScrollView row="1" class="nt-drawer__body">
            <StackLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item">
                    <Label col="0" :text="'fa-home' | fonticon" class="fas" fontSize="18" />
                    <Label col="1" text="Inicio" fontSize="15" class="p-l-10"/>
                </GridLayout>
                <GridLayout columns="auto,*" class="nt-drawer__list-item">
                    <Label col="0" :text="'fa-sync' | fonticon" class="fas" fontSize="18" />
                    <Label col="1" text="Actualizar" fontSize="15" class="p-l-10"/>
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </GridLayout>
</template>
<script>
export default {
    name: 'Content-Drawer'
}
</script>
