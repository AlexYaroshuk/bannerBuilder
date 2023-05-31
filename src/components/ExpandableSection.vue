<template>
  <div>
    <p class="prop-section-title" @click="$emit('toggleExpanded')">
      {{ title }}
      <i class="material-icons {{ expanded ? 'expand-less' : 'expand-more' }}">
        {{ expanded ? "expand_more" : "chevron_right" }}
      </i>
    </p>

    <div v-if="expanded">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "expanded"],
};
</script>

<style scoped>
.prop-section-title {
  border-top: 1px solid rgb(184, 183, 183);
  border-bottom: 1px solid rgb(184, 183, 183);
  background-color: lightgray;
  font-weight: 600;
  font-size: medium;
  cursor: default;
}
</style>
