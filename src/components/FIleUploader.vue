<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <img v-if="imageSource" :src="imageSource" alt="Image" />
    <button @click="setImage">Set</button>
    <button @click="clearImage">Clear</button>
  </div>
</template>

<script>
export default {
  emits: ["set-image-bg"],
  data() {
    return {
      imageSource: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imageSource = event.target.result;
      };
    },
    setImage() {
      this.$emit("set-image", this.imageSource);
    },
    clearImage() {
      this.$emit("clear-image");
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
