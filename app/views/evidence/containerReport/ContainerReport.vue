<template>
  <!-- <page @loaded="InfoSelect"> -->
  <ScrollView>
    <StackLayout @loaded="initialMethods" backgroundColor="#F4F6F8">
      <StackLayout
        class="shadow"
        backgroundColor="#F4F6F8"
        margin="10"
        borderWidth="1"
        borderColor="#3c495e"
        borderRadius="5"
      >
        <GridLayout
          ref="form"
          rows="auto,auto,auto,auto,auto,auto,60,auto,auto,auto,auto"
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
            label="No. CONTAINER:"
            placeholder="Code..."
            v-model="model.code"
          />
          <SelectField
            row="3"
            :value="model.type_id"
            :items="types"
            label="TIPO:"
            icon="fa-memory"
            @value="model.type_id = $event"
          />
          <FormGroupTextField
            row="4"
            label="CARGO:"
            placeholder="Cargo..."
            v-model="model.role"
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
          <GridLayout
            row="6"
            columns="35,auto,*,35,auto"
            style="width: 80%; margin-top: 15px"
          >
            <Label
              col="0"
              :text="'fa-tools' | fonticon"
              class="fas colorIcons"
              color="#EAB14D"
              fontSize="22"
            />
            <Label
              col="1"
              textWrap="true"
              text="Agregar Reparaciones"
              fontSize="14"
              class="colorIcons"
              @tap="openFormDamaged"
            />
            <Label
              col="3"
              :text="'fa-eye' | fonticon"
              class="fas colorIcons"
              color="#24D311"
              fontSize="22"
            />
            <Label
              col="4"
              textWrap="true"
              text="Ver Reparaciones"
              fontSize="14"
              class="colorIcons"
              @tap="listRepairs"
            />
          </GridLayout>
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
          <Stripe row="9" margin="20" />
          <Button
            row="10"
            backgroundColor="#F4F6F8"
            color="#222a37"
            text="Enviar"
            @tap="ver"
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
  <!-- </page> -->
</template>

<script>
const {
  getTypes,
  getAdditionalDamage,
  storeContainerReport,
  getContainerElements,
  getDamage,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import Header from "~/components/header/Header.vue";
import Signature from "~/components/signature/Signature.vue";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import SelectField from "~/components/selectField/SelectField";
import SelectFieldMul from "~/components/selectFieldMultiple/SelectFieldMultiple.vue";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import ListComponent from "~/components/listComponent/ListComponent";
import Stripe from "~/components/stripe/Stripe";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    Header,
    Signature,
    DamagedItems,
    FormGroupTextField,
    SelectField,
    ListComponent,
    Stripe,
    SelectFieldMul
  },

  data() {
    return {
      model: {
        management_id: null,
        code: "MSG1112020000567896",
        type_id: 1,
        role: "Mecanico",
        damages_repairs: [],
        additional_damage_id: [2,3,4],
        observation: "Testing",
      },
      types: [],
      additionalDamage: [],
      elements: [],
      info: [],
      icons: {},
      isScrolling: false,
    };
  },

  mixins: [mixinMasters],

  computed:{
    ...mapState('evidenceStore',['managementModel', 'damagedItems'])
  },

  methods: {
    ...mapMutations('evidenceStore',['setDamagedItem', 'cleanDamagedItems']),
    openFormDamaged() {
      this.$showModal(DamagedItems, {
        fullscreen: true,
        animated: true,
        cancelable: false,
        props: {
          container_elements: this.elements,
        },
      });
    },

    async ver() {
      console.log("model ", this.model);
      try {
        if (this.model.code.trim() !== "") {
          this.model.damages_repairs = this.damagedItems
          this.loadingCharge(true);
          const res = await storeContainerReport(this.model);
          Alert.success("Reporte creado")
        } else {
          Alert.info("¡Verique que no haya campos obligatorios, vacios!", 1);
          this.showMessageError()
        }
      } catch (error) {
        Alert.danger("Hubo un error al guardar ", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    listRepairs() {
      this.$showModal(ListComponent, {
        fullscreen: true,
        animated: true,
        props: {
          listOfItems: this.model.damages_repairs,
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

    initialMethods(){
      this.cleanDamagedItems()
      this.model.management_id = this.managementModel.id
      this.InfoSelect()
    }
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
</style>
