<template>
  <!-- <page @loaded="InfoSelect"> -->
    <ScrollView>
      <StackLayout @loaded="InfoSelect" backgroundColor="#F4F6F8">
        <StackLayout
          backgroundColor="#F4F6F8"
          margin="20"
          borderWidth="1"
          borderColor="#3c495e"
          borderRadius="5"
        >
          <GridLayout
            rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto"
            padding="30"
          >
            <Label
              class="text-center"
              text="CONTAINER DAMAGE REPORT"
              fontSize="18"
              color="#3c495e"
              fontWeight="bold"
            ></Label>
            <FormGroupTextField
              row="1"
              label="BUQUE:"
              placeholder="Buque..."
              v-model="model.vessel"
            />
            <FormGroupTextField
              row="2"
              label="VIAJE:"
              placeholder="Viaje..."
              v-model="model.journey"
            />
            <FormGroupTextField
              row="3"
              label="No. CONTAINER:"
              placeholder="Code..."
              v-model="model.code"
            />
            <SelectField
              row="4"
              :value="model.type_id"
              :items="types"
              label="TIPO:"
              icon="fa-memory"
              @value="model.type_id = $event"
            />
            <FormGroupTextField
              row="5"
              label="CARGO:"
              placeholder="Cargo..."
              v-model="model.role"
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
            <GridLayout
              row="7"
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
                text="Ver Reparaciones"
                fontSize="14"
                class="colorIcons"
                @tap="listRepairs"
              />
            </GridLayout>
            <SelectField
              row="8"
              :value="model.additional_damage_id"
              :items="additionalDamage"
              label="DAÑO ADICIONAL:"
              icon="fa-tools"
              @value="model.additional_damage_id = $event"
            />
            <FormGroupTextField
              row="9"
              label="Observacion:"
              textArea="true"
              placeholder="Observaciones..."
              v-model="model.observation"
            />
            <Stripe row="10" margin="20" />
            <Button
              row="11"
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
import DamagedItems from "~/views/evidence/damagedItems/DamagedItems";
import SelectField from "~/components/selectField/SelectField";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import ListComponent from "~/components/listComponent/ListComponent";
import Stripe from "~/components/stripe/Stripe";

export default {
  components: {
    Header,
    Signature,
    DamagedItems,
    FormGroupTextField,
    SelectField,
    ListComponent,
    Stripe,
  },

  data() {
    return {
      model: {
        vessel: "",
        journey: "",
        code: "",
        type_id: null,
        role: "",
        damages_repairs: [],
        additional_damage_id: null,
        observation: "",
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

  methods: {
    openFormDamaged() {
      this.$showModal(DamagedItems, {
        props: {
          container_elements: this.elements,
        },
      }).then((res) => {
        this.model.damages_repairs.push(res.model);
      });
    },

    async ver() {
      this.$showModal(Signature);
      /* try {
        this.loadingCharge(true);
        const res = await storeContainerReport(this.model);
      } catch (error) {
        console.log("se partio ", error);
      } finally {
        this.loadingCharge();
      } */
    },

    listRepairs() {
      this.$showModal(ListComponent, {
        props: {
          listOfItems: this.model.damages_repairs,
          container_elements: this.elements,
        },
      });
    },

    async InfoSelect() {
      try {
        this.loadingCharge(true);
        const types = await getTypes();
        const additionalDamage = await getAdditionalDamage();
        const containerElements = await getContainerElements();
        const damage = await getDamage();
        this.types = types.data;
        this.additionalDamage = additionalDamage.data;
        this.elements = containerElements.data;
        this.damages = damage.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingCharge();
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
</style>
