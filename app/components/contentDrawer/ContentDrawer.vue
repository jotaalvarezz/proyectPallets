<template>
  <GridLayout rows="auto, *" class="nt-drawer__content">
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
            color="#EAB14D"
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
            color="#24D311"
            fontSize="22"
          />
          <Label
            col="1"
            text="Actualizar"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <!-- static -->
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
            color="#0096b7"
            fontSize="22"
          />
          <Label
            col="1"
            :text="item.name"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <!-- Label en la parte inferior -->
        <Label text="Cerrar sesion" horizontalAlignment="center" />
      </StackLayout>
    </ScrollView>
  </GridLayout>
</template>
<script>
const {
  createTable,
  DBdelete,
  structure,
  storeUsers,
  storeModules,
} = require("../../sqlite/database");
import * as utils from "~/shared/util";
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";

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

    async getShipsWarehouses() {
      try {
        //const shipsWarehouses = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/ships');
        const shipsWarehouses = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/ships"
        );
        /* const shipsWarehouses = await axios.get(
          "http://192.168.20.38/mcp-backend/public/api/mobile/ships"
        ); */
        this.saveShipsWarehouses(shipsWarehouses);
        return shipsWarehouses;
      } catch (error) {
        /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
        console.log(error);
      }
    },

    async getUsersWsp() {
      try {
        //const shipsWarehouses = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/wsp_users');
        /*  const shipsWarehouses = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/wsp_users"
        ); */
        const users_wsp = await axios.get(
          "http://172.104.10.120/mcp-backend/public/api/mobile/wsp_users"
        );
        return users_wsp;
      } catch (error) {
        /* this.loadingCharge()
                Alert.danger("No se pudieron cargados los datos de MCP a la DB",error) */
        console.log(error);
      }
    },

    async getModulesWsp() {
      try {
        //const shipsWarehouses = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/wsp_modules');
        /*  const shipsWarehouses = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/wsp_modules"
        ); */
        const modules_wsp = await axios.get(
          "http://172.104.10.120/mcp-backend/public/api/mobile/wsp_modules"
        );
        return modules_wsp;
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
          const modules = await this.getModulesWsp();
          const users = await this.getUsersWsp();
          console.log("modules ", modules.data.data);
          console.log("users ", users.data.data);
          this.setUsers(modules.data.data);
          const db = await createTable(shipsWarehouses.data.data);
          const res = await storeUsers(users.data.data);
          const res2 = await storeModules(modules.data.data);
          console.log("resss ", res + "  " + res2);
          this.$router.pushClear("login.index");
          this.loadingCharge();
          Alert.success("Actualizacion de DB");
          //console.log(db)
        }
      } catch (error) {
        this.loadingCharge();
        Alert.danger("No se pudo actualizar la DB", error);
      }
    },

    navigate(url) {
      try {
        this.$router.pushClear(url);
        utils.closeDrawer();
        /*  const db = await structure(); */
        /* alert({
                    title:'Inicializando DB',
                    message:'Actualizando Tablas...',
                    okButtonText:"aceptar"
                }) */
        /* console.log(db); */
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
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
