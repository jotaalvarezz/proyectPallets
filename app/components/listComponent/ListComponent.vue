<template>
  <StackLayout backgroundColor="#F4F6F8">
    <StackLayout
      orientation="horizontal"
      style="background-color: #00acc1; text-align: center"
      height="70"
    >
      <Label
        :text="'fa-reply' | fonticon"
        fontSize="15"
        color="#F4F6F8"
        class="fas text-center"
        width="10%"
        @tap="$modal.close"
      ></Label>
      <Label
        text="Daños/Reparaciones"
        fontSize="18"
        color="#F4F6F8"
        fontWeight="bold"
        width="60%"
      ></Label>
    </StackLayout>
    <GridLayout rows="*" backgroundColor="#F4F6F8">
      <Label
        textWrap="true"
        class="info"
        v-if="listOfItems.length == 0"
        verticalAlignment="center"
      >
        <FormattedString>
          <Span class="fas" text.decode="&#x1f6e0; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <!-- Lista de daños -->
      <ListView
        ref="listView"
        for="(item, index) in listOfItems"
        v-if="listOfItems.length > 0"
      >
        <v-template>
          <GridLayout columns="*,40">
            <StackLayout orientation="horizontal" col="0">
              <!-- <Label
                :text="icon | fonticon"
                class="fas"
                width="auto"
                fontSize="70"
                color="#EAB14D"
              /> -->
              <StackLayout class="heigth" width="100%">
                <Label
                  :text="icon | fonticon"
                  class="fas text-center"
                  width="auto"
                  fontSize="70"
                  color="#EAB14D"
                  backgroundColor="#D8E2E8"
                />
                <Label
                  text="Daño:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="18"
                />
                <Label textWrap="true">
                  <FormattedString>
                    <Span text="Elemento: " fontWeight="bold" fontSize="15" />
                    <Span
                      :text="elementName(item.container_element_id) + '\n'"
                      fontSize="15"
                    />
                    <Span text="Ubicacion: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.location + '\n'" fontSize="15" />
                    <Span text="Posicion: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.position + '\n'" fontSize="15" />
                    <Span
                      text="Tipo de Daño:"
                      fontWeight="bold"
                      fontSize="15"
                    />
                  </FormattedString>
                </Label>
                <Tag :items="item.damage_id" labelIterator="text" />
                <!-- <Switch
                  width="50"
                  v-model="item.state"
                  horizontalAlignment="right"
                /> -->
              </StackLayout>
            </StackLayout>
            <Label
              :text="'fa-ellipsis-v' | fonticon"
              class="fas iconOptions"
              fontSize="18"
              col="1"
              style="text-align: center"
            />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </StackLayout>
</template>

<script>

export default {
  name:"ListComponent",

  props: {
    listOfItems: {
      type: Array,
      default: [],
    },
    container_elements: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "Daño:",
    },
    subTitle: {
      type: String,
      default: "Sin Informacion",
    },
    icon: {
      type: String,
      default: "fa-tools",
    },
  },

  data() {
    return {
      message: "No hay reparaciones para mostrar",
      isSwitchEnabled: false,
      elements: [],
      switche: false,
      model: [
        {
          container_element_id: 1,
          location: "Abajo",
          position: "Derecha",
          damage_id: [
            {
              id: 1,
              text: "AB - ABOLLADO",
              checked: true,
            },
            {
              id: 2,
              text: "DO - DOBLADO",
              checked: true,
            },
            {
              id: 3,
              text: "OX - OXIDADO",
              checked: true,
            },
            {
              id: 3,
              text: "OX - OXIDADO",
              checked: true,
            },
            {
              id: 3,
              text: "OX - OXIDADO",
              checked: true,
            },
            {
              id: 3,
              text: "OX - OXIDADO",
              checked: true,
            },
            {
              id: 3,
              text: "OX - OXIDADO",
              checked: true,
            },
          ]
        },
        {
          container_element_id: 3,
          location: "Arriba",
          position: "Derecha",
          damage_id: [
            {
              id: 1,
              text: "AB - ABOLLADO",
              checked: true,
            },
            {
              id: 2,
              text: "DO - DOBLADO",
              checked: true,
            },
            {
              id: 3,
              text: "OX - OXIDADO",
              checked: true,
            },
          ]
        },
      ],
    };
  },

  computed: {},

  methods: {
    elementName(id) {
      const element = this.elements.find((prev) => prev.id === id);
      if (element === null || element === undefined) {
        return id;
      }
      return element.name;
    },

    InfoSelect() {
      this.listOfItems = this.model;
      this.elements = this.container_elements;
    },
  },

  created() {
    this.InfoSelect();
  },
};
</script>

<style scoped>
.iconOptions {
  color: #303947;
  height: auto;
  text-align: center;
}
.tag {
  height: 26rem;
  margin: 3px 6px 3px 0px;
  border-radius: 5px;
  border-width: 1px;
  /* background-color: #eab14d; */
  border-color: #00acc1;
  color: #00acc1;
}

.switchEnable {
  /* color: #0DCAF0;
  background-color: #cef4fc;*/
  opacity: 1;
  background-color: #00acc1;
}

.switchDisable {
  opacity: 1;
  color: #e92222;
  background-color: #e92222;
}
</style>
