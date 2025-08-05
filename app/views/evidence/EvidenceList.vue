<template>
  <page @loaded="index">
    <ActionBar backgroundColor="#00acc1" padding="0">
      <HeaderComponent title="Sincronizar Reportes/Evidencias" :handleback="openDrawer" />
    </ActionBar>
    <GridLayout rows="auto,*" backgroundColor="#F4F6F8">
      <GridLayout margin="5" row="0" rows="*" columns="*, 70">
        <SearchBar
          ref="searchBar"
          row="0"
          col="0"
          height="50"
          margin="10"
          class="search-bar"
          hint="Buscar..."
          v-model="search"
          @loaded="focus"
          @textChange="filter"
          @submit="filter"
          @clear="clear"
        />
        <ButtonNavigate
          row="0"
          col="1"
          height="60"
          width="60"
          icon="fa-sync-alt"
          size="22"
          radius="50"
          :rotate="360"
          :handleEvent="() => refreshEvidenceRports()"
        />
      </GridLayout>
      <Label
        row="1"
        textWrap="true"
        class="info"
        v-if="array_filter.length == 0"
        verticalAlignment="center"
      >
        <FormattedString>
          <!-- <Span class="fas" text.decode="&#x1f6e0; " /> -->
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        v-if="array_filter.length > 0"
        row="1"
        ref="listView"
        separatorColor="transparent"
        for="item in array_filter"
      >
        <v-template>
          <card-view
            backgroundColor="white"
            margin="10 15 5 15"
            radius="24"
            elevation="3"
          >
            <GridLayout columns="*" padding="15">
              <StackLayout>
                <!-- Header section with icon and main info -->
                <GridLayout columns="100, *, 70" marginBottom="15">
                  <!-- Icon -->
                  <StackLayout col="0" horizontalAlignment="center">
                    <Label
                      backgroundColor="#D8E2E8"
                      :text="'fa-tools' | fonticon"
                      class="fas text-center"
                      padding="15"
                      fontSize="45"
                      color="#EAB14D"
                      borderRadius="8"
                    />
                  </StackLayout>

                  <!-- Main container info -->
                  <StackLayout col="1" marginLeft="12">
                    <Label
                      text="Reporte de Contenedor"
                      fontSize="16"
                      fontWeight="bold"
                      color="#333"
                      marginBottom="4"
                    />
                    <Label
                      :text="(item.prefix || '') + (item.code || 'Sin código')"
                      fontSize="18"
                      fontWeight="bold"
                      color="#00acc1"
                      marginBottom="2"
                    />
                    <Label
                      :text="'Tipo: ' + (item.nameType || 'No especificado')"
                      fontSize="14"
                      color="#666"
                    />
                  </StackLayout>

                  <!-- Options button -->
                  <ButtonNavigate
                    col="2"
                    height="50"
                    width="50"
                    icon="fa-eye"
                    radius="50"
                    class="options-button"
                    :handleEvent="() => navigateOptions(item, index)"
                  />
                </GridLayout>

                <!-- Details section -->
                <GridLayout
                  columns="*, *"
                  backgroundColor="#F4F6F8"
                  padding="12"
                  borderRadius="8"
                  marginBottom="12"
                >
                  <!-- Left column -->
                  <StackLayout col="0">
                    <Label
                      :text="
                        item.type_management_id === 1 ? 'Buque:' : 'Gestión:'
                      "
                      fontSize="14"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      :text="item.vessel || 'No especificado'"
                      fontSize="13"
                      color="#333"
                      textWrap="true"
                      marginBottom="8"
                    />

                    <Label
                      v-if="item.type_management_id === 1"
                      text="Viaje:"
                      fontSize="14"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      v-if="item.type_management_id === 1"
                      :text="item.journey || 'No especificado'"
                      fontSize="13"
                      color="#333"
                      textWrap="true"
                      marginBottom="8"
                    />

                    <Label
                      v-if="item.type_management_id === 2"
                      text="Patio:"
                      fontSize="14"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      v-if="item.type_management_id === 2"
                      text="Alieva"
                      fontSize="13"
                      color="#333"
                      marginBottom="8"
                    />
                  </StackLayout>

                  <!-- Right column -->
                  <StackLayout col="1" marginLeft="8">
                    <Label
                      :text="
                        item.type_management_id === 1 ? 'Capitán:' : 'Titular:'
                      "
                      fontSize="14"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      :text="item.titular_name || 'No especificado'"
                      fontSize="13"
                      color="#333"
                      textWrap="true"
                      marginBottom="8"
                    />

                    <Label
                      text="Técnico:"
                      fontSize="14"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      :text="item.role || 'No asignado'"
                      fontSize="13"
                      color="#333"
                      textWrap="true"
                    />
                  </StackLayout>
                </GridLayout>

                <!-- Elements section -->
                <StackLayout
                  v-if="item.repairs && item.repairs.length > 0"
                  backgroundColor="#F4F6F8"
                  padding="12"
                  borderRadius="8"
                >
                  <Tag
                    label="Elementos Dañados"
                    :items="item.repairs"
                    labelIterator="name"
                    labelColor="#333"
                  />
                </StackLayout>

                <!-- No elements message -->
                <StackLayout v-else>
                  <Label
                    text="Sin elementos dañados registrados"
                    fontSize="13"
                    color="#999"
                    fontStyle="italic"
                    textAlignment="center"
                    padding="8"
                  />
                </StackLayout>
              </StackLayout>
            </GridLayout>
          </card-view>
        </v-template>
      </ListView>
      <FloatingButton row="2" :icon="'fa-cloud-upload-alt'" :method="sendAll" />
    </GridLayout>
  </page>
</template>

