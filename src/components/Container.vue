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
    @click="handleContainerClick"
  >
    <div class="name" v-if="isSelected">{{ name }}</div>
    <div class="child" v-if="children && children.length">
      <div
        v-for="(child, index) in children"
        :key="index"
        @click.stop="selectChild(child, index)"
        :data-key="index"
      >
        <Text
          class="child-item"
          :class="{ 'child-item--selected': child.isSelected }"
          v-if="child.type && child.type === 'text'"
          :text="child.value"
          :textBGColor="textBGColor"
          :style="{
            fontSize: fontSize + 'px',
            fontFamily: fontFamily,
            color: textColor,
          }"
          :isSelected="child.isSelected"
          :containerName="name"
          :key="'text-' + index"
        />
      </div>
    </div>
    <!-- <div class="child">
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
    children: {
      type: Array,
      default: [],
    },

    selectedChild: {
      type: Object,
      default: null,
    },
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

    handleContainerClick(event) {
      let childItem = event.target.closest(".child-item");
      if (childItem) {
        let childIndex = parseInt(childItem.getAttribute("data-key"));
        let child = this.children[childIndex];
        this.selectChild(child);
        this.$emit("select-container", this.index);
      } else {
        this.$emit("deselect-all");
        this.$emit("select-container", this.index);
      }
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
.container:not(.selected):hover {
  border: 2px solid #1280ff;
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
.child-item--selected {
  border: 2px solid #1280ff;
  /* Add this line to give the parent element a position */
}
.child-item:not(.selected):hover {
  border: 2px solid #1280ff;
}
</style>
