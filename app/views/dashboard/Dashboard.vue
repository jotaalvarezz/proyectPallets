<template>
  <Page>
    <Header :search="false" />
    <GridLayout rows="auto,auto,*" backgroundColor="#F4F6F8">
      <Label
        row="0"
        text="Dashboard"
        class="dashboard"
        textWrap="true"
        width="auto"
        fontSize="18"
      />
      <Stripe row="1" color="#3c495e" mt="5" mb="20" />
      <ScrollView row="2">
        <StackLayout>
          <StackLayout
            margin="15"
            v-for="(item, index) in modules"
            :key="index"
            height="auto"
          >
            <Label
              horizontalAlignment="left"
              :text="item.name"
              height="40"
              class="cardtitle"
              fontSize="18"
            />
            <card-view
              class="position"
              backgroundColor="#D8E2E8"
              ripple="true"
              elevation="5"
              margin="4"
              radius="15"
              height="245"
              width="auto"
              @tap="navegate(item.url)"
            >
              <FlexboxLayout justifyContent="space-around" height="auto">
                <Label
                  margin="10"
                  alignSelf="center"
                  horizontalAlignment="center"
                  :text="item.icon | fonticon"
                  class="fas text-center"
                  color="#00acc1"
                  fontSize="85"
                />
              </FlexboxLayout>
            </card-view>
          </StackLayout>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapState("auth", ["modules"]),
  },

  methods: {
    navegate(url) {
      try {
        this.$router.pushClear(url);
      } catch (error) {
        Alert.info(
          "error intentando al dirigirse a la ruta " + error,
          1,
          "Error!"
        );
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  color: #222a37;
  font-weight: bold;
  margin-top: 30px;
  margin-left: 25px;
}
</style>
