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
      <div v-if="!viewModel.selectedItem">
        <h3>Nothing selected</h3>
        <br />
        When you select an element, you'll see its properties here.
      </div>
      <h3 v-if="viewModel.selectedItem">
        selected:{{ viewModel.selectedItem.type }}
      </h3>

      <div
        class="popup-content"
        :class="popupContentClass"
        style="margin-top: 16px"
      >
        <!-- text/link settings -->
        <div
          v-if="
            viewModel.selectedItem &&
            ((viewModel.selectedItem.type ?? '' === 'text') ||
              (viewModel.selectedItem.type ?? '' === 'link'))
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
        <div
          v-if="
            viewModel.selectedItem && viewModel.selectedItem.type === 'link'
          "
        >
          <div class="form-group">
            <label for="text-field">URL:</label>
            <input
              @input="updateChildText"
              id="text-field"
              type="text"
              v-model="viewModel.selectedItem.URL"
            />
          </div>
        </div>
      </div>
      <!-- hybrid settings -->
      <h3
        v-if="viewModel.selectedItem && viewModel.selectedItem.type === 'link'"
      >
        Link styles are WIP
      </h3>
      <div
        class="popup-content"
        v-if="viewModel.selectedItem && viewModel.selectedItem.type != 'link'"
      >
        <h3 @click="expandableGroups.typography = !expandableGroups.typography">
          Typography ({{ viewModel.selectedItem.type }})
          <i class="material-icons">
            {{ expandableGroups.typography ? "expand_less" : "expand_more" }}
          </i>
        </h3>
        <div v-if="expandableGroups.typography">
          <div style="border: 1px solid black">
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <p
                v-if="viewModel.selectedItem.parentContainer"
                class="status-text"
                :class="
                  viewModel.selectedItem.fontSize
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                {{
                  viewModel.selectedItem.fontSize
                    ? "Custom font size"
                    : "Inheriting from " +
                      viewModel.selectedItem.parentContainer.name
                }}
              </p>
              <button
                v-if="viewModel.selectedItem.fontSize"
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
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <p
                v-if="viewModel.selectedItem.parentContainer"
                class="status-text"
                :class="
                  viewModel.selectedItem.fontFamily
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                {{
                  viewModel.selectedItem.fontFamily
                    ? "Custom font family"
                    : "Inheriting from " +
                      viewModel.selectedItem.parentContainer.name
                }}
              </p>
              <button
                v-if="viewModel.selectedItem.fontFamily"
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
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <p
                v-if="viewModel.selectedItem.parentContainer"
                class="status-text"
                :class="
                  viewModel.selectedItem.color
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                {{
                  viewModel.selectedItem.color
                    ? "Custom color"
                    : "Inheriting from " +
                      viewModel.selectedItem.parentContainer.name
                }}
              </p>
              <button
                v-if="viewModel.selectedItem.color"
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
                :style="{ backgroundColor: viewModel.selectedItemColor }"
                @click="showColorPicker = !showColorPicker"
              ></div>
              <span class="hex-code">{{ viewModel.selectedItemColor }}</span>
            </div>
            <ColorPicker
              default-format="hex"
              v-if="showColorPicker"
              v-model="viewModel.selectedItemColor"
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
          v-if="
            viewModel.selectedItem &&
            viewModel.selectedItem.type === 'container'
          "
        >
          Backgrounds
          <i class="material-icons">
            {{ expandableGroups.background ? "expand_less" : "expand_more" }}
          </i>
        </h3>
        <div
          v-if="
            expandableGroups.background &&
            viewModel.selectedItem.type === 'container'
          "
        >
          <div class="color-display-container">
            <label for="color-picker">Color:</label>
            <div
              class="color-square"
              :style="{
                backgroundColor: viewModel.selectedItem.backgroundColor,
              }"
              @click="showBGColorPicker = !showBGColorPicker"
            ></div>
            <span class="hex-code">{{
              viewModel.selectedItem.backgroundColor
            }}</span>
          </div>
          <ColorPicker
            default-format="hex"
            v-if="showBGColorPicker"
            :color="viewModel.selectedItem.backgroundColor"
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
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";

export default {
  components: {
    ColorPicker,
    FIleUploader,
  },
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      default: null,
    },
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
        return this.viewModel.selectedItem
          ? this.viewModel.selectedItem.value
          : "";
      },
      set(newValue) {
        if (this.viewModel.selectedItem) {
          this.viewModel.selectedItem.value = newValue;
        }
      },
    },
    fontSize: {
      get() {
        return this.viewModel.selectedItem.fontSize !== null
          ? this.viewModel.selectedItem.fontSize
          : this.viewModel.selectedItem.parentContainer
          ? this.viewModel.selectedItem.parentContainer.fontSize
          : null;
      },
      set(fontSize) {
        this.viewModel.selectedItem.fontSize = fontSize;
      },
    },
    fontFamily: {
      get() {
        return this.viewModel.selectedItem.fontFamily !== null
          ? this.viewModel.selectedItem.fontFamily
          : this.viewModel.selectedItem.parentContainer
          ? this.viewModel.selectedItem.parentContainer.fontFamily
          : null;
      },
      set(fontFamily) {
        this.viewModel.selectedItem.fontFamily = fontFamily;
      },
    },

    selectedItemColor: {
      get() {
        return this.viewModel.selectedItem.color !== null
          ? this.viewModel.selectedItem.color
          : this.viewModel.selectedItem.parentContainer
          ? this.viewModel.selectedItem.parentContainer.color
          : null;
      },
      set(newColor) {
        this.viewModel.selectedItem.color = newColor;
      },
    },
    paragraphBgColor() {
      return this.viewModel.selectedItem.color ? "red" : "green";
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
        item: this.viewModel.selectedItem,
        color: eventData.cssColor,
      });
    },

    updateTypographyFontsize() {
      this.$emit("set-typography-fontsize", {
        item: this.viewModel.selectedItem,
        size: this.selectedTextSize,
      });
    },
    updateTypographyFontfamily() {
      this.viewModel.selectedItem.fontfamily = this.selectedTextFont;
    },

    updateColor(eventData) {
      this.$emit("set-bg-color", {
        item: this.viewModel.selectedItem,
        color: eventData.cssColor,
      });
    },

    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    resetStyle(type) {
      this.$emit("reset-style", {
        item: this.viewModel.selectedItem,
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
