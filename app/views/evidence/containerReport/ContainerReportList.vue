<template>
  <page @loaded="getEvidences">
    <ActionBar backgroundColor="#00acc1">
      <StackLayout orientation="horizontal">
        <Image
          src="res://icon"
          width="40"
          height="40"
          verticalAlignment="center"
        />
        <Label
          text="Reporte de Contenedores"
          fontSize="12"
          color="#F4F6F8"
          fontWeight="bold"
          verticalAlignment="center"
        />
      </StackLayout>
    </ActionBar>
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
                :text="'fa-tools' | fonticon"
                class="fas"
                width="16%"
                fontSize="70"
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
                    <Span text="Elemntos:" fontWeight="bold" fontSize="15" />
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
                  v-for="(repair, index) in item.repairs"
                  :key="index"
                  style="padding: 0px 5px 5px 8px"
                >
                  <Tag
                    :label="repair.name"
                    :items="repair.repair_damage"
                    labelIterator="name"
                  />
                  <!-- <Switch width="50" v-model="repair.state" horizontalAlignment="right"/> -->
                </StackLayout>
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
  getRepairDamage,
  getRepairs,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { mapState } from "vuex";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import ListModal from "~/components/listModal/ListModal.vue";
import containerReportListInfo from "~/views/evidence/containerReport/ContainerReportListInfo";
import ContainerReport from "~/views/evidence/containerReport/ContainerReport.vue";

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
    filter() {
      console.log("container report ", this.container_reports);
      console.log("search fuera", this.search);
      if (this.search.length > 0) {
        console.log("search dentro", this.search);
        this.array_filter = this.container_reports.filter(
          (data) =>
            !this.search || data.code.toLowerCase().includes(this.search)
        );
      } else if (this.search === 0) {
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
      this.$showModal(ContainerReport, {
        fullscreen: true,
        props: { info: item, action: true },
      }).then((res) => {
        console.log("respuesta ", res);
        this.$emit("someEvent", "Valor de ejemplo");
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
          propsGeneralComponent:{
            labelTag: 'name',
            itemsKey: 'repair_damage',
            labelIterator: 'name',
            titleCollapse: 'Visualizar Evidencia',
            labelViewImage: 'Foto',
            viewImageKey: 'photo'
          }
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
