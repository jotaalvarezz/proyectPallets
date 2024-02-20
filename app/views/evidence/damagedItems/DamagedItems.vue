<template>
  <page>
    <StackLayout backgroundColor="#F4F6F8">
      <StackLayout
        orientation="horizontal"
        style="background-color: #00acc1; text-align: center"
        height="70"
      >
        <Label
          :text="'fa-tools' | fonticon"
          fontSize="15"
          color="#F4F6F8"
          class="fas"
          width="10%"
          @tap="$modal.close"
        ></Label>
        <Label
          text="Registro de Daños/Reparaciones"
          fontSize="18"
          color="#F4F6F8"
          fontWeight="bold"
          width="60%"
        ></Label>
      </StackLayout>
      <StackLayout backgroundColor="#F4F6F8" margin="20">
        <SelectField
          row="4"
          :value="model.element"
          :items="elements"
          label="ELEMENTO:"
          icon="fa-toolbox"
          @value="model.element = $event"
        />
        <FormGroupTextField
          label="UBICACION:"
          placeholder="ubicacion..."
          v-model="model.location"
        />
        <FormGroupTextField
          label="POSICION:"
          placeholder="posicion..."
          v-model="model.position"
        />
        <Label
          text="DAÑO:"
          textWrap="true"
          marginTop="5"
          fontSize="18"
          fontWeight="bold"
          style="color: #3c495e; width: 90%"
        />
        <WrapLayout style="width: 90%">
          <check-box
            v-for="(item, index) in damages"
            :key="index"
            :text="item"
            :checked="isChecked"
            @checkedChange="onCheckedChange"
            style="color: #3c495e; width: 30%"
          />
        </WrapLayout>
        <Label
          row="1"
          text="REPARACION :"
          fontSize="18"
          fontWeight="bold"
          style="color: #3c495e; margin-top: 25px; width: 90%"
        />
        <Switch horizontalAlignment="left" width="50" :checked="model.state"/>
        <Button
          marginTop="30"
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="Agregar"
          @tap="addRepair"
          style="width: 80%"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
      </StackLayout>
    </StackLayout>
  </page>
</template>

<script>
import FormGroupTextField from "~/components/input/FormGroupTextField";
import SelectField from "~/components/selectField/SelectField";

export default {
  components: { FormGroupTextField, SelectField },
  data() {
    return {
      row: 1,
      col: 0,
      model: {
        element: "",
        location: "",
        position: "",
        damaged_selected: [],
        state: false,
      },
      isChecked: null,
      damages: [
        "AB - ABOLLADO",
        "DO - DOBLADO",
        "OX - OXIDADO",
        "SU - SUMIDO",
        "SC - SUCIO",
        "CO - CORTADO",
        "FA - FALTA",
        "RO - ROTO",
        "ZA - ZAFO",
        "AC - MANCHAS DE ACEITE",
      ],
      elements: [
        "Viga Frontal",
        "Travesaño",
        "Ventilador",
        "Soporte de Uña",
        "Manija de Puerta",
        "Barra de Cierre",
        "Empaque de Puerta",
        "Bisagras",
        "Seguro de Puerta",
      ],
    };
  },

  methods: {
    editPallet() {
      console.log("variable ", this.auxiliar);
    },

    onCheckedChange(args) {
      const checkbox = args.object;
      if (checkbox.checked) {
        this.model.damaged_selected.push({
          text: checkbox.text,
          checked: checkbox.checked,
        });
      }else{
        const index = this.model.damaged_selected.findIndex(prev => prev.text === checkbox.text)
        this.model.damaged_selected.splice(index,1)
      }
      console.log("model ", this.model.damaged_selected);
    },

    addRepair(){
      this.$modal.close({model:this.model})
    }
  },
};
</script>
