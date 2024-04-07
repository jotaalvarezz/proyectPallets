<template>
  <!--   <page @loaded="InfoSelect"> -->
  <StackLayout @loaded="initialMethods" backgroundColor="#F4F6F8">
    <GridLayout
      height="65"
      rows="*"
      columns="50, 3*, 50"
      backgroundColor="#00acc1"
    >
      <Label
        row="0"
        col="0"
        :text="'fa-arrow-left' | fonticon"
        fontSize="16"
        class="fas text-center"
        color="#F4F6F8"
        @tap="$modal.close"
      />
      <Label
        row="0"
        col="1"
        class="text-center"
        text="Registro de Contenedores"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout>
    <GridLayout rows="*, auto" backgroundColor="#F4F6F8">
      <Collapse row="0" :value="formCollapse" title="Reporte de Contenedor">
        <ScrollView>
          <GridLayout
            ref="form"
            rows="auto,auto,auto,auto,auto,auto,60,auto,auto,auto,auto"
            class="shadow"
            backgroundColor="#F4F6F8"
            borderWidth="1"
            borderColor="#c0c9d7"
            borderRadius="5"
            padding="20"
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
        </ScrollView>
        <!-- <Signature /> -->
      </Collapse>
      <Label
        row="0"
        textWrap="true"
        class="info"
        v-if="container_reports.length === 0 && formCollapse === false"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fas" text.decode="&#x1f6e0; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        row="1"
        ref="listView"
        for="(item, index) in container_reports"
        v-if="container_reports.length > 0 && formCollapse === false"
      >
        <v-template>
          <GridLayout columns="*, 40">
            <StackLayout orientation="horizontal" col="0">
              <Label
                :text="'fa-tools' | fonticon"
                class="fas"
                width="16%"
                fontSize="70"
                color="#EAB14D"
              />
              <StackLayout class="heigth" width="75%">
                <Label
                  text="Reporte:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="18"
                />
                <Label textWrap="true">
                  <FormattedString>
                    <Span text="Contenedor: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span text="Tipo: " fontWeight="bold" fontSize="15" />
                    <Span :text="nameType(item.type_id) + '\n'" fontSize="15" />
                    <Span text="Buque: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.vessel + '\n'" fontSize="15" />
                    <Span text="Tecnico: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.role + '\n'" fontSize="15" />
                    <Span text="Elemntos:" fontWeight="bold" fontSize="15" />
                  </FormattedString>
                </Label>
                <StackLayout
                  v-for="(repair, index) in item.repairs"
                  :key="index"
                  style="padding: 0px 5px 5px 8px"
                >
                  <Label :text="repair.name" class="subTittle" fontSize="12" />
                  <Tag :items="repair.repair_damage" labelIterator="name" />
                </StackLayout>
              </StackLayout>
            </StackLayout>
            <Label
              :text="'fa-ellipsis-v' | fonticon"
              class="fas iconOptions"
              fontSize="18"
              col="1"
              style="text-align: center"
            />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </StackLayout>
  <!-- </page> -->
</template>

<script>
const {
  getContainerReport,
  getTypes,
  getAdditionalDamage,
  storeContainerReport,
  getContainerElements,
  getDamage,
} = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import DamagedItems from "~/views/evidence/containerReport/damagedItems/DamagedItems.vue";
import ListComponent from "~/components/listComponent/ListComponent";
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    DamagedItems,
    ListComponent
  },

  data() {
    return {
      message: "No hay registros para mostrar",
      formCollapse:false,
      model: {
        management_id: null,
        code: "MSG1112020000567896",
        type_id: 1,
        role: "Mecanico",
        damages_repairs: [],
        additional_damage_id: [2, 3, 4],
        observation: "Testing",
      },
      types: [],
      additionalDamage: [],
      elements: [],
      info: [],
      container_reports: [],
      icons: {},
      isScrolling: false,
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel", "damagedItems"]),
  },

  methods: {
    ...mapMutations("evidenceStore", ["setDamagedItem", "cleanDamagedItems"]),
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
          this.model.damages_repairs = this.damagedItems;
          this.loadingCharge(true);
          const res = await storeContainerReport(this.model);
          Alert.success("Reporte creado");
        } else {
          Alert.info("¡Verique que no haya campos obligatorios, vacios!", 1);
          this.showMessageError();
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

    async getEvidences() {
      console.log("management model ", this.managementModel);
      try {
        this.loadingCharge(true);
        const res = await getContainerReport(this.managementModel.id);
        this.container_reports = res.data;
        console.log("reports ", this.container_reports);
        /* const aux = await getRepairDamage()
        console.log("aux ", aux.data);
        const r = await getRepairs()
        console.log("r ", r.data); */
        /*  if (this.types.length === 0) {
          const types = await getTypes();
          this.types = types.data;
        } */
      } catch (error) {
        Alert.danger("Hubo un error al traer informacion", error.message);
      } finally {
        this.loadingCharge();
      }
    },

    nameType(type_id) {
      const type = this.types.find((prev) => prev.id === type_id);
      if (type === null || type === undefined) {
        return type_id;
      }
      return type.name;
    },

    initialMethods() {
      this.cleanDamagedItems();
      this.model.management_id = this.managementModel.id;
      this.InfoSelect();
      this.getEvidences();
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
