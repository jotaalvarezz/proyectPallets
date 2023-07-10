import Loading from '~/components/Loading/Loading'

const mixinMasters = {
  components:{
    Loading
  },

  methods: {
    loadingCharge(){
      this.$showModal(
        Loading,
        {
          fullscreen: false,
          stretched: false,
          dimAmount: 0.5,
        }
      )
    }
  },
}


export default mixinMasters;
