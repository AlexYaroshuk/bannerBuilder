<template>
  <div class="elements-container">
    <div
      class="draggable-element"
      draggable="true"
      @dragstart="dragStart($event)"
      @dragend="dragEnd"
    >
      <i class="material-icons icon">drag_indicator</i>
      <span class="text">Drag Me</span>
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

    dragStart(event) {
      this.dragging = true;
      this.draggableElement = event.target.closest(".draggable-element");
      this.originalPosition = {
        position: this.draggableElement.style.position,
        zIndex: this.draggableElement.style.zIndex,
      };
      this.draggableElement.style.position = "absolute";
      this.draggableElement.style.zIndex = "777"; // Set a high z-index value
      this.offsetX =
        event.clientX - this.draggableElement.getBoundingClientRect().left;
      this.offsetY =
        event.clientY - this.draggableElement.getBoundingClientRect().top;

      this.$emit("element-drag-start", this.draggableElement);
    },

    dragEnd(event) {
      this.dragging = false;
      if (this.draggableElement) {
        this.draggableElement.style.position = this.originalPosition.position;
        this.draggableElement.style.zIndex = this.originalPosition.zIndex;
        this.draggableElement = null;
      }
      this.$emit("element-drag-end");
    },

    //extra
  },
};
</script>

<style scoped>
.sidebar {
  color: black;
  background-color: #f5f5f5;
  padding: 1rem;
  width: 20%;
  float: left;
  transition: all 0.2s ease-in-out;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  z-index: 2;
}

.hidden {
  left: -20%;
}

.sidebar-button {
  padding: 1rem;
  float: left;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.elements-container {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.draggable-element {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
  cursor: grab;
  padding: 10px;
  user-select: none;
  width: 100%; /* Set a fixed width for the draggable element */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  transition: background-color 0.2s ease; /* Center the draggable element within the container */
}
.draggable-element:hover {
  background-color: #ededed;
  /* Center the draggable element within the container */
}

.draggable-element:active {
  cursor: grabbing;
}

.draggable-element::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.draggable-element:active::after {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.8);
  transition: none;
}
</style>
