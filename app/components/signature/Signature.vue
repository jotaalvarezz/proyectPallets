<template>
  <StackLayout margin="10" backgroundColor="#F4F6F8">
    <Label
      text="Firma :"
      fontSize="14"
      fontWeight="bold"
      style="color: #3c495e; width: 90%"
    />
    <DrawingPad
      ref="drawingPad"
      height="200"
      width="90%"
      penWidth="3"
      borderWidth="1"
      borderRadius="5"
      borderColor="#3c495e"
    >
    </DrawingPad>
    <Stripe color="#3c495e" mt="10" mb="10" />
    <Button
      text="Guardar"
      backgroundColor="#F4F6F8"
      color="#222a37"
      style="width: 90%; margin-bottom: 5px"
      @tap="getMyDrawing"
      borderWidth="1"
      borderColor="#222a37"
      borderRadius="30"
    />
    <Button
      text="Limpiar"
      backgroundColor="#F4F6F8"
      color="#222a37"
      style="width: 90%"
      @tap="clean"
      borderWidth="1"
      borderColor="#222a37"
      borderRadius="30"
    />
  </StackLayout>
</template>

<script>
import { ImageSource } from "@nativescript/core";
import Stripe from "~/components/stripe/Stripe";

export default {
  components: {
    Stripe,
  },

  props:{
    signature:{
      type:String,
      default:""
    }
  },

  data() {
    return {
      isDrawing: false,
      previousPoint: null,
      points: [],
      currentPoint: [],
    };
  },
  methods: {
    clean() {
      this.$refs.drawingPad.nativeView.clearDrawing();
    },

    async getMyDrawing(args) {
      // get reference to the drawing pad
      try {
        const pad = this.$refs.drawingPad.nativeView;
        const res = await pad.getDrawing();
        const img = new ImageSource(res);
        const base64imageString = img.toBase64String("jpg");
        this.$modal.close({
          signature: base64imageString,
        });
      } catch (error) {
        this.$modal.close({
          signature: "",
        });
        console.log("err ", error);
      }
    },
  },
};
</script>
