<template>
  <div class="element-image">
    <img :src="child.currentState?.content?.value" />
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Image,
      required: true,
    },
    key: {
      type: String,
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
