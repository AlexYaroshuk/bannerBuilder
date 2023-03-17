<template>
  <div
    :container="container"
    class="container"
    :class="{
      'container--selected': container.isSelected,
      'container--hovered': container.isHovered && !container.isSelected, //not sure why, but need the second condition here. TODO: check the diff w/ children
    }"
    :style="{
      backgroundColor: !bannerStyle ? container.backgroundColor : undefined,
      borderRadius: borderRadius + 'px',
      borderWidth: borderWidth + 'px',
      borderColor: borderColor,
      backgroundImage: `url(${BGImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }"
    @click="handleContainerClick"
    @mouseover="handleContainerHover"
  >
    <div class="name" v-if="container.isSelected">{{ name }}</div>
    <div class="child" v-if="container.children && container.children.length">
      <div
        v-for="(child, index) in container.children"
        :key="index"
        @click.stop="selectChild(child, index)"
        @mouseover.stop="handleContainerChildHover(child, this.container)"
        class="child-item"
        :class="{
          'child-item--selected': child.isSelected,
          'child-item--hovered': child.isHovered,
        }"
        :data-key="index"
      >
        <!--         <div class="name" v-if="child.isSelected">{{ child.type }}</div> -->
        <Text
          v-if="child.type && child.type === 'text'"
          :text="child.value"
          :textBGColor="textBGColor"
          :style="{
            fontSize: fontSize + 'px',
            fontFamily: fontFamily,
            color: textColor,
          }"
          :containerName="name"
        />
      </div>
    </div>
    <!-- <div class="child">
      <Link
        :linkLabel="linkLabel"
        :linkURL="linkURL"
        :linkBGColor="linkBGColor"
        :style="{
          fontSize: linkFontSize + 'px',
          fontFamily: linkFontFamily,
        }"
      />
    </div>
    <div class="child">
      <Image :imageLink="imageLink" />
    </div> -->
  </div>
</template>

<script>
import Text from "./Text.vue";
import Link from "./Link.vue";
import Image from "./Image.vue";

export default {
  data() {
    return {
      currentContainerIndex: null,
      defaultColors: ["purple", "blue"],
      /* selectedChild: {}, */
    };
  },

  props: {
    bannerStyle: {
      type: String,
      default: "",
    },
    children: {
      type: Array,
      default: [],
    },
    container: {
      type: Object,
      default: null,
    },
    selectedChild: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: null,
    },

    /*    isSelected: {
      type: Boolean,
      required: true,
      default: false,
    }, */

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
      default: null,
    },
    BGImage: {
      type: String,
      default: "",
    },
  },
  methods: {
    selectChild(child, childIndex) {
      this.$emit("select-child", child, childIndex, this.name);
    },

    handleContainerClick() {
      this.$emit("select-container", this.container);
    },

    handleContainerHover() {
      this.$emit("container-hover", this.container);
    },

    handleContainerChildHover(child, container) {
      this.$emit("container-child-hover", child, container);
    },
  },

  components: {
    Text,
    Link,
    Image,
  },
};
</script>

<style scoped>
.container {
  flex-direction: column;
  width: 520px;
  height: 96px;

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
.container--hovered {
  border: 2px solid #1482ff80;
}
.container--selected .name {
  position: absolute;
  top: 0;
  left: 0;
  font-size: small;
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

.child-item {
  position: relative;
  display: flex;
  z-index: 1;
  border: 2px solid transparent;
  /*   align-items: center;
  padding: 16px;
  flex: 1; */
  /* Add this line to give the parent element a position */
}
.child-item--hovered {
  border: 2px solid #1482ff80;
}

.child-item--selected {
  border: 2px solid #1482ff;
  /* Add this line to give the parent element a position */
}

/* .child--selected .name {
  position: relative;
  top: 0;
  left: 0;
  font-size: 8px;
  background-color: #1280ff;
  color: white;
  padding: 0px 2px;
} */
</style>
