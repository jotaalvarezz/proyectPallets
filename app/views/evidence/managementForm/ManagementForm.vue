<template>
  <page @loaded="index">
    <Header :search="false" />
    <GridLayout rows="auto, auto ,auto, *" backgroundColor="#F4F6F8">
      <Collapse
        ref="Collapse"
        row="0"
        title="Diligenciar Gestion"
        @value="collapseValue = $event"
      >
        <!-- Contenido que se insertará dentro del componente -->
        <GridLayout
          rows="auto,auto,auto,auto,auto,auto,auto,auto,auto"
          class="shadow"
          backgroundColor="#F4F6F8"
          borderWidth="1"
          borderColor="#c0c9d7"
          borderRadius="5"
          padding="20"
        >
          <Label
            row="0"
            class="text-center"
            text="GESTION DE CONTENEDOR"
            fontSize="18"
            color="#3c495e"
            fontWeight="bold"
          ></Label>
          <Stripe row="1" color="#3c495e" mt="20" mb="20" mr="40" ml="40" />
          <FormGroupTextField
            v-if="management_id === 1"
            row="2"
            label="Buque:"
            placeholder="nombre de barco..."
            fontsize="14"
            v-model="model.name"
            :required="errors.name"
          />
          <FormGroupTextField
            v-if="management_id === 2"
            row="2"
            label="Gestion:"
            placeholder="nombre..."
            fontsize="14"
            v-model="model.name"
            :required="errors.name"
          />
          <FormGroupTextField
            v-if="management_id === 1"
            row="3"
            label="Viaje:"
            placeholder="viaje..."
            fontsize="14"
            v-model="model.journey"
          />
          <FormGroupTextField
            row="4"
            label="Titular:"
            placeholder="nombre de titular..."
            fontsize="14"
            v-model="model.titular_name"
          />
          <Stripe row="5" color="#3c495e" mt="20" mb="20" mr="40" ml="40" />
          <!-- Boton para Crear -->
          <Button
            row="6"
            :isEnabled="status"
            text="Agregar"
            backgroundColor="#F4F6F8"
            color="#222a37"
            style="width: 80%; margin-bottom: 20px"
            @tap="submitForm"
            borderWidth="1"
            borderColor="#222a37"
            borderRadius="30"
          />
          <!-- <Image row="7" ref="imageRef" margin="25" src="" loadMode="sync" /> -->
        </GridLayout>
      </Collapse>
      <StackLayout
        v-show="collapseValue === false"
        orientation="horizontal"
        row="2"
        padding="20"
      >
        <StackLayout>
          <Label
            text="Finalizar Operacion:"
            textWrap="true"
            width="auto"
            fontSize="16"
          />
          <StackLayout width="80" horizontalAlignment="left">
            <Switch ref="switch" v-model="status" @tap="finish" />
          </StackLayout>
        </StackLayout>
        <Label width="1" margin="15" backgroundColor="#c0c9d7" />
        <StackLayout
          orientation="horizontal"
          width="auto"
          backgroundColor="#D8E2E8"
        >
          <Label
            :text="status ? 'Operacion Abierta' : 'Operacion Cerrada'"
            class="text-center"
            width="auto"
            fontWeight="none"
            verticalAlignment="bottom"
            fontSize="16"
            margin="10"
            borderRadius="5"
          />
          <Label
            :text="(status ? 'fa-lock-open' : 'fa-lock') | fonticon"
            class="fas text-center"
            verticalAlignment="bottom"
            padding="10"
            fontSize="30"
            width="60"
            color="#EAB14D"
          />
        </StackLayout>
      </StackLayout>
      <GridLayout
        v-if="collapseValue === false"
        margin="5"
        row="1"
        rows="auto"
        columns="*, 65"
      >
        <SearchBar
          ref="searchbar"
          row="0"
          col="0"
          height="50"
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
          :handleEvent="() => refreshManagments()"
        />
      </GridLayout>
      <Label
        row="3"
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
        row="3"
        ref="listView"
        for="item in array_filter"
        @itemTap="onItemTap"
      >
        <v-template>
          <!-- Shows the list item label in the default color and style. -->
          <GridLayout columns="*, 50">
            <StackLayout orientation="horizontal" col="0">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-file-alt' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth" width="75%">
                <Label
                  text="Gestion de reporte:"
                  class="subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="15"
                />
                <Label textWrap="true">
                  <!-- en barco -->
                  <FormattedString v-if="management_id === 1">
                    <Span text="Barco: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.name + '\n'" fontSize="15" />
                    <Span text="Viaje: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.journey + '\n'" fontSize="15" />
                    <Span
                      text="Nombre del Capitan: "
                      fontWeight="bold"
                      fontSize="15"
                    />
                    <Span :text="item.titular_name" fontSize="15" />
                  </FormattedString>
                  <!-- en patio -->
                  <FormattedString v-if="management_id === 2">
                    <Span text="Nombre de Gestion: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.name + '\n'" fontSize="15" />
                    <Span text="Patio: " fontWeight="bold" fontSize="15" />
                    <Span :text="'Alieva' + '\n'" fontSize="15" />
                    <Span
                      text="Nombre del Conductor: "
                      fontWeight="bold"
                      fontSize="15"
                    />
                    <Span :text="item.titular_name" fontSize="15" />
                  </FormattedString>
                </Label>
                <!-- <StackLayout style="padding: 0px 5px 5px 8px">
                  <Label text="Contenedores:" class="subTittle" fontSize="12" /> -->
                <Tag
                  label="Contenedores"
                  :items="item.container_reports"
                  labelIterator="code"
                />
                <!-- </StackLayout> -->
                <!-- <ViewImage
                  ref="viewImage"
                  label="Firma: "
                  encrypted="true"
                  :url="item.signature"
                /> -->
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
      <!-- <FloatingButton
        row="3"
        :icon="!close ? 'fa-unlock-alt' : 'fa-lock'"
        :method="() => {closeManagement(!close)}"
      /> -->
    </GridLayout>
  </page>