<script>
import { ImageSource, knownFolders, path, Folder } from "@nativescript/core";
const {
  getAllManagements,
  sendEvidenceReports,
  deleteContainerReport,
  showTypesManagement,
} = require("~/sqlite/database");
import { mapState, mapMutations } from "vuex";
import mixinMasters from "~/mixins/Master";
import ListModal from "~/components/listModal/ListModal.vue";
import EvidenceListInfo from "./EvidenceListInfo";
import Alert from "~/alerts/Alerts";
import axios from "axios";
import { onSearchBarLoaded } from "~/shared/helpers";
import * as util from "~/shared/util";

export default {
  name: "EvidenceList",
  data() {
    return {
      search: "",
      message: "No hay registros para mostrar",
      evidenceReports: [],
      array_filter: [],
      type_management: {},
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("managementStore", ["close", "type", "StoreTypeManagementId"]),
  },

  methods: {
    ...mapMutations("evidenceStore", [
      "setContainerReport",
      "setContainerReportEdit",
    ]),

    index() {
      //this.$refs.searchBar.nativeView.dismissSoftInput();
      this.setContainerReport({});
      this.setContainerReportEdit(false);
      this.loadingCharge(true);
      setTimeout(() => {
        this.getEvidenceReports();
      }, 0);
      this.loadingCharge();
    },

    refreshEvidenceRports() {
      this.getEvidenceReports();
    },

    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.evidenceReports.filter(
          (data) =>
            !this.search ||
            data.code.toLowerCase().includes(this.search.toLowerCase())
        );
      } else if (this.search.length === 0) {
        this.array_filter = this.evidenceReports;
      }
    },

    openDrawer() {
      util.showDrawer();
    },

    navigateOptions(item, index) {
      this.evidenceReportsInfo(item);
    },

    async typeManagement() {
      try {
        this.loadingCharge(true);
        const res = await showTypesManagement(
          this.managementModel.type_management_id
        );
        this.type_management = res.data;
      } catch (error) {
        Alert.danger(
          "Hubo un error al traer los tipos de gestion",
          error.message
        );
      } finally {
        this.loadingCharge();
      }
    },

    async getEvidenceReports() {
      try {
        this.loadingCharge(true);
        const res = await getAllManagements();
        this.evidenceReports = res.data;
        this.array_filter = res.data;
      } catch (error) {
        Alert.danger("Hubo un error al traer los reportes", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    evidenceReportsInfo(item) {
      this.loadingCharge(true);
      let listRows = [];
      if (item.type_management_id === 1) {
        listRows = EvidenceListInfo.listRowsVeesel;
      } else if (item.type_management_id === 2) {
        listRows = EvidenceListInfo.listRowsPatio;
      }
      setTimeout(() => {
        this.$showModal(ListModal, {
          fullscreen: true,
          animated: true,
          props: {
            title: "Informacion del reporte",
            info: item,
            listRows: listRows,
            showTags: "additionalDamage",
            iteratorTags: "name",
            showMulTags: "repairs",
            propsGeneralComponent: {
              labelTag: "name",
              itemsKey: "repair_damage",
              labelIterator: "name",
              titleCollapse: "Visualizar Evidencia",
              labelViewImage: "Foto",
              viewImageKey: "photo",
            },
          },
        });
      }, 5);
      this.loadingCharge();
    },

    evidenceReportsEdit(item) {
      this.setContainerReport(item);
      this.setContainerReportEdit(true);
      if (item.type_management_id === 2) {
        this.$router.push("reportinyard.create");
      } else {
        this.$router.push("reportship.create");
      }
    },

    async deleteRow(id) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteContainerReport(id);
          const index = this.evidenceReports.findIndex(
            (prev) => prev.id === id
          );
          this.evidenceReports.splice(index, 1);
        } catch (error) {
          Alert.danger("eleminacion fallida ", error.message);
        }
      }
    },

    async sendAll() {
      try {
        let confirmated = await Alert.info(
          "¿Desea sincronizar la informacion?",
          3,
          "Sincronizar"
        );
        if (confirmated) {
          const reports = await sendEvidenceReports();
          if (reports.data.length > 0) {
            //validar si ya las gestiones estan finalizadas
            for (let i = 0; i < reports.managementsStatus.length; i++) {
              if (reports.managementsStatus[i].status === 0) {
                Alert.info(
                  `La operacion en ` +
                    reports.managementsStatus[i].name +
                    ` aun no esta finalizada.` +
                    `\n\n* Finalice las operaciones antes de sincronizar`,
                  1,
                  `Sin Finalizar`
                );
                return;
              }
            }
            this.loadingCharge(true);
            const postEvidence = await axios.post(
              process.env.VUE_APP_API_URL + "/loadevidence",
              reports.data
            );
            Alert.success("Reportes sincronizados...");
          } else {
            Alert.danger(
              "No se encontraron reportes",
              "por favor asegurese antes de sincronizar"
            );
          }
        }
      } catch (error) {
        Alert.danger(
          "Hubo un error en el cargue de los reportes",
          error.message
        );
      } finally {
        this.loadingCharge();
      }
    },
    //evento para quitarle foco al searhBar cuando se carga la vista
    focus(event) {
      onSearchBarLoaded(event);
    },
  },
};
</script>

<style scoped>
.animated {
  background-color: #d8e2e8;
  border-radius: 60px;
}

.search-bar {
  font-size: 15; /* Cambia el tamaño del texto aquí */
}

.options-button {
  background: linear-gradient(135deg, #e8f0f3 0%, #f4f6f8 40%, #d8e2e8 100%);
  color: #666;
  transition: all 0.2s ease;
}

.options-button:active {
  background: #c8d4da;
  transform: scale(0.95);
}
</style>
