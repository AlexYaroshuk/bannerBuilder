<template>
  <div
    :container="container"
    class="container"
    :class="{
      'container--selected': viewModel.getSelectedElement() === container,
      'container--hovered': viewModel.getHoveredElement() === container,
    }"
    :border="
      viewModel.getSelectedElement() === container ||
      viewModel.getHoveredElement() === container
        ? `${container.borderWidth}px solid ${container.borderColor}`
        : '2px solid transparent'
    "
    :style="{ ...containerStyle, ...borderColorStyle }"
    @click.stop="selectItem(container)"
    @mouseover="hoverItem(container)"
    @dragover.stop.prevent="hoverItem(container)"
    @mouseleave="viewModel.handleElementDehovered()"
    @drop="handleWidgetDrop(container)"
  >
    <div class="background-container">
      <div
        class="background-layer"
        v-for="(backgroundLayer, layerIndex) in containerStyle.backgroundLayers"
        :key="'layer-' + layerIndex"
        v-show="backgroundLayer.isVisible"
        :style="backgroundLayer"
      >
        <video
          v-if="backgroundLayer.type === 'video'"
          :src="backgroundLayer.value"
          :style="backgroundLayer"
          autoplay
          muted
          loop
        ></video>
      </div>
    </div>

    <div class="children-wrapper">
      <div class="name" v-if="viewModel.getSelectedElement() === container">
        {{ container.name }}
      </div>
      <div class="child" v-if="container.children && container.children.length">
        <div
          class="child-item"
          :class="{
            'child-item--selected': viewModel.getSelectedElement() === child,
            'child-item--hovered': viewModel.getHoveredElement() === child,
          }"
          v-for="(child, index) in container.children"
          :key="index"
          :data-key="index"
          @click.stop="selectItem(child)"
          @contextmenu.prevent="onContextMenu($event, 'child', child)"
          @mouseover.stop="hoverItem(child)"
        >
          <component
            :is="getComponent(child)"
            :class="{ hidden: !child.currentState.style.isVisible }"
            style="padding: 4px"
            :child="child"
            :viewModel="viewModel"
          />
        </div>
        <div
          class="widget-dropzone"
          v-show="
            viewModel.isDraggingWidgetElement &&
            viewModel.getHoveredElement() === container
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import ElementText from "./ElementText.vue";
import ElementLink from "./ElementLink.vue";
import ElementImage from "./ElementImage.vue";
import ElementVideo from "./ElementVideo.vue";
import { Container } from "@/models/container";
import { BannerBuilderViewModel } from "@/viewmodels/bannerBuilderViewModel";
import { Text } from "@/models/text";
import { Link } from "@/models/link";
import { Image } from "@/models/image";
import { Video } from "@/models/video";

