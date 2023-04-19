<template>
  <div class="elements-container">
    <div
      v-for="(asset, index) in assets"
      :key="index"
      class="draggable-element"
      draggable="true"
      @dragstart="dragStart($event, asset)"
      @dragend="dragEnd"
    >
      <i class="material-icons icon">drag_indicator</i>
      <span class="text">{{ asset.type }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    viewModel: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      draggableElement: null,
      dragging: false,
      assets: [
        {
          type: "Type 1",
          // Add other properties here
        },
      ],
    };
  },

  methods: {
    dragStart(event) {
      this.viewModel.draggedElement =
        event.target.closest(".draggable-element");
      this.viewModel.isDraggingAssetsElement = true;
      console.log(this.viewModel.isDraggingAssetsElement);
    },

    dragEnd() {
      this.viewModel.handleDragEnd();
    },
  },
};
</script>

<style scoped></style>
