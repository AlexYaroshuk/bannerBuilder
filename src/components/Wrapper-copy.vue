<template>
  <div class="wrapper">
    <div v-for="(container, index) in containers" :key="index">
      <Container
        :bannerStyle="container.bannerStyle"
        :container="container"
        :class="containerClass(container.bannerStyle)"
        :backgroundColor="container.backgroundColor"
        :text="text"
        :fontSize="textSize"
        :fontFamily="textFamily"
        :textColor="textColor"
        :textBGColor="textBGColor"
        :borderRadius="borderRadius"
        :borderWidth="borderWidth"
        :borderColor="borderColor"
        :linkLabel="linkLabel"
        :linkFontSize="linkTextSize"
        :linkFontFamily="linkFamily"
        :linkColor="linkColor"
        :linkBGColor="linkBGColor"
        :linkURL="linkURL"
        :data-has-image="BGImage !== null"
        :imageLink="containers[index].imageLink"
        :BGImage="BGImage"
      />
    
    <Tree
      @element-drag-start="onElementDragStart"
      @element-drag-end="onElementDragEnd"
      :containers="containers"
      :treeItems="treeItemsWithSelected"
      :selected-item="selectedChild"
      @select-child="handleSelectChild"
      @select-container="selectContainer"
    />
  </div>
</template>

<script>
import Container from "./Container.vue";
import Properties from "./Properties.vue";
import Tree from "./Tree.vue";

export default {
  components: {
    Container,
    Tree,
    Properties,
  },

  data() {
    return {
      containers: [
        {
          containerName: "Container 1",
          isHovered: false,
          isSelected: false,

          //children
          children: [
            {
              name: "Text 1",
              value: "foo",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
            {
              name: "Text 2",
              value: "bar",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
            {
              name: "Text 3",
              value: "sac",
              type: "text",
              isSelected: false,
              isHovered: false,
              parentContainer: null,
            },
          ],
          backgroundColor: "white",

        },
      
      ],
      /*      currentSelectionClass: null,
      currentContainerIndex: null, */
      name: `Container ${this.index}`,
      defaultColors: ["purple", "blue"],
    };
  },


  mounted() {
    document.addEventListener("mouseup", this.onElementDragEnd);
  },

  beforeUnmount() {
    document.removeEventListener("mouseup", this.onElementDragEnd);
  },

  methods: {
    ///////////////////////control
    //drag
    onDrop(event, containerIndex, position) {
      event.preventDefault();
      if (!this.draggedElement) return;

      const totalContainers = this.containers.length;
      const newContainerName = `Container ${totalContainers + 1}`;

      // Function to generate a random color
      const getRandomColor = () => {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        return randomColor;
      };

      const newContainer = {
        containerName: newContainerName,
        isHovered: false,
        isSelected: false,
        children: [
          {
            name: "Text 3",
            value: "new",
            type: "text",
            isSelected: false,
            isHovered: false,
            parentContainer: null,
          },
          {
            name: "Text 4",
            value: "container",
            type: "text",
            isSelected: false,
            isHovered: false,
            parentContainer: null,
          },
        ],
      };

      if (position === "after") {
        this.containers.splice(containerIndex + 1, 0, newContainer);
      } else {
        // 'inside'
        this.containers[containerIndex].children.push({
          name: this.draggedElement.innerText,
          value: this.draggedElement.innerText,
          type: "text",
          isSelected: false,
          isHovered: false,
          parentContainer: null,
        });
      }

      this.draggedElement = null;
    },

    
    //class
    containerClass(bannerStyle) {
      let classes = ["container"];
      if (bannerStyle === "style1") {
        classes.push("container--style1");
      } else if (bannerStyle === "style2") {
        classes.push("container--style2");
      }
      return classes;
    },
    //select
    selectContainer(container) {
      this.deselectAll();
      container.isSelected = true;
      this.selectedContainer = container;
    },

    deselectAll() {
      this.containers.forEach((container) => {
        container.isSelected = false;
        if (container.children) {
          container.children.forEach((child) => {
            child.isSelected = false;
          });
        }
      });
    },

    /*     addChild(containerIndex, child) {
      this.containers[containerIndex].children.push(child);
    }, */

    handleWrapperClick(event) {
      if (!event.target.closest(".container")) {
        this.$emit("deselect-all");
      }
    },

    handleSelectChild(child) {
      this.deselectAll();
      child.isSelected = true;
      this.selectedChild = child;
      this.selectedContainer = null;
    },
    
  },
};
</script>

<style scoped>
.wrapper {
  min-width: 600px;
  min-height: 200px;
  display: grid;
  /*   gap: 8px; */

  background-color: transparent;
  z-index: 2;
}

.dropzone {
  display: none;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  background-color: #80bbff;
  transition: min-height 0.2s ease, background-color 0.2s ease;
}

.dropzone--visible {
  display: flex;
}

.dropzone--hovered {
  min-height: 48px;
  background-color: #1280ff;
}

.container--style1 {
  background-color: yellow;
}

.container--style2 {
  background-color: green;
}
</style>
