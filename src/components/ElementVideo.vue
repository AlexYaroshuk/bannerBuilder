<template>
  <div class="element-video">
    <video controls autoplay loop muted :src="child.value"></video>
  </div>
</template>

<script>
import { Video } from "@/models/video";

export default {
  props: {
    child: {
      type: Video,
      required: true,
    },
  },
};
</script>

<style scoped>
.element-video {
  max-width: 240px;
  max-height: 240px;
  overflow: hidden;
}
</style>
