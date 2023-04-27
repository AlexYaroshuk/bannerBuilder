<template>
  <div
    class="background-selector"
    v-if="isBackgroundSelectorVisible"
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
        <span class="tab-text">{{ tab.label }}</span>
        <div class="ripple"></div>
      </button>
    </div>
    <div v-if="activeTab === 'image'">
      <div class="prop-section">
        Image
        <FIleUploader
          :selectedBackground="selectedBackground"
          :view-model="viewModel"
        />
      </div>
      <div class="section-divider" />
      <div class="prop-section">
        Size
        <div class="option">
          <button
            v-for="(option, index) in sizeOptions"
            :key="index"
            :class="{ active: selectedBackground.size === option.value }"
            @click="
              selectedBackground.size = option.value;
              if (option.value === 'contain' || option.value === 'cover') {
                selectedBackground.width = 'auto';
                selectedBackground.height = 'auto';
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
                v-model="selectedBackground.width"
                :disabled="selectedBackground.size !== 'custom'"
                :class="{ disabled: selectedBackground.size !== 'custom' }"
              />
              <span
                v-if="
                  selectedBackground.size === 'custom' &&
                  selectedBackground.width !== 'auto'
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
                v-model="selectedBackground.height"
                :disabled="selectedBackground.size !== 'custom'"
                :class="{ disabled: selectedBackground.size !== 'custom' }"
              />
              <span
                v-if="
                  selectedBackground.size === 'custom' &&
                  selectedBackground.height !== 'auto'
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
              :class="{ active: selectedBackground.position === 'top left' }"
              @click="updatePosition('top left')"
            ></div>
            <div
              class="dot top-center"
              :class="{ active: selectedBackground.position === 'top center' }"
              @click="updatePosition('top center')"
            ></div>
            <div
              class="dot top-right"
              :class="{ active: selectedBackground.position === 'top right' }"
              @click="updatePosition('top right')"
            ></div>
            <div
              class="dot center-left"
              :class="{ active: selectedBackground.position === 'center left' }"
              @click="updatePosition('center left')"
            ></div>
            <div
              class="dot center-center"
              :class="{
                active: selectedBackground.position === 'center center',
              }"
              @click="updatePosition('center center')"
            ></div>
            <div
              class="dot center-right"
              :class="{
                active: selectedBackground.position === 'center right',
              }"
              @click="updatePosition('center right')"
            ></div>
            <div
              class="dot bottom-left"
              :class="{ active: selectedBackground.position === 'bottom left' }"
              @click="updatePosition('bottom left')"
            ></div>
            <div
              class="dot bottom-center"
              :class="{
                active: selectedBackground.position === 'bottom center',
              }"
              @click="updatePosition('bottom center')"
            ></div>
            <div
              class="dot bottom-right"
              :class="{
                active: selectedBackground.position === 'bottom right',
              }"
              @click="updatePosition('bottom right')"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="prop-section">
      Color

      <ColorPicker
        v-if="activeTab === 'color'"
        @color-change="updateColor"
        :color="selectedBackground.value"
      />
    </div>
  </div>
</template>

<script>
import FIleUploader from "./FIleUploader.vue";
import { BannerBuilderViewModel } from "../viewmodels/bannerBuilderViewModel";
import { ColorPicker } from "vue-accessible-color-picker";
import backgroundPlaceholder from "@/assets/background_placeholder_texture.svg";

export default {
  components: {
    FIleUploader,
    ColorPicker,
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
      ],
      sizeOptions: [
        { label: "Custom", value: "custom" },
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
      ],
    };
  },
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      required: true,
    },
    selectedBackground: null,
    isBackgroundSelectorVisible: false,
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
      if (this.selectedBackground) {
        return document.querySelector(
          `.dot-${this.selectedBackground.position}`
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
      this.selectedBackground.value = eventData.cssColor;
    },

    updatePosition(position) {
      this.selectedBackground.position = position;
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
        this.selectedBackground.type = "color";
        this.selectedBackground.value = "hsla(0, 0%, 0%, 0.25)";
      } else if (tab.name === "image") {
        this.setDefaultImageAsBackground();
      }
    },

    setDefaultImageAsBackground() {
      this.selectedBackground.type = "image";
      this.selectedBackground.value = backgroundPlaceholder;
      this.selectedBackground.fileName = backgroundPlaceholder;
      this.selectedBackground.repeat = "repeat";
      this.selectedBackground.size = "custom";
      this.selectedBackground.width = "auto";
      this.selectedBackground.height = "auto";
      this.selectedBackground.position = "center top";
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

.dot:hover {
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
