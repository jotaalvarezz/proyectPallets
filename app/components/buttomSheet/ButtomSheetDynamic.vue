<template>
  <StackLayout backgroundColor="#F4F6F8"
    ><!-- backgroundColor="#F4F6F8" -->
    <!-- <ScrollView> -->
    <!-- <GridLayout rows="auto,auto,auto" margin="15" padding="5" style="width: 100%; height:65%;" backgroundColor="#3c495e"> -->
    <!-- **** -->
    <GridLayout
      id="1"
      row="0"
      v-for="(item, index) in events"
      :key="index"
      columns="*,50,120,*"
      @tap="eventButtomSheet(item)"
      @touch="onTouch(index)"
      height="70"
      width="100%"
      class="hover-label"
      :class="isHovered && itemSelector == index ? 'hovered' : ''"
    >
      <Label
        col="1"
        :text="item.icon | fonticon"
        class="fas icon"
        fontSize="20"
      />
      <Label
        col="2"
        :text="item.name"
        fontSize="14"
        class="colorIcons"
        :class="isHovered && itemSelector == index ? 'underline' : ''"
      />
    </GridLayout>
    <!-- **** -->
    <Button
      text="CERRAR"
      row="3"
      backgroundColor="#F4F6F8"
      color="#222a37"
      @tap="$closeBottomSheet()"
      borderWidth="1"
      borderColor="#222a37"
      borderRadius="30"
    />
    <!-- </GridLayout> -->
    <!-- </ScrollView> -->
  </StackLayout>
</template>

<script>
export default {
  name: "ButtonSheetDinamyc",
  props: {
    generalOptions: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
    },
    events:{
        type: Object,
        default:[]
    }
  },
  data() {
    return {
      info: {},
      isHovered: false,
      itemSelector: 0,
    };
  },
  methods: {
    eventButtomSheet(data){
      data.event()
      this.$closeBottomSheet();
    },

    onTouch(n) {
      this.itemSelector = n;
      if (!this.isHovered) {
        this.isHovered = true;
      } else {
        this.isHovered = false;
      }
    },
  },

  created() {},
};
</script>

<style scoped>
.colorIcons {
  color: #222a37;
}

.iconDelete {
  color: #fb404b;
}

.iconEdit {
  color: #eab14d;
}

.iconDetalles {
  color: #0096b7;
}

.icon {
  color: #3c495e;
}

.underline {
  text-decoration: underline;
}
.hover-label {
  /* padding-left: 120%; */
  font-size: 24;
  color: #222a37;
}

.hovered {
  background-color: lightgray;
  text-decoration: underline;
}
</style>
