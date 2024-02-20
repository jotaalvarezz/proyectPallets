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
      :isEnabled="enable"
      :value="value"
      padding="10"
      :hint="placeholder"
      height="45"
      fontSize="18"
      border="none"
      style="
        placeholder-color: #3c495e;
        color: #3c495e;
        background-color: #c0c9d7;
        width: 90%;
      "
      @textChange="onTextChange"
    />
    <TextView
      v-if="textArea"
      :value="value"
      fontSize="18"
      style="
        placeholder-color: #3c495e;
        color: #3c495e;
        background-color: #c0c9d7;
        width: 90%;
      "
    />
  </StackLayout>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    fontsize: {
      type: Number,
      default: 18,
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
  },

  methods: {
    onTextChange(args) {
      const newValue = args.object.text;
      console.log("Nuevo valor:", newValue);
      this.$emit("input", newValue);
    },
  },

  data() {
    return {};
  },
};
</script>
