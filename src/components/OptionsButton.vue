<template>
  <div
    class="options-button"
    :class="{ 'is-active': isActive }"
    style="text-align: center; line-height: 2em"
  >
    <div @click="toggleDropdown">
      <i class="fas fa-edit"></i>
    </div>
    <div class="dropdown" :class="{ show: showDropdown }">
      <ul>
        <li @click="showPopup = true">Change text</li>
        <li @click="showColorPicker = true">Change color</li>
      </ul>
    </div>
    <div class="popup" :class="{ show: showPopup }">
      <div class="popup-content">
        <h3>Change Text</h3>
        <div class="form-group">
          <label for="text-field">Text:</label>
          <input id="text-field" type="text" v-model="newText" />
          <div class="popup-buttons">
            <button @click="updateBannerText">OK</button>
            <button @click="hidePopup">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div class="popup" :class="{ show: showColorPicker }">
      <div class="popup-content">
        <h3>Change Color</h3>
        <ColorPicker :color="color" @color-change="updateColor" />

        <div
          :style="{
            backgroundColor: tempColor,
            width: '100px',
            height: '100px',
          }"
        ></div>
        <div class="popup-buttons">
          <button @click="hideColors">Cancel</button>
          <button @click="applyColor">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ColorPicker } from "vue-accessible-color-picker";

export default {
  components: {
    ColorPicker,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    bannerColor: {
      type: String,
      default: "purple",
    },
    bannerText: {
      type: String,
      default: "Banner Text",
    },
  },
  data() {
    return {
      showDropdown: false,
      showPopup: false,
      newText: this.bannerText,
      showColorPicker: false,
      color: this.bannerColor,
      tempColor: this.bannerColor,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    hideDropdown() {
      this.showDropdown = false;
    },
    hidePopup() {
      this.showPopup = false;
      this.showColorPicker = false;
    },
    updateBannerText() {
      this.newText = this.newText;
      this.$emit("update-text", this.newText);
      this.hidePopup();
    },
    updateColor(eventData) {
      this.tempColor = eventData.cssColor;
    },
    applyColor() {
      this.color = this.tempColor;
      this.$emit("update-color", this.color);
      this.showColorPicker = false;
    },
    hideColors() {
      this.showColorPicker = false;
    },
  },
  updated() {
    document.addEventListener("click", (event) => {
      if (!this.$el.contains(event.target)) {
        this.hideDropdown();
        this.hidePopup();
      }
    });
  },
};
</script>

<style scoped>
.options-button {
  display: block;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 4px;
  z-index: 10;
  opacity: 0;
}

.options-button i {
  color: black;
  height: 20px;
  widows: 20px;
}

.options-button.is-active {
  display: block;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dropdown {
  position: absolute;
  border-radius: 4px;
  top: 100%;
  right: 0;
  width: 128px;
  background-color: white;
  color: black;
  transform: translateY(-10px);
  transition: transform 0.2s ease-in-out;
  opacity: 0;
  z-index: 10;
}

.dropdown.show {
  opacity: 1;
  transform: translateY(0);
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #ccc;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  justify-items: flex-start;
  z-index: 20;
  color: black;
}

.popup.show {
  display: flex;
}

.popup-content {
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  text-align: left;
  gap: 3em;
}

.popup-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.popup-input {
  margin-bottom: 1rem;
}

.popup-button {
  display: inline-block;
  background-color: blue;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 1rem;
}

.popup-button:hover {
  background-color: darkblue;
}

.popup-button-secondary {
  display: inline-block;
  background-color: #ccc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.popup-button-secondary:hover {
  background-color: #aaa;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.color-picker {
  position: relative;
  z-index: 99;
}

.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f4f4f4;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-preview-square {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.color-picker-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  background-color: white;
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.color-picker-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.color-picker-button {
  background-color: #f4f4f4;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin-left: 10px;
  cursor: pointer;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
