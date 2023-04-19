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
      <h3
        v-if="
          viewModel.selectedItem &&
          viewModel.selectedItem.parentContainer != null
        "
      >
        selected:{{ viewModel.selectedItem.type }}
      </h3>
      <h3
        style="background-color: gold"
        v-if="
          viewModel.selectedItem &&
          viewModel.selectedItem.parentContainer === null
        "
      >
        selected: rootContainer
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
            (viewModel.selectedItem.type === 'text' ||
              viewModel.selectedItem.type === 'link')
          "
        >
          <div class="form-group">
            <label for="text-field">Text:</label>
            <input
              @input="updateChildText"
              id="text-field"
              type="text"
              v-model="viewModel.selectedItem.label"
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
              v-model="viewModel.selectedItem.url"
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
          Typography({{
            viewModel.selectedItem.parentContainer
              ? viewModel.selectedItem.type
              : ""
          }}{{ viewModel.selectedItem.parentContainer ? "" : "root" }})
          <i class="material-icons">
            {{ expandableGroups.typography ? "expand_less" : "expand_more" }}
          </i>
        </h3>
        <div v-if="expandableGroups.typography">
          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <div
                v-if="viewModel.selectedItem.parentContainer"
                :class="
                  viewModel.selectedItem.fontSize
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.selectedItem.fontSize">Custom font size</p>

                <div
                  class="status-text"
                  v-if="!viewModel.selectedItem.fontSize"
                >
                  Inheriting from
                  <p
                    class="link-text"
                    @click="
                      this.viewModel.selectItem(
                        viewModel.selectedItem.parentContainer
                      )
                    "
                  >
                    {{ viewModel.selectedItem.parentContainer.name }}
                  </p>
                </div>
              </div>
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
          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <div
                v-if="viewModel.selectedItem.parentContainer"
                :class="
                  viewModel.selectedItem.fontWeight
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.selectedItem.fontWeight">
                  Custom font weight
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.selectedItem.fontWeight"
                >
                  Inheriting from
                  <p
                    class="link-text"
                    @click="
                      this.viewModel.selectItem(
                        viewModel.selectedItem.parentContainer
                      )
                    "
                  >
                    {{ viewModel.selectedItem.parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.selectedItem.fontWeight"
                @click.stop="resetStyle('fontWeight')"
                class="reset-button"
              >
                Reset
              </button>
            </div>
            <label for="fontWeight">Font weight:</label>
            <input
              id="fontWeight"
              type="number"
              min="1"
              step="1"
              v-model="fontWeight"
            />
          </div>

          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <div
                v-if="viewModel.selectedItem.parentContainer"
                :class="
                  viewModel.selectedItem.fontFamily
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.selectedItem.fontFamily">
                  Custom font family
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.selectedItem.fontFamily"
                >
                  Inheriting from
                  <p
                    class="link-text"
                    @click="
                      this.viewModel.selectItem(
                        viewModel.selectedItem.parentContainer
                      )
                    "
                  >
                    {{ viewModel.selectedItem.parentContainer.name }}
                  </p>
                </div>
              </div>
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
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Roboto">Roboto</option>
            </select>
          </div>
          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <div
                v-if="viewModel.selectedItem.parentContainer"
                :class="
                  viewModel.selectedItem.color
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.selectedItem.color">Custom color</p>

                <div class="status-text" v-if="!viewModel.selectedItem.color">
                  Inheriting from
                  <p
                    class="link-text"
                    @click="
                      this.viewModel.selectItem(
                        viewModel.selectedItem.parentContainer
                      )
                    "
                  >
                    {{ viewModel.selectedItem.parentContainer.name }}
                  </p>
                </div>
              </div>
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
          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.selectedItem.parentContainer"
            >
              <div
                v-if="viewModel.selectedItem.parentContainer"
                :class="
                  viewModel.selectedItem.backgroundColor
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.selectedItem.backgroundColor">
                  Custom background color
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.selectedItem.backgroundColor"
                >
                  Inheriting from
                  <p
                    class="link-text"
                    @click="
                      this.viewModel.selectItem(
                        viewModel.selectedItem.parentContainer
                      )
                    "
                  >
                    {{ viewModel.selectedItem.parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.selectedItem.backgroundColor"
                @click.stop="resetStyle('backgroundColor')"
                class="reset-button"
              >
                Reset
              </button>
            </div>
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
              v-model="selectedItemBackgroundColor"
              @color-change="updateColor"
            />
          </div>
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
          ? this.viewModel.selectedItem.text
          : "";
      },
      set(newValue) {
        if (this.viewModel.selectedItem) {
          this.viewModel.selectedItem.text = newValue;
        }
      },
    },
    /* selectedItemFontSize: {
      get() {
        const selectedItem = this.viewModel.selectedItem;
        if (selectedItem) {
          if (selectedItem.fontSize !== null) {
            return selectedItem.fontSize;
          } else if (
            selectedItem.parentContainer &&
            selectedItem.parentContainer.fontSize !== null
          ) {
            return selectedItem.parentContainer.fontSize;
          }
        }
        return null;
      },
      set(fontSize) {
        this.viewModel.selectedItem.fontSize = selectedItemFontSize;
      },
    },
    selectedItemFontFamily: {
      get() {
        const selectedItem = this.viewModel.selectedItem;
        if (selectedItem) {
          if (selectedItem.fontFamily !== null) {
            return selectedItem.fontFamily;
          } else if (
            selectedItem.parentContainer &&
            selectedItem.parentContainer.fontFamily !== null
          ) {
            return selectedItem.parentContainer.fontFamily;
          }
        }
        return null;
      },
      set(selectedItemFontFamily) {
        this.viewModel.selectedItem.fontFamily = selectedItemFontFamily;
      },
    },
    selectedItemFontWeight: {
      get() {
        const selectedItem = this.viewModel.selectedItem;
        if (selectedItem) {
          if (selectedItem.selectedItemFontWeight !== null) {
            return selectedItem.selectedItemFontWeight;
          } else if (
            selectedItem.parentContainer &&
            selectedItem.parentContainer.selectedItemFontWeight !== null
          ) {
            return selectedItem.parentContainer.selectedItemFontWeight;
          }
        }
        return null;
      },
      set(selectedItemFontWeight) {
        this.viewModel.selectedItem.fontWeight = selectedItemFontWeight;
      },
    }, */

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
    fontWeight: {
      get() {
        return this.viewModel.selectedItem.fontWeight !== null
          ? this.viewModel.selectedItem.fontWeight
          : this.viewModel.selectedItem.parentContainer
          ? this.viewModel.selectedItem.parentContainer.fontWeight
          : null;
      },
      set(fontWeight) {
        this.viewModel.selectedItem.fontWeight = fontWeight;
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
      set(selectedItemColor) {
        this.viewModel.selectedItem.color = selectedItemColor;
      },
    },
    selectedItemBackgroundColor: {
      get() {
        return this.viewModel.selectedItem.backgroundColor !== null
          ? this.viewModel.selectedItem.backgroundColor
          : this.viewModel.selectedItem.parentContainer
          ? this.viewModel.selectedItem.parentContainer.backgroundColor
          : null;
      },
      set(selectedItemBackgroundColor) {
        this.viewModel.selectedItem.backgroundColor =
          selectedItemBackgroundColor;
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
      this.viewModel.selectedItem.color = eventData.cssColor;
      console.log(this.viewModel.selectedItem.color);
    },

    /*     updateTypographyFontsize() {
      this.$emit("set-typography-fontsize", {
        item: this.viewModel.selectedItem,
        size: this.selectedTextSize,
      });
    }, */
    updateTypographyFontfamily() {
      this.viewModel.selectedItem.fontfamily = this.selectedTextFont;
    },

    updateColor(eventData) {
      (this.viewModel.selectedItem.backgroundColor = eventData.cssColor),
        console.log(this.viewModel.selectedItem.backgroundColor);
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

  font-size: small;
}
.link-text {
  margin-left: 4px;
  display: flex;
  font-weight: 600;
  font-size: small;
  text-decoration: underline;
  cursor: pointer;
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

.prop-section {
  border-top: 1px solid lightgray;
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
