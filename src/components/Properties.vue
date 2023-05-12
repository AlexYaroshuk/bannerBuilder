<template>
  <div>
    <aside :class="['sidebar-button', { hidden: !isVisible }]">
      <button @click="toggleSidebarVisibility">&lt; Show sidebar</button>
    </aside>
    <aside
      :class="['sidebar', { hidden: !isVisible }]"
      @click.stop="hideBackgroundSelector"
    >
      <div class="prop-section-wrapper">
        <button @click="toggleSidebarVisibility">&gt; Hide</button>
        <div class="tab-bar">
          <header v-for="(tab, index) in tabs" :key="index">
            <i class="material-icons"> {{ tab.icon }}</i>
            <span class="tab-text">{{ tab.label }}</span>
            <div class="ripple"></div>
          </header>
          <button @click="test">test</button>
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

        <!-- ! visibility settings -->

        <div v-if="viewModel.getSelectedElement()">
          <p
            class="prop-section-title"
            @click="expandableGroups.visibility = !expandableGroups.visibility"
          >
            Visibility
            <i
              class="material-icons {{ expandableGroups.visibility ? 'expand-less' : 'expand-more' }}"
            >
              {{
                expandableGroups.visibility ? "expand_more" : "chevron_right"
              }}
            </i>
          </p>

          <!-- ! text settings -->

          <div v-if="expandableGroups.visibility">
            <div class="prop-section">
              <div class="background-list-buttons">
                <button @click.stop="toggleElementVisibility">
                  {{
                    viewModel.getSelectedElement().isVisible ? "Hide" : "Show"
                  }}
                </button>
              </div>

              <div
                class="section-divider"
                v-if="viewModel.getSelectedElement().type === 'link'"
              />
            </div>
          </div>
        </div>

        <!-- ! content settings -->
        <div
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
            }}{{
              viewModel.getSelectedElement().parentContainer ? "" : "root"
            }})
            <i
              class="material-icons {{ expandableGroups.content ? 'expand-less' : 'expand-more' }}"
            >
              {{ expandableGroups.content ? "expand_more" : "chevron_right" }}
            </i>
          </p>

          <!-- ! text settings -->

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

            <!-- ! link settings -->

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
              <label for="text-field">URL:</label>
              <input
                id="text-field"
                type="text"
                v-model="viewModel.getSelectedElement().url"
              />
            </div>

            <!-- ! image settings -->

            <div
              class="prop-section"
              v-if="viewModel.getSelectedElement().type === 'image'"
            >
              <!--            <label for="text-field">URL:</label>
              <input id="text-field" type="text" /> -->

              <FIleUploader :view-model="viewModel"></FIleUploader>
            </div>
            <!-- ! video settings -->

            <div
              class="prop-section"
              v-if="viewModel.getSelectedElement().type === 'video'"
            >
              <label for="text-field">URL:</label>
              <input
                id="text-field"
                type="text"
                v-model="viewModel.getSelectedElement().value"
              />
            </div>

            <div
              class="section-divider"
              v-if="viewModel.getSelectedElement().type === 'link'"
            />
          </div>
        </div>
        <!-- ! typography settings -->
        <div
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
            }}{{
              viewModel.getSelectedElement().parentContainer ? "" : "root"
            }})
            <i
              class="material-icons {{ expandableGroups.typography ? 'expand-less' : 'expand-more' }}"
            >
              {{
                expandableGroups.typography ? "expand_more" : "chevron_right"
              }}
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
                  <p v-if="viewModel.getSelectedElement().color">
                    Custom color
                  </p>

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
          v-if="
            viewModel.getSelectedElement() &&
            viewModel.getSelectedElement().type === 'container' &&
            viewModel.getSelectedElement().parentContainer != null
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
              {{
                expandableGroups.background ? "expand_more" : "chevron_right"
              }}
            </i>
          </p>
          <!-- /*If that doesn't work, you can also try wrapping the entire div with class background-list-item inside a draggable element and setting group="background" and tag="div" on it. Then, you can remove the handle=".background-drag-handle" from the draggable element that surrounds the entire background-list.*/ -->
          <div v-if="expandableGroups.background">
            <div class="prop-section">
              <div class="row" style="display: flex">
                Add a background layer
                <div class="button-wrapper" @click.stop="addBackground()">
                  <i class="material-icons">add</i>
                </div>

                <!-- <i class="material-icons">add</i> -->
              </div>
              <draggable
                class="background-list"
                v-model="viewModel.getSelectedElement().background"
                tag="div"
                handle=".background-drag-handle"
                @end="onEnd"
                cursor="grabbing"
                :dragging-class="'background-dragging'"
              >
                <BackgroundSelector
                  ref="backgroundSelector"
                  :view-model="viewModel"
                />
                <div
                  v-for="(background, index) in viewModel.getSelectedElement()
                    .background"
                  :key="index"
                  @mouseover="setBackgroundListHoverIndex(index)"
                  @mouseout="clearBackgroundListHoverIndex"
                >
                  <div class="background-list-item">
                    <div class="background-drag-handle">☰</div>
                    <div
                      class="color-square"
                      @click.stop="editBackground(background)"
                      :class="{
                        'transparent-pattern':
                          background && background.type !== 'gradient',
                      }"
                      :style="{
                        backgroundImage:
                          background && background.type === 'image'
                            ? `url(${background.value})`
                            : background && background.type === 'gradient'
                            ? `linear-gradient(${
                                background.value.degree
                              }deg, ${background.value.points
                                .map(
                                  (point) =>
                                    point.color + ' ' + point.left + '%'
                                )
                                .join(', ')})`
                            : '',
                        backgroundColor:
                          background && background.type === 'color'
                            ? background.value
                            : '',
                        backgroundBlendMode:
                          background && background.type === 'color'
                            ? 'overlay'
                            : '',
                      }"
                    />

                    <div class="background-list-content">
                      <div
                        class="background-list-type"
                        :class="{ 'background-hidden': !background.isVisible }"
                      >
                        <div class="icon-wrapper">
                          <i
                            v-if="background.type === 'color'"
                            class="material-icons"
                            >format_color_fill</i
                          >
                          <i
                            v-if="background.type === 'image'"
                            class="material-icons"
                            >image</i
                          >
                          <i
                            v-if="background.type === 'gradient'"
                            class="material-icons"
                            >gradient</i
                          >
                          <i
                            v-if="background.type === 'video'"
                            class="material-icons"
                            >smart_display</i
                          >
                        </div>
                        {{
                          background.type === "image" && background.fileName
                            ? background.fileName.length > 20
                              ? background.fileName.slice(0, 20) +
                                "..." +
                                background.fileName.slice(
                                  background.fileName.lastIndexOf(".")
                                )
                              : background.fileName
                            : background.type === "gradient"
                            ? "Gradient"
                            : background.type === "image" && background.fileName
                            ? background.fileName.length > 20
                              ? background.fileName.slice(0, 20) +
                                "..." +
                                background.fileName.slice(
                                  background.fileName.lastIndexOf(".")
                                )
                              : background.fileName
                            : background.type === "video"
                            ? background.value.length > 20
                              ? background.value.slice(0, 20) +
                                "..." +
                                background.value.slice(
                                  background.value.lastIndexOf(".")
                                )
                              : background.value
                            : background.value
                        }}
                      </div>

                      <div class="background-list-buttons">
                        <div
                          class="button-wrapper"
                          @click.stop="
                            toggleBackgroundLayerVisibility(background)
                          "
                          :style="wrapperStyle"
                        >
                          <i v-if="!background.isVisible" class="material-icons"
                            >visibility_off</i
                          >
                          <i v-if="background.isVisible" class="material-icons"
                            >visibility</i
                          >
                        </div>
                        <div
                          class="button-wrapper"
                          @click="removeBackground(background)"
                          :style="wrapperStyle"
                        >
                          <i class="material-icons">delete</i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="section-divider"
                    v-if="viewModel.getSelectedElement().background.length > 1"
                  />
                  <!-- <div
                    class="background-list-color-square"
                    v-if="background.type === 'color'"
                    :style="{ backgroundColor: background.value }"
                  ></div>
                  <div
                    class="background-list-gradient"
                    v-if="background.type === 'gradient'"
                    :style="{
                      backgroundImage: `linear-gradient(${background.value})`,
                    }"
                  ></div>
                  <div
                    class="background-list-image"
                    v-if="background.type === 'image'"
                    :style="{ backgroundImage: `url(${background.value})` }"
                  ></div> -->
                </div>
              </draggable>
            </div>

            <!-- <div class="section-divider" />

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
            </div> -->
          </div>
        </div>
        <div
          class="sidebar-overlay"
          v-if="viewModel.isBackgroundSelectorVisible"
          @click="dismissBackgroundSelector"
        />
      </div>
    </aside>
  </div>
