<template>
  <Page @loaded="verifySesion">
    <Header :search="false" />
    <GridLayout rows="*, auto,auto" backgroundColor="#F4F6F8" height="100%">
      <ScrollView row="0">
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
            text="Iniciar sesión"
            style="width: 80%"
            borderWidth="1"
            borderColor="#222a37"
            borderRadius="30"
            @tap="submit"
          />
        </StackLayout>
      </ScrollView>

      <!--<Button
        row="1"
        backgroundColor="#F4F6F8"
        color="#222a37"
        text="update"
        style="width: 80%"
        borderWidth="1"
        borderColor="#222a37"
        borderRadius="30"
        @tap="updateApk"
      />-->

      <!-- Footer fijo al final -->
      <StackLayout row="2" backgroundColor="#D8E2E8" width="100%" padding="5">
        <Label :text="footer" textAlignment="center" />
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { getVersionName, getVersionCode } from "@nativescript/appversion";
import {
  getConnectionType,
  connectionType,
} from "@nativescript/core/connectivity";
import { Toasty } from "@triniwiz/nativescript-toasty";
import axios from 'axios';
import { knownFolders, File, path, Http } from "@nativescript/core";
import * as utils from '@nativescript/core/utils';

export default {
  name: "LoginIndex",
  data() {
    return {
      model: {
        user: "",
        password: "",
      },
      textFooter: "WSP V",
      versionApp: "",
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("auth", ["logout", "modules", "user"]),
    footer() {
      return this.textFooter + "(" + this.versionApp + ")";
    },
  },

  methods: {
    ...mapActions("auth", ["isLogin", "isActive"]),

    async submit() {
      try {
        // ...
        this.loadingCharge(true);
        const res = await this.isLogin(this.model);
        if (res.status && res.status === 400) {
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

    async verifySesion() {
      this.versionApp = await getVersionName();
      try {
        this.loadingCharge(true, "Validando Usuario...");
        if (await this.isActive()) {
          this.$router.pushClear("dashboard.index");
        }
      } catch (error) {
        Alert.danger(
          "¡Hubo un error al intentar iniciar sesion!",
          error.message
        );
      } finally {
        this.loadingCharge();
      }
    },

    // ✅ Verificar permisos para instalar desde fuentes desconocidas (Android 8+)
    checkInstallPermission() {
      const context = utils.ad.getApplicationContext();
      if (android.os.Build.VERSION.SDK_INT >= 26) { // Android 8+
        if (!context.getPackageManager().canRequestPackageInstalls()) {
          const intent = new android.content.Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
          intent.setData(android.net.Uri.parse(`package:${context.getPackageName()}`));
          intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
          context.startActivity(intent);
          return false;
        }
      }
      return true;
    },

    // 🚀 Método para instalar la APK descargada
    installApk(apkFileName) {
      try {
        const context = utils.ad.getApplicationContext();
        const apkFilePath = path.join(knownFolders.externalDocuments().path, apkFileName);
        console.log("apkFilePath ",apkFilePath)
        const apkFile = new java.io.File(apkFilePath);
        console.log("apkfile ",apkFile)
        if (!apkFile.exists()) {
          console.error('Archivo APK no encontrado:', apkFilePath);
          return;
        }

        const authority = `${context.getPackageName()}.provider`;
        const apkUri = androidx.core.content.FileProvider.getUriForFile(context, authority, apkFile);

        const intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
        //intent.setDataAndType(apkUri, 'application/vnd.android.package-archive');
        intent.setDataAndType(apkUri, "*/*");
        intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

        context.startActivity(intent);
      } catch (error) {
        console.error('⚡ Error al intentar instalar la APK:', error);
      }
    },

    async download(url){
      try {
        console.log("daldhañuf ",url)
        const documents = knownFolders.externalDocuments()
        //const documents = knownFolders.externalStorage()
        console.log("documento ",documents)
        const filePath = path.join(documents.path, "wspTest.apk")
        this.loadingCharge(true, "Descargando actualizacion...");
        const file = File.fromPath(filePath)
        const response = await Http.getFile(url, filePath);
        if(response && response.path){
          console.log(`📏 Tamaño del archivo APK descargado: ${file.size} bytes`);
          if (this.checkInstallPermission()) {
            this.installApk("wsp.apk");
          } else {
            console.log('⚠️ El usuario debe permitir la instalación desde fuentes desconocidas.');
          }
        }
      } catch(error) {
        console.error('⚡ Error al intentar instalar la APK:', error);
      } finally {
        this.loadingCharge();
      }
    },

    async updateApk() {
      try {
        const connection = getConnectionType();
        const versionApp = {};
        versionApp.version = await getVersionName();
        console.log("conexion ", connection, connectionType);
        if (connection != connectionType.none) {
          const res = await axios.post(
            process.env.VUE_APP_API_URL + "/wsp_versions",
            versionApp
          );
          console.log("res", res)
          if (res.data.code == 1) {
            new Toasty({ text: "Actualizacion disponible" }).show();
            this.download(res.data.url);

          } else {
            new Toasty({ text: "No hay actualizacion disponible" }).show();
          }
        }
      } catch (error) {}
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
