<template>
  <div
    class="container"
    :class="{ 'container--selected': isSelected }"
    :style="{
      backgroundColor: backgroundColor,
      borderRadius: borderRadius + 'px',
      borderWidth: borderWidth + 'px',
      borderColor: borderColor,
      backgroundImage: `url(${BGImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }"
  >
    <div class="name" v-if="isSelected">{{ name }}</div>
    <div class="child">
      <Text
        :text="text"
        :textBGColor="textBGColor"
        :style="{
          fontSize: fontSize + 'px',
          fontFamily: fontFamily,
          color: textColor,
        }"
      />
    </div>
    <div class="child">
      <Link
        :linkLabel="linkLabel"
        :linkURL="linkURL"
        :linkColor="linkColor"
        :linkBGColor="linkBGColor"
        :style="{
          fontSize: linkFontSize + 'px',
          fontFamily: linkFontFamily,
        }"
      />
    </div>
    <div class="child">
      <Image :imageLink="imageLink" />
    </div>
  </div>
</template>

<script>
import Text from "./Text.vue";
import Link from "./Link.vue";
import Image from "./Image.vue";

export default {
  props: {
    index: {
      type: Number,
      default: null,
    },

    isSelected: {
      type: Boolean,
      required: true,
      default: false,
    },

    backgroundColor: {
      type: [String, Object],
      default: null,
    },

    borderColor: {
      type: String,
      default: null,
    },
    borderRadius: {
      type: Number,
      default: 0,
    },
    borderWidth: {
      type: Number,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    text: {
      type: String,
      default: null,
    },
    fontSize: {
      type: String,
      default: "16",
    },
    fontFamily: {
      type: String,
      default: "Arial",
    },
    textColor: {
      type: String,
      default: null,
    },
    textBGColor: {
      type: String,
      default: null,
    },

    linkLabel: {
      type: String,
      default: null,
    },
    linkFontSize: {
      type: String,
      default: "14",
    },
    linkFontFamily: {
      type: String,
      default: "Arial",
    },
    linkColor: {
      type: String,
      default: "yellow",
    },
    linkBGColor: {
      type: String,
      default: "",
    },

    linkURL: {
      type: String,
      default: "https://chat.openai.com/",
    },
    linkColor: {
      type: String,
      default: "yellow",
    },
    imageLink: {
      type: String,
      default:
        "https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/713db751-0cc0-4d18-b283-bd707824f201/smashingconf-front-end-sf-2023.png",
    },
    BGImage: {
      type: String,
      default: "",
    },
  },

  components: {
    Text,
    Link,
    Image,
  },
};
</script>
r
<style scoped>
.container {
  flex-direction: column;

  display: flex;
  justify-content: space-between;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;

  /* Add this line to give the parent element a position */
}

.container[data-has-image="true"] {
  background-image: url(BGImage);
}

.container--selected {
  border: 2px solid #1280ff;

  /*   position: relative; */
}

.container--selected .name {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #1280ff;
  color: white;
  padding: 0px 4px;
}

.child {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
  /* Add this line to give the parent element a position */
}
</style>
