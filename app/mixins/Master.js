import Loading from "~/components/Loading/Loading";
import { mapState, mapMutations } from "vuex";

const mixinMasters = {
  components: {
    Loading,
  },

  data() {
    return {
    };
  },

  computed:{
    ...mapState(['instance'])
  },

  methods: {
    ...mapMutations(['loadingInstance']),

    async loadingCharge(activated = activated || false) {
      /* if (activated) { */
        var charger = await this.$showModal(Loading, {
          fullscreen: false,
          stretched: false,
          dimAmount: 0.5,
        });
        console.log("charge ",charger.nativeView)
      /* }else{ */
        console.log("falso")
        /* this.$modal.close(); */
      /* } */
    },
  },
};

export default mixinMasters;
