<template>
  <a :href="child.url" target="_blank" :style="typographyStyle">
    {{ child.label }}
  </a>
</template>

<script>
import { Link } from "@/models/link";

export default {
  props: {
    child: {
      type: Link,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
  },
  computed: {
    typographyStyle() {
      const styles = this.child.getEffectiveStyles();
      return {
        color: styles.color,
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        fontSize: `${styles.fontSize}px`,
      };
    },
  },
};
</script>
