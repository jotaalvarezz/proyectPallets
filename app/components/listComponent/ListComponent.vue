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
              <StackLayout class="heigth">
                <Label
                  :text="title"
                  class="p-l-10 subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="18"
                />
                <Label :text="subTitle" class="p-l-10 colorIcons" fontSize="18" />
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
    title: {
      type: String,
      default: "Daño:",
    },
    subTitle: {
      type: String,
      default: "Sin Informacion",
    },
    icon:{
        type:String,
        default: 'fa-tools'
    }
  },
};
</script>

<style scoped>
.iconOptions {
  color: #303947;
  height: auto;
  text-align: center;
}
</style>
