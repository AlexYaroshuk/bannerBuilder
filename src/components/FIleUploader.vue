<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileUpload" />

    <img
      v-if="this.viewModel.currentSelectedElement.backgroundImage"
      :src="this.viewModel.currentSelectedElement.backgroundImage"
      :alt="this.viewModel.currentSelectedElement.backgroundImage"
    />

    <button @click="clearImage">Clear</button>
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
  },
  computed: {
    showImage() {
      return !!this.viewModel.currentSelectedElement.backgroundImage;
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imageSource = event.target.result;
        this.setImage();
        this.imageSource = null; // clear the imageSource variable
      };
    },

    clearImage() {
      this.imageSource = null;
      this.viewModel.currentSelectedElement.backgroundImage = "";
    },

    setImage() {
      this.viewModel.currentSelectedElement.backgroundImage = this.imageSource;
      this.$refs.fileInput.value = null; // clear the input field
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
