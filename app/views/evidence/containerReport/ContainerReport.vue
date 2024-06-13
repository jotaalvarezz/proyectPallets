<template>
  <StackLayout @loaded="initialMethods" backgroundColor="#F4F6F8">
    <HeaderComponent title="Creacion de Reporte/Contenedor" :handleback="$modal.close"/>
    <ScrollView>
      <StackLayout backgroundColor="#F4F6F8">
        <StackLayout
          ref="form"
          class="shadow"
          backgroundColor="#F4F6F8"
          margin="10"
          borderWidth="1"
          borderColor="#c0c9d7"
          borderRadius="5"
        >
          <GridLayout
            ref="form2"
            rows="auto,auto,auto,auto,auto,60,auto,auto,auto,auto,auto"
            padding="30"
          >
            <Label
              class="text-center"
              text="CONTAINER DAMAGE REPORT"
              fontSize="18"
              color="#3c495e"
              fontWeight="bold"
            ></Label>
            <Stripe row="1" margin="20" />
            <FormGroupTextField
              row="2"
              label="# CONTENEDOR:"
              placeholder="Codigo..."
              v-model="model.code"
              :required="errors.code"
            />
            <SelectField
              row="3"
              :value="model.type_id"
              :items="types"
              label="TIPO:"
              icon="fa-memory"
              @value="model.type_id = $event"
              :required="errors.type_id"
            />
            <FormGroupTextField
              row="4"
              label="TECNICO:"
              placeholder="Cargo..."
              v-model="model.role"
              :required="errors.role"
            />
            <!-- tabla de descripcion de daños y elementos -->
            <Label
              row="5"
              textWrap="true"
              marginTop="5"
              style="
                color: #3c495e;
                width: 80%;
                border-bottom-width: 1px;
                border-top-width: 1px;
              "
            >
              <FormattedString>
                <Span
                  text="Utilice los codigos para daños y localización, si no esta definido anotar nombre completo del daño y/o localización, si no fue observado alguna de sus partes dejar la constancia."
                  fontStyle="italic"
                  fontSize="13"
                />
              </FormattedString>
            </Label>
            <SelectField
              row="6"
              :value="model.additional_damage_id"
              :items="additionalDamage"
              label="DAÑO ADICIONAL:"
              :multiple="true"
              icon="fa-tools"
              @value="model.additional_damage_id = $event"
            />
            <FormGroupTextField
              row="7"
              label="OBSERVACION:"
              textArea="true"
              placeholder="Observaciones..."
              v-model="model.observation"
            />
            <Stripe row="8" margin="20" />
            <!-- Boton para Crear -->
            <Button
              v-if="containerReportEdit == false"
              row="9"
              backgroundColor="#F4F6F8"
              color="#222a37"
              text="Enviar"
              @tap="addContainerReport"
              style="width: 80%"
              borderWidth="1"
              borderColor="#222a37"
              borderRadius="30"
            />
            <!-- ******************* -->
            <!-- Boton para Editar -->
            <Button
              v-if="containerReportEdit == true"
              row="9"
              backgroundColor="#F4F6F8"
              color="#222a37"
              text="Actualizar"
              @tap="updateContainerReport"
              style="width: 80%"
              borderWidth="1"
              borderColor="#222a37"
              borderRadius="30"
            />
            <!-- ************************************************* -->
            <!-- <Signature row="14" /> -->
          </GridLayout>
          <!-- <Signature /> -->
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </StackLayout>
</template>

