<template>
  <page @loaded="index">
    <Header :search="false" />
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
          <Span class="fas" text.decode="&#x1f6e0; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        v-if="array_filter.length > 0"
        row="1"
        ref="listView"
        for="item in array_filter"
      >
        <v-template>
          <!-- Shows the list item label in the default color and style. -->
          <GridLayout columns="*, 50">
            <StackLayout>
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-tools' | fonticon"
                class="fas text-center"
                padding="20"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout orientation="horizontal" col="0">
                <StackLayout class="heigth" width="75%">
                  <Label
                    text="Reporte:"
                    class="subTittle"
                    textWrap="true"
                    width="auto"
                    fontSize="18"
                  />
                  <Label textWrap="true">
                    <!-- Barco -->
                    <FormattedString>
                      <Span
                        text="Contenedor: "
                        fontWeight="bold"
                        fontSize="15"
                      />
                      <Span :text="item.code + '\n'" fontSize="15" />
                      <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                      <Span :text="item.nameType + '\n'" fontSize="15" />
                      <Span :text="item.type_management_id === 1 ? 'Buque: ': 'Nombre de Gestion: '" fontWeight="bold" fontSize="15" />
                      <Span :text="item.vessel + '\n'" fontSize="15" />
                      <Span v-if="item.type_management_id === 2" text="Patio: " fontWeight="bold" fontSize="15" />
                      <Span v-if="item.type_management_id === 2" :text="'Alieva' + '\n'" fontSize="15" />
                      <Span :text="item.type_management_id === 1 ? 'Capitan: ' : 'Conductor: '" fontWeight="bold" fontSize="15" />
                      <Span :text="item.titular_name + '\n'" fontSize="15" />
                      <Span text="Tecnico: " fontWeight="bold" fontSize="15" />
                      <Span :text="item.role + '\n'" fontSize="15" />
                      <Span
                        :text="'Elemntos:' + '\t\t\t\t\t'"
                        fontWeight="bold"
                        fontSize="15"
                      />
                    </FormattedString>
                  </Label>
                  <StackLayout
                    orientation="horizontal"
                    v-for="(repair, index) in item.repairs"
                    :key="index"
                    style="padding: 0px 5px 5px 8px"
                  >
                    <Tag
                      width="80%"
                      :label="repair.name"
                      :items="repair.repair_damage"
                      labelIterator="name"
                    />
                  </StackLayout>
                </StackLayout>
              </StackLayout>
            </StackLayout>
            <ButtonNavigate
              col="1"
              height="50"
              width="50"
              icon="fa-ellipsis-v"
              radius="50"
              :handleEvent="() => navigateOptions(item, index)"
            />
          </GridLayout>
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
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import ListModal from "~/components/listModal/ListModal.vue";
import EvidenceListInfo from "./EvidenceListInfo";
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import Alert from "~/alerts/Alerts";
import axios from "axios";

export default {
  name: "EvidenceList",
  data() {
    return {
      search: "",
      message: "No hay registros para mostrar",
      evidenceReports: [],
      array_filter: [],
      type_management:{}
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapMutations("evidenceStore", [
      "setContainerReport",
      "setContainerReportEdit",
    ]),

    index() {
      setTimeout(() => {
        this.getEvidenceReports();
        this.$refs.searchBar.nativeView.dismissSoftInput();
      }, 300)
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

    navigateOptions(item, index) {
      item.action = true;
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: item.status === 1 ? true : false,
          infoRegister: () => this.evidenceReportsInfo(item),
          updateRegister: () => this.evidenceReportsEdit(item),
          deleteRow: () => this.deleteRow(item.id),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {},
        },
      };
      this.$showBottomSheet(ButtomSheet, options);
    },

    async typeManagement(){
      try {
        this.loadingCharge(true);
        const res = await showTypesManagement(this.managementModel.type_management_id)
        this.type_management = res.data
      } catch (error) {
        Alert.danger("Hubo un error al traer los tipos de gestion", error.message);
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
      let listRows = [];
      if (item.type_management_id === 1) {
        listRows = EvidenceListInfo.listRowsVeesel;
      } else if (item.type_management_id === 2) {
        listRows = EvidenceListInfo.listRowsPatio;
      }
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
    },

    evidenceReportsEdit(item) {
      this.setContainerReport(item);
      this.setContainerReportEdit(true);
      this.$showModal(ContainerReport, {
        fullscreen: true,
        animated: true,
      }).then(() => {
        this.setContainerReport({});
        this.setContainerReportEdit(false);
        this.getEvidenceReports();
      });
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
        this.loadingCharge(true);
        const reports = await sendEvidenceReports();
        if (reports.data.length > 0) {
          /* validar si ya las gestiones estan finalizadas */
          for (let i = 0; i < reports.managementsStatus.length; i++) {
            if(reports.managementsStatus[i].status){
              Alert.info(
                `La operacion en `+
                reports.managementsStatus[i].name+
                ` aun no esta finalizada.`+
                `\n\n* Finalice las operaciones antes de sincronizar`,
                1,
                `Sin Finalizar`
              );
              return;
            }
          }
          const postEvidence = await axios.post(process.env.VUE_APP_API_URL+'/loadevidence', reports.data)
          Alert.success("Reportes sincronizados...");
        } else {
          Alert.danger(
            "No se encontraron reportes",
            "por favor asegurese antes de sincronizar"
          );
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
</style>
