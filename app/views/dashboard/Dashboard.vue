<template>
  <Page @loaded="initialMethod">
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

      <!-- Implementación de Material Tabs -->
      <MDTabs row="2" selectedIndex="0" tabsPosition="bottom">
        <!-- Tab Strip (encabezados de los tabs) -->
        <MDTabStrip>
          <MDTabStripItem>
            <Label text="Gestion" />
            <Image src="~/assets/images/gestion.png" class="fas size-icon" />
          </MDTabStripItem>
          <MDTabStripItem>
            <Label text="Sincronizar" />
            <Image src="~/assets/images/sincronizar.png" class="fas" stretch="fill"/>
          </MDTabStripItem>
        </MDTabStrip>

        <!-- Contenido del primer tab -->
        <MDTabContentItem>
          <ScrollView>
            <StackLayout>
              <StackLayout
                margin="15"
                v-for="(item, index) in processModules"
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
        </MDTabContentItem>

        <!-- Contenido del segundo tab (mismo contenido por ahora) -->
        <MDTabContentItem>
          <ScrollView>
            <StackLayout>
              <StackLayout
                margin="15"
                v-for="(item, index) in syncModules"
                :key="'tab2-' + index"
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
        </MDTabContentItem>
      </MDTabs>
    </GridLayout>
  </Page>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Dashboard",
  data(){
    return {
      processModules: [],
      syncModules: []
    }
  },

  computed: {
    ...mapState("auth", ["modules"]),
  },

  methods: {
    initialMethod(){
      console.log(this.modules);
      this.processModules = this.modules.filter(item => !item.movil_id.startsWith('ns_sync'));
      this.syncModules = this.modules.filter(item => item.movil_id.startsWith('ns_sync'));
      console.log(this.processModules);
    },

    navegate(url) {
      try {
        this.$router.push(url);
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

.size-icon {
  font-size: 8px;
}

MDTabStrip {
  highlight-color: #EAB14D;
}
</style>
