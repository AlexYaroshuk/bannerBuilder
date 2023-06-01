<template>
  <div class="element-image" :style="imageStyle">
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
  computed: {
    imageStyle() {
      const styles = this.child.currentState.style;
      return {
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

<style scoped>
.element-image {
  min-width: 100px;
  min-height: 100px;
  overflow: hidden;
}
</style>
