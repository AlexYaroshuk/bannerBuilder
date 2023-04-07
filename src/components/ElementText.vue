<template>
  <div class="element-text" :style="typographyStyle">
    <span>{{ child.value }}</span>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
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
