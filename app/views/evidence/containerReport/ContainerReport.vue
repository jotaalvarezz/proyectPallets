<template>
  <!-- <page @loaded="InfoSelect"> -->
  <ScrollView>
    <StackLayout @loaded="InfoSelect" backgroundColor="#F4F6F8">
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
          rows="auto,auto,auto,auto,auto,auto,auto,auto,60,auto,auto,auto,auto"
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
            label="BUQUE:"
            placeholder="Buque..."
            v-model="model.vessel"
          />
          <FormGroupTextField
            row="3"
            label="VIAJE:"
            placeholder="Viaje..."
            v-model="model.journey"
          />
          <FormGroupTextField
            row="4"
            label="No. CONTAINER:"
            placeholder="Code..."
            v-model="model.code"
          />
          <SelectField
            row="5"
            :value="model.type_id"
            :items="types"
            label="TIPO:"
            icon="fa-memory"
            @value="model.type_id = $event"
          />
          <FormGroupTextField
            row="6"
            label="CARGO:"
            placeholder="Cargo..."
            v-model="model.role"
          />
          <!-- tabla de descripcion de daños y elementos -->
          <Label
            row="7"
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
            row="8"
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
            row="9"
            :value="model.additional_damage_id"
            :items="additionalDamage"
            label="DAÑO ADICIONAL:"
            icon="fa-tools"
            @value="model.additional_damage_id = $event"
          />
          <FormGroupTextField
            row="10"
            label="OBSERVACION:"
            textArea="true"
            placeholder="Observaciones..."
            v-model="model.observation"
          />
          <Stripe row="11" margin="20" />
          <Button
            row="12"
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
import FormGroupTextField from "~/components/input/FormGroupTextField";
import ListComponent from "~/components/listComponent/ListComponent";
import Stripe from "~/components/stripe/Stripe";
import Alert from "~/alerts/Alerts";

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
        vessel: "Cala Pino",
        journey: "U.S.A",
        code: "MSG1112020000567896",
        type_id: 1,
        role: "Mecanico",
        damages_repairs: [
          {
            container_element_id: 1,
            location: "Abajo",
            position: "Derecha",
            damage_id: [
              {
                id: 1,
                text: "AB - ABOLLADO",
                checked: true,
              },
              {
                id: 2,
                text: "DO - DOBLADO",
                checked: true,
              },
              {
                id: 3,
                text: "OX - OXIDADO",
                checked: true,
              },
              {
                id: 3,
                text: "OX - OXIDADO",
                checked: true,
              },
              {
                id: 3,
                text: "OX - OXIDADO",
                checked: true,
              },
              {
                id: 3,
                text: "OX - OXIDADO",
                checked: true,
              },
              {
                id: 3,
                text: "OX - OXIDADO",
                checked: true,
              },
            ],
            state: true,
          },
          {
            container_element_id: 3,
            location: "Arriba",
            position: "Derecha",
            damage_id: [
              {
                id: 1,
                text: "AB - ABOLLADO",
                checked: true,
              },
              {
                id: 2,
                text: "DO - DOBLADO",
                checked: true,
              },
              {
                id: 3,
                text: "OX - OXIDADO",
                checked: true,
              },
            ],
            state: false,
          },
        ],
        additional_damage_id: 3,
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

  methods: {
    openFormDamaged() {
      this.$showModal(DamagedItems, {
        fullscreen: true,
        animated: true,
        cancelable: false,
        props: {
          container_elements: this.elements,
        },
      }).then((res) => {
        this.model.damages_repairs.push(res.model);
      });
    },

    async ver() {
      /* console.log("model ", this.model); */
      try {
        if (this.model.vessel.trim() !== "" && this.model.code.trim() !== "") {
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
        Alert.danger("Hubo un error al traer informacion", error.message);
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

.shadow {
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
