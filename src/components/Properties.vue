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
      <h2 v-if="selectedItem">selected:{{ selectedItem.type }}</h2>

      <div
        class="popup-content"
        :class="popupContentClass"
        style="margin-top: 16px"
      >
        <!-- text settings -->
        <div v-if="selectedItem && selectedItem.type === 'text'">
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
        <!-- hybrid settings -->
        <div class="popup-content" v-if="selectedItem">
          <h3>Typography color (container)</h3>
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
                  : "Inheriting from " +
                    selectedItem.parentContainer.containerName
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
          <ColorPicker
            v-model="selectedItemColor"
            @color-change="updateTypographyColor"
          />
        </div>
        <!--         <div class="popup-content" v-if="selectedChild">
          <h3>Typography color (child)</h3>
          <ColorPicker
            :color="selectedChild.color"
            @color-change="updateTextColor"
          />
        </div> -->

        <!-- container settings -->

        <div
          class="popup-content"
          v-if="selectedItem && selectedItem.type === 'container'"
        >
          <h3>Background color/image</h3>
          <ColorPicker
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
      currentSettings: "",
      isVisible: true,
      text: this.text,

      selectedTextSize: this.selectedTextSize,
      selectedTextFont: this.selectedTextFont,
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

    updateColor(eventData) {
      this.$emit("set-bg-color", {
        item: this.selectedItem,
        color: eventData.cssColor,
      });
    },

    // direct mutation, color reset needs to be invoked twice otherwise (todo: fix)
    resetStyle() {
      this.$emit("reset-style", {
        item: this.selectedItem,
        type: "color",
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
  padding-left: 4px;
  padding-right: 4px;
}

.status-text-inherited-color {
  color: rgb(154, 67, 253);
  background-color: rgba(154, 67, 253, 0.2);
}

.status-text-selected-color {
  color: rgba(0, 123, 255);
  background-color: rgba(0, 123, 255, 0.2);
}
</style>
