<template>
    <page>
        <Header />
        <grid-layout rows="*" backgroundColor="#F4F6F8">
            <ListView for="(item, index) in pallets" @itemTap="onItemTap">
                <v-template>
                    <GridLayout columns="auto, *,50" @longPress="operations">
                        <Label :text="'fa-pallet' | fonticon" class="fas" width="110" fontSize="70" col="0"
                            color="#0096b7" />
                        <Label :text="item.text" class="p-l-10 colorIcons" width="auto" fontSize="25" col="1" />
                        <!-- <Label
              :text="'fa-trash-alt' | fonticon"
              class="fas colorIcons"
              fontSize="18"
              col="2"
              @tap="deleteRow(item.id)"
            /> -->
                    </GridLayout>
                </v-template>
            </ListView>
            <fab @tap="getAll" marginBottom="13%" :text="'fa-sync' | fonticon" class="fab-sync fas"
                rippleColor="#f1f1f1"></fab>
            <!-- <FloatingButton row="2" :add="openModal" /> -->
        </grid-layout>
    </page>
</template>
<script>
import FloatingButton from '~/components/floatingButton/FloatingButton.vue';
import Header from '~/components/header/Header.vue';
const { getPalletsAll } = require("~/sqlite/database");

export default {
    components: {
        FloatingButton,
        Header
    },
    data() {
        return {
            pallets: []
        }
    },

    methods: {
        fabTap() {
            console.log('fotante activo...')
        },

        async getAll() {
            try {
                const pallets = await getPalletsAll();
                console.log(pallets);
                for (let i = 0; i < pallets.length; i++) {
                    this.pallets.push(
                        {
                            id: pallets[i][0],
                            text: pallets[i][1],
                            observation: pallets[i][2],
                            warehouse_id: pallets[i][3]
                        });
                }
            } catch (error) {
                console.error("error", error);
            }
        }
    },

    created(){
        this.getAll();
    }
}
</script>
<style lang="scss"></style>
