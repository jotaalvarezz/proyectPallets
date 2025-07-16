<template>
  <GridLayout rows="*" @loaded="initialMethods" backgroundColor="#F4F6F8">
    <!-- <HeaderComponent
      title="Creacion de Reporte/Contenedor"
      :handleback="$modal.close"
    /> -->
    <!-- <StackLayout backgroundColor="#F4F6F8"> -->
    <!-- <GridLayout
        ref="form"
        class="shadow"
        rows="*"
        margin="*"
        borderRadius=""
      > -->
    <ScrollView>
      <GridLayout
        ref="form2"
        class="shadow"
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
      </GridLayout>
    </ScrollView>
    <!-- </GridLayout> -->
    <!-- </StackLayout> -->
  </GridLayout>
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
  name: "ContainerReport",
  components: {
    HeaderComponent,
  },

  props: {
    validations: {
      type: Object,
      default: {},
    },
    value: {
      type: Object,
      default: "",
    },
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

      errors: this.validations,
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState(["recharge"]),
    ...mapState("evidenceStore", [
      "managementModel",
      "containerReport",
      "containerReportEdit",
    ]),
    ...mapState("managementStore", ["type"]),
  },
  watch: {
    // Observar cambios en todo el objeto 'model'
    model: {
      deep: true, // Observa cambios en cualquier propiedad dentro de 'model'
      handler(newValue, oldValue) {
        newValue.prefixCode = newValue.prefix
          ? identifyObject(newValue.prefix, this.prefixes).prefix
          : "";
        newValue.typeName = newValue.type_id
          ? identifyObject(newValue.type_id, this.types).name
          : "";
        // Aquí puedes realizar cualquier acción cuando el objeto cambia
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    /* ****************************************************************** */
    clean() {
      this.model.prefix = null;
      this.model.code = "";
      this.model.type_id = null;
      this.model.role = "";
      this.model.repairs = [];
      this.model.additional_damage_id = [];
      this.model.observation = "";
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
      /* this.model.code = this.containerReport.code; */
      if (this.containerReportEdit) {
        if (this.recharge) {
          const additionalDamage = this.containerReport.additionalDamage;
          let additional_damage_id = [];
          for (let i = 0; i < additionalDamage.length; i++) {
            additional_damage_id.push(additionalDamage[i].id);
          }
          this.model.id = this.containerReport.id;
          this.model.code = this.containerReport.code;
          setTimeout(() => {
            this.model.type_id = this.containerReport.type_id;
            this.model.prefix = this.containerReport.prefixId;
          }, 1000);
          this.model.role = this.containerReport.role;
          this.model.additional_damage_id = additional_damage_id;
          this.model.observation = this.containerReport.observation;
        }
      }
      if (!this.type) {
        this.model.management_id = this.managementModel.id;
      } else {
        this.model.management_id = this.containerReport.management_id
          ? this.containerReport.management_id
          : null;
        this.$emit("input", this.model);
      }
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
