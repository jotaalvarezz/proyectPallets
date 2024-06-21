<template>
  <StackLayout marginTop="10">
    <Label
      :text="label"
      :fontSize="fontsize"
      fontWeight="bold"
      style="color: #3c495e; width: 90%"
    />
    <!-- <TextField
      v-if="!textArea"
      ref="field"
      class="input"
      width="90%"
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
    /> -->
    <StackLayout orientation="horizontal" width="90%">
      <TextField
        v-if="!textArea"
        ref="field"
        margin="0"
        class="input"
        :width="pass === true ? '92%' : '100%'"
        :isEnabled="enable"
        :text="value"
        :keyboardType="typeInput"
        :secure="pass"
        padding="10"
        :hint="placeholder"
        height="45"
        :fontSize="fontsize"
        border="none"
        borderTopLeftRadius="2"
        borderBottomLeftRadius="2"
        :borderTopRightRadius="pass ? '0' : '2'"
        :borderBottomRightRadius="pass ? '0' : '2'"
        @textChange="onTextChange"
      />
      <Label
        v-if="pass === true"
        ref="hoverLabel"
        :text="securefield ? 'fa-eye' : 'fa-eye-slash' | fonticon"
        fontSize="16"
        class="far label-Lock text-center"
        width="8%"
        height="45"
        borderTopRightRadius="2"
        borderBottomRightRadius="2"
        @touch="onTouch"
        @tap="showPassword"
      />
    </StackLayout>
    <TextView
      v-if="textArea"
      class="input"
      width="90%"
      :text="value"
      padding="10"
      :fontSize="fontsize"
      borderRadius="2"
      @textChange="onTextChange"
    />
    <Label
      v-if="required && textValue.length === 0"
      class="label-error"
      :text="'*el campo ' + validateLabel + ' es oblogatorio'"
    />
  </StackLayout>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "FormGroupTextField",
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
    required: {
      type: Boolean,
      default: false,
    },
    typeInput: {
      type: String,
      default: "text",
    },
    pass: {
      type: Boolean,
      default: false,
    },
    /*   showError:{
      type:Boolean,
      default:false
    } */
  },

  data() {
    return {
      validateLabel: "",
      textValue: "",
      securefield: true,
    };
  },

  computed: {
    ...mapState(["showError"]),
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

    showPassword() {
      let field = this.$refs.field.nativeView;
      if (field.secure) {
        this.securefield = false;
        field.secure = this.securefield;
      } else {
        this.securefield = true;
        field.secure = this.securefield;
      }
    },

    onTouch(event) {
      const hoverLabel = this.$refs.hoverLabel.nativeView;
      switch (event.action) {
        case "down":
          // El usuario ha tocado la pantalla
          hoverLabel.animate({
            backgroundColor: "rgba(216, 226, 232, 0.5)", // Cambiar el color de fondo
            duration: 300,
          });
          break;
        case "up":
          // El usuario ha levantado el dedo de la pantalla
          hoverLabel.animate({
            backgroundColor: "#c0c9d7", // Revertir al color original
            duration: 300,
          });
          break;
        case "cancel":
          // El toque ha sido cancelado
          hoverLabel.animate({
            backgroundColor: "#c0c9d7", // Revertir al color original
            duration: 300,
          });
          break;
      }
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
  opacity: 0.9;
}

.label-Lock {
  placeholder-color: #3c495e;
  color: #3c495e;
  background-color: #c0c9d7;
  opacity: 0.9;
}

.label-error {
  color: #e92222;
  width: 90%;
  text-align: left;
}
</style>
