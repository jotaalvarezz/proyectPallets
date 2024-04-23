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
        <GridLayout
          id="2"
          columns="40,*"
          class="nt-drawer__list-item"
          :class="isHovered && itemSelector == 2 ? 'hovered' : ''"
          @touch="onTouch(2)"
          @tap="pallets"
        >
          <Label
            col="0"
            :text="'fa-pallet' | fonticon"
            class="fas"
            color="#0096b7"
            fontSize="22"
          />
          <Label
            col="1"
            text="Pallets"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
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
        <GridLayout
          id="3"
          columns="40,*"
          class="nt-drawer__list-item"
          @tap="signature"
          :class="isHovered && itemSelector == 4 ? 'hovered' : ''"
          @touch="onTouch(4)"
        >
          <Label
            col="0"
            :text="'fa-file-signature' | fonticon"
            class="fas colorIcons"
            fontSize="22"
          />
          <Label
            col="1"
            text="Reportes/Evidencias"
            textWrap="true"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <GridLayout
          id="3"
          columns="40,*"
          class="nt-drawer__list-item"
          :class="isHovered && itemSelector == 5 ? 'hovered' : ''"
          @tap="EvidenceList"
          @touch="onTouch(5)"
        >
          <Label
            col="0"
            :text="'fa-file-upload' | fonticon"
            class="fas colorIcons"
            fontSize="22"
          />
          <Label
            col="1"
            text="Sincronozar Evidencias"
            textWrap="true"
            fontSize="14"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <!-- <GridLayout columns="auto,*" class="nt-drawer__list-item" @tap="showProgressDialog">
                    <Label col="0" :text="'fa-trash-alt' | fonticon" class="fas colorIcons" fontSize="18" />
                    <Label col="1" text="Prueba" fontSize="15" class="p-l-10 colorIcons" />
                </GridLayout> -->
      </StackLayout>
    </ScrollView>
  </GridLayout>
</template>
<script>
const { createTable, DBdelete, structure, storeUsers } = require("../../sqlite/database");
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
  },

  mixins: [mixinMasters],

  methods: {
    ...mapMutations(["saveShipsWarehouses", "indicatorState"]),
    ...mapMutations("auth",["setUsers", "setModules"]),

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

    async getModulesWsp() {
      try {
        //const shipsWarehouses = await axios.get('http://186.1.181.146:8811/mcp-backend/public/api/mobile/ships');
        /*  const shipsWarehouses = await axios.get(
          "http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/ships"
        ); */
        const modules_wsp = await axios.get(
          "http://172.70.9.110/mcp-backend/public/api/mobile/wsp_modules",
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
          const modules = await this.getModulesWsp()
          console.log("modules ", modules.data.data)
          this.setUsers(modules.data.data)
          const db = await createTable(shipsWarehouses.data.data);
          const users = await storeUsers(modules.data.data)
          console.log("users ", users)
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

    home() {
      try {
        this.$router.pushClear("ship.index");
        utils.closeDrawer();
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
      }
    },

    async pallets() {
      try {
        this.$router.pushClear("generalpallets.index");
        utils.closeDrawer();
         const db = await structure()
        /* alert({
                    title:'Inicializando DB',
                    message:'Actualizando Tablas...',
                    okButtonText:"aceptar"
                }) */
        console.log(db)
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
      }
    },

    signature() {
      try {
        this.$router.pushClear("evidence.index");
        utils.closeDrawer();
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
      }
    },

    EvidenceList() {
      try {
        this.$router.pushClear("evidence_list.show");
        utils.closeDrawer();
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
      }
    },
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
