import ViewImage from "~/components/viewImage/ViewImage.vue";
import ButtomSheet from "~/components/buttomSheet/ButtomSheet.vue";
import Collapse from "~/components/collapse/Collapse.vue";
import ContentDrawer from "~/components/contentDrawer/ContentDrawer.vue";
import FloatingButton from "~/components/floatingButton/FloatingButton.vue";
import Header from "~/components/header/Header.vue";
import FormGroupTextField from "~/components/input/FormGroupTextField.vue";
import ListComponent from "~/components/listComponent/ListComponent.vue";
import searchView from "~/components/search/searchView.vue";
import SelectField from "~/components/selectField/SelectField.vue";
import Signature from "~/components/signature/Signature.vue";
import Stripe from "~/components/stripe/Stripe.vue";
import Tag from "~/components/tag/Tag.vue";
import ListModal from "~/components/listModal/ListModal.vue";
import GeneralComponent from "~/components/GeneralComponent/GeneralComponent.vue";

const GlobalComponents = {
  install(Vue) {
    Vue.component(ViewImage.name, ViewImage);
    Vue.component(ButtomSheet.name, ButtomSheet);
    Vue.component(Collapse.name, Collapse);
    Vue.component(ContentDrawer.name, ContentDrawer);
    Vue.component(FloatingButton.name, FloatingButton);
    Vue.component(Header.name, Header);
    Vue.component(FormGroupTextField.name, FormGroupTextField);
    Vue.component(ListComponent.name, ListComponent);
    Vue.component(searchView.name, searchView);
    Vue.component(SelectField.name, SelectField);
    Vue.component(Signature.name, Signature);
    Vue.component(Stripe.name, Stripe);
    Vue.component(Tag.name, Tag);
    Vue.component(ListModal.name, ListModal);
    Vue.component(GeneralComponent.name, GeneralComponent);
  }
}

export default GlobalComponents;
