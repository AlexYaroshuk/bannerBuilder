import { ref, defineComponent } from "vue";
import ElementContainerComponent from "../components/ElementContainer.vue";
import ElementTextComponent from "../components/ElementText.vue";
import { ElementContainer, ElementText } from "./elements";


export default defineComponent({
  components: {
    ElementContainer: ElementContainerComponent,
    ElementText: ElementTextComponent,
  },
  setup() {
    const containers = ref<ElementContainer[]>([]);


    const container1 = new ElementContainer("Container 1");
    container1.addChild(new ElementText("Text 1", "foo"));
    container1.addChild(new ElementText("Text 2", "bar"));
    container1.addChild(new ElementText("Text 3", "sac"));
    container1.backgroundColor = "aliceblue"

    const container2 = new ElementContainer("Container 2");
    container2.addChild(new ElementText("Text 3", "baz"));
    container2.addChild(new ElementText("Text 4", "wee"));
    container2.backgroundColor = "lightgreen"

    containers.value = [container1, container2];

    return {
      containers,
    };
  },
});
