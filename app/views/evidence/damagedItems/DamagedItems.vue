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
          label="TIPO:"
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
        <GridLayout
          rows="auto,auto,auto,auto,auto"
          columns="auto,auto,auto"
          style="width: 90%"
          textWrap="true"
        >
          <Label
            row="0"
            col="0"
            colSpan="3"
            text="DAÑO:"
            textWrap="true"
            marginTop="5"
            fontSize="18"
            fontWeight="bold"
            style="color: #3c495e"
          />
          <!-- 1 -->
          <check-box
            row="1"
            col="0"
            text="AB - ABOLLADO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <check-box
            row="1"
            col="1"
            text="DO - DOBLADO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <check-box
            row="1"
            col="2"
            text="OX - OXIDADO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <!-- 2 -->
          <check-box
            row="2"
            col="0"
            text="SU - SUMIDO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <check-box
            row="2"
            col="1"
            text="SC - SUCIO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <check-box
            row="2"
            col="2"
            text="CO - CORTADO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <!-- 3 -->
          <check-box
            row="3"
            col="0"
            text="FA - FALTA"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <check-box
            row="3"
            col="1"
            text="RO - ROTO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <check-box
            row="3"
            col="2"
            text="ZA - ZAFO"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
          <!-- 4 -->
          <check-box
            row="4"
            col="0"
            text="AC - MANCHAS DE ACEITE"
            :checked="isChecked"
            @checkedChange="isChecked = $event.value"
            style="color: #3c495e; width: 30%"
          />
        </GridLayout>
        <Label
          row="1"
          text="REPARACION :"
          fontSize="18"
          fontWeight="bold"
          style="color: #3c495e; margin-top: 25px; width: 80%"
        />
        <Switch horizontalAlignment="left" width="50" checked="true" />
        <Button
          marginTop="30"
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="Agregar"
          @tap="editPallet"
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
      model: {
        element:'',
        location:'',
        position:''
      },
      isChecked: null,
      elements:[
        'Viga Frontal',
        'Travesaño',
        'Ventilador',
        'Soporte de Uña',
        'Manija de Puerta',
        'Barra de Cierre',
        'Empaque de Puerta',
        'Bisagras',
        'Seguro de Puerta'
      ]
    };
  },

  methods: {
    editPallet() {
      console.log("variable ", this.auxiliar);
    },
  },
};
</script>
