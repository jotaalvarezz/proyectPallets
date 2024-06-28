<template>
  <GridLayout rows="auto, *, 70" class="nt-drawer__content">
    <StackLayout row="0" class="nt-drawer__header" backgroundColor="#00acc1">
      <Image
        class="nt-drawer__header-image fas t-36"
        src="~/assets/images/logobarco.png"
      />
      <Label
        class="nt-drawer__header-brand coloIcons"
        color="#F4F6F8"
        fontWeight="bold"
        text="WSP"
      />
    </StackLayout>
    <ScrollView row="1" class="nt-drawer__body" backgroundColor="#F4F6F8">
      <StackLayout>
        <GridLayout
          v-if="logout === true"
          id="1"
          columns="40,*"
          class="nt-drawer__list-item hover-label"
          :class="isHovered && itemSelector == 1 ? 'hovered' : ''"
          @touch="onTouch(1)"
          @tap="home"
        >
          <Label
            col="0"
            :text="'fa-home' | fonticon"
            class="fas colorIcons"
            color="#3c495e"
            fontSize="22"
          />
          <Label
            col="1"
            text="Inicio"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <!-- static -->
        <GridLayout
          id="3"
          columns="40,*"
          class="nt-drawer__list-item"
          :class="isHovered && itemSelector == 3 ? 'hovered' : ''"
          @touch="onTouch(3)"
          @tap="createTables"
        >
          <Label
            col="0"
            :text="'fa-sync' | fonticon"
            class="fas"
            color="#3c495e"
            fontSize="22"
          />
          <Label
            col="1"
            text="Actualizar"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <!-- create modules -->
        <GridLayout
          v-for="(item, index) in modules"
          :key="index"
          :id="item.id"
          columns="40,*"
          class="nt-drawer__list-item"
          :class="isHovered && itemSelector == item.id ? 'hovered' : ''"
          @touch="onTouch(item.id)"
          @tap="navigate(item.url)"
        >
          <Label
            col="0"
            :text="item.icon | fonticon"
            class="fas"
            color="#3c495e"
            fontSize="22"
          />
          <Label
            col="1"
            :text="item.name"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
      </StackLayout>
    </ScrollView>
    <!-- Label en la parte inferior -->
    <GridLayout
      ref="gridlayout"
      backgroundColor="#F4F6F8"
      v-if="logout === true"
      id="100"
      row="2"
      height="70"
      columns="*, *,40"
      class="nt-drawer__list-item hover-label"
      @touch="onTouchClose"
      @tap="closeSession"
    >
      <Label
        col="1"
        :text="'fa-sign-out-alt' | fonticon"
        class="fas colorIcons"
        color="#3c495e"
        fontSize="22"
      />
      <Label
        col="0"
        text="Cerrar sesion"
        fontSize="14"
        class="p-l-10 colorIcons"
      />
    </GridLayout>
  </GridLayout>
</template>
<script>
const {
  createTable,
  DBdelete,
  structure,
  storeUsers,
  storeModules,
  insertSeletsEvidence,
  insertTypesManagement,
} = require("../../sqlite/database");
import * as utils from "~/shared/util";
import axios from "axios";
import { mapState, mapMutations, mapActions } from "vuex";
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { ImageSource, knownFolders, path, Folder } from "@nativescript/core";
import * as fs from "@nativescript/core/file-system";

