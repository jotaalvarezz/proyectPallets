<template>
  <page @loaded="typesManagement">
    <ActionBar backgroundColor="#00acc1" padding="0">
      <HeaderComponent title="Reportes/Evidencias" :handleback="openDrawer" />
    </ActionBar>
    <GridLayout rows="*, *" backgroundColor="#F4F6F8" padding="30">
      <card-view
        v-for="(item, index) in types_management"
        :key="index"
        :row="index"
        backgroundColor="#D8E2E8"
        ripple="true"
        margin="30"
        elevation="10"
        radius="15"
        @tap="navigate(item.id)"
      >
        <StackLayout>
          <Image
            ref="imageRef"
            stretch="aspectFit"
            height="88%"
            width="40%"
            :src="item.icon"
            loadMode="sync"
          />
          <Stripe margin="0" />
          <Label
            style="font-weight: bold"
            height="12%"
            :text="item.name"
            fontSize="18"
            class="text-center"
          />
        </StackLayout>
      </card-view>
    </GridLayout>
  </page>
</template>

<script>
const { getTypesManagement } = require("~/sqlite/database");
import Alert from "~/alerts/Alerts";
import { mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";
import * as util from "~/shared/util";

export default {
  name: "Evidences",

  data() {
    return {
      types_management: [],
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapMutations("managementStore", [
      "setType",
      "setTypeMangement",
      "cleanStoreTypeManagementId",
    ]),
    ...mapMutations("evidenceStore", ["cleanManagementModel"]),

    openDrawer() {
      util.showDrawer();
    },

    navigate(id) {
      this.setTypeMangement(id);
      this.loadingCharge(true);
      setTimeout(() => {
        switch (id) {
          case 1:
            this.setType(false);
            this.$router.push("verification.details");
            break;
          case 2:
            this.setType(true);
            this.$router.push("container_report.index");
            break;
        }
      }, 0);
      this.loadingCharge();
    },

    async typesManagement() {
      this.cleanStoreTypeManagementId();
      this.cleanManagementModel();
      try {
        const res = await getTypesManagement();
        this.types_management = res.data;
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      }
    },
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
