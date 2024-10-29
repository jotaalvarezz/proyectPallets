<template>
  <page @loaded="initialFunction" actionBarHidden="false">
    <ActionBar backgroundColor="#00acc1" padding="0">
      <HeaderComponent title="Reportes/Evidencias" :handleback="navigateBack" />
    </ActionBar>
    <GridLayout rows="auto,*" backgroundColor="#F4F6F8">
      <GridLayout margin="5" row="0" rows="auto" columns="*, 70">
        <SearchBar
          height="50"
          ref="mySearchBar"
          row="0"
          col="0"
          class="search-bar"
          margin="10"
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
          :handleEvent="() => refreshEvidences()"
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
      <!-- Lista de reportes -->
      <ListView
        row="1"
        ref="listView"
        for="(item, index) in array_filter"
        v-if="array_filter.length > 0"
      >
        <v-template>
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
                    <FormattedString
                      v-if="managementModel.type_management_id === 1"
                    >
                      <Span
                        text="Contenedor: "
                        fontWeight="bold"
                        fontSize="15"
                      />
                      <Span :text="item.code + '\n'" fontSize="15" />
                      <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                      <Span
                        :text="nameType(item.type_id) + '\n'"
                        fontSize="15"
                      />
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
                      <Span
                        text="Contenedor: "
                        fontWeight="bold"
                        fontSize="15"
                      />
                      <Span :text="item.code + '\n'" fontSize="15" />
                      <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                      <Span
                        :text="nameType(item.type_id) + '\n'"
                        fontSize="15"
                      />
                      <Span text="Patio: " fontWeight="bold" fontSize="15" />
                      <Span :text="'Alieva' + '\n'" fontSize="15" />
                      <Span text="Tecnico: " fontWeight="bold" fontSize="15" />
                      <Span :text="item.role + '\n'" fontSize="15" />
                      <Span text="Estructura:" fontWeight="bold" fontSize="15" />
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
                    <ButtonNavigate
                      :isEnabled="type_management.status === 1 ? true : false"
                      height="45"
                      width="45"
                      icon="fa-minus"
                      :size='12'
                      iconColor="#e92222"
                      radius="50"
                      :handleEvent="() => deleteRowRepair(item, repair.id)"
                    />
                  </StackLayout>
                  <ButtonNavigate
                    :isEnabled="type_management.status === 1 ? true : false"
                    height="60"
                    width="60"
                    icon="fa-toolbox"
                    iconColor="#f4f6f8"
                    iconBackground="#eab14d"
                    radius="50"
                    :handleEvent="() => openFormDamaged(item)"
                  />
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
      <FloatingButton :isEnabled="type_management.status === 1 ? true : false" row="1" :icon="'fa-plus'" :method="openModal" />
    </GridLayout>
  </page>
</template>

<script>
const {
  getContainerReport,
  getTypes,
  deleteContainerReport,
  deleteRepair,
  showTypesManagement,
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
      type_management: {},
    };
  },
  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel", "containerReport"]),
    ...mapState("managementStore", ["close"]),
  },

  methods: {
    ...mapMutations("evidenceStore", [
      "setContainerReport",
      "setContainerReportEdit",
    ]),

    initialFunction(){
      this.getEvidences()
      this.typeManagement()
    },

    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.container_reports.filter(
          (data) =>
            !this.search || data.code.toLowerCase().includes(this.search.toLowerCase())
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
        this.getEvidences();
      });
    },

    openFormDamaged(item) {
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
        this.getEvidences();
      });
    },

    navigateOptions(item, index) {
      item.action = true;
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: this.type_management.status === 1 ? true : false,
          infoRegister: () => this.containerReportInfo(item),
          updateRegister: () => this.containerReportEdit(item),
          deleteRow: () => this.deleteRow(item.id),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {},
        },
      };
      this.$showBottomSheet(ButtomSheet, options);
    },

    navigateBack() {
      /* this.$router.push("container_report.index"); */
      this.$router.back();
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

    async getEvidences() {
      try {
        this.loadingCharge(true);
        const res = await getContainerReport(this.managementModel.id);
        this.container_reports = res.data;
        this.array_filter = res.data;
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
      let confirmated = await Alert.info("Se removera la reparacion...!",3,"Quitar");
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
        this.getEvidences();
      });
    },

    containerReportInfo(item) {
      let listRows = containerReportListInfo.listRowsContainerReport;
      this.$showModal(ListModal, {
        animated: true,
        stretched: false,
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

.animated {
  /* background-color: #d8e2e8; */
  border-radius: 60px;
}

.search-bar {
  font-size: 15; /* Cambia el tamaño del texto aquí */
}
</style>
