<template>
  <div class="element-image">
    <img :src="child.url" />
  </div>
</template>

<script>
import { Image } from "@/models/image";

export default {
  props: {
    child: {
      type: Image,
      required: true,
    },
  },
  /*   computed: {
    typographyStyle() {
      const styles = this.child.getEffectiveStyles();
      return {
        color: styles.color,
             fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontSize: `${styles.fontSize}px`,
      };
    },
  }, */
};
</script>

<style scoped>
.element-image {
  max-width: 100px;
  max-height: 100px;
  overflow: hidden;
}
</style>
