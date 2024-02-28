<template>
  <page @loaded="InfoSelect">
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
      <StackLayout
        backgroundColor="#F4F6F8"
        margin="20"
        borderWidth="1"
        borderColor="#3c495e"
        borderRadius="5"
      >
        <SelectField
          row="4"
          :value="model.container_element_id"
          :items="elements"
          label="ELEMENTO:"
          icon="fa-toolbox"
          @value="model.container_element_id = $event"
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
            v-for="item in damages"
            :key="item.id"
            :id="item.id"
            :text="item.name"
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
        <Switch
          horizontalAlignment="left"
          :class="model.state === true ? 'switchEnable' : 'switchDisable'"
          width="50"
          v-model="model.state"
        />
        <Stripe color="#3c495e"/>
        <Button
          backgroundColor="#F4F6F8"
          color="#222a37"
          text="Agregar"
          @tap="addRepair"
          style="width: 80%; margin-bottom: 20px"
          borderWidth="1"
          borderColor="#222a37"
          borderRadius="30"
        />
      </StackLayout>
    </StackLayout>
  </page>
</template>

<script>
const { getDamage } = require("~/sqlite/database");
import mixinMasters from "~/mixins/Master";
import FormGroupTextField from "~/components/input/FormGroupTextField";
import SelectField from "~/components/selectField/SelectField";
import Stripe from '~/components/stripe/Stripe'

export default {
  components: { FormGroupTextField, SelectField, Stripe },
  props: {
    container_elements: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      row: 1,
      col: 0,
      model: {
        container_element_id: null,
        location: "",
        position: "",
        damage_id: [],
        state: false,
      },
      isChecked: null,
      damages: [],
      elements: [],
    };
  },

  mixins: [mixinMasters],

  methods: {
    onCheckedChange(args) {
      const checkbox = args.object;
      if (checkbox.checked) {
        this.model.damage_id.push({
          id: checkbox.id,
          text: checkbox.text,
          checked: checkbox.checked,
        });
      } else {
        const index = this.model.damage_id.findIndex(
          (prev) => prev.text === checkbox.text
        );
        this.model.damage_id.splice(index, 1);
      }
    },

    async addRepair() {
      /* console.log({ model: this.model }); */
      this.$modal.close({ model: this.model, elements: this.elements });
    },

    async InfoSelect() {
      try {
        this.loadingCharge(true);
        const res2 = await getDamage();
        this.damages = res2.data;
        this.elements = this.container_elements;
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingCharge();
      }
    },
  },
};
</script>

<style scoped>
.switchEnable {
  color: #0dcaf0;
  background-color: #cef4fc;
}

.switchDisable {
  color: #e92222;
  background-color: #fad2d2;
}
</style>
