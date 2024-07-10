<template>
  <Page>
    <Header :search="false" />
    <FlexboxLayout justifyContent="space-around" backgroundColor="#F4F6F8">
      <StackLayout
        class="img"
        alignSelf="center"
        backgroundColor="#F4F6F8"
        margin="30"
        padding="20"
        width="510"
        height="410"
        borderWidth="1"
        borderColor="#D5D8DC"
        borderRadius="5"
      >
        <Label class="login-title" text="WSP" />
        <FormGroupTextField
          label="Usuario:"
          placeholder="usuario..."
          fontsize="18"
          v-model="model.user"
        />
        <FormGroupTextField
          label="Contraseña:"
          placeholder="contraseña..."
          fontsize="18"
          v-model="model.password"
          :pass="true"
        />
        <Stripe color="#D5D8DC" mt="20" mb="20" />
        <Button
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="Iniciar sesion"
          style="width: 80%"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
          @tap="submit"
        />
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";

export default {
  name: "LoginIndex",
  data() {
    return {
      model: {
        user: "",
        password: "",
      },
      secretKey: "security",
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapActions("auth", ["isLogin"]),

    async submit() {
      try {
        // ...
        this.loadingCharge(true);
        const res = await this.isLogin(this.model);
        if (res.status === 400) {
          Alert.info(res.message, 1, res.error);
          return;
        }
        this.$router.pushClear("dashboard.index");
        // ...
      } catch (error) {
        Alert.danger(
          "¡Hubo un error al intentar iniciar sesion!",
          error.message
        );
      } finally {
        this.loadingCharge();
      }
    },
  },
};
</script>
<style scoped>
.shadow {
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.19);
}

.login-title {
  text-align: center;
  font-size: 55px;
  font-weight: bold;
  font-family: comic Arial, Helvetica, sans-serif;
  color: #00acc1;
}
</style>
