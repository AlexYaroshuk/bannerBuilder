<template>
  <div class="wrapper">
    <div v-for="(container, index) in containers" :key="index">
      <Container
        @select-container="selectContainer(index)"
        :children="getChildrenForContainer(index)"
        :index="index"
        @select-child="handleSelectChild"
        @deselect-all="deselectAll"
        class="container"
        :isSelected="index === selectedContainerIndex"
      />
    </div>
    <SidebarRight
      :currentSelectionClass="currentSelectionClass"
      :currentContainerIndex="
        selectedContainerIndex !== null ? selectedContainerIndex : undefined
      "
      :containerName="
        selectedContainerIndex !== null
          ? containers[selectedContainerIndex].containerName
          : ''
      "
      :backgroundColor="
        selectedContainerIndex !== null
          ? containers[selectedContainerIndex].backgroundColor
          : ''
      "
      :selectedChild="selectedChild"
    />

    <SidebarLeft :treeItems="treeItemsWithSelected" />
  </div>
</template>

<script>
import Container from "./Container.vue";
import SidebarRight from "./SidebarRight.vue";
import SidebarLeft from "./SidebarLeft.vue";

export default {
  components: {
    Container,
    SidebarRight,
    SidebarLeft,
  },

  data() {
    return {
      containers: [
        {
          containerName: "Container 1",

          //children
          children: [
            {
              name: "Text 1",
              value: "foo",
              type: "text",
              isSelected: false,
            },
            {
              name: "Text 2",
              value: "bar",
              type: "text",
              isSelected: false,
            },
          ],
        },
        {
          containerName: "Container 2",

          // children
          children: [
            {
              name: "Text 3",
              value: "baz",
              type: "text",
              isSelected: false,
            },
            {
              name: "Text 4",
              value: "wee",
              type: "text",
              isSelected: false,
            },
          ],

        },
      ],
      currentSelectionClass: null,
      currentContainerIndex: null,
      name: `Container ${this.index}`,
      defaultColors: ["purple", "blue"],
      selectedChild: {},
    };
  },

  computed: {
    selectedContainerIndex() {
      return this.currentContainerIndex !== null
        ? this.currentContainerIndex
        : null;
    },
    currentSelectionClass() {
      return this.currentSelectionClass !== null
        ? this.currentSelectionClass
        : null;
    },

    treeItemsWithSelected() {
      return this.containers.map((container) => {
        const children = container.children
          ? container.children
              .filter((child) => child.type === "text")
              .map((child) => ({
                ...child,
                isSelected: this.selectedChild === child,
              }))
          : [];
        container.isSelected =
          container.isSelected || children.some((child) => child.isSelected);
        return {
          containerName: container.containerName,
          isSelected: container.isSelected,
          children,
        };
      });
    },
  },

  /*   created() {
    this.$root.$on("deselect-all", this.deselectAll);
  }, */

  methods: {
    //control
    selectContainer(index) {
      this.currentContainerIndex = index;
      this.currentSelectionClass = "container";

      this.containers.forEach((container, i) => {
        container.isSelected = i === index;
      });

      this.containers[index].children.forEach((child) => {
        child.isSelected = false;
      });
    },

    deselectContainer(event) {
      const isClickedInsideContainer =
        event.target.closest(".container") !== null;
      if (!isClickedInsideContainer) {
        this.currentContainerIndex = null;
      }
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

    handleWrapperClick(event) {
      if (!event.target.closest(".container")) {
        this.$emit("deselect-all");
      }
    },

    handleSelectChild(childIndex, containerName) {
      const containerIndex = this.containers.findIndex(
        (c) => c.containerName === containerName
      );
      if (containerIndex < 0) return; // container not found

      const container = this.containers[containerIndex];
      if (!container.children) return; // no children in the container

      container.children.forEach((c, i) => {
        c.isSelected = i === childIndex;
      });

      this.selectedChild = container.children[childIndex];

      this.currentSelectionClass = this.selectedChild.type;

      this.$nextTick(() => {
        this.$emit("update-selected-child", this.selectedChild);
      });
    },

    getChildrenForContainer(index) {
      if (index !== null && this.containers[index].children) {
        return this.containers[index].children
          .filter((child) => child.type === "text")
          .map((child) => ({
            ...child,
            isSelected: child.isSelected || false,
          }));
      } else {
        return [];
      }
    },