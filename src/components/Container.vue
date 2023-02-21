<template>
  <div
    class="container"
    :style="{
      backgroundColor: backgroundColor,
      borderRadius: borderRadius + 'px',
    }"
  >
    <div class="child">
      <Text :bannerText="bannerText" />
    </div>
    <div class="child">
      <Link :linkLabel="linkLabel" :linkURL="linkURL" :linkColor="linkColor" />
    </div>
    <div class="child">
      <Image :imgLink="imgLink" />
    </div>
  </div>
</template>

<script>
import Text from "./Text.vue";
import Link from "./Link.vue";
import Image from "./Image.vue";

export default {
  props: {
    backgroundColor: {
      type: String,
      default: "green",
    },
    borderRadius: {
      type: Number,
      default: 80,
    },
    bannerText: {
      type: String,
      default: "",
    },
    linkLabel: {
      type: String,
      default: "this is some link",
    },
    linkURL: {
      type: String,
      default: "https://chat.openai.com/",
    },
    linkColor: {
      type: String,
      default: "yellow",
    },
    imgLink: {
      type: String,
      default:
        "https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/713db751-0cc0-4d18-b283-bd707824f201/smashingconf-front-end-sf-2023.png",
    },
  },

  components: {
    Text,
    Link,
    Image,
    Image,
  },

  methods: {
    onBannerTextUpdate(value) {
      this.text = value;
    },
    onUpdateColor(color) {
      this.backgroundColor = color;
    },
  },
};
</script>

<style scoped>
.container {
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Add this line to give the parent element a position */
}

.child {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
  /* Add this line to give the parent element a position */
}
</style>
