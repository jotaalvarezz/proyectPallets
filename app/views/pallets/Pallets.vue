<template>
  <Page @loaded="addFocus">
    <Header :search="false" />
    <grid-layout rows="auto, *" backgroundColor="#F4F6F8">
      <card-view margin="10" elevation="2" radius="5" row="0">
        <GridLayout rows="auto,auto,auto,auto" padding="30">
          <StackLayout row="0" orientation="horizontal">
            <Image
              src="~/assets/images/logopallets.png"
              stretch="aspectFit"
              height="10%"
              width="40%"
            />
            <card-view
              margin="22"
              elevation="18"
              radius="25"
              width="155"
              style="height: 88"
            >
              <StackLayout>
                <Label
                  text="N° de Pallets:"
                  textAlignment="center"
                  fontSize="18"
                  margin="5"
                  fontWeight="bold"
                  style="color: #3c495e"
                  width="145"
                />
                <Label
                  :text="pallets.length"
                  textAlignment="center"
                  fontSize="18"
                  fontWeight="bold"
                  style="color: #000000; width: auto; margin: 0 15 0 15"
                  backgroundColor="#c0c9d7"
                  borderRadius="5"
                />
              </StackLayout>
            </card-view>
          </StackLayout>
          <Label
            row="1"
            text="Pallet:"
            fontSize="14"
            fontWeight="bold"
            style="color: #3c495e; width: 80%"
          />
          <TextField
            ref="field"
            row="2"
            v-model="code"
            padding="10"
            borderRadius="2"
            hint="codigo..."
            class="fas inputStyle"
            height="45"
            fontSize="14"
            boder="none"
          />
        </GridLayout>
      </card-view>
      <Label class="info" v-if="pallets.length == 0" row="1">
        <FormattedString>
          <Span class="fas" text.decode="&#x1F4E6; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
      <ListView
        for="(item, index) in pallets"
        :class="spaceEnd"
        @itemTap="onItemTap"
        @itemLoading="scrolling"
        @loadMoreItems="onScroll"
        row="1"
        v-if="pallets.length > 0"
      >
        <v-template>
          <GridLayout columns="30,*,50">
            <Label
              col="0"
              :text="index + 1"
              fontSize="11"
              textWrap="true"
              fontWeight="bold"
              class="styleIndex"
            />
            <StackLayout col="1" orientation="horizontal">
              <Label
                backgroundColor="#D8E2E8"
                :text="'fa-pallet' | fonticon"
                class="nt-drawer__header-image fas"
                fontSize="45"
                color="#EAB14D"
              />
              <StackLayout class="heigth">
                <Label
                  text="Pallet:"
                  class="subTittle"
                  textWrap="true"
                  width="auto"
                  fontSize="15"
                />
                <Label textWrap="true">
                  <FormattedString>
                    <Span text="Codigo: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.code + '\n'" fontSize="15" />
                    <Span text="Observacion: " fontWeight="bold" fontSize="15" />
                    <Span :text="item.observation ? item.observation  : 'Sin observacion...'" fontSize="15" />
                  </FormattedString>
                </Label>
              </StackLayout>
            </StackLayout>
            <ButtonNavigate
              col="2"
              height="50"
              width="50"
              icon="fa-times"
              iconColor="#e92222"
              radius="50"
              :handleEvent="() => deleteRow(item.id, index)"
            />
          </GridLayout>
        </v-template>
      </ListView>
    </grid-layout>
  </Page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import { mapState } from "vuex";
import CreateEditPallet from "~/views/pallets/CreateEditPallet/CreateEditPallet.vue";
import CustomInput from "~/components/pallets/inputObservation/CustomInput";
const {
  getPallets,
  insertPallet,
  deletePallet,
  updatePallet,
} = require("~/sqlite/database");
import Alert from "~/alerts/Alerts";
import moment from "moment";

export default {
  name: "Ships",
  components: {
    FloatingButton,
    /*  CreateEditShip, */
    Header,
  },
  data() {
    return {
      message: "No hay Pallets Escaneados",
      bandera: false,
      model: {
        code: "",
        warehouse_id: "",
      },
      code: "",
      typingTimer: null,
      typingTimeout: 500,
      pallets: [],
    };
  },
  computed: {
    ...mapState(["item"]),

    spaceEnd() {
      return {
        "e-height": this.bandera == true,
        "n-height": this.bandera == false,
      };
    },
  },
  watch: {
    code() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(this.savePallet, this.typingTimeout);
    },
  },
  methods: {
    scrolling() {
      if (this.bandera) {
        this.bandera = false;
      }
    },

    onScroll() {
      this.bandera = true;
    },

    onItemTap(event) {
      this.addObservation(event.item);
    },

    addObservation(item) {
      this.$showModal(
        CustomInput
        /* {
          fullscreen: false,
          props: {
            item: item
          }
        } */
      ).then((res) => {
        if (res.option) {
          item.observation = res.observation;
          this.editPallet(item);
        }
      });
    },

    async editPallet(item) {
      try {
        const pallet = await updatePallet(item);
      } catch (error) {
        console.error("Hubo un error al editar ", error);
      }
    },

    async deleteRow(id, index) {
      let confirmated = await Alert.Danger(1);
      if (confirmated) {
        try {
          const record = await deletePallet(id);
          this.pallets.splice(index, 1);
        } catch (error) {
          console.log("eleminacion fallida ", error);
        }
      }
    },

    checkRepeated() {
      const pallet = this.pallets.find((d) => d.code == this.code);

      return pallet;
    },

    async savePallet() {
      try {
        if (this.code.length > 0 && !this.checkRepeated() && this.code.trim()) {
          this.model.code = this.code;
          this.model.warehouse_id = this.item.id;
          this.model.pallet_creation = moment().format("YYYY-MM-DD HH:mm:ss");
          const pallet = await insertPallet(this.model);
          this.code = "";
          this.model.warehouse_id = "";
          this.$refs.field.nativeView.focus();
          this.getPallets();
        } else if (this.checkRepeated()) {
          Alert.info("EL PALLET " + this.code + " YA FUE SCANNEADO! ", 2).then(
            () => {
              this.code = "";
            }
          );
        }
      } catch (error) {
        console.log("al insertar error ", error);
        0;
      }
    },

    async getPallets() {
      try {
        this.pallets = [];
        const res = await getPallets(this.item.id);
        this.pallets = res.data;
        this.pallets.reverse();
      } catch (error) {
        console.error("error", error);
      }
    },

    addFocus() {
      this.$refs.field.nativeView.focus();
    },
  },

  created() {
    this.getPallets();
  },
  /* components: { GridLayout }, */
};
</script>
<style lang="scss" scoped>
.fab-sync {
  height: 70;
  width: 70; /// this is required on iOS - Android does not require width so you might need to adjust styles
  margin: 15;
  background-color: #00acc1;
  color: #f4f6f8;
  horizontal-align: right;
  vertical-align: bottom;
}

.heigth {
  height: 70%;
}
.n-height {
  height: 100%;
}

.e-height {
  height: 300px;
}

.colorIcons {
  color: #222a37;
}

.subTittle {
  color: #222a37;
  text-decoration: underline;
  font-weight: bold;
}

.inputStyle {
  placeholder-color: #3c495e;
  color: #3c495e;
  background-color: #c0c9d7;
  width: 80%;
}

.styleIndex {
  background-color: #3c495e;
  color: #f4f6f8;
  text-align: center;
  border-radius: 50px;
}
.colorMinus {
  color: #e92222;
  height: auto;
  text-align: center;
}

.info {
  font-size: 16;
  horizontal-align: center;
  vertical-align: center;
}
</style>
