<template>
  <page>
    <Header :data="info" :icons="icons" :search="false" />
    <ScrollView @pan="onScroll">
      <StackLayout backgroundColor="#F4F6F8">
        <card-view margin="10" elevation="2" radius="15">
          <GridLayout
            rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto"
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
              v-model="model.buque"
            />
            <FormGroupTextField
              row="2"
              label="VIAJE:"
              placeholder="Viaje..."
              v-model="model.voyage"
            />
            <FormGroupTextField
              row="3"
              label="No. CONTAINER:"
              placeholder="Code..."
              v-model="model.code"
            />
            <SelectField
              row="4"
              :value="model.type"
              :items="listOfItems"
              label="TIPO:"
              icon="fa-memory"
              @value="model.type = $event"
            />
            <FormGroupTextField
              row="5"
              label="CARGO:"
              placeholder="Cargo..."
              v-model="model.technical"
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
            <!-- <ListView
              row="8"
              style="width: 80%; margin-top: 15px"
              for="item in registers"
              @pan="pan"
            >
              <v-template>
                <Label :text="item" />
              </v-template>
            </ListView> -->
            <SelectField
              row="8"
              :value="model.additional_damage"
              :items="additionalDamage"
              label="DAÑO ADICIONAL:"
              icon="fa-tools"
              @value="model.additional_damage = $event"
            />

            <FormGroupTextField
              row="9"
              label="Observacion:"
              textArea="true"
              placeholder="Observaciones..."
              v-model="model.observation"
            />
            <Button
              row="10"
              marginTop="20 "
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
        </card-view>
      </StackLayout>
    </ScrollView>
  </page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import Signature from "~/components/signature/Signature.vue";
import ListOptions from "~/components/listOptions/ListOptions.vue";
import DamagedItems from "~/views/evidence/damagedItems/DamagedItems";
import SelectField from "~/components/selectField/SelectField";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import ListComponent from "~/components/listComponent/ListComponent";

export default {
  components: {
    Header,
    Signature,
    DamagedItems,
    FormGroupTextField,
    SelectField,
    ListOptions,
    ListComponent,
  },

  data() {
    return {
      model: {
        buque: "",
        voyage: "",
        code: "",
        type: "",
        technical: "",
        damages_repairs: [],
        additional_damage: "",
        observation: "",
      },
      listOfItems: ["Refrigerado", "Seco", "Lleno", "Vacio"],
      additionalDamage: [
        "VENTILADOR",
        "TEMPERATURA",
        "PLUG",
        "CABLE ELECTRICO",
        "CONVERTIDOR DE FRECUENCIA",
        "MICRO",
        "FREON",
        "COMPRESOR",
        "PANTALLA	",
      ],
      registers: [
        "celso",
        "piña",
        "los tiempos de celso",
        "piña",
        "piña",
        "piña",
      ],
      info: [],
      icons: {},
      isScrolling: false,
    };
  },

  methods: {
    openFormDamaged() {
      this.$showModal(DamagedItems)
      .then((res) => {
        this.model.damages_repairs.push(res.model)
      });
    },

    pan(event) {
      console.log("capturado ");
      this.isScrolling = true;
    },

    ver() {
      console.log("modelss ", this.model);
    },

    onScroll(event) {
      // Permitir que el evento de desplazamiento se propague hacia arriba hasta el ScrollView
      console.log("evento propagado");
      if (this.isScrolling) {
        /* event.android.setScrollEnabled(false); */ // Disables user scrolling.
        console.log("android => ", event.android);
      }
      /* event.stopPropagation(); */
    },

    listRepairs() {
      this.$showModal(ListComponent, {
        props: {
          listOfItems: this.registers,
        },
      });
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