</template>

<script>
const {
  getTypesManagement,
  storeManagement,
  getManagements,
  deleteManagement,
  finishOperations,
  showContainerReport,
  showTypesManagement,
  getRepairsReport,
} = require("~/sqlite/database");
import ManagementEdit from "~/views/evidence/managementForm/ManagementEdit";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import mixinMasters from "~/mixins/Master";
import { ImageSource, Utils } from "@nativescript/core";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";
import ListModal from "~/components/listModal/ListModal.vue";
import ManagmentShipList from "~/views/evidence/managementForm/ManagmentShipList";

export default {
  name: "Management",
  components: {
    ButtomSheet,
  },

  props: {
    management_id: {
      type: Number,
    },
  },

  data() {
    return {
      status: true,
      search: "",
      collapseValue: false,
      message: "No hay registros para mostrar",
      model: {
        type_management_id: null,
        name: "",
        journey: "",
        titular_name: "",
        signature: "",
      },
      type_management: {},
      array_filter: [],
      managments: [],

      errors: {
        name: false,
      },
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel"]),
    ...mapState("managementStore", ["close"]),
  },

  methods: {
    ...mapMutations("evidenceStore", ["setManagementModel"]),
    ...mapMutations("managementStore", ["closeManagement"]),

    /* ****************************************************************** */
    async finish() {
      try {
        let confirmated = await Alert.info(
          "Al finalizar la operacion no podra realizar mas cambios.",
          3,
          "Finalizar Operacion"
        );
        if (confirmated) {
          if (this.status === false) {
            const res = await finishOperations(
              this.model.type_management_id,
              this.status
            );

            if (res.status === 400) {
              this.status = this.type_management.status === 1 ? true : false;
              Alert.info(res.message, 1, res.error);
              return;
            }

            this.status = res.data.status === 1 ? true : false;
            this.$refs.switch.nativeView.isEnabled = false;
            return;
          }
        }
        this.status = this.type_management.status === 1 ? true : false;
      } catch (error) {
        Alert.danger(
          "¡Hubo un error al finalizar la operacion!",
          error.message
        );
      }
    },

    validateField(fields) {
      this.errors.name = !this.model.name.trim();
      let fullfield = "";
      for (const key in this.errors) {
        if (this.errors.hasOwnProperty(key) && this.errors[key] != false) {
          return !this.errors[key];
        }
        fullfield = !this.errors[key];
      }
      return fullfield;
    },

    async submitForm() {
      const isValid = this.validateField();
      if (!isValid) {
        // Detener la ejecución si la validación falla
        return;
      }

      try {
        this.loadingCharge(true);
        const res = await storeManagement(this.model);
        if (res.status === 500) {
          Alert.info(res.message, 1, "Ya existe");
          return;
        } else {
          this.managments.push(res.data);
        }

        this.model = {
          type_management_id: this.management_id,
          name: "",
          journey: "",
          titular_name: "",
          signature: "",
        };

        this.$refs.Collapse.activated();
        // Continuar con el envío del formulario
        Alert.info(
          "la Gestion se ah creado con exito.",
          1,
          "Registro Agregado"
        );
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      } finally {
        this.loadingCharge();
      }
    },
    /* ******************************************************************* */

    onItemTap(event) {
      this.navigate(event.item);
    },

    filter() {
      if (this.search.length > 0) {
        this.array_filter = this.managments.filter(
          (data) =>
            !this.search ||
            data.name.toLowerCase().includes(this.search.toLowerCase())
        );
      } else if (this.search === 0) {
        this.array_filter = this.managments;
      }
    },

    clear() {
      this.array_filter = this.managments;
    },

    index() {
      this.model.type_management_id = this.management_id;
      this.getManagements(this.model.type_management_id);
    },

    async getManagements(id) {
      try {
        this.loadingCharge(true);
        const response = await showTypesManagement(id);
        this.type_management = response.data;
        this.status = this.type_management.status === 1 ? true : false;
        if (this.status === false) {
          this.$refs.switch.nativeView.isEnabled = false;
        }
        const res = await getManagements(id);
        this.managments = res.data;
        this.array_filter = res.data;
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    async addManagement() {
      try {
        if (this.model.titular_name !== "" && this.model.name !== "") {
          this.loadingCharge(true);
          const res = await storeManagement(this.model);
          if (res.status === 500) {
            Alert.info(res.message, 1, "Ya existe");
          } else {
            this.managments.push(res.data);
          }
        } else {
          Alert.info("¡Revise que los campos no se encuentren vacios!", 1);
        }
        this.model = {
          type_management_id: this.management_id,
          name: "",
          journey: "",
          titular_name: "",
          signature: "",
        };
        this.$refs.Collapse.activated();
      } catch (error) {
        Alert.danger("Hubo un error al traer los datos ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    navigate(item) {
      this.setManagementModel(item);
      this.$router.push("container_report.index");
    },

    refreshManagments() {
      this.getManagements(this.model.type_management_id);
    },

    navigateOptions(item, index) {
      item.action = true;
      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          generalOptions: this.status,
          component: ManagementEdit,
          infoRegister: () => this.managmentInfo(item),
          updateRegister: () => this.managementEdit(item),
          deleteRow: () => this.deleteRow(item.id),
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {},
        },
      };
      this.$showBottomSheet(ButtomSheet, options);
    },

    managmentInfo(item) {
      let listRows = [];
      if (item.type_management_id === 1) {
        listRows = ManagmentShipList.listRowsShip;
      } else if (item.type_management_id === 2) {
        listRows = ManagmentShipList.listRowsPatio;
      }
      this.$showModal(ListModal, {
        animated: true,
        stretched: false,
        props: {
          title: "Informacion del reporte",
          info: item,
          listRows: listRows,
          showTags: "container_reports",
          iteratorTags: "code",
        },
      });
    },

    managementEdit(item) {
      this.$showModal(ManagementEdit, {
        fullscreen: true,
        animated: true,
        stretched: false,
        props: { info: item },
      }).then(async (res) => {
        this.getManagements(res.model.type_management_id);
        /* const index = this.managments.findIndex(prev => prev.id === res.model.id)
        this.managments[index] = res.model
        this.$refs.listView.nativeView.refresh(); */
      });
    },

    async deleteRow(id) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deleteManagement(id);
          const index = this.managments.findIndex((prev) => prev.id === id);
          this.managments.splice(index, 1);
        } catch (error) {
          Alert.danger("eleminacion fallida ", error.message);
        }
      }
    },
  },
};
</script>
<style>
.colorIcons {
  color: #222a37;
}

.my-card {
  border-width: 2;
  border-color: #000000;
  border-radius: 5;
}

.shadow {
  box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.19);
}

.info {
  font-size: 16px;
  horizontal-align: center;
  vertical-align: center;
}

.error {
  color: red;
}

.animated {
  /* background-color: #d8e2e8; */
  border-radius: 60px;
}

.search-bar {
  font-size: 15; /* Cambia el tamaño del texto aquí */
}
</style>
