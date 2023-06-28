<template>
  <StackLayout
    style="background-color: #057ff8; text-align: center"
    height="300"
  >
    <ScrollView>
      <GridLayout
        rows="auto,auto,auto"
        margin="60"
        style="background-color: green; width: 100%"
      >
        <GridLayout
          row="0"
          columns="auto,*"
          @tap="home"
          height="40%"
          width="40%"
          style="background-color: red"
        >
          <Label
            col="0"
            :text="'fa-edit' | fonticon"
            class="fas colorIcons"
            fontSize="30"
            style="background-color: yellow"
          />
          <Label
            col="1"
            text="Editar"
            fontSize="22"
            class="p-l-10 colorIcons"
            style="background-color: rgb(19, 196, 220)"
          />
        </GridLayout>
        <GridLayout
          row="1"
          marginTop="30"
          columns="auto,*"
          height="40%"
          width="40%"
          @tap="pallets"
          style="text-align: center"
        >
          <Label
            col="0"
            :text="'fa-times' | fonticon"
            class="fas colorIcons"
            fontSize="30"
          />
          <Label
            col="1"
            text="Eliminar"
            fontSize="22"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
        <GridLayout
          row="2"
          marginTop="30"
          columns="auto,*"
          height="40%"
          width="40%"
          @tap="pallets"
          style="text-align: center"
        >
          <Label
            col="0"
            :text="'fa-times' | fonticon"
            class="fas colorIcons"
            fontSize="30"
          />
          <Label
            col="1"
            text="Eliminar"
            fontSize="22"
            class="p-l-10 colorIcons"
          />
        </GridLayout>
      </GridLayout>
    </ScrollView>
  </StackLayout>
</template>

<style>
.colorIcons {
  color: #222a37;
}
</style>
