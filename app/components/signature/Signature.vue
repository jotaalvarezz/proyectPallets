<template>
  <StackLayout marginTop="10">
    <Label
      text="Firma :"
      fontSize="14"
      fontWeight="bold"
      style="color: #3c495e; width: 90%"
    />
    <CanvasView
      ref="canvas"
      width="90%"
      height="200"
      borderWidth="1"
      borderRadius="5"
      borderColor="#3c495e"
      @draw="onDraw"
      @touch="onTouch"
    />
    <button @tap="capturar" style="width: 90%">Limpiar</button>
  </StackLayout>
</template>

<script>
import { Canvas, Paint } from "@nativescript-community/ui-canvas";
import { getViewById } from "@nativescript/core";
import { Image } from "@nativescript/core";

export default {
  data() {
    return {
      isDrawing: false,
      previousPoint: null,
      points: [],
      currentPoint: [],
    };
  },
  methods: {
    onDraw(event) {
      const canvas = event.canvas;
      const paint = new Paint();
      paint.setStrokeWidth(5);
      paint.setColor("#000000");
      console.log("currentpoints ", this.currentPoint);
      // Dibujar los trazos anteriores
      for (let i = 1; i < this.currentPoint.length; i++) {
        const previousPoint = this.currentPoint[i - 1];
        const currentPoint = this.currentPoint[i];
        canvas.drawLine(
          previousPoint.x,
          previousPoint.y,
          currentPoint.x,
          currentPoint.y,
          paint
        );
      }

      for (let i = 1; i < this.points.length; i++) {
        const previousPoint = this.points[i - 1];
        const currentPoint = this.points[i];
        canvas.drawLine(
          previousPoint.x,
          previousPoint.y,
          currentPoint.x,
          currentPoint.y,
          paint
        );
      }
    },

    onTouch(args) {
      console.log("points ", this.points.length);
      const action = args.android.getAction();
      const x = args.getX();
      const y = args.getY();

      switch (action) {
        case android.view.MotionEvent.ACTION_DOWN:
          this.isDrawing = true;
          this.points.push({ x, y });
          break;

        case android.view.MotionEvent.ACTION_MOVE:
          if (this.isDrawing) {
            this.points.push({ x, y });
            this.$refs.canvas.nativeView.invalidate();
          }
          break;

        case android.view.MotionEvent.ACTION_UP:
          this.isDrawing = false;
          this.currentPoint = this.points;
          this.points = [];
          break;
      }
    },

    clean() {
      this.currentPoint = [];
      this.points = [];
      this.$refs.canvas.nativeView.invalidate();
    },

    async capturar() {
      const canvas = getViewById(this.$refs.canvas.nativeView, "canvas");
      this.signatureData = canvas.toDataURL(); // Convertir la firma a formato base64
      console.log("Firma guardada:", this.signatureData);
      // Aquí puedes guardar la firma en la base de datos u otro almacenamiento
    },
  },
};
</script>
