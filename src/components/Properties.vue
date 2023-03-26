<template>
  <div :class="sidebar">
    <aside :class="['sidebar-button', { hidden: !isVisible }]">
      <button @click="toggleVisibility">&lt; Show sidebar</button>
    </aside>
    <aside :class="['sidebar', { hidden: !isVisible }]">
      <button @click="toggleVisibility">&gt; Hide</button>
      <div class="tab-bar">
        <header v-for="(tab, index) in tabs" :key="index">
          <i class="material-icons"> {{ tab.icon }}</i>
          <span class="tab-text">{{ tab.label }}</span>
          <div class="ripple"></div>
        </header>
      </div>
      <div v-if="!selectedChild & !selectedContainer">
        <h3>Nothing selected</h3>
        <br />
        When you select an element, you'll see its properties here.
      </div>
      <h2 v-if="selectedChild && !selectedContainer">
        selected:{{ selectedChild.type }}
      </h2>
      <h2 v-if="!selectedChild && selectedContainer">
        selected:{{ selectedContainer.containerName }}
      </h2>

      <div
        class="popup-content"
        :class="popupContentClass"
        style="margin-top: 16px"
      >
        <!-- container settings -->

        <div class="popup-content" v-if="selectedContainer">
          <h3>Background color/image</h3>
          <ColorPicker
            :color="selectedContainer.backgroundColor"
            @color-change="updateColor"
          />
        </div>
      </div>
      <!-- text settings -->
      <div v-if="selectedChild && selectedChild.type === 'text'">
        <div class="form-group">
          <label for="text-field">Text:</label>
          <input
            @input="updateChildText"
            id="text-field"
            type="text"
            v-model="inputText"
          />
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ColorPicker } from "vue-accessible-color-picker";
import FIleUploader from "./FIleUploader.vue";

export default {
  components: {
    ColorPicker,
    FIleUploader,
  },
  props: {
    containers: {
      type: Array,
      default: [],
    },
    currentContainerIndex: {
      type: Number,
      default: null,
    },
    containerName: {
      type: String,
      default: null,
    },
    selectedChild: {
      type: Object,
      default: null,
    },
    selectedContainer: {
      type: Object,
      default: null,
    },
    currentSelectionClass: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      tabs: [
        {
          name: "properties",
          label: "Properties",
          icon: "tune",
        },
      ],
      currentSettings: "",
      isVisible: true,
      text: this.text,

      selectedTextSize: this.selectedTextSize,
      selectedTextFont: this.selectedTextFont,
      textColor: this.textColor,
      textBGColor: this.textBGColor,
      inputLinkLabel: "",
      selectedLinkFont: this.selectedLinkFont,
      linkColor: this.linkColor,
      linkBGColor: this.linkBGColor,
      selectedLinkTextSize: this.selectedLinkTextSize,
      inputLinkURL: "",
      backgroundColor: this.backgroundColor,
      borderColor: this.bannerBorderColor,
      selectedColor: "",
      borderRadius: this.borderRadius,
      borderWidth: this.borderWidth,
      BGImage: this.BGImage,
      imageLink: this.imageLink,
    };
  },

  computed: {
    popupContentClass() {
      return {
        show: this.currentSettings === !null,
      };
    },
    inputText: {
      get() {
        return this.selectedChild ? this.selectedChild.value : "";
      },
      set(newValue) {
        if (this.selectedChild) {
          this.selectedChild.value = newValue;
        }
      },
    },
  },

  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    // text settings
    updateChildText() {
      this.$emit("set-text", this.inputText, this.selectedChild);
    },

    onSelectTextSize() {
      this.$emit("text-font-size-changed", this.selectedTextSize);
    },
    onChangeTextFont() {
      this.$emit("text-font-family-changed", this.selectedTextFont);
    },

    updateTextColor(eventData) {
      this.$emit("text-color-changed", eventData.cssColor);
    },
    updateTextBGColor(eventData) {
      this.$emit("text-bg-color-changed", eventData.cssColor);
    },

    // link settings
    updateLinkLabel() {
      this.$emit("set-link-label", this.inputLinkLabel);
    },
    onSelectLinkSize() {
      this.$emit("link-font-size-changed", this.selectedLinkTextSize);
    },
    onChangeLinkFont() {
      this.$emit("link-font-family-changed", this.selectedLinkFont);
    },
    updateLinkURL() {
      this.$emit("set-link-URL", this.inputLinkURL);
    },

    setLinkColor(eventData) {
      this.$emit("link-color-changed", eventData.cssColor);
    },
    setLinkBGColor(eventData) {
      this.$emit("link-bg-color-changed", eventData.cssColor);
    },

    // bg settings
    updateColor(eventData) {
      this.$emit("set-bg-color", {
        container: this.selectedContainer,
        color: eventData.cssColor,
      });
    },

    updateBorderColor(eventData) {
      this.$emit("set-border-color", eventData.cssColor);
    },

    setImageAsBG(image) {
      this.BGImage = image;
      this.$emit("update-image-BG", this.BGImage);
    },
    clearImage() {
      this.BGImage = null;
      this.$emit("clear-image-BG");
    },

    // border settings
    updateBorderRadius(event) {
      this.sliderValueRadius = parseInt(event.target.value);
      this.$emit("set-border-radius", this.sliderValueRadius);
    },
    updateBorderWidth(event) {
      this.sliderValueWidth = parseInt(event.target.value);
      this.$emit("set-border-width", this.sliderValueWidth);
    },

    // image settings
    setNestedImage(image) {
      this.imageLink = image;
      this.$emit("update-image-nested", this.imageLink);
    },
    clearNestedImage() {
      this.imageLink = null;
      this.$emit("clear-image-nested");
    },
  },
};
</script>

<style scoped>
.sidebar {
  color: black;
  background-color: #f5f5f5;
  padding: 1rem;
  width: 20%;
  float: right;
  transition: all 0.2s ease-in-out;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  overflow-y: scroll;
  z-index: 2;
}

.hidden {
  right: -20%;
}

.sidebar-button {
  padding: 1rem;
  float: right;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
}
</style>