<script>
const {
  getContainerReport,
  getTypes,
  getAdditionalDamage,
  storeContainerReport,
  getContainerElements,
  getDamage,
  updateContainerReport,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import DamagedItemsList from "~/views/evidence/containerReport/damagedItems/DamagedItemsList.vue";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";
import HeaderComponent from '~/components/header/HeaderComponent.vue';

export default {
  components: {
    DamagedItems,
    HeaderComponent,
  },

  data() {
    return {
      message: "No hay registros para mostrar",
      formCollapse: false,
      model: {
        management_id: null,
        code: "MSG1112020000567896",
        type_id: null,
        role: "Mecanico",
        repairs: [],
        additional_damage_id: [],
        observation: "Testing",
      },
      types: [],
      additionalDamage: [],
      elements: [],
      icons: {},
      isScrolling: false,

      errors: {
        code: false,
        role: false,
        type_id:false,
      },
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", [
      "managementModel",
      "damagedItems",
      "containerReport",
      "containerReportEdit",
    ]),
  },

  methods: {
    openFormDamaged() {
      this.$showModal(DamagedItems, {
        fullscreen: true,
        animated: true,
        cancelable: false,
        props: {
          container_elements: this.elements,
          repairs: this.model.repairs,
        },
      }).then((res) => {
        console.log("console damage");
      });
    },

    /* ****************************************************************** */
    validateField(fields) {
      this.errors.code = !this.model.code.trim();
      this.errors.role = !this.model.role.trim();
      this.errors.type_id = this.model.type_id === null ? true : false
      let fullfield = "";
      for (const key in this.errors) {
        if (this.errors.hasOwnProperty(key) && this.errors[key] != false) {
          return !this.errors[key];
        }
        fullfield = !this.errors[key];
      }
      return fullfield;
    },

    async addContainerReport() {
      const isValid = this.validateField();
      if (!isValid) {
        // Detener la ejecución si la validación falla
        return;
      }

      try {
        this.loadingCharge(true);
        const res = await storeContainerReport(this.model);
        if (res.status === 500) {
          Alert.info(res.message, 1, "Ya existe");
        } else {
          Alert.success("Reporte creado");
          this.$modal.close();
        }
      } catch (error) {
        Alert.danger("Hubo un error al guardar ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    async updateContainerReport() {
      try {
        const isValid = this.validateField();
        if (!isValid) {
          // Detener la ejecución si la validación falla
          return;
        }
        const res = await updateContainerReport(this.model);
        Alert.success("Reporte Actualizado!");
        this.$modal.close();
      } catch (error) {}
    },

    listRepairs() {
      this.$showModal(DamagedItemsList, {
        fullscreen: true,
        animated: true,
        props: {
          listOfItems: this.model.repairs,
          container_elements: this.elements,
        },
      });
    },

    async InfoSelect() {
      try {
        /* this.loadingCharge(true); */
        const types = await getTypes();
        const additionalDamage = await getAdditionalDamage();
        const containerElements = await getContainerElements();
        const damage = await getDamage();
        this.types = types.data;
        this.additionalDamage = additionalDamage.data;
        this.elements = containerElements.data;
        this.damages = damage.data;
      } catch (error) {
        Alert.danger("Hubo un error al traer informacion", error.message);
      } finally {
        /* this.loadingCharge(); */
      }
    },

    initialMethods() {
      if (this.containerReportEdit) {
        const additionalDamage = this.containerReport.additionalDamage;
        let additional_damage_id = [];
        for (let i = 0; i < additionalDamage.length; i++) {
          additional_damage_id.push(additionalDamage[i].id);
        }
        this.model.id = this.containerReport.id;
        this.model.code = this.containerReport.code;
        this.model.type_id = this.containerReport.type_id;
        this.model.role = this.containerReport.role;
        this.model.role = this.containerReport.role;
        this.model.additional_damage_id = additional_damage_id;
        this.model.observation = this.containerReport.observation;
      }
      this.model.management_id = this.managementModel.id;
      this.InfoSelect();
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
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.tag {
  height: 23rem;
  margin: 3px 6px 3px 0px;
  border-radius: 5px;
  border-width: 1px;
  /* background-color: rgba(60, 73, 94, 0.19); */
  border-color: #3c495e;
  color: #3c495e;
}

.info {
  font-size: 16;
  horizontal-align: center;
  vertical-align: center;
}
</style>
