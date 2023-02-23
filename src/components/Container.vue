<template>
  <div
    class="container"
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
        :style="{
          fontSize: linkFontSize + 'px',
          fontFamily: linkFontFamily,
        }"
      />
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
    borderColor: {
      type: String,
      default: "green",
    },
    borderRadius: {
      type: Number,
      default: 0,
    },
    borderWidth: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: "This is some text",
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
      default: "white",
    },
    textBGColor: {
      type: String,
      default: "white",
    },

    linkLabel: {
      type: String,
      default: "this is some link",
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
    BGImage: {
      type: String,
      default: "",
    },
  },

  watch: {
    BGImage: function (newVal) {
      this.backgroundImage = newVal ? `url(${newVal})` : null;
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0px solid black;

  /* Add this line to give the parent element a position */
}

.container[data-has-image="true"] {
  background-image: url(BGImage);
}

.child {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
  /* Add this line to give the parent element a position */
}
</style>
