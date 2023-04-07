<template>
  <div>
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
      <div v-if="!selectedItem">
        <h3>Nothing selected</h3>
        <br />
        When you select an element, you'll see its properties here.
      </div>
      <h3 v-if="selectedItem">selected:{{ selectedItem.type }}</h3>

      <div
        class="popup-content"
        :class="popupContentClass"
        style="margin-top: 16px"
      >
        <!-- text/link settings -->
        <div
          v-if="
            (selectedItem?.type ?? '') === 'text' ||
            (selectedItem?.type ?? '') === 'link'
          "
        >
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
        <!-- link settings -->
        <div v-if="selectedItem && selectedItem.type === 'link'">
          <div class="form-group">
            <label for="text-field">URL:</label>
            <input
              @input="updateChildText"
              id="text-field"
              type="text"
              v-model="selectedItem.URL"
            />
          </div>
        </div>
      </div>
      <!-- hybrid settings -->
      <h3 v-if="selectedItem && selectedItem.type === 'link'">
        Link styles are WIP
      </h3>
      <div
        class="popup-content"
        v-if="selectedItem && selectedItem.type != 'link'"
      >
        <h3 @click="expandableGroups.typography = !expandableGroups.typography">
          Typography ({{ selectedItem.type }})
          <i class="material-icons">
            {{ expandableGroups.typography ? "expand_less" : "expand_more" }}
          </i>
        </h3>
        <div v-if="expandableGroups.typography">
          <div style="border: 1px solid black">
            <div class="status-text" v-if="selectedItem.parentContainer">
              <p
                v-if="selectedItem.parentContainer"
                class="status-text"
                :class="
                  selectedItem.fontSize
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                {{
                  selectedItem.fontSize
                    ? "Custom font size"
                    : "Inheriting from " + selectedItem.parentContainer.name
                }}
              </p>
              <button
                v-if="selectedItem.fontSize"
                @click.stop="resetStyle('fontSize')"
                class="reset-button"
              >
                Reset
              </button>
            </div>
            <label for="fontSize">Font size:</label>
            <input
              id="fontSize"
              type="number"
              min="1"
              step="1"
              v-model="fontSize"
            />
          </div>

          <div style="border: 1px solid black; margin-top: 4px">
            <div class="status-text" v-if="selectedItem.parentContainer">
              <p
                v-if="selectedItem.parentContainer"
                class="status-text"
                :class="
                  selectedItem.fontFamily
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                {{
                  selectedItem.fontFamily
                    ? "Custom font family"
                    : "Inheriting from " + selectedItem.parentContainer.name
                }}
              </p>
              <button
                v-if="selectedItem.fontFamily"
                @click.stop="resetStyle('fontFamily')"
                class="reset-button"
              >
                Reset
              </button>
            </div>
            <label for="text-font-family">Font Family:</label>
            <select
              id="text-font-family"
              v-model="fontFamily"
              @change="updateTypographyFontfamily"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
            </select>
          </div>
          <div style="border: 1px solid black; margin-top: 4px">
            <div class="status-text" v-if="selectedItem.parentContainer">
              <p
                v-if="selectedItem.parentContainer"
                class="status-text"
                :class="
                  selectedItem.color
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                {{
                  selectedItem.color
                    ? "Custom color"
                    : "Inheriting from " + selectedItem.parentContainer.name
                }}
              </p>
              <button
                v-if="selectedItem.color"
                @click.stop="resetStyle('color')"
                class="reset-button"
              >
                Reset
              </button>
            </div>
            <div class="color-display-container">
              <label for="color-picker">Color:</label>
              <div
                class="color-square"
                :style="{ backgroundColor: selectedItemColor }"
                @click="showColorPicker = !showColorPicker"
              ></div>
              <span class="hex-code">{{ selectedItemColor }}</span>
            </div>
            <ColorPicker
              default-format="hex"
              v-if="showColorPicker"
              v-model="selectedItemColor"
              @color-change="updateTypographyColor"
            />
          </div>
        </div>
        <!--         <div class="popup-content" v-if="selectedChild">
          <h3>Typography color (child)</h3>
          <ColorPicker
            :color="selectedChild.color"
            @color-change="updateTextColor"
          />
        </div> -->

        <!-- container settings -->
        <h3
          @click="expandableGroups.background = !expandableGroups.background"
          style="margin-top: 16px"
          v-if="selectedItem && selectedItem.type === 'container'"
        >
          Backgrounds
          <i class="material-icons">
            {{ expandableGroups.background ? "expand_less" : "expand_more" }}
          </i>
        </h3>
        <div
          v-if="
            expandableGroups.background && selectedItem.type === 'container'
          "
        >
          <div class="color-display-container">
            <label for="color-picker">Color:</label>
            <div
              class="color-square"
              :style="{ backgroundColor: selectedItem.backgroundColor }"
              @click="showBGColorPicker = !showBGColorPicker"
            ></div>
            <span class="hex-code">{{ selectedItem.backgroundColor }}</span>
          </div>
          <ColorPicker
            default-format="hex"
            v-if="showBGColorPicker"
            :color="selectedItem.backgroundColor"
            @color-change="updateColor"
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
    selectedItem: {
      type: Object,
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
      expandableGroups: {
        typography: true,
        background: true,
      },
      currentSettings: "",
      isVisible: true,
      text: this.text,

      selectedTextSize: this.selectedTextSize,
      selectedTextFont: this.selectedTextFont,
      showColorPicker: false,
      showBGColorPicker: false,
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
        return this.selectedItem ? this.selectedItem.value : "";
      },
      set(newValue) {
        if (this.selectedItem) {
          this.selectedItem.value = newValue;
        }
      },
    },
    fontSize: {
      get() {
        return this.selectedItem.fontSize !== null
          ? this.selectedItem.fontSize
          : this.selectedItem.parentContainer
          ? this.selectedItem.parentContainer.fontSize
          : null;
      },
      set(fontSize) {
        this.selectedItem.fontSize = fontSize;
      },
    },
    fontFamily: {
      get() {
        return this.selectedItem.fontFamily !== null
          ? this.selectedItem.fontFamily
          : this.selectedItem.parentContainer
          ? this.selectedItem.parentContainer.fontFamily
          : null;
      },
      set(fontFamily) {
        this.selectedItem.fontFamily = fontFamily;
      },
    },

    selectedItemColor: {
      get() {
        return this.selectedItem.color !== null
          ? this.selectedItem.color
          : this.selectedItem.parentContainer
          ? this.selectedItem.parentContainer.color
          : null;
      },
      set(newColor) {
        this.selectedItem.color = newColor;
      },
    },
    paragraphBgColor() {
      return this.selectedItem.color ? "red" : "green";
    },
  },

  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    //hybrid settings
    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    updateTypographyColor(eventData) {
      this.$emit("set-typography-color", {
        item: this.selectedItem,
        color: eventData.cssColor,
      });
    },

    updateTypographyFontsize() {
      console.log("size", this.selectedTextSize);
      this.$emit("set-typography-fontsize", {
        item: this.selectedItem,
        size: this.selectedTextSize,
      });
    },
    updateTypographyFontfamily() {
      this.selectedItem.fontfamily = this.selectedTextFont;
    },

    updateColor(eventData) {
      this.$emit("set-bg-color", {
        item: this.selectedItem,
        color: eventData.cssColor,
      });
    },

    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    resetStyle(type) {
      this.$emit("reset-style", {
        item: this.selectedItem,
        type: type,
      });
    },

    setImageAsBG(image) {
      this.BGImage = image;
      this.$emit("update-image-BG", this.BGImage);
    },
    clearImage() {
      this.BGImage = null;
      this.$emit("clear-image-BG");
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
.status-text {
  display: flex;
  font-weight: 600;
  font-size: small;
  /*   padding-left: 4px;
  padding-right: 4px; */
}

.status-text-inherited-color {
  color: rgb(154, 67, 253);
  background-color: rgba(154, 67, 253, 0.2);
}

.status-text-selected-color {
  color: rgba(0, 123, 255);
  background-color: rgba(0, 123, 255, 0.2);
}

.color-display-container {
  display: flex;
  align-items: center;
}

.color-square {
  width: 24px;
  height: 24px;
  border: 1px solid black;
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
}

.hex-code {
  margin-right: 4px;
}
</style>
