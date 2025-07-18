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
          :handleEvent="() => refreshEvidences()"
        />
      </GridLayout>
      <Label
        row="2"
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
        v-if="array_filter.length > 0"
        row="2"
        ref="listView"
        separatorColor="transparent"
        for="item in array_filter"
      >
        <v-template>
          <!-- Card container with shadow effect -->
          <card-view
            backgroundColor="white"
            margin="10 15 5 15"
            radius="24"
            elevation="3"
            ripple="true"
          >
            <GridLayout
              columns="*"
              padding="15"
            >
              <StackLayout>
                <!-- Header section with icon and main info -->
                <GridLayout columns="90, *, 50" marginBottom="15">
                  <!-- Icon -->
                  <StackLayout col="0" horizontalAlignment="left">
                    <Label
                      backgroundColor="#D8E2E8"
                      :text="'fa-tools' | fonticon"
                      class="fas text-center"
                      padding="5"
                      fontSize="60"
                      color="#EAB14D"
                      borderRadius="8"
                      marginTop="4"
                    />
                  </StackLayout>

                  <!-- Main container info -->
                  <StackLayout col="1" marginLeft="12">
                    <Label
                      text="Reporte de Contenedor"
                      class="subTittle"
                      fontSize="16"
                      fontWeight="bold"
                      color="#333"
                      marginBottom="2"
                    />
                    <Label
                      :text="(item.prefix || '') + (item.code || 'Sin código')"
                      fontSize="20"
                      fontWeight="bold"
                      color="#00acc1"
                      marginBottom="1"
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
                    height="40"
                    width="40"
                    icon="fa-ellipsis-v"
                    radius="20"
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
                      text="Ubicación:"
                      fontSize="14"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      v-if="item.type_management_id === 1"
                      :text="item.journey || 'No especificada'"
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
                  marginBottom="12"
                >
                  <Tag
                    label="Elementos Dañados"
                    :items="item.repairs"
                    labelIterator="name"
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
      <FloatingButton
        :isEnabled="type_management.status === 0 ? true : false"
        row="2"
        :opacity="type_management.status === 0 ? 1 : 0.5"
        :icon="'fa-plus'"
        :method="openModal"
      />
      <FloatingButton
        v-if="type === true"
        marginBottom="100"
        row="2"
        :opacity="type_management.status === 0 ? 1 : 0.5"
        :icon="type_management.status === 0 ? 'fa-lock-open' : 'fa-lock'"
        :method="finish"
      />
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
  getReportingManagementShip,
  finishOperations,
  getRepairDamage,
  getRepairs,
} = require("~/sqlite/database");
const { getAllManagementsYard } = require("~/sqlite/queries/management");
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import ListModal from "~/components/listModal/ListModal.vue";
import containerReportListInfo from "~/views/evidence/containerReport/ContainerReportListInfo";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import { onSearchBarLoaded } from "~/shared/helpers";
import { Toasty } from "@triniwiz/nativescript-toasty";

export default {
  name: "containerReportList",
  components: {
    ButtomSheet,
  },
  data() {
    return {
      status: true,
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
    ...mapState("managementStore", ["close", "type", "StoreTypeManagementId"]),
  },

  methods: {
    ...mapMutations("evidenceStore", [
      "setContainerReport",
      "setContainerReportEdit",
    ]),

    initialFunction() {
      this.setContainerReport({});
      this.setContainerReportEdit(false);
      this.getEvidences();
      this.typeManagement();
    },

    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.container_reports.filter(
          (data) =>
            !this.search ||
            data.code.toLowerCase().includes(this.search.toLowerCase())
        );
      } else if (this.search.length === 0) {
        this.array_filter = this.container_reports;
      }
    },

    clear() {
      this.array_filter = this.container_reports;
    },

    openModal() {
      if (this.type) {
        this.$router.push("reportinyard.create");
      } else {
        this.$router.push("reportship.create");
      }
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
          generalOptions: this.type_management.status === 0 ? true : false,
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

    async finish() {
      try {
        if (this.type_management.status === 1) {
          new Toasty({ text: "La operacion ya esta finalizada" }).show();
          return;
        }
        let confirmated = await Alert.info(
          "Al finalizar la operacion no podra realizar mas cambios.",
          3,
          "Finalizar Operacion"
        );
        if (confirmated) {
          const res = await finishOperations(this.StoreTypeManagementId);
          if (res.status === 400) {
            Alert.info(res.message, 1, res.error);
            return;
          }

          this.type_management.status = res.data.status;
          new Toasty({
            text: "Operacion " + res.data.name + " Finalizada",
          }).show();
          return;
        }
      } catch (error) {
        Alert.danger(
          "¡Hubo un error al finalizar la operacion!",
          error.message
        );
      }
    },

    async typeManagement() {
      try {
        this.loadingCharge(true);
        const res = await showTypesManagement(this.StoreTypeManagementId);
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

    getEvidences() {
      if (this.type) {
        this.yardEvidence();
      } else {
        this.shipEvidence();
      }
    },

    async shipEvidence() {
      try {
        this.loadingCharge(true);
        const res = await getReportingManagementShip(this.managementModel.id);
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

    async yardEvidence() {
      try {
        this.loadingCharge(true);
        const res = await getAllManagementsYard(this.StoreTypeManagementId);
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
      let confirmated = await Alert.info(
        "Se removera la reparacion...!",
        3,
        "Quitar"
      );
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
      if (this.type) {
        this.$router.push("reportinyard.create");
      } else {
        this.$router.push("reportship.create");
      }
    },

    containerReportInfo(item) {
      let listRows = [];
      if (!this.type) {
        listRows = containerReportListInfo.listRowsVeesel;
      } else {
        listRows = containerReportListInfo.listRowsPatio;
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
            itemsKey: "damage_id",
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

    //evento para quitarle foco al searhBar cuando se carga la vista
    focus(event) {
      onSearchBarLoaded(event);
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
