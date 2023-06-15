<template>
    <page>
        <StackLayout backgroundColor="#3c495e">
            <StackLayout backgroundColor="#354052" orientation="horizontal" padding="11" height="70">
                <TextField v-model="textFieldValue" height="40" borderWidth="1" backgroundColor="#3c495e" width="70%"
                    borderRadius="5" borderColor="#F40000" horizontalAlignment="left"
                    style="placeholder-color:#F4F6F8; color: #F4F6F8;" hint="Buscar Pallet..." paddingLeft="10" fontSize="15"
                    @textChange="filterAnime" />
                <Label :text="'fa-window-close' | fonticon" class="fas" color="#F40000" fontSize="40" alignItems="flex-end"
                    @tap="$modal.close" />
            </StackLayout>
            <FlexboxLayout v-if="this.animes_filter.length > 0" alignSelf="center" flexWrap="wrap" marginTop="30" height="auto">
                <FlexboxLayout flexDirection="column" marginTop="15" v-for="(item, index) in animes_filter" :key="index"
                    height="auto">
                    <card-view class="position" ripple="true" elevation="20" margin="4" radius=15 height="230" width="31%"
                        @tap="watchEpisodes(item.mal_id)">
                        <stack-layout orientation="horizontal" style="background-color: #1c6b48;" height="auto">
                            <Image :src="item.images.jpg.image_url" stretch="fill" />
                        </stack-layout>
                    </card-view>
                    <Label :text="item.title" width="31%" height="40" class="cardtitle" fontSize="18"></Label>
                </FlexboxLayout>
            </FlexboxLayout>
        </StackLayout>
    </page>
</template>

<script>

export default {
    props: ['animes'],
    data() {
        return {
            textFieldValue: '',
            animes_filter: []
        }
    },

    methods: {
        filterAnime() {
            if (this.textFieldValue.length > 0) {
                this.animes_filter = this.animes.filter(anime => !this.textFieldValue || anime.title.includes(this.textFieldValue))
            }
            /* for (let i = 0; i < field.length; i++) {
                console.log(field[i].title)
            } */
        },

        watchEpisodes(id) {
            /* this.$navigateTo(AnimeInfo, { props: { anime_id: id } })
            this.$modal.close() */
        },
    },
}
</script>
