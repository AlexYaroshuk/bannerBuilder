<template>
  <div class="element-video" :style="videoStyle">
    <video
      controls
      autoplay
      loop
      muted
      :src="child.currentState?.content?.value"
    ></video>
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
    key: {
      type: String,
      required: true,
    },
  },
  computed: {
    videoStyle() {
      const styles = this.child.currentState.style;
      return {
        margin: this.getMarginValue(styles),
        padding: this.getPaddingValue(styles),
      };
    },
  },
  methods: {
    getMarginValue(styles) {
      const { leftMargin, rightMargin, topMargin, bottomMargin } = styles;
      return `${topMargin}px ${rightMargin}px ${bottomMargin}px ${leftMargin}px`;
    },
    getPaddingValue(styles) {
      const { leftPadding, rightPadding, topPadding, bottomPadding } = styles;
      return `${topPadding}px ${rightPadding}px ${bottomPadding}px ${leftPadding}px`;
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
