<template>
  <page @loaded="index">
    <Header :search="false" />
    <GridLayout rows="auto,*" backgroundColor="#F4F6F8">
      <GridLayout margin="5" row="0" rows="auto" columns="3*, 50">
        <SearchBar
          row="0"
          col="0"
          margin="10"
          hint="Buscar..."
          v-model="search"
          @textChange="filter"
          @submit="filter"
          @clear="clear"
        />
        <Label
          row="0"
          col="1"
          margin="10"
          :text="'fa-sync-alt' | fonticon"
          class="fas text-center"
          width="40"
          color="#222a37"
          fontSize="22"
          @tap="refreshEvidenceRports"
        />
      </GridLayout>
      <Label
        row="1"
        textWrap="true"
        class="info"
        v-if="evidenceReports.length == 0"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fas" text.decode="&#x1f6e0; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        row="1"
        ref="listView"
        for="item in array_filter"
        @itemTap="onItemTap"
      >
        <v-template>
          <!-- Shows the list item label in the default color and style. -->
          <GridLayout columns="*, 40">
            <StackLayout orientation="horizontal" col="0">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-tools' | fonticon"
                class="fas nt-drawer__header-image"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth" width="75%">
                <Label
                  text="Reporte:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="18"
                />
                <Label textWrap="true">
                  <!-- Barco -->
                  <FormattedString v-if="item.type_management_id === 1">
                    <Span text="Contenedor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.nameType + '\n'" fontSize="15" />
                    <Span text="Buque: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.vessel + '\n'" fontSize="15" />
                    <Span text="Capitan: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.titular_name + '\n'" fontSize="15" />
                    <Span text="Tecnico: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.role + '\n'" fontSize="15" />
                    <Span
                      :text="'Elemntos:' + '\t\t\t\t\t'"
                      fontWeight="bold"
                      fontSize="15"
                    />
                  </FormattedString>
                  <!-- Patio -->
                  <FormattedString v-if="item.type_management_id === 2">
                    <Span text="Contenedor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.nameType + '\n'" fontSize="15" />
                    <Span text="Patio: " fontWeight="bold" fontSize="15" />
                    <Span :text="'Alieva' + '\n'" fontSize="15" />
                    <Span text="Conductor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.titular_name + '\n'" fontSize="15" />
                    <Span text="Tecnico: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.role + '\n'" fontSize="15" />
                    <Span text="Elemntos:" fontWeight="bold" fontSize="15" />
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
                  <!-- <Label
                    width="20%"
                    height="40"
                    :text="'fa-times' | fonticon"
                    class="fas text-center"
                    fontWeight="bold"
                    fontSize="15"
                    @tap="deleteRowRepair(item, repair.id)"
                  /> -->
                </StackLayout>
                <!-- <Label
                  width="50"
                  height="50"
                  marginTop="10"
                  backgroundColor="#D8E2E8"
                  :text="'fa-toolbox' | fonticon"
                  class="text-center fas"
                  fontWeight="bold"
                  fontSize="15"
                  borderRadius="50"
                  @tap="openFormDamaged(item)"
                /> -->
              </StackLayout>
            </StackLayout>
            <Label
              :text="'fa-ellipsis-v' | fonticon"
              class="fas iconOptions"
              fontSize="14"
              col="1"
              style="text-align: center"
              @tap="navigateOptions(item, index)"
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
const { getAllManagements, sendEvidenceReports } = require("~/sqlite/database");
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
    };
  },

  mixins: [mixinMasters],

  methods: {
    ...mapMutations("evidenceStore", [
      "setContainerReport",
      "setContainerReportEdit",
    ]),

    index() {
      this.getEvidenceReports();
    },

    refreshEvidenceRports() {
      this.getEvidenceReports();
    },

    filter() {
      console.log("cabronship 0", this.evidenceReports);
      console.log("search fuera", this.search);
      if (this.search.length > 0) {
        console.log("search dentro", this.search);
        this.array_filter = this.evidenceReports.filter(
          (data) =>
            !this.search || data.name.toLowerCase().includes(this.search)
        );
      } else if (this.search.length === 0) {
        console.log("search 0", this.evidenceReports);
        this.array_filter = this.evidenceReports;
      }
    },

    navigateOptions(item, index) {
      console.log("item ", item);
      item.action = true;
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: true,
          infoRegister: () => this.evidenceReportsInfo(item),
          updateRegister: () => this.evidenceReportsEdit(item),
          /* updateRegister: () => this.containerReportEdit(item),
          deleteRow: () => this.deleteRow(item.id), */
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {
            console.log(value);
          },
        },
      };
      this.$showBottomSheet(ButtomSheet, options);
    },

    async getEvidenceReports() {
      try {
        this.loadingCharge(true);
        const res = await getAllManagements();
        console.log("res ", res.data);
        this.evidenceReports = res.data;
        this.array_filter = res.data;
      } catch (error) {
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
        console.log("close modallll");
      });
    },

    async sendAll() {
      try {
        this.loadingCharge(true);
        const reports = await sendEvidenceReports();
        console.log("reportes ", reports.data);
        /* return; */
        if (reports.data.length > 0) {
          /* console.log("entre ",evidenceReports) */
          //const postPallets = await axios.post('http://186.1.181.146:8811/mcp-backend/public/api/mobile/loadpallets', this.sendPallets)
          //const postPallets = await axios.post('http://186.1.181.146:8811/mcp-testing-backend/public/api/mobile/loadpallets', this.sendPallets)
          const postEvidence = await axios.post(
            "http://172.70.9.110/mcp-backend/public/api/mobile/loadevidence",
            reports.data
          );
          console.log("dataa ", postEvidence);
          for (let i = 0; i < postEvidence.data.length; i++) {
            console.log("postEvidence ", postEvidence);
          }
          this.loadingCharge();
          Alert.success("Cargue");
        } else {
          this.loadingCharge();
          Alert.danger(
            "No se encontraron reportes",
            "por favor asegurese antes de sincronizar"
          );
        }
      } catch (error) {
        this.loadingCharge();
        Alert.danger(
          "Hubo un error en el cargue de los reportes",
          error.message
        );
      }
    },
  },
};
</script>

<style scoped></style>
