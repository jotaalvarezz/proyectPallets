<template>
  <page>
    <Header :data="info" :icons="icons" :search="false" />
    <ScrollView>
      <StackLayout backgroundColor="#F4F6F8">
        <card-view margin="10" elevation="40" radius="15">
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
              columns="35,*"
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
            </GridLayout>
            <Button row="8" @tap="ver">VER</Button>
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
/* import ListOptions from "~/components/listOptions/ListOptions.vue"; */
import DamagedItems from "~/views/evidence/damagedItems/DamagedItems";
import SelectField from "~/components/selectField/SelectField";
import FormGroupTextField from "~/components/input/FormGroupTextField";

export default {
  components: {
    Header,
    Signature,
    DamagedItems,
    FormGroupTextField,
    SelectField,
  },

  data() {
    return {
      model: {
        buque:'',
        voyage:'',
        code:'',
        type: "",
        technical:''
      },
      listOfItems: ["Refrigerado", "Seco", "Lleno", "Vacio"],
      info: [],
      icons: {},
    };
  },

  methods: {
    openFormDamaged() {
      this.$showModal(DamagedItems);
    },

    ver(){
      console.log("modelss ", this.model)
    }
  },
};
</script>
<style>
.colorIcons {
  color: #222a37;
}
</style>
