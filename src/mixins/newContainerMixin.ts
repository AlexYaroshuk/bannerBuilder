import { ElementContainer, ElementText } from '@/mixins/elements';
import { reactive } from 'vue';



export default {
  data() {
    return {
      newContainerTemplate: null,
    };
  },
  methods: {
    createNewContainer(totalContainers: number) {
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

    addTextElement(container: ElementContainer, name: string, value: string): ElementText {
      const newTextElement = new ElementText(name, value);
      container.addChild(newTextElement);
      return newTextElement;
    }

  },
};
