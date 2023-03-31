<template>
  <div class="element-leaf">
    <div v-if="type === 'text'" :style="colorStyle">
      <span>{{ child.value }}</span>
    </div>
    <div v-else-if="type === 'link'" class="link-text" :style="colorStyle">
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
    colorStyle() {
      if (this.child.type === "text") {
        return {
          color: this.child.effectiveColor,
        };
      } else {
        return {
          color: this.child.color,
        };
      }
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
