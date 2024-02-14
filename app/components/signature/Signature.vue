<template>
  <StackLayout>
    <Label
      text="Firma :"
      fontSize="18"
      fontWeight="bold"
      style="color: #3c495e; width: 80%"
    />
    <CanvasView
      ref="canvas"
      width="430"
      height="200"
      borderWidth="2"
      borderColor="#3c495e"
      @draw="onDraw"
      @touch="onTouch"
    />
    <button @tap="clean">Limpiar</button>
  </StackLayout>
</template>

<script>
import { Canvas, Paint } from "@nativescript-community/ui-canvas";

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
  },
};
</script>
