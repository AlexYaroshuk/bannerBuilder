<template>
  <div :style="textStyle">
    <span>{{ child.text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    child: {
      type: Text,
      required: true,
    },
    // Add a key prop to force re-rendering when the parent container's color changes
    key: {
      type: String,
      required: true,
    },
  },
  computed: {
    textStyle() {
      const styles = this.child.getEffectiveStyles();
      return {
        fontFamily: styles.fontFamily || "inherit",
        fontSize: styles.fontSize ? `${styles.fontSize}px` : "inherit",
        color: styles.color || "inherit",
      };
    },
  },
};
</script>
