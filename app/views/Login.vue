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
        class="img"
        alignSelf="center"
        backgroundColor="#F4F6F8"
        margin="30"
        padding="20"
        borderWidth="1"
        borderColor="#D5D8DC"
        borderRadius="5"
      >
        <!-- <Image
          src="~/assets/images/logobarco.png"
          stretch="aspectFit"
          height="30%"
          width="60%"
        /> -->
        <Label class="login-title" text="WSP" />
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
        <!-- ************************************** -->
        <Button
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="test password"
          style="width: 80%"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
          @tap="users"
        />
        <!-- *************************************** -->
      </StackLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinMasters from "~/mixins/Master";
import axios from "axios";
const CryptoJS = require("crypto-js");

export default {
  name: "LoginIndex",
  data() {
    return {
      model: {
        user: "adminWsp",
        password: "Admin2024.",
      },
      secretKey: "security",
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapActions("auth", ["isLogin"]),

    async submit() {
      // ...
      this.loadingCharge(true);
      const aux = await this.isLogin(this.model);
      this.loadingCharge();
      this.$router.pushClear("dashboard.index");

      // ...
    },

    async users() {
      try {
        const users_wsp = await axios.get(
          "http://172.70.9.110/mcp-backend/public/api/mobile/wsp_users"
        );
        const user = users_wsp.data.data[0];
        console.log("users ", user);
        // Separar el IV de los datos cifrados
        // Decodificar base64
        const decodedData = CryptoJS.enc.Base64.parse(user.wspencryptdef);
        // Extraer IV (16 bytes) y datos cifrados
        const iv = CryptoJS.lib.WordArray.create(
          decodedData.words.slice(0, 4),
          16
        );
        const encrypted = CryptoJS.lib.WordArray.create(
          decodedData.words.slice(4),
          decodedData.sigBytes - 16
        );

        console.log("ivm ", iv);
        console.log("ecrypted ", encrypted);
        // Decodificar los datos cifrados
        const decryptedData = await CryptoJS.AES.decrypt(
          encrypted,
          CryptoJS.enc.Utf8.parse("security"),
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        ).toString(CryptoJS.enc.Utf8);

        console.log("Decrypted Data: ", decryptedData);
      } catch (error) {
        console.log("error de usuario ", error);
      }
    },
  },
};
</script>
<style scoped>
.shadow {
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.19);
}

.img {
}

.login-title {
  text-align: center;
  font-size: 55px;
  font-weight: bold;
  font-family: comic Arial, Helvetica, sans-serif;
  color: #00acc1;
}
</style>
