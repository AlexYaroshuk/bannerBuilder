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
      <div v-if="!viewModel.getSelectedElement()">
        <h3>Nothing selected</h3>
        <br />
        When you select an element, you'll see its properties here.
      </div>
      <h3
        v-if="
          viewModel.getSelectedElement() &&
          viewModel.getSelectedElement().parentContainer != null
        "
      >
        selected:{{ viewModel.getSelectedElement().type }}
      </h3>
      <h3
        style="background-color: gold"
        v-if="
          viewModel.getSelectedElement() &&
          viewModel.getSelectedElement().parentContainer === null
        "
      >
        selected: rootContainer
      </h3>

      <!-- ! content settings -->
      <div
        class="prop-section-wrapper"
        v-if="
          viewModel.getSelectedElement() &&
          viewModel.getSelectedElement().type != 'container'
        "
      >
        <p
          class="prop-section-title"
          @click="expandableGroups.content = !expandableGroups.content"
        >
          Content({{
            viewModel.getSelectedElement().parentContainer
              ? viewModel.getSelectedElement().type
              : ""
          }}{{ viewModel.getSelectedElement().parentContainer ? "" : "root" }})
          <i
            class="material-icons {{ expandableGroups.content ? 'expand-less' : 'expand-more' }}"
          >
            {{ expandableGroups.content ? "expand_more" : "chevron_right" }}
          </i>
        </p>

        <div v-if="expandableGroups.content">
          <div
            class="prop-section"
            v-if="viewModel.getSelectedElement().type === 'text'"
          >
            <label for="text-field">Text:</label>
            <input
              id="text-field"
              type="text"
              v-model="viewModel.getSelectedElement().text"
            />
          </div>

          <div
            class="prop-section"
            v-if="viewModel.getSelectedElement().type === 'link'"
          >
            <label for="text-field">Label:</label>
            <input
              id="text-field"
              type="text"
              v-model="viewModel.getSelectedElement().label"
            />
          </div>
          <div
            class="section-divider"
            v-if="viewModel.getSelectedElement().type === 'link'"
          />
          <div
            class="prop-section"
            v-if="
              viewModel.getSelectedElement() &&
              (viewModel.getSelectedElement().type === 'image' ||
                viewModel.getSelectedElement().type === 'link')
            "
          >
            <label for="text-field">URL:</label>
            <input
              id="text-field"
              type="text"
              v-model="viewModel.getSelectedElement().url"
            />
          </div>
        </div>

        <!-- ! link settings -->
      </div>
      <!-- ! hybrid settings -->
      <div
        class="prop-section-wrapper"
        v-if="
          viewModel.getSelectedElement() &&
          viewModel.getSelectedElement().type != 'link' &&
          viewModel.getSelectedElement().type != 'image'
        "
      >
        <p
          class="prop-section-title"
          @click="expandableGroups.typography = !expandableGroups.typography"
        >
          Typography({{
            viewModel.getSelectedElement().parentContainer
              ? viewModel.getSelectedElement().type
              : ""
          }}{{ viewModel.getSelectedElement().parentContainer ? "" : "root" }})
          <i
            class="material-icons {{ expandableGroups.typography ? 'expand-less' : 'expand-more' }}"
          >
            {{ expandableGroups.typography ? "expand_more" : "chevron_right" }}
          </i>
        </p>

        <div v-if="expandableGroups.typography">
          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.getSelectedElement().parentContainer"
            >
              <div
                v-if="viewModel.getSelectedElement().parentContainer"
                :class="
                  viewModel.getSelectedElement().fontSize
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.getSelectedElement().fontSize">
                  Custom font size
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.getSelectedElement().fontSize"
                >
                  Inheriting from
                  <p class="link-text" @click.stop="handleSelectParent">
                    {{ viewModel.getSelectedElement().parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.getSelectedElement().fontSize"
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
          <div class="section-divider" />

          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.getSelectedElement().parentContainer"
            >
              <div
                v-if="viewModel.getSelectedElement().parentContainer"
                :class="
                  viewModel.getSelectedElement().fontWeight
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.getSelectedElement().fontWeight">
                  Custom font weight
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.getSelectedElement().fontWeight"
                >
                  Inheriting from
                  <p class="link-text" @click.stop="handleSelectParent">
                    {{ viewModel.getSelectedElement().parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.getSelectedElement().fontWeight"
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
          <div class="section-divider" />

          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.getSelectedElement().parentContainer"
            >
              <div
                v-if="viewModel.getSelectedElement().parentContainer"
                :class="
                  viewModel.getSelectedElement().fontFamily
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.getSelectedElement().fontFamily">
                  Custom font family
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.getSelectedElement().fontFamily"
                >
                  Inheriting from
                  <p class="link-text" @click.stop="handleSelectParent">
                    {{ viewModel.getSelectedElement().parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.getSelectedElement().fontFamily"
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
          <div class="section-divider" />

          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.getSelectedElement().parentContainer"
            >
              <div
                v-if="viewModel.getSelectedElement().parentContainer"
                :class="
                  viewModel.getSelectedElement().color
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.getSelectedElement().color">Custom color</p>

                <div
                  class="status-text"
                  v-if="!viewModel.getSelectedElement().color"
                >
                  Inheriting from
                  <p class="link-text" @click.stop="handleSelectParent">
                    {{ viewModel.getSelectedElement().parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.getSelectedElement().color"
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
      </div>
      <!--         <div class="popup-content" v-if="selectedChild">
          <h3>Typography color (child)</h3>
          <ColorPicker
            :color="selectedChild.color"
            @color-change="updateTextColor"
          />
        </div> -->

      <!-- ! container settings -->

      <div
        class="prop-section-wrapper"
        v-if="
          viewModel.getSelectedElement() &&
          viewModel.getSelectedElement().type === 'container'
        "
      >
        <p
          class="prop-section-title"
          @click="expandableGroups.background = !expandableGroups.background"
        >
          Backgrounds
          <i
            class="material-icons {{ expandableGroups.background ? 'expand-less' : 'expand-more' }}"
          >
            {{ expandableGroups.background ? "expand_more" : "chevron_right" }}
          </i>
        </p>

        <div v-if="expandableGroups.background">
          <div class="prop-section">
            <div
              class="status-text"
              v-if="viewModel.getSelectedElement().parentContainer"
            >
              <div
                v-if="viewModel.getSelectedElement().parentContainer"
                :class="
                  viewModel.getSelectedElement().backgroundColor
                    ? 'status-text-selected-color'
                    : 'status-text-inherited-color'
                "
              >
                <p v-if="viewModel.getSelectedElement().backgroundColor">
                  Custom background color
                </p>

                <div
                  class="status-text"
                  v-if="!viewModel.getSelectedElement().backgroundColor"
                >
                  Inheriting from
                  <p
                    class="link-text"
                    @click="
                      this.viewModel.selectItem(
                        viewModel.getSelectedElement().parentContainer
                      )
                    "
                  >
                    {{ viewModel.getSelectedElement().parentContainer.name }}
                  </p>
                </div>
              </div>
              <button
                v-if="viewModel.getSelectedElement().backgroundColor"
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
                  backgroundColor:
                    viewModel.getSelectedElement().backgroundColor,
                }"
                @click="showBGColorPicker = !showBGColorPicker"
              ></div>
              <span class="hex-code">{{
                viewModel.getSelectedElement().backgroundColor
              }}</span>
            </div>

            <ColorPicker
              default-format="hex"
              v-if="showBGColorPicker"
              v-model="selectedItemBackgroundColor"
              @color-change="updateColor"
            />
          </div>
          <div class="section-divider" />
          <div
            class="prop-section"
            v-if="viewModel.getSelectedElement().parentContainer"
          >
            <label>Image:</label>

            <FIleUploader
              v-model="viewModel.getSelectedElement().backgroundImage"
              @set-image="setBackgroundImage"
              @clear-image="clearBackgroundImage"
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
      required: true,
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
        content: true,
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
          ? this.viewModel.getSelectedElement().text
          : "";
      },
      set(newValue) {
        if (this.viewModel.selectedItem) {
          this.viewModel.getSelectedElement().text = newValue;
        }
      },
    },
    /* selectedItemFontSize: {
      get() {
        const selectedItem = this.viewModel.selectedItem;
        if (selectedItem) {
          if (getSelectedElement().fontSize !== null) {
            return getSelectedElement().fontSize;
          } else if (
            getSelectedElement().parentContainer &&
            getSelectedElement().parentContainer.fontSize !== null
          ) {
            return getSelectedElement().parentContainer.fontSize;
          }
        }
        return null;
      },
      set(fontSize) {
        this.viewModel.getSelectedElement().fontSize = selectedItemFontSize;
      },
    },
    selectedItemFontFamily: {
      get() {
        const selectedItem = this.viewModel.selectedItem;
        if (selectedItem) {
          if (getSelectedElement().fontFamily !== null) {
            return getSelectedElement().fontFamily;
          } else if (
            getSelectedElement().parentContainer &&
            getSelectedElement().parentContainer.fontFamily !== null
          ) {
            return getSelectedElement().parentContainer.fontFamily;
          }
        }
        return null;
      },
      set(selectedItemFontFamily) {
        this.viewModel.getSelectedElement().fontFamily = selectedItemFontFamily;
      },
    },
    selectedItemFontWeight: {
      get() {
        const selectedItem = this.viewModel.selectedItem;
        if (selectedItem) {
          if (getSelectedElement().selectedItemFontWeight !== null) {
            return getSelectedElement().selectedItemFontWeight;
          } else if (
            getSelectedElement().parentContainer &&
            getSelectedElement().parentContainer.selectedItemFontWeight !== null
          ) {
            return getSelectedElement().parentContainer.selectedItemFontWeight;
          }
        }
        return null;
      },
      set(selectedItemFontWeight) {
        this.viewModel.getSelectedElement().fontWeight = selectedItemFontWeight;
      },
    }, */

    fontSize: {
      get() {
        return this.viewModel.getSelectedElement().fontSize !== null
          ? this.viewModel.getSelectedElement().fontSize
          : this.viewModel.getSelectedElement().parentContainer
          ? this.viewModel.getSelectedElement().parentContainer.fontSize
          : null;
      },
      set(fontSize) {
        this.viewModel.getSelectedElement().fontSize = fontSize;
      },
    },
    fontFamily: {
      get() {
        return this.viewModel.getSelectedElement().fontFamily !== null
          ? this.viewModel.getSelectedElement().fontFamily
          : this.viewModel.getSelectedElement().parentContainer
          ? this.viewModel.getSelectedElement().parentContainer.fontFamily
          : null;
      },
      set(fontFamily) {
        this.viewModel.getSelectedElement().fontFamily = fontFamily;
      },
    },
    fontWeight: {
      get() {
        return this.viewModel.getSelectedElement().fontWeight !== null
          ? this.viewModel.getSelectedElement().fontWeight
          : this.viewModel.getSelectedElement().parentContainer
          ? this.viewModel.getSelectedElement().parentContainer.fontWeight
          : null;
      },
      set(fontWeight) {
        this.viewModel.getSelectedElement().fontWeight = fontWeight;
      },
    },

    selectedItemColor: {
      get() {
        return this.viewModel.getSelectedElement().color !== null
          ? this.viewModel.getSelectedElement().color
          : this.viewModel.getSelectedElement().parentContainer
          ? this.viewModel.getSelectedElement().parentContainer.color
          : null;
      },
      set(selectedItemColor) {
        this.viewModel.getSelectedElement().color = selectedItemColor;
      },
    },
    selectedItemBackgroundColor: {
      get() {
        return this.viewModel.getSelectedElement().backgroundColor !== null
          ? this.viewModel.getSelectedElement().backgroundColor
          : this.viewModel.getSelectedElement().parentContainer
          ? this.viewModel.getSelectedElement().parentContainer.backgroundColor
          : null;
      },
      set(selectedItemBackgroundColor) {
        this.viewModel.getSelectedElement().backgroundColor =
          selectedItemBackgroundColor;
      },
    },
    paragraphBgColor() {
      return this.viewModel.getSelectedElement().color ? "red" : "green";
    },
  },

  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    //hybrid settings
    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    updateTypographyColor(eventData) {
      this.viewModel.getSelectedElement().color = eventData.cssColor;
      console.log(this.viewModel.getSelectedElement().color);
    },

    /*     updateTypographyFontsize() {
      this.$emit("set-typography-fontsize", {
        item: this.viewModel.selectedItem,
        size: this.selectedTextSize,
      });
    }, */
    updateTypographyFontfamily() {
      this.viewModel.getSelectedElement().fontfamily = this.selectedTextFont;
    },

    updateColor(eventData) {
      (this.viewModel.getSelectedElement().backgroundColor =
        eventData.cssColor),
        console.log(this.viewModel.getSelectedElement().backgroundColor);
    },

    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    resetStyle(type) {
      this.$emit("reset-style", {
        item: this.viewModel.getSelectedElement(),
        type: type,
      });
    },

    setBackgroundImage(image) {
      this.viewModel.getSelectedElement().backgroundImage = image;
    },
    clearBackgroundImage() {
      this.viewModel.getSelectedElement().backgroundImage = "";
    },

    handleSelectParent() {
      const parent = this.viewModel.currentSelectedElement.parentContainer;
      this.viewModel.handleElementSelected(parent);
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
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 4px;
  display: flex;

  font-size: small;
  cursor: pointer;
  color: white;
  background-color: rgb(154, 67, 253);
  /*   padding-left: 4px;
  padding-right: 4px; */
}

.status-text-inherited-color {
  padding-top: 4px;
  padding-bottom: 4px;
}

.status-text-selected-color {
  color: rgba(0, 123, 255);
  background-color: rgba(0, 123, 255, 0.2);
}

.color-display-container {
  display: flex;
  align-items: center;
}

i.material-icons {
  float: left;
  margin-right: 4px; /* adjust the margin as needed */
}

.material-icons.expand-more {
  transform: rotate(90deg);
}

.hex-code {
  margin-right: 4px;
}

.prop-section {
  padding-top: 4px;
  padding-bottom: 4px;
}
.prop-section-wrapper {
  background-color: #edebeb;
  padding: 2px;
}

.prop-section-title {
  border-top: 1px solid rgb(184, 183, 183);
  border-bottom: 1px solid rgb(184, 183, 183);
  background-color: lightgray;
  font-weight: 600;
  font-size: medium;
  cursor: default;
}

.section-divider {
  background-color: lightgray;
  height: 1px;
}
</style>
