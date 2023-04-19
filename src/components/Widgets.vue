<template>
  <div class="widgets-container" v-for="widget in widgets">
    <div
      class="draggable-element"
      draggable="true"
      @dragstart="dragStart($event, widget)"
      @dragend="dragEnd"
    >
      <i class="material-icons icon">{{ widget.icon }}</i>
      <span class="text">{{ widget.label }}</span>
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
      widgets: [
        { type: "text", label: "Text", icon: "text_format" },
        { type: "link", label: "Link", icon: "link" },
        { type: "image", label: "Image", icon: "image" },
      ],
    };
  },

  methods: {
    //control

    dragStart(event, widget) {
      this.viewModel.widgetDragStart(widget);
    },
    dragEnd() {
      this.viewModel.handleDragEnd();
    },
  },
};
</script>

<style scoped></style>
