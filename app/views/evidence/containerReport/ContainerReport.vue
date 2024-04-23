<template>
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
        text="Creacion de Reporte/Contenedor"
        fontSize="15"
        color="#F4F6F8"
        fontWeight="bold"
      ></Label>
    </GridLayout>
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
            <!-- <GridLayout
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
            </GridLayout> -->
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
import DamagedItemsList from '~/views/evidence/containerReport/damagedItems/DamagedItemsList.vue'
import Alert from "~/alerts/Alerts";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    DamagedItems
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
        repairs: [],
        additional_damage_id: [2, 3, 4],
        observation: "Testing",
      },
      types: [],
      additionalDamage: [],
      elements: [],
      icons: {},
      isScrolling: false,
    };
  },

  mixins: [mixinMasters],

  computed: {
    ...mapState("evidenceStore", ["managementModel", "damagedItems", "containerReport", "containerReportEdit"]),
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
        console.log("console damage")
      });
    },

    async addContainerReport() {
      console.log("model ", this.model);
      try {
        if (this.model.code.trim() !== "") {
/*           this.model.repairs = this.damagedItems; */
          /* console.log("model.repairs ", this.model); */
          this.loadingCharge(true);
          const res = await storeContainerReport(this.model);
          if (res.status === 500) {
            Alert.info(res.message, 1, "Ya existe");
          } else {
            Alert.success("Reporte creado");
            this.$modal.close();
          }
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

    async updateContainerReport() {
      try {
        const res = await updateContainerReport(this.model);
        console.log("update res ", res);
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
        this.model = this.containerReport;
        this.model.additional_damage_id = additional_damage_id;
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
