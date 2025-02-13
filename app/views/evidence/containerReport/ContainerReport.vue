<template>
  <StackLayout @loaded="initialMethods" backgroundColor="#F4F6F8">
    <HeaderComponent
      title="Creacion de Reporte/Contenedor"
      :handleback="$modal.close"
    />
    <!-- <StackLayout backgroundColor="#F4F6F8"> -->
      <GridLayout
        ref="form"
        class="shadow"
        rows="*"
        backgroundColor="#F4F6F8"
        margin="10"
        borderWidth="1"
        borderColor="#c0c9d7"
        borderRadius="5"
      >
        <ScrollView>
          <GridLayout
            ref="form2"
            rows="auto,auto,auto,auto,auto,auto,60,auto,auto,auto"
            padding="30"
          >
            <Label
              class="text-center"
              text="INFORME DE DAÑOS DEL CONTENEDOR"
              fontSize="18"
              color="#3c495e"
              fontWeight="bold"
            ></Label>
            <Stripe row="1" margin="20" />
            <FilterSelectField
              row="2"
              :value="model.prefix"
              :items="prefixes"
              label="PREFIJO:"
              labelIterator="prefix"
              icon="fa-memory"
              @value="model.prefix = $event"
              :required="errors.prefix"
            />
            <FormGroupTextField
              row="3"
              label="CONTENEDOR:"
              placeholder="Codigo..."
              typeInput="number"
              v-model="model.code"
              :required="errors.code"
            />
            <SelectField
              row="4"
              :value="model.type_id"
              :items="types"
              label="TIPO:"
              icon="fa-memory"
              @value="model.type_id = $event"
              :required="errors.type_id"
            />
            <FormGroupTextField
              row="5"
              label="TECNICO:"
              placeholder="Nombre..."
              v-model="model.role"
              :required="errors.role"
            />
            <!-- tabla de descripcion de daños y elementos -->
            <Label
              row="6"
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
              row="7"
              :value="model.additional_damage_id"
              :items="additionalDamage"
              label="DAÑO ADICIONAL:"
              :multiple="true"
              icon="fa-tools"
              @value="model.additional_damage_id = $event"
            />
            <FormGroupTextField
              row="8"
              label="OBSERVACION:"
              textArea="true"
              placeholder="Observaciones..."
              v-model="model.observation"
            />
           <!--  <Stripe row="9" margin="20" /> -->
            <!-- Boton para Crear -->
            <!-- <Button
              v-if="containerReportEdit == false"
              row="10"
              backgroundColor="#F4F6F8"
              color="#222a37"
              text="Enviar"
              @tap="addContainerReport"
              style="width: 80%"
              borderWidth="1"
              borderColor="#222a37"
              borderRadius="30"
            /> -->
            <!-- ******************* -->
            <!-- Boton para Editar -->
            <!-- <Button
              v-if="containerReportEdit == true"
              row="10"
              backgroundColor="#F4F6F8"
              color="#222a37"
              text="Actualizar"
              @tap="updateContainerReport"
              style="width: 80%"
              borderWidth="1"
              borderColor="#222a37"
              borderRadius="30"
            /> -->
          </GridLayout>
        </ScrollView>
        <FloatingButton
          :icon="'fa-save'"
          iconSize="sm"
          :method="containerReportEdit == false ? addContainerReport : updateContainerReport"
        />
      </GridLayout>
    <!-- </StackLayout> -->
  </StackLayout>
</template>

<script>
const {
  getPrefixes,
  getTypes,
  getAdditionalDamage,
  storeContainerReport,
  updateContainerReport,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";
import HeaderComponent from "~/components/header/HeaderComponent.vue";
import { identifyObject } from "~/shared/helpers";

export default {
  components: {
    HeaderComponent,
  },

  data() {
    return {
      message: "No hay registros para mostrar",
      formCollapse: false,
      model: {
        management_id: null,
        prefix: null,
        code: "",
        type_id: null,
        role: "",
        repairs: [],
        additional_damage_id: [],
        observation: "",
      },
      prefixes: [],
      types: [],
      additionalDamage: [],
      elements: [],
      icons: {},
      isScrolling: false,

      errors: {
        prefix: false,
        code: false,
        role: false,
        type_id: false,
      },
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", [
      "managementModel",
      "containerReport",
      "containerReportEdit",
    ]),
  },

  methods: {
    /* ****************************************************************** */
    validateField(fields) {
      this.errors.prefix = this.model.prefix === null ? true : false;
      this.errors.code = !this.model.code.trim();
      this.errors.role = !this.model.role.trim();
      this.errors.type_id = this.model.type_id === null ? true : false;
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
        const object = identifyObject(this.model.prefix, this.prefixes);
        this.model.prefixCode = object.prefix;
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
        const object = identifyObject(this.model.prefix, this.prefixes);
        this.model.prefixCode = object.prefix;
        const res = await updateContainerReport(this.model);
        Alert.success("Reporte Actualizado!");
        this.$modal.close();
      } catch (error) {}
    },

    async InfoSelect() {
      try {
        /* this.loadingCharge(true); */
        const prefixes = await getPrefixes();
        const types = await getTypes();
        const additionalDamage = await getAdditionalDamage();
        this.prefixes = prefixes.data;
        this.types = types.data;
        this.additionalDamage = additionalDamage.data;
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
        this.model.prefix = this.containerReport.prefixId;
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
