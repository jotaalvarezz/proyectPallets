<template>
  <page @loaded="index">
    <Header :search="false" />
    <GridLayout rows="auto, auto, *" backgroundColor="#FFFFFF">
      <Collapse
        ref="Collapse"
        row="0"
        title="Diligenciar Gestion"
        v-model="collapseValue"
      >
        <!-- Contenido que se insertará dentro del componente -->
        <GridLayout
          rows="auto,auto,auto,auto,auto,auto,auto,auto,auto"
          class="shadow"
          backgroundColor="#FFFFFF"
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
            v-if="StoreTypeManagementId === 1"
            row="2"
            label="Buque:"
            placeholder="nombre de barco..."
            fontsize="14"
            v-model="model.name"
            :required="errors.name"
          />
          <FormGroupTextField
            v-if="StoreTypeManagementId === 2"
            row="2"
            label="Gestion:"
            placeholder="nombre..."
            fontsize="14"
            v-model="model.name"
            :required="errors.name"
          />
          <FormGroupTextField
            v-if="StoreTypeManagementId === 1"
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
          :handleEvent="() => refreshManagments()"
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
      <ListView
        v-if="array_filter.length > 0"
        row="2"
        ref="listView"
        separatorColor="transparent"
        for="item in array_filter"
        @itemTap="onItemTap"
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
                <GridLayout columns="90, *, 70" marginBottom="15">
                  <!-- Icon -->
                  <StackLayout col="0" horizontalAlignment="left">
                    <Label
                      backgroundColor="#D8E2E8"
                      :text="'fa-file-alt' | fonticon"
                      class="fas text-center"
                      padding="10"
                      fontSize="60"
                      color="#EAB14D"
                      borderRadius="8"
                    />
                  </StackLayout>

                  <!-- Main info -->
                  <StackLayout col="1" marginLeft="12">
                    <Label
                      text="Gestión de Reporte"
                      fontSize="14"
                      fontWeight="bold"
                      color="#333"
                      marginBottom="4"
                    />
                    <Label
                      :text="item.name || 'Sin nombre'"
                      fontSize="16"
                      fontWeight="bold"
                      color="#00acc1"
                      marginBottom="2"
                      textWrap="true"
                    />
                  </StackLayout>

                  <!-- Options button -->
                  <ButtonNavigate
                    col="2"
                    height="50"
                    width="50"
                    icon="fa-ellipsis-v"
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
                      :text="StoreTypeManagementId === 1 ? 'Viaje:' : 'Patio:'"
                      fontSize="13"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      :text="
                        StoreTypeManagementId === 1
                          ? item.journey || 'No especificado'
                          : 'Alieva'
                      "
                      fontSize="13"
                      color="#333"
                      textWrap="true"
                      marginBottom="8"
                    />
                  </StackLayout>

                  <!-- Right column -->
                  <StackLayout col="1" marginLeft="8">
                    <Label
                      :text="
                        StoreTypeManagementId === 1 ? 'Capitán:' : 'Conductor:'
                      "
                      fontSize="13"
                      fontWeight="bold"
                      color="#666"
                      marginBottom="2"
                    />
                    <Label
                      :text="item.titular_name || 'No especificado'"
                      fontSize="13"
                      color="#333"
                      textWrap="true"
                    />
                  </StackLayout>
                </GridLayout>

                <!-- Containers section -->
                <StackLayout
                  backgroundColor="#F4F6F8"
                  padding="12"
                  borderRadius="8"
                >
                  <Tag
                    label="Contenedores"
                    :items="item.container_reports"
                    labelIterator="code"
                    labelColor="#333"
                  />
                </StackLayout>
              </StackLayout>
            </GridLayout>
          </card-view>
        </v-template>
      </ListView>
      <FloatingButton
        row="2"
        :opacity="type_management.status === 0 ? 1 : 0.5"
        :icon="type_management.status == 0 ? 'fa-lock-open' : 'fa-lock'"
        :method="finish"
      />
    </GridLayout>
  </page>
