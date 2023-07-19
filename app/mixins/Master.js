import Loading from "~/components/Loading/Loading";
import { mapState, mapMutations } from "vuex";

const mixinMasters = {
  components: {
    Loading,
  },

  data() {
    return {};
  },

  computed: {
    ...mapState(["instance"]),
  },

  methods: {
    ...mapMutations(["indicatorState"]),

    loadingCharge(activated = false) {
      if (activated) {
        this.$showModal(Loading, {
          fullscreen: false,
          stretched: false,
          dimAmount: 0.5,
          props: {
            state: activated,
          },
        });
      }else{
        this.indicatorState(activated)
      }
    },
  },
};

export default mixinMasters;
