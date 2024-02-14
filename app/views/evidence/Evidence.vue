<template>
  <page>
    <Header :data="info" :icons="icons" :search="false" />
    <StackLayout backgroundColor="#F4F6F8">
      <card-view margin="10" elevation="40" radius="15">
        <GridLayout
          rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto"
          padding="30"
        >
          <Label
            class="text-center"
            text="CONTAINER DAMAGE REPORT"
            fontSize="18"
            color="#3c495e"
            fontWeight="bold"
          ></Label>
          <Label
            row="1"
            text="BUQUE :"
            fontSize="18"
            fontWeight="bold"
            style="color: #3c495e; width: 80%"
          />
          <TextField
            ref="field"
            row="2"
            isEnabled="false"
            v-model="model.buque"
            padding="10"
            hint="code..."
            class="fas"
            height="45"
            fontSize="18"
            boder="none"
            style="
              placeholder-color: #3c495e;
              color: #3c495e;
              background-color: #c0c9d7;
              width: 80%;
            "
          />
          <Label
            row="3"
            text="N° CONTAINER:"
            fontSize="18"
            fontWeight="bold"
            style="color: #3c495e; width: 80%"
          />
          <TextField
            ref="field"
            row="4"
            isEnabled="false"
            v-model="model.code"
            padding="10"
            hint="code..."
            class="fas"
            height="45"
            fontSize="18"
            boder="none"
            style="
              placeholder-color: #3c495e;
              color: #3c495e;
              background-color: #c0c9d7;
              width: 80%;
            "
          />
          <Signature row="5"/>
        </GridLayout>
        <!-- <Signature /> -->
      </card-view>
    </StackLayout>
  </page>
</template>

<script>
import Header from "~/components/header/Header.vue";
import Signature from "~/components/signature/Signature.vue";

export default {
  components: {
    Header,
    Signature,
  },

  data() {
    return {
      model: {},
      info: [],
      icons: {},
    };
  },
};
</script>
