<template>
  <div
    class="background-selector"
    v-if="viewModel.isBackgroundSelectorVisible"
    ref="backgroundSelector"
    @click.stop
  >
    <div class="tab-bar">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === tab.name }"
        @click="setSelectedTab(tab)"
        @mousedown="startRipple($event)"
      >
        <i class="material-icons">{{ tab.icon }}</i>
        <!-- <span class="tab-text">{{ tab.label }}</span> -->
        <div class="ripple"></div>
      </button>
    </div>
    <div v-if="activeTab === 'image'">
      <div class="prop-section">
        Image
        <FIleUploader :view-model="viewModel" />
      </div>
      <div class="section-divider" />
      <div class="prop-section">
        Size
        <div class="option">
          <button
            v-for="(option, index) in sizeOptions"
            :key="index"
            :class="{
              active: viewModel.selectedBackground.size === option.value,
            }"
            @click="
              viewModel.selectedBackground.size = option.value;
              if (option.value === 'contain' || option.value === 'cover') {
                viewModel.selectedBackground.width = 'auto';
                viewModel.selectedBackground.height = 'auto';
              }
            "
          >
            {{ option.label }}
          </button>
        </div>

        <div class="custom-options">
          <div class="option">
            <label for="width">Width:</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="width"
                v-model="viewModel.selectedBackground.width"
                :disabled="viewModel.selectedBackground.size !== 'custom'"
                :class="{
                  disabled: viewModel.selectedBackground.size !== 'custom',
                }"
              />
              <span
                v-if="
                  viewModel.selectedBackground.size === 'custom' &&
                  viewModel.selectedBackground.width !== 'auto'
                "
                >PX</span
              >
            </div>
          </div>
          <div class="option">
            <label for="height">Height:</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="height"
                v-model="viewModel.selectedBackground.height"
                :disabled="viewModel.selectedBackground.size !== 'custom'"
                :class="{
                  disabled: viewModel.selectedBackground.size !== 'custom',
                }"
              />
              <span
                v-if="
                  viewModel.selectedBackground.size === 'custom' &&
                  viewModel.selectedBackground.height !== 'auto'
                "
                >PX</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="section-divider" />
      <div class="prop-section">
        Position
        <div class="position-selector">
          <div class="position-square">
            <div class="dot top-left" @click="updatePosition('top left')"></div>
            <div
              class="dot top-center"
              @click="updatePosition('top center')"
            ></div>
            <div
              class="dot top-right"
              @click="updatePosition('top right')"
            ></div>
            <div
              class="dot top-left"
              :class="{
                active: viewModel.selectedBackground.position === 'top left',
              }"
              @click="updatePosition('top left')"
            ></div>
            <div
              class="dot top-center"
              :class="{
                active: viewModel.selectedBackground.position === 'top center',
              }"
              @click="updatePosition('top center')"
            ></div>
            <div
              class="dot top-right"
              :class="{
                active: viewModel.selectedBackground.position === 'top right',
              }"
              @click="updatePosition('top right')"
            ></div>
            <div
              class="dot center-left"
              :class="{
                active: viewModel.selectedBackground.position === 'center left',
              }"
              @click="updatePosition('center left')"
            ></div>
            <div
              class="dot center-center"
              :class="{
                active:
                  viewModel.selectedBackground.position === 'center center',
              }"
              @click="updatePosition('center center')"
            ></div>
            <div
              class="dot center-right"
              :class="{
                active:
                  viewModel.selectedBackground.position === 'center right',
              }"
              @click="updatePosition('center right')"
            ></div>
            <div
              class="dot bottom-left"
              :class="{
                active: viewModel.selectedBackground.position === 'bottom left',
              }"
              @click="updatePosition('bottom left')"
            ></div>
            <div
              class="dot bottom-center"
              :class="{
                active:
                  viewModel.selectedBackground.position === 'bottom center',
              }"
              @click="updatePosition('bottom center')"
            ></div>
            <div
              class="dot bottom-right"
              :class="{
                active:
                  viewModel.selectedBackground.position === 'bottom right',
              }"
              @click="updatePosition('bottom right')"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="prop-section"
      v-if="
        activeTab === 'color' && viewModel.selectedBackground.type === 'color'
      "
    >
      Color

      <ColorPicker
        @color-change="updateColor"
        :color="viewModel.selectedBackground.value"
      />
    </div>
    <div
      class="prop-section"
      v-if="
        activeTab === 'gradient' &&
        viewModel.selectedBackground.type === 'gradient'
      "
    >
      Gradient

      <GradientColorPicker :viewModel="viewModel" />
    </div>
    <div
      class="prop-section"
      v-if="
        activeTab === 'video' && viewModel.selectedBackground.type === 'video'
      "
    >
      Video
      <label for="text-field">URL:</label>
      <input
        id="text-field"
        type="text"
        v-model="viewModel.selectedBackground.value"
      />

      <video
        ref="video"
        :src="viewModel.selectedBackground.value"
        @loadeddata="captureThumbnail"
        style="display: flex; width: 100%; height: 100%"
        preload="metadata"
      ></video>
    </div>
  </div>
