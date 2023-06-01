<template>
  <div>
    <div class="gradient-wrapper">
      <div
        class="points-wrapper"
        @click="handleWrapperClick"
        @dragover.prevent
        :style="gradientStyle"
        v-if="isValidGradient"
      >
        <div class="point-marker-wrapper">
          <div
            v-for="(point, index) in gradient.points"
            :key="index"
            class="point-marker"
            :class="{
              hover: point === hoveredPoint,
              active: point === selectedPoint,
            }"
            :style="{
              left: point.left + '%',
              backgroundColor: pointColor(point),
              zIndex: point === selectedPoint ? 1 : 0,
            }"
            @mouseover="hoveredPoint = point"
            @mouseout="hoveredPoint = null"
            @click.stop="selectPoint(point)"
            draggable="true"
            @dragstart="dragStart(point)"
            @mousedown="mouseDown"
            @mouseup="mouseUp"
            @dragend="dragEnd"
          >
            <div
              class="arrow"
              :class="{ active: point === selectedPoint }"
            ></div>
            <div
              class="delete-button-wrapper"
              v-if="gradient.points.length != 1"
              @click="deletePoint(point)"
            >
              <i class="material-icons">close</i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="prop-section">
      Angle
      <div class="option">
        <div
          class="row"
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <div class="degree-control">
            <svg
              @mousedown="startRotate"
              @mousemove="rotate"
              @mouseup="stopRotate"
              @mouseleave="stopRotate"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="gray"
                stroke-width="4"
              />
              <circle
                :cx="
                  50 +
                  40 * Math.cos((gradient.degree * Math.PI) / 180 - Math.PI / 2)
                "
                :cy="
                  50 +
                  40 * Math.sin((gradient.degree * Math.PI) / 180 - Math.PI / 2)
                "
                r="8"
                fill="blue"
              />
            </svg>
          </div>

          <!-- Turn buttons -->
          <div class="turn-buttons">
            <button @click="turnLeft">
              <i class="material-icons">arrow_back</i>
            </button>
            <button @click="turnRight">
              <i class="material-icons">arrow_forward</i>
            </button>
          </div>

          <div class="form-group">
            <input
              id="degree"
              type="number"
              v-model="gradient.degree"
              min="0"
              max="360"
            />
          </div>
        </div>
      </div>
    </div>

    <ColorPicker
      v-if="selectedPoint"
      :color="selectedPointColor"
      @color-change="updateSelectedPointColor"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, reactive, nextTick } from "vue";

import { ColorPicker } from "vue-accessible-color-picker";
import { BannerBuilderViewModel } from "@/viewmodels/bannerBuilderViewModel";
import { onMounted } from "vue";

const props = defineProps({
  viewModel: {
    type: BannerBuilderViewModel,
    required: true,
  },
});

const isDragging = ref(false);

const mouseDown = () => {
  isDragging.value = true;
};

/* const pointColor = (point) => {
  const colorWithAlpha = point.color;
  const colorWithoutAlpha = colorWithAlpha.replace(/,\s*\d+(\.\d+)?\)/, ")");
  return `1px solid ${colorWithoutAlpha}`;
}; */

const mouseUp = () => {
  isDragging.value = false;
};

const gradient = reactive(props.viewModel.selectedBackground.value);
const selectedPoint = ref(null);
const hoveredPoint = ref(null);

const gradientStyle = computed(() => {
  if (gradient.points.length === 1) {
    return {
      background: gradient.points[0].color,
    };
  }

  const sortedPoints = [...gradient.points].sort((a, b) => a.left - b.left);
  const points = sortedPoints
    .map((point) => `${point.color} ${point.left}%`)
    .join(", ");
  const css = {
    background: `linear-gradient(90deg, ${points})`,
  };
  gradientCSS.value = css.background;
  return css;
});

