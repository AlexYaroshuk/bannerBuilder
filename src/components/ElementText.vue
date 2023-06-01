<template>
  <div :style="textStyle">
    <span>{{ child.currentState?.content?.text }}</span>
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
      const styles = this.child.currentState.style;
      return {
        fontFamily: styles.fontFamily || "inherit",
        fontSize: styles.fontSize ? `${styles.fontSize}px` : "inherit",
        fontWeight: styles.fontWeight,
        color: styles.color || "inherit",
        margin: this.getMarginValue(styles),
        padding: this.getPaddingValue(styles),
      };
    },
  },
  methods: {
    getMarginValue(styles) {
      const { leftMargin, rightMargin, topMargin, bottomMargin } = styles;
      return `${topMargin}px ${rightMargin}px ${bottomMargin}px ${leftMargin}px`;
    },
    getPaddingValue(styles) {
      const { leftPadding, rightPadding, topPadding, bottomPadding } = styles;
      return `${topPadding}px ${rightPadding}px ${bottomPadding}px ${leftPadding}px`;
    },
  },
};
</script>