</template>

<script>
const {
  storeManagement,
  getManagements,
  deleteManagement,
  finishOperations,
  showTypesManagement,
  updateManagement,
} = require("~/sqlite/database");
import ManagementEdit from "~/views/evidence/managementForm/ManagementEdit";
import ButtomSheetDynamic from "~/components/buttomSheet/ButtomSheetDynamic.vue";
import Signature from "~/components/signature/Signature.vue";
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";
import ListModal from "~/components/listModal/ListModal.vue";
import ManagmentShipList from "~/views/evidence/managementForm/ManagmentShipList";
import { onSearchBarLoaded } from "~/shared/helpers";
import { Toasty } from "@triniwiz/nativescript-toasty";

export default {
  name: "Management",
  components: {
    ButtomSheetDynamic,
  },

  data() {
    return {
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

  watch: {
    // Observamos cambios en el objeto `user`
    /* type_management(newValue, oldValue) {
      this.type_management.status = newValue.status
    }, */
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel"]),
    ...mapState("managementStore", ["close", "StoreTypeManagementId"]),
  },

  methods: {
    ...mapMutations("evidenceStore", ["setManagementModel"]),
    ...mapMutations("managementStore", ["closeManagement"]),

    /* ****************************************************************** */
    index() {
      this.model.type_management_id = this.StoreTypeManagementId;
      this.getManagements(this.model.type_management_id);
    },

    refreshManagments() {
      this.getManagements(this.model.type_management_id);
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
          const res = await finishOperations(this.model.type_management_id);
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
          type_management_id: this.StoreTypeManagementId,
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

    async getManagements(id) {
      try {
        this.loadingCharge(true);
        const response = await showTypesManagement(id);
        this.type_management = response.data;
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
          type_management_id: this.StoreTypeManagementId,
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

    navigateOptions(item, index) {
      item.action = true;
      const events = [
        {
          name: "Ver Detalles",
          icon: "fa-eye",
          event: () => this.managmentInfo(item),
        },
      ];

      // Solo agregar opciones de editar y elim inar si la operación no está finalizada
      if (this.type_management.status === 0) {
        events.push(
          {
            name: "Firmar",
            icon: "fa-signature",
            event: () => this.signatureManagement(item),
          },
          {
            name: "Actualizar",
            icon: "fa-redo",
            event: () => this.managementEdit(item),
          },
          {
            name: "Eliminar",
            icon: "fa-times",
            event: () => this.deleteRow(item.id),
          }
        );
      }

      const options = {
        dismissOnBackgroundTap: true,
        dismissOnDraggingDownSheet: false,
        transparent: true,
        props: {
          item: item,
          events: events,
          generalOptions: false,
        },
        // listeners to be connected to MyComponent
        on: {
          someEvent: (value) => {},
        },
      };
      this.$showBottomSheet(ButtomSheetDynamic, options);
    },

    managmentInfo(item) {
      this.loadingCharge(true);
      let listRows = [];
      if (item.type_management_id === 1) {
        listRows = ManagmentShipList.listRowsShip;
      } else if (item.type_management_id === 2) {
        listRows = ManagmentShipList.listRowsPatio;
      }
      setTimeout(() => {
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
      }, 5);
      this.loadingCharge();
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

    signatureManagement(item) {
      console.log("item ", item);
      this.model = item;
      this.$showModal(Signature, {
        animated: true,
        props: {
          id: this.model.id,
          signature: this.model.signature,
        },
        animated: true,
        cancelable: true,
      }).then(async (res) => {
        this.model.signature = await res.signature;
        await updateManagement(this.model);
        //console.log("res ",this.model)
      });
    },

    //evento para quitarle foco al searhBar cuando se carga la vista
    focus(event) {
      onSearchBarLoaded(event);
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
