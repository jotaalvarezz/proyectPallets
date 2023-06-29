<template>
    <page>
        <StackLayout backgroundColor="#F4F6F8">
            <StackLayout backgroundColor="#00acc1" orientation="horizontal" padding="11" height="70">
                <TextField v-model="textFieldValue" height="40" borderWidth="1" backgroundColor="#F4F6F8" width="70%"
                    borderRadius="5" borderColor="#F4F6F8" horizontalAlignment="left"
                    style="placeholder-color:#3c495e; color: #3c495e;" hint="Buscar Pallet..." paddingLeft="10"
                    fontSize="15" @textChange="filterAnime" />
                <Label :text="'fa-window-close' | fonticon" class="fas" color="#222a37" fontSize="40" alignItems="flex-end"
                    @tap="$modal.close" />
            </StackLayout>
            <grid-layout v-if="this.array_filter.length > 0" rows="*" backgroundColor="#F4F6F8">
                <ListView for="(item, index) in array_filter" @itemTap="onItemTap">
                    <v-template>
                        <GridLayout columns="*,70">
                            <StackLayout orientation="horizontal" @tap="operation1(item)" col="0">
                                <Label :text="icons.iconLogo | fonticon" class="fas" width="110" fontSize="70"
                                    color="#0096b7" />
                                <Label :text="item.text" class="p-l-10 colorIcons" textWrap="true" width="65%"
                                    fontSize="25" />
                            </StackLayout>
                            <Label :text="icons.iconOperations | fonticon" class="fas colorIcons" fontSize="18" col="1"
                                style="text-align: center;" @tap="operation2(item)" />
                        </GridLayout>
                    </v-template>
                </ListView>
                <fab @tap="getAll" :text="'fa-sync' | fonticon" class="fab-sync fas" rippleColor="#f1f1f1">
                </fab>
            </grid-layout>
        </StackLayout>
    </page>
</template>

<script>

export default {
    props: {
        data:{
            type:Array
        },
        icons:{
            type:Object,
            required:true
        },
        operation1:{
            type:Function
        },
        operation2:{
            type:Function
        }
    },
    data() {
        return {
            textFieldValue: '',
            array_filter: []
        }
    },

    methods: {
        filterAnime() {
            //console.log(this.data)
            if (this.textFieldValue.length > 0) {
                this.array_filter = this.data.filter(data => !this.textFieldValue || data.text.includes(this.textFieldValue))
            }
            console.log(this.array_filter)
        },

        watchEpisodes(id) {
            /* this.$navigateTo(AnimeInfo, { props: { anime_id: id } })
            this.$modal.close() */
        },
    },
}
</script>
