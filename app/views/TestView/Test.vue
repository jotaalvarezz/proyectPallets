<template>
  <Page>
    <ActionBar title="Registro de Tiendas">
      <ActionItem
        @tap="prev"
        ios.systemIcon="13"
        android.systemIcon="ic_media_previous"
        ios.position="left"
        android.position="actionBar"
      />
      <ActionItem
        @tap="next"
        ios.systemIcon="14"
        android.systemIcon="ic_media_next"
        ios.position="right"
        android.position="actionBar"
      />
    </ActionBar>

    <ScrollView>
      <StackLayout>
        <!-- Paso 1: Datos de la tienda -->
        <StackLayout v-if="step === 0" padding="20">
          <Label text="Paso 1: Datos de la Tienda" class="h2" />
          <TextField v-model="tiendaActual.nombre" hint="Nombre de la tienda" />
          <TextField v-model="tiendaActual.direccion" hint="Dirección" />
          <TextField v-model="tiendaActual.propietario" hint="Propietario" />
        </StackLayout>

        <!-- Paso 2: Productos -->
        <StackLayout v-if="step === 1" padding="20">
          <Label text="Paso 2: Agregar Mercancía" class="h2" />

          <ScrollView height="300">
            <StackLayout>
              <StackLayout
                v-for="(item, index) in mercanciasTemp"
                :key="index"
                class="card"
                marginBottom="10"
              >
                <Label :text="`Producto ${index + 1}`" fontWeight="bold" />
                <TextField v-model="item.nombre" hint="Nombre del producto" />
                <TextField
                  v-model="item.cantidad"
                  hint="Cantidad"
                  keyboardType="number"
                />
                <TextField
                  v-model="item.precio"
                  hint="Precio"
                  keyboardType="number"
                />
              </StackLayout>
            </StackLayout>
          </ScrollView>

          <Button
            text="➕ Agregar otro producto"
            @tap="agregarMercancia"
            marginTop="10"
          />
        </StackLayout>

        <!-- Mensaje de error -->
        <Label v-if="error" :text="error" color="red" margin="10" />

        <!-- Botón para guardar -->
        <Button
          v-if="step === 1"
          text="💾 Guardar Tienda"
          class="btn btn-primary"
          @tap="guardarTienda"
          marginTop="10"
        />

        <!-- Lista de tiendas -->
        <StackLayout v-if="tiendas.length > 0" marginTop="20" padding="20">
          <Label text="Tiendas registradas:" class="h3" />
          <StackLayout
            v-for="(t, i) in tiendas"
            :key="i"
            class="card"
            padding="10"
            backgroundColor="#f0f0f0"
            marginBottom="10"
          >
            <Label
              :text="`🛒 ${t.nombre} (${t.propietario})`"
              fontWeight="bold"
            />
            <Label :text="`📍 ${t.direccion}`" />
            <Label :text="`🧾 Productos: ${t.mercancias.length}`" />
            <GridLayout columns="*,*" marginTop="5">
              <Button text="✏️ Editar" @tap="editarTienda(i)" col="0" />
              <Button text="🗑️ Eliminar" @tap="eliminarTienda(i)" col="1" />
            </GridLayout>
          </StackLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
export default {
  data() {
    return {
      step: 0,
      error: "",
      editIndex: null,
      tiendas: [],
      tiendaActual: {
        nombre: "",
        direccion: "",
        propietario: "",
      },
      mercanciasTemp: [{ nombre: "", cantidad: "", precio: "" }],
    };
  },
  methods: {
    next() {
      if (this.step < 1) this.step++;
    },
    prev() {
      if (this.step > 0) this.step--;
    },
    agregarMercancia() {
      this.mercanciasTemp.push({ nombre: "", cantidad: "", precio: "" });
    },
    guardarTienda() {
      // Validación general
      if (
        !this.tiendaActual.nombre ||
        !this.tiendaActual.direccion ||
        !this.tiendaActual.propietario
      ) {
        this.error = "Completa todos los campos de la tienda.";
        this.step = 0;
        return;
      }

      for (const m of this.mercanciasTemp) {
        if (!m.nombre || !m.cantidad || !m.precio) {
          this.error = "Completa todos los campos de los productos.";
          this.step = 1;
          return;
        }
      }

      this.error = "";
      const nuevaTienda = {
        ...this.tiendaActual,
        mercancias: JSON.parse(JSON.stringify(this.mercanciasTemp)),
      };

      if (this.editIndex !== null) {
        this.tiendas[this.editIndex] = nuevaTienda;
      } else {
        this.tiendas.push(nuevaTienda);
      }

      this.resetForm();
      alert("✅ Tienda guardada correctamente");
    },
    editarTienda(index) {
      const tienda = this.tiendas[index];
      this.tiendaActual = { ...tienda };
      this.mercanciasTemp = JSON.parse(JSON.stringify(tienda.mercancias));
      this.editIndex = index;
      this.step = 0;
    },
    eliminarTienda(index) {
      this.tiendas.splice(index, 1);
    },
    resetForm() {
      this.tiendaActual = { nombre: "", direccion: "", propietario: "" };
      this.mercanciasTemp = [{ nombre: "", cantidad: "", precio: "" }];
      this.editIndex = null;
      this.step = 0;
    },
  },
};
</script>
