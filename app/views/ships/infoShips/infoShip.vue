<template>
  <Page>
    <StackLayout backgroundColor="#F4F6F8">
      <GridLayout
        height="55"
        rows="*"
        columns="50, 3*, 50"
        backgroundColor="#00acc1"
      >
        <Label
          row="0"
          col="2"
          :text="'fa-times' | fonticon"
          fontSize="16"
          class="fas text-center"
          color="#F4F6F8"
          @tap="$modal.close"
        />
        <Label
          row="0"
          col="1"
          class="text-center text-decoration"
          text="Infomacion del Barco"
          fontSize="15"
          color="#F4F6F8"
          fontWeight="bold"
        ></Label>
      </GridLayout>
      <GridLayout
        rows="auto,auto,auto,auto,auto"
        padding="20"
        backgroundColor="#F4F6F8"
        margin="20"
        borderWidth="1"
        borderColor="#3c495e"
        borderRadius="5"
      >
        <Label row="0" textWrap="true">
          <FormattedString>
            <Span text="Nombre: " fontWeight="bold" fontSize="14" />
            <Span :text="info.text + '\n'" fontSize="14" />
          </FormattedString>
        </Label>
        <Stripe row="1" color="#3c495e" ml="0" mr="0"/>
        <Label row="2" textWrap="true">
          <FormattedString>
            <Span text="Viaje: " fontWeight="bold" fontSize="14" />
            <Span :text="info.journey" fontSize="14" />
          </FormattedString>
        </Label>
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import Stripe from "~/components/stripe/Stripe";

export default {
  components: { Stripe },
  props: {
    info: {
      type: Object,
    },
  },
};
</script>

<style>
.text-decoration {
  text-decoration: underline;
}
</style>
