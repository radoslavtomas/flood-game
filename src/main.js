import Vue from "vue";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSquareFull,
  faCircle,
  faAsterisk,
  faSnowflake,
  faStar,
  faStroopwafel,
  faDiceOne,
  faDiceFive,
  faDotCircle,
  faArrowsAlt,
  faArrowsAltV,
  faArrowsAltH
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faSquareFull,
  faCircle,
  faAsterisk,
  faSnowflake,
  faStar,
  faStroopwafel,
  faDiceOne,
  faDiceFive,
  faDotCircle,
  faArrowsAlt,
  faArrowsAltV,
  faArrowsAltH
);

Vue.component("fa-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
