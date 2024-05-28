<template>
  <Page>
    <Header :search="false" />
    <FlexboxLayout justifyContent="space-around" backgroundColor="#F4F6F8">
      <!-- <Label
        text="second"
        alignSelf="center"
        width="70"
        height="70"
        backgroundColor="#1c6b48"
      /> -->
      <StackLayout
        alignSelf="center"
        backgroundColor="#F4F6F8"
        margin="30"
        padding="20"
        borderWidth="1"
        borderColor="#D5D8DC"
        borderRadius="5"
      >
        <Image
          src="~/assets/images/logobarco.png"
          stretch="aspectFit"
          height="30%"
          width="60%"
        />
        <FormGroupTextField
          label="Usuario:"
          placeholder="usuario..."
          v-model="model.user"
        />
        <FormGroupTextField
          label="Contraseña:"
          placeholder="contraseña..."
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
import { mapState, mapActions } from 'vuex';
import mixinMasters from "~/mixins/Master";

export default {
  name: "LoginIndex",
  data() {
    return {
      model:{
        user: "adminWsp",
        password: "Admin2024."
      }
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapActions('auth',['isLogin']),

    async submit() {
      // ...
      this.loadingCharge(true);
      const aux = await this.isLogin(this.model)
      this.loadingCharge();
      this.$router.pushClear("dashboard.index");

      // ...
    },
  },
};
</script>
<style scoped>
.shadow {
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.19);
}
</style>
