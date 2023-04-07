<template>
  <div class="widgets-wrapper">
    <div v-for="widget in widgets" class="widgets-container">
      <div
        class="draggable-widget"
        draggable="true"
        @dragstart="dragStart($event, widget)"
        @dragend="dragEnd"
      >
        <i class="material-icons icon">{{ widget.icon }}</i>
        <span class="text">{{ widget.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      draggableElement: null,
      dragging: false,
      offsetX: 0,
      offsetY: 0,
      widgets: [
        { type: "text", label: "Text", icon: "text_format" },
        { type: "link", label: "Link", icon: "link" },
      ],
    };
  },

  mounted() {
    window.addEventListener("mousemove", this.moveElement);
    window.addEventListener("mouseup", this.dragEnd);
  },
  beforeUnmount() {
    window.removeEventListener("mousemove", this.moveElement);
    window.removeEventListener("mouseup", this.dragEnd);
  },

  methods: {
    //control

    dragStart(event, widget) {
      this.dragging = true;
      this.draggableElement = event.target.closest(".draggable-widget");
      this.originalPosition = {
        position: this.draggableElement.style.position,
        zIndex: this.draggableElement.style.zIndex,
      };
      this.draggableElement.style.position = "absolute";
      this.draggableElement.style.zIndex = "777";
      this.offsetX =
        event.clientX - this.draggableElement.getBoundingClientRect().left;
      this.offsetY =
        event.clientY - this.draggableElement.getBoundingClientRect().top;

      this.$emit("widget-drag-start", {
        element: this.draggableElement,
        widget,
      });
    },

    dragEnd(event) {
      this.dragging = false;
      if (this.draggableElement) {
        this.draggableElement.style.position = this.originalPosition.position;
        this.draggableElement.style.zIndex = this.originalPosition.zIndex;
        this.draggableElement = null;
      }
      this.$emit("widget-drag-end");
    },
  },
};
</script>

<style scoped>
.widgets-wrapper {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}

.draggable-widget {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
  cursor: grab;
  padding: 10px;
  width: 100%;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  transition: background-color 0.2s ease;
}
.draggable-widget:hover {
  background-color: #ededed;
}

.draggable-widget:active {
  cursor: grabbing;
}

.draggable-widget::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.draggable-widget:active::after {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.8);
  transition: none;
}
</style>
