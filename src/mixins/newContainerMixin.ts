export default {
  data() {
    return {
      newContainerTemplate: {
        containerName: "",
        type: "container",
        isHovered: false,
        isSelected: false,
        backgroundColor: "",
        children: [
          {
            name: "",
            value: "",
            type: "text",
            isSelected: false,
            isHovered: false,
            parentContainer: null,
          },
          {
            name: "",
            value: "",
            type: "text",
            isSelected: false,
            isHovered: false,
            parentContainer: null,
          },
        ],
      },
    };
  },
  methods: {
    createNewContainer() {
      const totalContainers = this.containers.length;
      const newContainerName = `Container ${totalContainers + 1}`;

      const getRandomColor = () => {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
      };

      let newContainer = JSON.parse(JSON.stringify(this.newContainerTemplate));
      newContainer.containerName = newContainerName;
      newContainer.backgroundColor = getRandomColor();
      newContainer.children[0].name = "Text 3";
      newContainer.children[0].value = "new";
      newContainer.children[1].name = "Text 4";
      newContainer.children[1].value = "container";

      return newContainer;

    },
  },
};