const handleWrapperClick = (event) => {
  const wrapper = document.querySelector(".points-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const left = ((event.clientX - rect.left) / rect.width) * 100;
  addPoint(left);
};

// Replace updateSelectedPointColor function with this
const updateSelectedPointColor = (eventData) => {
  console.log("updateSelectedPointColor", eventData);
  if (selectedPoint.value && eventData.cssColor) {
    selectedPoint.value.color = eventData.cssColor;
    console.log(eventData.cssColor);
    gradient.points = [...gradient.points];
    console.log(gradient.points); // trigger reactivity
  }
};

// Remove the 'set' part of the computed property
const selectedPointColor = computed(() => {
  if (!selectedPoint.value) return null;
  return selectedPoint.value.color;
});

const selectPoint = (point) => {
  if (selectedPoint.value) {
    selectedPoint.value.active = false;
  }
  selectedPoint.value = point;
  selectedPoint.value.active = true;

  console.log("Selected point:", point);
  selectedPoint.value = point;
  if (point) {
    const { red, green, blue, alpha } = point;
    selectedPointColor.value = { r: red, g: green, b: blue, a: alpha };
  } else {
    selectedPointColor.value = null;
  }
};

const deletePoint = (point) => {
  gradient.points = gradient.points.filter((p) => p !== point);
  gradient.points = [...gradient.points]; // Trigger reactivity
  if (selectedPoint.value === point) {
    selectedPoint.value = null;
  }
};

watch(gradient, () => {
  props.viewModel.selectedBackground.value = { ...gradient };
});

const addPoint = (left) => {
  const randomColor = () => Math.floor(Math.random() * 256);
  const newPoint = {
    left,
    color: `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 1)`,
  };
  gradient.points = [...gradient.points, newPoint];
};

const isValidGradient = computed(() => {
  return gradient && gradient.points;
});

const pointColor = (point) => point.color;

const draggedPoint = ref(null);

const gradientCSS = ref("");

/* const drag = async (_event) => {
  if (!selectedPoint.value) return;
  const wrapper = document.querySelector(".points-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const left = ((_event.clientX - rect.left) / rect.width) * 100;
  selectedPoint.value.left = Math.max(0, Math.min(100, left));

  // Update gradient points and force reactivity
  gradient.points = [...gradient.points];

  // Force a re-render of the gradient
  await nextTick();
}; */

onMounted(() => {
  window.addEventListener("drag", (event) => {
    if (isDragging.value) {
      drag(event);
    }
  });

  /*  window.addEventListener("mouseup", () => {
    isDragging.value = false;
    selectedPoint.value = null;
  }); */
});

const drag = (event) => {
  if (!selectedPoint.value) return;

  const wrapper = document.querySelector(".points-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const left = ((event.clientX - rect.left) / rect.width) * 100;
  selectedPoint.value.left = Math.max(0, Math.min(100, left));

  // Update gradient points and force reactivity
  gradient.points = [...gradient.points];

  // Update gradient CSS
  gradientCSS.value = gradientStyle.value.background;
};

const dragStart = (point, event) => {
  selectedPoint.value = point;
  isDragging.value = true;
};

const dragEnd = (event) => {
  if (!selectedPoint.value) return;

  const wrapper = document.querySelector(".points-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const left = ((event.clientX - rect.left) / rect.width) * 100;

  selectedPoint.value.left = Math.max(0, Math.min(100, left));

  // Check if the point is not being dragged before resetting the selectedPoint
  if (!isDragging.value) {
    selectedPoint.value = null;
  }

  // Always reset the isDragging flag when drag ends
  isDragging.value = false;
};

// To track if the user is currently rotating the dot along the circle
const rotating = ref(false);

// Function to start rotating
const startRotate = (event) => {
  rotating.value = true;
};

// Function to stop rotating
const stopRotate = (event) => {
  rotating.value = false;
};

// Function to handle rotation
const rotate = (event) => {
  if (!rotating.value) return;

  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const degree = Math.round(
    ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360
  ); // Added rounding

  gradient.degree = degree;
};

// Function to turn gradient left
const turnLeft = () => {
  gradient.degree = (gradient.degree - 90 + 360) % 360;
};

// Function to turn gradient right
const turnRight = () => {
  gradient.degree = (gradient.degree + 90) % 360;
};
</script>

<style scoped>
.gradient-wrapper {
  margin-bottom: 20px;
  margin-right: 32px;
  margin-left: 32px;
}
.points-wrapper {
  height: 32px;
  position: relative;
  cursor: pointer;
  border: 2px solid rgb(186, 186, 186);
  margin-bottom: 4rem;
}
.point-marker {
  position: absolute;
  top: 3.25rem;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  padding: 12px;
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgb(186, 186, 186);

  border-radius: 2px;

  cursor: pointer;
}

.point-marker-wrapper {
  padding: 4px;
}

.arrow {
  position: absolute;
  bottom: 100%;
  margin-bottom: 2px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid currentColor; /* Use currentColor to inherit the color from the parent element */
  transform: translateX(-50%);
}
.delete-button-wrapper {
  position: absolute;
  top: 100%;
  margin-top: 8px;

  /* Use currentColor to inherit the color from the parent element */
  transform: translateX(-50%);
}
.delete-button-wrapper:hover {
  background-color: #f5f5f5;
}
.delete-button-wrapper i {
  font-size: medium;
}

.arrow.active {
  color: rgba(0, 123, 255);
}

.point-marker.active {
  box-shadow: 0 0 0 2px white, 0 0 0 4px rgba(0, 123, 255);
}

.degree-control {
  width: 64px;
  height: 64px;
}

.degree-control svg {
  width: 100%;
  height: 100%;
}

.turn-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
/* .point-marker.hover {
  border: 8px solid rgba(0, 0, 0, 0.2);
} */
</style>
