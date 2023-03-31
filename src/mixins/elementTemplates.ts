import { ElementContainer, ElementText, ElementLink, CustomElement } from '@/mixins/elements';
import { reactive } from 'vue';



export default {
  data() {
    return {
      newContainerTemplate: null,
    };
  },
  methods: {
    createNewElementContainer(totalContainers: number) {
      const newContainerName = `Container ${totalContainers + 1}`;

      const getRandomColor = () => {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
      };

      const newContainer = reactive(new ElementContainer(newContainerName));

      newContainer.backgroundColor = getRandomColor();

      const text1 = new ElementText('Text 3', 'new');
      const text2 = new ElementText('Text 4', 'container');

      newContainer.addChild(text1);
      newContainer.addChild(text2);

      return newContainer;
    },

    createNewElementText(container: ElementContainer): ElementText {
      const newTextElement = new ElementText();
      container.addChild(newTextElement);
      return newTextElement;
    },

    createNewElementLink(container: ElementContainer): ElementLink {
      const newLinkElement = new ElementLink();
      container.addChild(newLinkElement);
      return newLinkElement;
    },

    createNewElement(container: ElementContainer, type: string): CustomElement {
      let newElement: CustomElement;

      switch (type) {
        case "text":
          newElement = new ElementText();
          break;
        case "link":
          newElement = new ElementLink();
          break;
        default:
          throw new Error(`Unsupported element type: ${type}`);
      }

      container.addChild(newElement);
      return newElement;
    },
  },
};
