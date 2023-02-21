<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <img v-if="imageSource" :src="imageSource" alt="Image" />
  </div>
</template>

<script>
export default {
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
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
