<template>
  <div class="element-image">
    <img :src="child.value" />
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
  min-width: 100px;
  min-height: 100px;
  overflow: hidden;
}
</style>