</template>

<script>
import { ColorPicker } from "vue-accessible-color-picker";
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";
import { VueDraggableNext } from "vue-draggable-next";
import BackgroundSelector from "./BackgroundSelector.vue";
import FIleUploader from "./FIleUploader.vue";

export default {
  components: {
    ColorPicker,
    BackgroundSelector,
    FIleUploader,
    draggable: VueDraggableNext,
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
        visibility: true,
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

      backgroundListHoverIndex: null,
      isBackgroundSelectorVisible: false,
      selectedBackground: null,
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

    gradientString() {
      if (this.background && this.background.type === "gradient") {
        const gradient = this.background.value;
        const points = gradient.points
          .map(
            (point) =>
              `rgba(${point.red}, ${point.green}, ${point.blue}, ${point.alpha}) ${point.left}%`
          )
          .join(", ");

        return `${gradient.type}-gradient(${gradient.degree}deg, ${points})`;
      }
      return "";
    },
  },

  methods: {
    gradientStyle(background) {
      if (!background) return null;

      if (background.type !== "gradient") return null;

      const square = this.$refs.colorSquare;
      if (!square) return null;

      const { width, height } = square.getBoundingClientRect();

      if (background.points.length === 1) {
        return {
          background: background.points[0].color,
        };
      }

      const sortedPoints = [...background.points].sort(
        (a, b) => a.left - b.left
      );
      const points = sortedPoints
        .map((point) => `${point.color} ${point.left}%`)
        .join(", ");
      const css = {
        background: `linear-gradient(90deg, ${points})`,
        width: `${width}px`,
        height: `${height}px`,
        display: "inline-block",
      };
      return css;
    },

    toggleSidebarVisibility() {
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

    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    resetStyle(type) {
      this.$emit("reset-style", {
        item: this.viewModel.getSelectedElement(),
        type: type,
      });
    },

    handleSelectParent() {
      const parent = this.viewModel.currentSelectedElement.parentContainer;
      this.viewModel.handleElementSelected(parent);
    },

    //test
    test() {
      console.log(this.viewModel.selectedBackground);
    },

    onEnd(evt) {
      const draggedBackground =
        this.viewModel.getSelectedElement().background[evt.oldIndex];
      const targetBackground =
        this.viewModel.getSelectedElement().background[evt.newIndex];
      [draggedBackground.layerIndex, targetBackground.layerIndex] = [
        targetBackground.layerIndex,
        draggedBackground.layerIndex,
      ];
      this.viewModel
        .getSelectedElement()
        .background.sort((a, b) => a.layerIndex - b.layerIndex);
    },

    setBackgroundListHoverIndex(index) {
      this.backgroundListHoverIndex = index;
    },
    clearBackgroundListHoverIndex() {
      this.backgroundListHoverIndex = null;
    },

    removeBackground(background) {
      const index =
        this.viewModel.currentSelectedElement?.background?.indexOf(background);
      if (index !== -1) {
        this.viewModel.currentSelectedElement?.background?.splice(index, 1);
      }
    },

    addBackground() {
      this.$nextTick(() => {
        this.$refs.backgroundSelector.activeTab = "color";
      });
      const newColorBackground = {
        type: "color",
        //get random color
        value: "hsla(0, 0%, 0%, 25%)",
        layerIndex: this.viewModel.currentSelectedElement.background.length,
        isVisible: true,
      };
      this.viewModel.currentSelectedElement.addBackgroundLayer(
        newColorBackground
      );
      this.viewModel.selectedBackground = newColorBackground;

      this.viewModel.isBackgroundSelectorVisible = true;
    },
    editBackground(background) {
      this.viewModel.isBackgroundSelectorVisible = true;
      this.viewModel.selectedBackground = background;
      this.$nextTick(() => {
        this.$refs.backgroundSelector.activeTab = background.type;
      });
    },

    hideBackgroundSelector() {
      this.viewModel.isBackgroundSelectorVisible = false;
      this.viewModel.selectedBackground = null;
    },

    toggleBackgroundLayerVisibility(background) {
      background.isVisible = !background.isVisible;
    },

    toggleElementVisibility() {
      this.viewModel.getSelectedElement().isVisible =
        !this.viewModel.getSelectedElement().isVisible;
    },

    getGradientString() {
      if (this.background && this.background.type === "gradient") {
        const gradient = this.background.value;
        const points = gradient.points
          .map(
            (point) =>
              `rgba(${point.red}, ${point.green}, ${point.blue}, ${point.alpha}) ${point.left}%`
          )
          .join(", ");

        return `${gradient.type}-gradient(${gradient.degree}deg, ${points})`;
      }
      return "";
    },

    /*     addColorBackground() {
      const backgroundColorLayer = {
        type: "color",
        //get random color
        value: "#" + Math.floor(Math.random() * 16777215).toString(16),
        layerIndex: this.viewModel.currentSelectedElement.background.length,
      };
      this.viewModel.currentSelectedElement.addBackgroundLayer(
        backgroundColorLayer
      );
    }, */
  },
};
</script>

<style scoped>
.sidebar {
  color: black;
  background-color: #f5f5f5;

  width: 20%;
  height: 100vh;
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

  /* adjust the margin as needed */
}

.material-icons.expand-more {
  transform: rotate(90deg);
}

.hex-code {
  margin-right: 4px;
}

.prop-section-title {
  border-top: 1px solid rgb(184, 183, 183);
  border-bottom: 1px solid rgb(184, 183, 183);
  background-color: lightgray;
  font-weight: 600;
  font-size: medium;
  cursor: default;
}

.background-list {
  background-color: rgba(211, 211, 211, 0.6);
  margin-top: 8px;
}

.background-list-item {
  display: flex;
  padding: 4px;
  font-size: small;
}

.background-list-content {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.background-list-type {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.background-list-buttons {
  display: flex;
}

.draggable-dragging {
  opacity: 0.5;
}

.background-drag-handle {
  cursor: grab;
}

.background-dragging {
  cursor: grabbing;
}

.draggable-ghost {
  opacity: 0.5;
}

.delete-icon {
  display: none;
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 24px;
  color: rgb(2, 1, 1);
}

.delete-icon:hover {
  color: red;
}

.background-list-item:hover .delete-icon {
  display: block;
}

.sidebar-overlay {
  position: absolute;
  height: 100vh;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.button-wrapper {
  display: flex;
  padding: 4px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 24px;
  height: 24px;
  cursor: pointer;

  color: #666;
}
.button-wrapper i {
  font-size: large;
}

.button-wrapper:hover {
  background-color: #f5f5f5;
}

.background-hidden {
  color: #999;
}

.icon-wrapper {
  color: #666;
}
</style>
