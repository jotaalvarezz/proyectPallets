<template>
  <page @loaded="typesManagement">
    <Header :search="false" />
    <GridLayout rows="*, *" backgroundColor="#F4F6F8" padding="30">
      <card-view v-for="(item, index) in types_management"
        :key="index"
        :row="index"
        ripple="true"
        margin="30"
        elevation="10"
        radius="5"
        @tap="navigate(item.id)"
      >
        <StackLayout>
          <Image
            height="88%"
            ref="imageRef"
            stretch="fill"
            :src="item.icon"
            loadMode="sync"
            style="border-bottom-color: #3c495e; border-bottom-width: 1px"
          />
          <Label height="12%" :text="item.name" class="text-center" />
        </StackLayout>
      </card-view>
    </GridLayout>
  </page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import NavViews from "~/views/evidence/tabview/NavViews.vue";
const {getTypesManagement} = require("~/sqlite/database");
import Alert from "~/alerts/Alerts";

export default {
  name: "Evidences",
  components: { Header, NavViews },

  data() {
    return {
      types_management:[]
    };
  },

  methods: {
    navigate(id) {
      this.$router.push("verification.details",{
        props:{
          management_id: id
        }
      });
    },

    async typesManagement() {
      try {
        const res = await getTypesManagement()
        this.types_management = res.data
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      }
    }
  },

  mounted() {

  },
};
</script>
<style>
.colorIcons {
  color: #222a37;
}

.my-card {
  border-width: 2;
  border-color: #000000;
  border-radius: 5;
}

.shadow {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
