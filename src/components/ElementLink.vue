<template>
  <div class="element-link">
    <a :href="child.url" target="_blank">
      {{ child.label }}
    </a>
  </div>
</template>

<script>
import { Link } from "@/models/link";

export default {
  props: {
    child: {
      type: Link,
      required: true,
    },
  },
  computed: {
    typographyStyle() {
      const styles = this.child.getEffectiveStyles();
      return {
        color: styles.color,
        /*        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontSize: `${styles.fontSize}px`, */
      };
    },
  },
};
</script>

<style scoped>
.element-link a {
}
</style>
