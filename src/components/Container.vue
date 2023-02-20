<template>
  <div class="container">
    <banner>
      <text :text="text" slot="text"></text>
    </banner>
  </div>
</template>

<script>
import Banner from "./Banner.vue";
import Text from "./Text.vue";

export default {
  components: {
    Banner,
    Text,
  },
  data() {
    return {
      text: "Hello World!",
    };
  },
};
</script>

<style scoped>
.container {
  display: inline-block;
  border: 2px solid blue;
  background-color: transparent;
}
</style>
