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
    ...mapState(["showError"]),
  },

  methods: {
    ...mapMutations(["indicatorState", "setShowError"]),

    loadingCharge(activated = false, msg="Cargando...") {
      if (activated) {
        this.$showModal(Loading, {
          fullscreen: false,
          animated:true,
          cancelable: false,
          props: {
            state: activated,
            msg: msg
          },
        });
      }else{
        setTimeout(() => {
          this.indicatorState(activated)
        }, 800);
      }
    },

    showMessageError(){
      if(!this.showError){
        this.setShowError(true)
        setTimeout(() => {
          this.setShowError(false)
        }, 10000);

        return true;
      }

      return false;
    }
  },
};

export default mixinMasters;
