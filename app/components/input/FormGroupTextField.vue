<template>
  <StackLayout marginTop="10">
    <Label
      :text="label"
      :fontSize="fontsize"
      fontWeight="bold"
      style="color: #3c495e; width: 90%"
    />
    <TextField
      v-if="!textArea"
      ref="field"
      class="input"
      :isEnabled="enable"
      :text="value"
      :keyboardType="typeInput"
      :secure="pass"
      padding="10"
      :hint="placeholder"
      height="45"
      :fontSize="fontsize"
      border="none"
      borderRadius="2"
      @textChange="onTextChange"
    />
    <TextView
      v-if="textArea"
      class="input"
      :text="value"
      padding="10"
      :fontSize="fontsize"
      borderRadius="2"
      @textChange="onTextChange"
    />
    <Label
      v-if="validate && textValue.length === 0 && showError"
      class="label-error"
      :text="'*el campo ' + validateLabel + ' es oblogatorio'"
    />
  </StackLayout>
</template>

<script>
import { mapState } from "vuex";

export default {
  name:"FormGroupTextField",
  props: {
    label: {
      type: String,
      required: true,
    },
    fontsize: {
      type: Number,
      default: 14,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
    },
    textArea: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: Boolean,
      default: false,
    },
    typeInput:{
      type: String,
      default: "text",
    },
    pass:{
      type: Boolean,
      default: false
    }
  /*   showError:{
      type:Boolean,
      default:false
    } */
  },

  data() {
    return {
      validateLabel: "",
      textValue: "",
    };
  },

  computed:{
    ...mapState(["showError"])
  },

  methods: {
    onTextChange(args) {
      this.textValue = args.object.text;
      /* if(this.showError){ */
      /* } */
      this.$emit("input", this.textValue);
    },

    formatLabel() {
      const size = this.label.length;
      const label = this.label;
      this.validateLabel =
        this.label.charAt(0).toUpperCase() +
        label.slice(1, size - 1).toLowerCase();
      return this.validateLabel;
    },
  },

  created() {
    this.formatLabel();
  },
};
</script>

<style scoped>
.input {
  placeholder-color: #3c495e;
  color: #3c495e;
  background-color: #c0c9d7;
  width: 90%;
  opacity: 0.9;
}

.label-error {
  color: #e92222;
  width: 90%;
  text-align: left;
}
</style>
