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
      <ListView ref="listView" for="(item, index) in listOfItems">
        <v-template>
          <GridLayout columns="*,40">
            <StackLayout orientation="horizontal" col="0">
              <Label
                :text="icon | fonticon"
                class="fas"
                width="110"
                fontSize="70"
                color="#EAB14D"
              />
              <StackLayout class="heigth" width="100%">
                <Label
                  text="Daño:"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="18"
                />
                <StackLayout
                  style="padding-top: 0px; padding-bottom: 0px"
                  v-for="(info, index) in item"
                  :key="index"
                >
                  <WrapLayout v-if="Array.isArray(info) && info.length > 0">
                    <Label
                      v-for="(subInfo, index) in info"
                      :key="index"
                      class="tag"
                      :text="subInfo.text"
                    />
                  </WrapLayout>
                  <Label
                    v-else-if="typeof info === 'number'"
                    :text="elementName(info)"
                    style="padding-bottom: 0px; padding-top: 0px"
                  />
                  <Switch
                    v-else-if="typeof info === 'boolean'"
                    :class="info === true ? 'switchEnable':'switchDisable'"
                    isEnabled="false"
                    horizontalAlignment="right"
                    width="50"
                    :checked="info"
                  />
                  <Label
                    v-else
                    :text="info"
                    style="padding-bottom: 0px; padding-top: 0px"
                  />
                </StackLayout>
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
          ],
          state: true,
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
            }
          ],
          state: false,
        },
      ],
    };
  },

  computed: {

  },

  methods: {
    elementName(id) {
      const element = this.elements.find((prev) => prev.id === id);
      if(element === null || element === undefined){
        return id
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
