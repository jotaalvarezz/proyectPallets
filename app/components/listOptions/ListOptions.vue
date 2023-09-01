<template>
    <!-- <Page> -->
        <grid-layout rows="*" backgroundColor="white">
            <ListView for="(item, index) in ships" @itemTap="onItemTap">
                <v-template>
                    <GridLayout columns="auto">
                        <Label :text="item" class="p-l-10" width="auto" color="black" fontSize="25" col="0" />
                    </GridLayout>
                </v-template>
            </ListView>
        </grid-layout>
    <!-- </Page> -->
</template>
<script>
const { getShips } = require('~/sqlite/database')

export default {
  components: {

  },
  data() {
    return {
        ships:[]
    };
  },
  computed: {

  },
  methods: {
    async getShips() {
      try {
        this.ships = []
        const ships = await getShips()
        console.log(ships)
        for (let i = 0; i < ships.length; i++) {
          this.ships.push(ships[i][1])
        }
      } catch (error) {
        console.error("error al traer lo datos ", error)
      }
    }
  },

  created(){
    this.getShips()
  }
};
</script>
<style lang="scss">
.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #081a36;
  horizontal-align: right;
  vertical-align: bottom;
}
</style>