</template>

<script>
import FIleUploader from "./FIleUploader.vue";
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";
import { ColorPicker } from "vue-accessible-color-picker";
import backgroundPlaceholder from "@/assets/background_placeholder_texture.svg";

import GradientColorPicker from "./GradientColorPicker.vue";

export default {
  components: {
    FIleUploader,
    ColorPicker,

    GradientColorPicker,
  },

  data() {
    return {
      activeTab: "color",
      tabs: [
        {
          name: "color",
          label: "Color",
          icon: "format_color_fill",
        },
        {
          name: "image",
          label: "Image",
          icon: "image",
        },
        {
          name: "gradient",
          label: "Gradient",
          icon: "gradient",
        },
        {
          name: "video",
          label: "Video",
          icon: "smart_display",
        },
      ],
      sizeOptions: [
        { label: "Custom", value: "custom" },
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
      ],
      thumbnail: null,
    };
  },
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      required: true,
    },
  },

  watch: {
    selectedBackground(newValue) {
      if (newValue) {
        this.setActiveDot(newValue.position);
      }
    },
  },

  computed: {
    activeDot() {
      if (this.viewModel.selectedBackground) {
        return document.querySelector(
          `.dot-${this.viewModel.selectedBackground.position}`
        );
      }
      return null;
    },
  },

  methods: {
    setActiveDot(position) {
      const activeDot = document.querySelector(".dot.active");
      if (activeDot) {
        activeDot.classList.remove("active");
      }
      const newActiveDot = document.querySelector(`.dot.${position}`);
      if (newActiveDot) {
        newActiveDot.classList.add("active");
      }
    },

    removeBackground(background) {
      const index =
        this.viewModel.currentSelectedElement?.background?.indexOf(background);
      if (index !== -1) {
        this.viewModel.currentSelectedElement?.background?.splice(index, 1);
      }
    },

    addColorBackground() {
      const backgroundColorLayer = {
        type: "color",
        //get random color
        value: "#" + Math.floor(Math.random() * 16777215).toString(16),
        layerIndex: this.viewModel.currentSelectedElement.background.length,
      };
      this.viewModel.currentSelectedElement.addBackgroundLayer(
        backgroundColorLayer
      );
    },

    updateColor(eventData) {
      this.viewModel.selectedBackground.value = eventData.cssColor;
    },

    mounted() {
      if (this.viewModel.selectedBackground?.type === "video") {
        this.generateThumbnail(this.viewModel.selectedBackground.value);
      }
    },

    updatePosition(position) {
      this.viewModel.selectedBackground.position = position;
      const dots = document.querySelectorAll(".dot");
      dots.forEach((dot) => {
        dot.classList.remove("active");
      });
      const newActiveDot = document.querySelector(
        `.dot.${position.replaceAll(" ", "-")}`
      );
      if (newActiveDot) {
        newActiveDot.classList.add("active");
      }
    },

    setSelectedTab(tab) {
      this.activeTab = tab.name;
      if (tab.name === "color") {
        this.viewModel.selectedBackground.type = "color";
        this.viewModel.selectedBackground.value = "hsla(0, 0%, 0%, 0.25)";
      } else if (tab.name === "image") {
        this.setDefaultImageAsBackground();
      } else if (tab.name === "video") {
        this.setDefaultVideoAsBackground();
      } else if (tab.name === "gradient") {
        this.viewModel.selectedBackground.type = "gradient";
        this.viewModel.selectedBackground.value = {
          type: "linear",
          degree: 0,
          points: [
            { left: 0, color: "white" }, // White
            { left: 100, color: "grey" }, // Grey
          ],
        };
      }
    },

    async captureThumbnail() {
      // Wait for the video's metadata to load
      await new Promise(
        (resolve) => (this.$refs.video.onloadedmetadata = resolve)
      );

      // Get the Data URL of the canvas content, which is an image

      // Set the thumbnail URL as the source of the image element
      this.$refs.thumbnail.src = thumbnailUrl;
    },

    setDefaultImageAsBackground() {
      this.viewModel.selectedBackground.type = "image";
      this.viewModel.selectedBackground.value = backgroundPlaceholder;
      this.viewModel.selectedBackground.fileName = backgroundPlaceholder;
      this.viewModel.selectedBackground.repeat = "repeat";
      this.viewModel.selectedBackground.size = "custom";
      this.viewModel.selectedBackground.width = "auto";
      this.viewModel.selectedBackground.height = "auto";
      this.viewModel.selectedBackground.position = "center center";
    },
    setDefaultVideoAsBackground() {
      this.viewModel.selectedBackground.type = "video";
      this.viewModel.selectedBackground.value =
        "https://www.shutterstock.com/shutterstock/videos/1044255715/preview/stock-footage-person-signing-important-document-camera-following-tip-of-the-pen-as-it-signs-crucial-business.webm";

      this.viewModel.selectedBackground.repeat = "repeat";
      this.viewModel.selectedBackground.size = "custom";
      this.viewModel.selectedBackground.width = "auto";
      this.viewModel.selectedBackground.height = "auto";
      this.viewModel.selectedBackground.position = "center center";
    },

    startRipple(event) {
      const button = event.currentTarget;
      const ripple = button.querySelector(".ripple");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - radius;
      const y = event.clientY - rect.top - radius;
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add("ripple-animation");
      setTimeout(() => {
        ripple.classList.remove("ripple-animation");
      }, 300);
    },
  },
};
</script>
<style>
.background-selector {
  position: absolute;
  width: 100%;
  min-height: 200px;
  left: 0;
  top: 0;
  background-color: #edebeb;
  padding: 8px;
  z-index: 2;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  margin-top: 36px;
  margin-left: -8px;
  margin-right: -8px;
}

.position-selector {
  margin-top: 20px;
  display: flex;
}

.position-square {
  position: relative;
  width: 96px;
  height: 96px;
  border: 2px solid #ccc;
}

.dot {
  position: absolute;
  width: 12px;
  height: 12px;

  background-color: #ccc;
  cursor: pointer;
}
.dot.active {
  background-color: #1976d2;
  width: 16px;
  height: 16px;
}

.dot:not(.active):hover {
  background-color: #999;
}

.top-left {
  top: 0;
  left: 0;
}

.top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.top-right {
  top: 0;
  right: 0;
}

.center-left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.center-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.center-right {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.bottom-left {
  bottom: 0;
  left: 0;
}

.bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.bottom-right {
  bottom: 0;
  right: 0;
}

.option button {
  border: none;
  border: 1px solid gray;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 8px;

  color: #333;
}

.option button.active {
  background-color: #1976d2;
  color: #fff;
}

input:disabled {
  cursor: not-allowed;
}

.input-wrapper input:disabled + span {
  opacity: 1;
}

.input-wrapper span {
  opacity: 0.5;
  font-size: 14px;
  margin-left: 5px;
}
</style>
