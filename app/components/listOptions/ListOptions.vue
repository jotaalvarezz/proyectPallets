<template>
    <!-- <Page> -->
        <grid-layout rows="*" backgroundColor="white">
            <ListView for="(item, index) in ships" @itemTap="onItemTap">
                <v-template>
                    <GridLayout columns="auto">
                        <!-- <Label :text="'fa-ship' | fonticon" class="fas" width="110" fontSize="70" col="0"
                            backgroundColor="#222A37" color="white" /> -->
                        <Label :text="item" class="p-l-10" width="auto" color="black" fontSize="25" col="0" />
                        <!-- <Label :text="'fa-trash-alt' | fonticon" class="fas" fontSize="18" col="2"
                            @tap="deleteRow(item.id, index)" /> -->
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
    //console.log("componente ",this.ships)
    this.getShips()
  }
  /* components: { GridLayout }, */
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
