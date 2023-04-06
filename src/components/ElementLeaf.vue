<template>
  <div class="element-leaf">
    <div v-if="type === 'text'" :style="typographyStyle">
      <span>{{ child.value }}</span>
    </div>
    <div v-else-if="type === 'link'" class="link-text" :style="typographyStyle">
      <a :href="child.URL" target="_blank">{{ child.value }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    typographyStyle() {
      const styles = this.child.effectiveStyles;
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

<style scoped>
:deep(.link-text) a {
  color: inherit;
  text-decoration: none;
}
</style>
