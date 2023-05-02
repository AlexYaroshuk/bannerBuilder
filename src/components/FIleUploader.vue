<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileUpload" />

    <img
      v-if="backgroundImage"
      :src="
        isBackgroundMode
          ? selectedBackground.value
          : viewModel.getSelectedElement().url
      "
      :alt="backgroundImage"
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
    selectedBackground: null,
    isBackgroundMode: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
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

    showImage() {
      return !!this.viewModel.currentSelectedElement.backgroundImage;
    },
  },

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
      if (this.isBackgroundMode) {
        this.selectedBackground.type = "image";
        this.selectedBackground.fileName = fileName;
        this.selectedBackground.value = this.imageSource;
      } else {
        this.viewModel.getSelectedElement().url = this.imageSource;
      }

      this.$refs.fileInput.value = null; // clear the input field
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
