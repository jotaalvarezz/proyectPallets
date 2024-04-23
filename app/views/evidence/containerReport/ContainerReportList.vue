<template>
  <page @loaded="getEvidences">
    <ActionBar backgroundColor="#00acc1">
      <Label
        class="text-center"
        text="Reporte de Contenedores"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      />
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="goBack"
      />
    </ActionBar>
    <GridLayout
      height="65"
      rows="*"
      columns="50, 3*, 50"
      backgroundColor="#00acc1"
    >
      <Label
        row="0"
        col="0"
        :text="'fa-arrow-left' | fonticon"
        fontSize="16"
        class="fas text-center"
        color="#F4F6F8"
        @tap="$modal.close"
      />
      <Label
        row="0"
        col="1"
        class="text-center"
        text="Registro de Daños/Reparaciones"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout>
    <GridLayout rows="auto,*" backgroundColor="#F4F6F8">
      <GridLayout margin="5" row="0" rows="auto" columns="50, 3*, 50">
        <SearchBar
          row="0"
          col="1"
          margin="10"
          hint="Buscar..."
          v-model="search"
          @textChange="filter"
          @submit="filter"
          @clear="clear"
        />
        <Label
          row="0"
          col="2"
          margin="10"
          :text="'fa-sync-alt' | fonticon"
          class="fas text-center"
          width="40"
          color="#222a37"
          fontSize="22"
          @tap="refreshEvidences"
        />
      </GridLayout>
      <Label
        row="1"
        textWrap="true"
        class="info"
        v-if="container_reports.length == 0"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fas" text.decode="&#x1f6e0; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <!-- Lista de reportes -->
      <ListView
        row="1"
        ref="listView"
        for="(item, index) in array_filter"
        v-if="container_reports.length > 0"
      >
        <v-template>
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
                  <FormattedString
                    v-if="managementModel.type_management_id === 1"
                  >
                    <Span text="Contenedor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                    <Span :text="nameType(item.type_id) + '\n'" fontSize="15" />
                    <Span text="Buque: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.vessel + '\n'" fontSize="15" />
                    <Span text="Tecnico: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.role + '\n'" fontSize="15" />
                    <Span
                      :text="'Elemntos:' + '\t\t\t\t\t'"
                      fontWeight="bold"
                      fontSize="15"
                    />
                  </FormattedString>
                  <!-- Patio -->
                  <FormattedString
                    v-if="managementModel.type_management_id === 2"
                  >
                    <Span text="Contenedor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                    <Span :text="nameType(item.type_id) + '\n'" fontSize="15" />
                    <Span text="Patio: " fontWeight="bold" fontSize="15" />
                    <Span :text="'Alieva' + '\n'" fontSize="15" />
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
                  <Label
                    width="20%"
                    height="40"
                    :text="'fa-times' | fonticon"
                    class="fas text-center"
                    fontWeight="bold"
                    fontSize="15"
                    @tap="deleteRowRepair(item, repair.id)"
                  />
                </StackLayout>
                <Label
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
                />
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
      <FloatingButton row="1" :icon="'fa-plus'" :method="openModal" />
    </GridLayout>
  </page>
</template>

<script>
const {
  getContainerReport,
  getTypes,
  deleteContainerReport,
  deleteRepair,
  getRepairDamage,
  getRepairs,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import ListModal from "~/components/listModal/ListModal.vue";
import containerReportListInfo from "~/views/evidence/containerReport/ContainerReportListInfo";
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";

export default {
  name: "containerReportList",
  components: {
    ButtomSheet,
  },
  data() {
    return {
      search: "",
      message: "No hay reportes de contenedores para mostrar",
      container_reports: [],
      types: [],
      array_filter: [],
      state: true,
    };
  },
  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel"]),
  },

  methods: {
    ...mapMutations("evidenceStore", [
      "setContainerReport",
      "setContainerReportEdit",
    ]),

    filter() {
      console.log("container report ", this.container_reports);
      console.log("search fuera", this.search);
      if (this.search.length > 0) {
        console.log("search dentro", this.search);
        this.array_filter = this.container_reports.filter(
          (data) =>
            !this.search || data.code.toLowerCase().includes(this.search)
        );
      } else if (this.search.length === 0) {
        this.array_filter = this.container_reports;
      }
    },

    clear() {
      this.array_filter = this.container_reports;
    },

    openModal() {
      this.$showModal(ContainerReport, {
        fullscreen: true,
        animated: true,
      }).then(() => {
        console.log("list");
        this.getEvidences();
      });
    },

    openFormDamaged(item) {
      console.log("item ", item);
      this.$showModal(DamagedItems, {
        fullscreen: true,
        animated: true,
        cancelable: false,
        props: {
          container_report_id: item.id,
          /* container_elements: this.elements,
          repairs: this.model.repairs, */
        },
      }).then((res) => {
        console.log("console damage");
      });
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
          infoRegister: () => this.containerReportInfo(item),
          updateRegister: () => this.containerReportEdit(item),
          deleteRow: () => this.deleteRow(item.id),
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

    async getEvidences() {
      console.log("management model ", this.managementModel);
      try {
        this.loadingCharge(true);
        const res = await getContainerReport(this.managementModel.id);
        this.container_reports = res.data;
        this.array_filter = res.data;
        console.log("reports ", this.container_reports);
        /* const aux = await getRepairDamage()
        console.log("aux ", aux.data);
        const r = await getRepairs()
        console.log("r ", r.data); */
        if (this.types.length === 0) {
          const types = await getTypes();
          this.types = types.data;
        }
      } catch (error) {
        Alert.danger("Hubo un error al traer informacion", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    async deleteRowRepair(item, id) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteRepair(id);
          if (record.status === 500) {
            Alert.info(record.message, 1, "Registro no existe!");
          } else {
            const index_report = this.container_reports.findIndex(
              (prev) => prev.id === item.id
            );
            const index = this.container_reports[
              index_report
            ].repairs.findIndex((prev) => prev.id === id);
            this.container_reports[index_report].repairs.splice(index, 1);
          }
        } catch (error) {
          Alert.danger("eleminacion fallida ", error.message);
        }
      }
    },

    async deleteRow(id) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteContainerReport(id);
          console.log("record ", record);
          const index = this.container_reports.findIndex(
            (prev) => prev.id === id
          );
          this.container_reports.splice(index, 1);
        } catch (error) {
          Alert.danger("eleminacion fallida ", error.message);
        }
      }
    },

    containerReportEdit(item) {
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

    containerReportInfo(item) {
      let listRows = containerReportListInfo.listRowsContainerReport;
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

    refreshEvidences() {
      this.getEvidences();
    },

    nameType(type_id) {
      const type = this.types.find((prev) => prev.id === type_id);
      if (type === null || type === undefined) {
        return type_id;
      }
      return type.name;
    },

    /* async InfoSelect() {
      try {
        this.loadingCharge(true);
        const types = await getTypes();
        this.types = types.data;
      } catch (error) {
        Alert.danger("Hubo un error al traer los tipos", error.message);
      } finally {
        this.loadingCharge();
      }
    }, */
  },
};
</script>

<style scoped>
.info {
  font-size: 16;
  horizontal-align: center;
  vertical-align: center;
}
</style>