export default {
  name: "Content-Drawer",
  data() {
    return {
      loading: false,
      isHovered: false,
      itemSelector: 0,
    };
  },

  computed: {
    ...mapState(["indicator"]),
    ...mapState("auth", ["logout", "modules", "user"]),
  },

  mixins: [mixinMasters],

  methods: {
    ...mapMutations(["saveShipsWarehouses", "indicatorState"]),
    ...mapMutations("auth", ["setUsers", "setModules", "setUser", "setLogout"]),
    ...mapActions("auth", ["islogout"]),

    accessModules() {
      if (this.logout) {
      }
    },

    onTouch(n) {
      this.itemSelector = n;
      if (!this.isHovered) {
        this.isHovered = true;
      } else {
        this.isHovered = false;
      }
    },

    onTouchClose(event) {
      const hoverLabel = this.$refs.gridlayout.nativeView;
      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          hoverLabel.animate({
            backgroundColor: "lightgray", // Cambiar el color de fondo
            duration: 300,
          });
          break;
        case "up":
        case "cancel":
          // El toque ha sido cancelado
          setTimeout(() => {
            hoverLabel.animate({
              backgroundColor: "#F4F6F8", // Revertir al color original
              duration: 300,
            });
          }, 300);
          break;
      }
    },

    async getShipsWarehouses() {
      try {
        const shipsWarehouses = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/ships');
        /* const shipsWarehouses = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/ships"
        ); */
        /* const shipsWarehouses = await axios.get(
          "http://172.70.9.110/mcp-backend/public/api/mobile/ships"
        ); */
        this.saveShipsWarehouses(shipsWarehouses);
        return shipsWarehouses;
      } catch (error) {
        /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
        return Alert.danger(
          "¡Hubo un error al cargar los barcos y las bodegas!",
          error.message
        );
      }
    },

    async getUsersWsp() {
      try {
        const users_wsp = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/wsp_users');
        /* const users_wsp = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/wsp_users"
        ); */
        /* const users_wsp = await axios.get(
          "http://172.70.9.110/mcp-backend/public/api/mobile/wsp_users"
        ); */
        return users_wsp;
      } catch (error) {
        /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
        return Alert.danger(
          "¡Hubo un error al cargar los usuarios!",
          error.message
        );
      }
    },

    async getModulesWsp() {
      try {
        const modules_wsp = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/wsp_modules');
        /* const modules_wsp = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/wsp_modules"
        ); */
        /* const modules_wsp = await axios.get(
          "http://172.70.9.110/mcp-backend/public/api/mobile/wsp_modules"
        ); */
        return modules_wsp;
      } catch (error) {
        /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
        return Alert.danger(
          "¡Hubo un error al cargar los modulos!",
          error.message
        );
      }
    },

    async defaultSelects() {
      try {
        const selects_evidence = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/selects_evidence');
        /* const selects_evidence = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/selects_evidence"
        ); */
        /* const selects_evidence = await axios.get(
          "http://172.70.9.110/mcp-backend/public/api/mobile/selects_evidence"
        ); */
        return selects_evidence;
      } catch (error) {
        /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
        console.log(error);
      }
    },

    async createTables() {
      try {
        let confirmated = await Alert.Danger(2);
        if (confirmated) {
          this.loadingCharge(true);
          const shipsWarehouses = await this.getShipsWarehouses();
          const selects_evidence = await this.defaultSelects();
          const modules = await this.getModulesWsp();
          const users = await this.getUsersWsp();
          this.setUsers(modules.data.data);
          const db = await createTable(shipsWarehouses.data.data);
          await storeUsers(users.data.data);
          await storeModules(modules.data.data);
          await insertSeletsEvidence(selects_evidence.data.data.defaultSelects);
          await insertTypesManagement(selects_evidence.data.data.defaultTypes);
          this.cleanImages();
          this.islogout();
          this.$router.pushClear("login.index");
          this.loadingCharge();
          Alert.success("Actualizacion de DB");
        }
      } catch (error) {
        this.loadingCharge();
        Alert.danger("No se pudo actualizar la DB", error);
      }
    },

    async home() {
      /* const struc = await structure() */
      this.$router.pushClear("dashboard.index");
      utils.closeDrawer();
    },

    async navigate(url) {
      try {
        this.$router.pushClear(url);
        utils.closeDrawer();
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
      }
    },

    async closeSession() {
      let confirmated = await Alert.info("Se cerrara la sesion", 3, "Cerrar");
      if (confirmated) {
        this.islogout();
        this.$router.pushClear("login.index");
        utils.closeDrawer();
      }
    },

    cleanImages() {
      const folderPath = knownFolders.documents().path;
      const folder = Folder.fromPath(folderPath);
      const fileList = folder.getEntitiesSync();
      for (let i = 0; i < fileList.length; i++) {
        if (
          fileList[i]["_extension"] &&
          (fileList[i]["_extension"] === ".jpg" ||
            fileList[i]["_extension"] === ".png")
        ) {
          fs.File.fromPath(fileList[i]["_path"]).remove();
        }
      }
    },
  },

  created() {
    this.accessModules();
  },
};
</script>
<style>
.colorIcons {
  color: #222a37;
}

.hover-label {
  font-size: 24;
  color: #222a37;
}

.hovered {
  background-color: lightgray;
}
</style>
