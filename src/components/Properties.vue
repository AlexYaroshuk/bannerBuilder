<template>
  <aside :class="['sidebar-button', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&lt; Show sidebar</button>
  </aside>
  <aside :class="['sidebar', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&gt; Hide</button>
    <div class="tab-bar">
      <header v-for="(tab, index) in tabs" :key="index">
        <i class="material-icons"> {{ tab.icon }}</i>
        <span>{{ tab.label }}</span>
        <div class="ripple"></div>
      </header>
    </div>
    <h4 v-if="!selectedChild & !selectedContainer">nothing selected</h4>
    <h2 v-if="selectedChild && !selectedContainer">
      selected:{{ selectedChild.type }}
    </h2>
    <h2 v-if="!selectedChild && selectedContainer">
      selected:{{ selectedContainer.name }}
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

        <div style="margin-top: 16px">
          <h4>Image upload</h4>
          <FIleUploader
            v-model="BGImage"
            @set-image="setImageAsBG"
            @clear-image="clearImage"
          />
        </div>

        <hr style="margin-top: 16px" />

        <h3>Border settings</h3>
        <h4>Border color</h4>
        <ColorPicker :color="color" @color-change="updateBorderColor" />

        <div style="margin-top: 16px">
          <h4>Border width</h4>
          <div class="slider">
            <input
              style="width: 100%"
              type="range"
              min="0"
              max="32"
              v-model="borderWidth"
              @input="updateBorderWidth"
            />
            <span class="value">{{ borderWidth }}</span>
          </div>

          <div style="margin-top: 16px">
            <h4>Border radius</h4>
            <div class="slider">
              <input
                style="width: 100%"
                type="range"
                min="0"
                max="100"
                v-model="borderRadius"
                @input="updateBorderRadius"
              />
              <span class="value">{{ borderRadius }}</span>
            </div>
          </div>
        </div>
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

        <div>
          <label for="fontSize">Select font size:</label>
          <select
            id="fontSize"
            v-model="selectedTextSize"
            @change="onSelectTextSize"
          >
            <option value="12">12px</option>
            <option value="24">24px</option>
            <option value="36">36px</option>
            <option value="48">48px</option>
          </select>
        </div>

        <div>
          <label for="text-font-family">Font Family:</label>
          <select
            id="text-font-family"
            v-model="selectedTextFont"
            @change="onChangeTextFont"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
          </select>
        </div>
        <h3>Text Color</h3>
        <ColorPicker :color="textColor" @color-change="updateTextColor" />
        <h3>Text background color</h3>
        <ColorPicker :color="textBGColor" @color-change="updateTextBGColor" />
      </div>
    </div>
  </aside>
</template>

<script>
import { ColorPicker } from "vue-accessible-color-picker";
import FIleUploader from "./FIleUploader.vue";
/* import { debounce } from "lodash"; */

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
    // other props...
  },

  data() {
    return {
      tabs: [
        {
          name: "properties",
          label: "Properties",
          icon: "tune",
        },
        /*        {
          name: "assets",
          label: "Assets",
          icon: "folder",
        }, */
        /*         {
          name: "elements",
          label: "Elements",
          icon: "widgets",
        }, */
      ],
      currentSettings: "container",
      isVisible: true,
      text: this.text,
      inputText: "",
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
  watch: {
    selectedChild: function (newValue) {
      this.inputText = newValue.value;
    },
  },

  computed: {
    popupContentClass() {
      return {
        show: this.currentSettings === !null,
      };
    },
    selectedText() {
      if (
        this.selectedChild &&
        this.selectedChild.type === "text" &&
        this.$parent.selectedContainerIndex !== null
      ) {
        const container =
          this.$parent.containers[this.$parent.selectedContainerIndex];
        const text = container.texts[this.selectedChild.index];
        return text ? text.value : "";
      } else {
        return "";
      }
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

    //wip for expandable groups
    showSettings(settingsType) {
      this.currentSettings = settingsType;
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
}
</style>
