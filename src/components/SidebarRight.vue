<template>
  <aside :class="['sidebar-button', { hidden: !isVisible }]">
    <button @click="toggleVisibility">&lt; Show sidebar</button>
  </aside>
  <aside :class="['sidebar', { hidden: !isVisible }]">
    <h2>Properties</h2>
    <!--     <p>
      This is where you can customize a property. Select an option to get
      started
    </p>
    <button @click="toggleVisibility">&gt; Hide</button>
 -->
    <div>
      <button @click="showSettings('container')">Container</button
      ><button @click="showSettings('text')">Text</button
      ><button @click="showSettings('link')">Link</button
      ><button @click="showSettings('upload image')">Image</button>
    </div>

    <div class="popup-content" :class="popupContentClass">
      <!-- container settings -->

      <div class="popup-content" v-if="currentSettings === 'container'">
        <h3>Customize Container</h3>
        <h3>Background color/image</h3>
        <ColorPicker :color="color" @color-change="updateColor" />
        <div>
          <h3>Image upload</h3>
          <FIleUploader
            v-model="BGImage"
            @set-image="setImageAsBG"
            @clear-image="clearImage"
          />
        </div>

        <h3>Border settings</h3>
        <h2>Border color</h2>
        <ColorPicker :color="color" @color-change="updateBorderColor" />

        <h2>Border width</h2>
        <div class="slider">
          <input
            style="width: 100%"
            type="range"
            min="0"
            max="100"
            v-model="borderWidth"
            @input="updateBorderWidth"
          />
          <span class="value">{{ borderWidth }}</span>

          <h2>Border radius</h2>
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
    <!-- text settings -->
    <div v-if="currentSettings === 'text'">
      <div class="form-group">
        <h3>Customize Text</h3>

        <label for="text-field">Text:</label>
        <input
          :initial="text"
          @input="updateText"
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
        <h3>Customize Text Color</h3>
        <ColorPicker :color="textColor" @color-change="updateTextColor" />
        <h3>Customize Text BG Color</h3>
        <ColorPicker :color="textBGColor" @color-change="updateTextBGColor" />
      </div>
    </div>

    <!-- link settings -->

    <div v-if="currentSettings === 'link'">
      <h3>Customize Link</h3>
      <label for="text-field">Text:</label>
      <input
        style="width: 100%"
        @input="updateLinkLabel"
        id="link-label"
        type="text"
        v-model="inputLinkLabel"
      />

      <div>
        <label for="linkFontSize">Select font size:</label>
        <select
          id="linkFontSize"
          v-model="selectedLinkTextSize"
          @change="onSelectLinkSize"
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
          id="link-font-family"
          v-model="selectedLinkFont"
          @change="onChangeLinkFont"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Helvetica">Helvetica</option>
        </select>
      </div>

      <label for="text-field">URL:</label>
      <input
        style="width: 100%"
        @input="updateLinkURL"
        id="link-URL"
        type="URL"
        v-model="inputLinkURL"
      />
      <h3>Customize Link Color</h3>
      <ColorPicker :color="linkColor" @color-change="setLinkColor" />
      <h3>Customize Link Background</h3>
      <ColorPicker :color="linkBGColor" @color-change="setLinkBGColor" />
    </div>

    <!-- upload settings -->
    <h3>Customize Link</h3>
    <FIleUploader
      v-if="currentSettings === 'upload image'"
      v-model="imageLink"
      @set-image="setNestedImage"
      @clear-image="clearNestedImage"
    />
  </aside>
</template>

<script>
import { ColorPicker } from "vue-accessible-color-picker";
import FIleUploader from "./FIleUploader.vue";
export default {
  components: {
    ColorPicker,
    FIleUploader,
  },
  data() {
    return {
      currentSettings: "container",
      isVisible: true,
      text: this.text,
      inputText: "",
      selectedTextSize: "14",
      selectedTextFont: "Arial",
      textColor: "black",
      textBGColor: this.textBGColor,
      inputLinkLabel: "",
      selectedLinkFont: "Arial",
      linkColor: "black",
      linkBGColor: this.linkBGColor,
      selectedLinkTextSize: "14",
      inputLinkURL: "",
      color: this.bannerColor,
      borderColor: this.bannerBorderColor,
      selectedColor: "",
      borderRadius: 0,
      borderWidth: 0,
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
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    // text settings
    updateText() {
      this.$emit("set-text", this.inputText);
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
      this.$emit("set-bg-color", eventData.cssColor);
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
