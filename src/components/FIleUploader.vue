<template>
  <div
    v-if="
      (viewModel.selectedBackground &&
        viewModel.selectedBackground.type === 'image' &&
        viewModel.selectedBackground.value) ||
      (viewModel.getSelectedElement() &&
        viewModel.getSelectedElement().type === 'image' &&
        viewModel.getSelectedElement().value)
    "
  >
    <input type="file" ref="fileInput" @change="handleFileUpload" />

    <img
      :src="
        viewModel.selectedBackground
          ? viewModel.selectedBackground.value
          : viewModel.getSelectedElement().value
      "
    />
  </div>
</template>

<script>
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";
export default {
  emits: ["set-image", "clear-image"],
  data() {
    return {
      imageSource: null,
    };
  },
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      required: true,
    },
    isBackgroundMode: false,
  },
  /*   computed: {
    backgroundImage() {
      const currentElement = this.viewModel.currentSelectedElement;
      if (currentElement.background) {
        const imageLayer = currentElement.background.find(
          (layer) => layer.type === "image"
        );
        return imageLayer ? imageLayer.value : null;
      }
      return null;
    },
  }, */

  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const fileName = file.name;
      reader.onload = (event) => {
        this.imageSource = event.target.result;
        this.setImage(fileName);
        this.imageSource = null; // clear the imageSource variable
      };
    },

    setImage(fileName) {
      if (this.viewModel.selectedBackground) {
        this.viewModel.selectedBackground.type = "image";
        this.viewModel.selectedBackground.fileName = fileName;
        this.viewModel.selectedBackground.value = this.imageSource;
      } else {
        this.viewModel.getSelectedElement().value = this.imageSource;
      }
    },
  },
};
</script>

<style scoped>
img {
  width: 64px;
  height: 64px;
}
</style>