// ! nested Container
const ElementContainer = {
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      default: true,
    },
    container: {
      type: Container,
      required: true,
    },
  },
  emits: ["widget-drop", "select-item", "context-menu"],

  methods: {
    getComponent(element) {
      if (element instanceof Text) {
        return ElementText;
      }
      if (element instanceof Link) {
        return ElementLink;
      }
      if (element instanceof Image) {
        return ElementImage;
      }
      if (element instanceof Video) {
        return ElementVideo;
      }
      if (element instanceof Container) {
        return ElementContainer;
      }
    },

    handleContainerDehover() {
      this.viewModel.handleElementDehovered();
    },

    selectItem(item) {
      this.viewModel.handleElementSelected(item);
    },
    hoverItem(item) {
      this.viewModel.handleElementHovered(item);
    },
    handleWidgetDrop(container) {
      if (
        !this.viewModel.draggedElement ||
        this.viewModel.draggedElement.type === "container"
      )
        return;
      this.$emit("widget-drop", container);
    },
    onContextMenu(event, type, item) {
      event.preventDefault();
      this.viewModel.handleElementSelected(item);
      this.$emit("context-menu", event, type, item);
    },

    getGradientCSS(gradient) {
      const { type, degree, points } = gradient;

      // Check if there's only one point and return a solid color
      if (points.length === 1) {
        return points[0].color;
      }

      const stops = points
        .map((point) => `${point.color} ${point.left}%`)
        .join(", ");

      let startPoint = "";

      if (type === "linear") {
        startPoint = `${degree}deg`;
      } else if (type === "radial") {
        const center = points.find((point) => point.center);
        const centerX = center ? center.left : 50;
        const centerY = center ? center.top : 50;
        startPoint = `${centerX}% ${centerY}%`;
      }

      return `${type}-gradient(${startPoint}, ${stops})`;
    },
  },

  watch: {
    "viewModel.getSelectedElement().currentState.name": {
      handler(newVal) {
        this.selectedStateName = newVal;
      },
      immediate: true,
    },
  },

  computed: {
    containerStyle() {
      const styles = this.container.getEffectiveStyles();
      const backgroundLayers = [];

      for (const bg of styles.background) {
        const layer = {
          zIndex: bg.layerIndex,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          isVisible: bg.isVisible !== undefined ? bg.isVisible : true, // Add isVisible property
          type: bg.type, // Add type property
          value: bg.value, // Add value property
        };

        console.log(
          `Layer index: ${bg.layerIndex}, isVisible: ${bg.isVisible}`
        ); // Add this line

        if (bg.isVisible) {
          switch (bg.type) {
            case "color":
              layer.backgroundColor = bg.value;
              break;
            case "gradient":
              layer.backgroundImage = this.getGradientCSS(bg.value);
              break;
            case "image":
              layer.backgroundImage = `url(${bg.value})`;
              layer.backgroundRepeat = bg.repeat || "no-repeat";
              layer.backgroundPosition = bg.position || "center";
              layer.backgroundSize = bg.size || "cover";

              if (bg.size === "custom" && bg.width && bg.height) {
                layer.width = `${bg.width}px`;
                layer.height = `${bg.height}px`;
              }
              break;

            case "video":
              layer.backgroundRepeat = bg.repeat || "no-repeat";
              layer.backgroundPosition = bg.position || "center";
              layer.backgroundSize = bg.size || "cover";
              break;
            default:
              throw new Error(`Unknown background type: ${bg.type}`);
          }
        }

        backgroundLayers.push(layer);
      }

      return {
        backgroundLayers,
      };
    },

    borderColorStyle() {
      const isSelectedOrHovered =
        this.viewModel.selectedItem === this.container ||
        this.viewModel.hoveredItem === this.container;
      return {
        border: isSelectedOrHovered
          ? `${this.container.borderWidth}px solid ${this.container.borderColor}`
          : "2px solid transparent",
      };
    },
  },
};
// ! end nested Container

export default {
  components: {
    ElementText: ElementText,
    ElementLink: ElementLink,
    ElementContainer: ElementContainer,
    ElementImage: ElementImage,
    ElementVideo: ElementVideo,
  },

  props: {
    viewModel: {
      type: Object,
      default: () => ({}),
    },
    container: {
      type: Object,
      required: true,
    },
  },
  emits: ["widget-drop"],

  beforeCreate() {
    this.$options.components.ElementContainer = this.$options;
  },

  methods: {
    getComponent(element) {
      if (element instanceof Text) {
        return ElementText;
      }
      if (element instanceof Link) {
        return ElementLink;
      }
      if (element instanceof Image) {
        return ElementImage;
      }
      if (element instanceof Video) {
        return ElementVideo;
      }
      if (element instanceof Container) {
        return ElementContainer;
      }
    },

    selectItem(item) {
      this.viewModel.handleElementSelected(item);
    },
    hoverItem(item) {
      this.viewModel.handleElementHovered(item);
    },
    handleWidgetDrop(container) {
      if (
        !this.viewModel.draggedElement ||
        this.viewModel.draggedElement.type === "container"
      )
        return;
      this.$emit("widget-drop", container);
    },
    onContextMenu(event, type, item) {
      event.preventDefault();
      this.$emit("context-menu", event, type, item);
      this.$emit("select-item", item); // Add this line
    },

    getGradientCSS(gradient) {
      const { type, degree, points } = gradient;

      // Check if there's only one point and return a solid color
      if (points.length === 1) {
        return `linear-gradient(${points[0].color}, ${points[0].color})`;
      }

      const sortedPoints = [...points].sort((a, b) => a.left - b.left);

      const stops = sortedPoints
        .map((point) => `${point.color} ${point.left}%`)
        .join(", ");

      let startPoint = "";

      if (type === "linear") {
        startPoint = `${degree}deg`;
      } else if (type === "radial") {
        const center = points.find((point) => point.center);
        const centerX = center ? center.left : 50;
        const centerY = center ? center.top : 50;
        startPoint = `${centerX}% ${centerY}%`;
      }

      return `${type}-gradient(${startPoint}, ${stops})`;
    },

    generateGradient(gradient) {
      if (!gradient) {
        return "";
      }

      const { type, degree, points } = gradient;
      const sortedPoints = [...points].sort((a, b) => a.left - b.left);

      let pointStrings;
      let startPoint;

      if (sortedPoints.length === 1) {
        pointStrings = [
          `rgba(${sortedPoints[0].red},${sortedPoints[0].green},${sortedPoints[0].blue},${sortedPoints[0].alpha}) 0%`,
          `rgba(${sortedPoints[0].red},${sortedPoints[0].green},${sortedPoints[0].blue},${sortedPoints[0].alpha}) 100%`,
        ];
        startPoint = `0deg`;
      } else {
        pointStrings = sortedPoints.map(
          ({ left, red, green, blue, alpha }) =>
            `rgba(${red},${green},${blue},${alpha}) ${left}%`
        );
        startPoint = `${degree}deg`;
      }

      return `${type}-gradient(${startPoint}, ${pointStrings.join(", ")})`;
    },
  },
  computed: {
    containerStyle() {
      const styles = this.container.getEffectiveStyles();
      const sortedBackgroundLayers = styles.background.sort(
        (a, b) => b.layerIndex - a.layerIndex
      );

      const backgroundLayers = sortedBackgroundLayers.map((bg) => {
        const layer = {
          zIndex: bg.layerIndex,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          isVisible: bg.isVisible !== undefined ? bg.isVisible : true,
          type: bg.type, // Add type property
          value: bg.value, // Add value property
        };

        switch (bg.type) {
          case "color":
            layer.backgroundColor = bg.value;
            break;
          case "gradient":
            layer.backgroundImage = this.getGradientCSS(bg.value);
            break;
          case "image":
            layer.backgroundImage = `url(${bg.value})`;
            layer.backgroundRepeat = bg.repeat || "no-repeat";
            layer.backgroundPosition = bg.position || "center";
            layer.backgroundSize = bg.size || "cover";

            if (bg.size === "custom" && bg.width && bg.height) {
              layer.width = `${bg.width}px`;
              layer.height = `${bg.height}px`;
            }
            break;

          case "video":
            layer.backgroundImage = `url(${bg.value})`;
            layer.backgroundRepeat = bg.repeat || "no-repeat";
            layer.backgroundPosition = bg.position || "center";
            layer.backgroundSize = bg.size || "cover";
            layer.backgroundAttachment = "fixed";
            layer.backgroundColor = bg.overlayColor || "transparent";
            layer.mixBlendMode = bg.blendMode || "normal";
            layer.filter = bg.filter || "none";
            layer.transition = "none";
            break;
          default:
            throw new Error(`Unknown background type: ${bg.type}`);
        }

        return layer;
      });

      return {
        backgroundLayers,
      };
    },

    borderColorStyle() {
      const isSelectedOrHovered =
        this.viewModel.getSelectedElement() === this.container ||
        this.viewModel.getHoveredElement() === this.container;
      return {
        border: isSelectedOrHovered
          ? `${this.container.borderWidth}px solid ${this.container.borderColor}`
          : "2px solid transparent",
      };
    },
  },
};
</script>

<style scoped>
.container {
  flex-direction: column;
  width: 520px;
  min-height: 96px;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  min-width: 8px;
  min-height: 8px;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.children-wrapper {
  position: relative;
  z-index: 2;
}

.container--selected {
  border: 2px solid #1280ff;
}
.container--hovered {
  border: 2px solid #1482ff80;
}
.container--selected .name {
  position: absolute;
  top: 0;
  left: 0;
  font-size: smaller;
  background-color: #1280ff;
  color: white;
  padding: 0px 4px;
}
.child {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
}
.child-item {
  position: relative;
  display: flex;
  z-index: 1;
  border: 2px solid transparent;
}
.child-item--hovered {
  border: 2px solid #1482ff80;
}
.child-item--selected {
  border: 2px solid #1482ff;
}
.container--dragging {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: grabbing;
}

.floating-container {
  position: fixed;
  pointer-events: none;
  z-index: 3;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
  opacity: 0.9;
}
.widget-dropzone {
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border: 2px solid #1482ff80;
  transition: min-height 0.2s ease, background-color 0.2s ease;
}

.widget-dropzone--hovered {
  min-height: 48px;
  background-color: #1280ff;
}

.hidden {
  visibility: hidden;
}
</style>
