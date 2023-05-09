<template>
  <div>
    <div
      class="gradient-display"
      :style="gradientStyle"
      v-if="isValidGradient"
    ></div>

    <div class="points-wrapper" @click="handleWrapperClick" @dragover.prevent>
      <div
        v-for="(point, index) in gradient.points"
        :key="index"
        class="point-marker"
        :class="{ hover: point === hoveredPoint }"
        :style="{ left: point.left + '%', backgroundColor: pointColor(point) }"
        @mouseover="hoveredPoint = point"
        @mouseout="hoveredPoint = null"
        @click.stop="selectPoint(point)"
        draggable="true"
        @dragstart="dragStart(point)"
        @drag="drag(point)"
        @dragend="dragEnd"
      ></div>
    </div>
    <div
      v-if="selectedPoint"
      class="color-square"
      :style="{
        backgroundColor: `rgba(${selectedPointColor.r}, ${selectedPointColor.g}, ${selectedPointColor.b}, ${selectedPointColor.a})`,
      }"
    ></div>

    <ColorPicker
      v-if="selectedPoint"
      :color="selectedPointColor"
      @color-change="updateSelectedPointColor"
    />

    <button v-if="selectedPoint" @click="deleteSelectedPoint">
      Delete Selected Point
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed, reactive } from "vue";
import { ColorPicker } from "vue-accessible-color-picker";
import { BannerBuilderViewModel } from "@/viewmodels/bannerBuilderViewModel";
import { onMounted } from "vue";

const props = defineProps({
  viewModel: {
    type: BannerBuilderViewModel,
    required: true,
  },
});

const gradient = reactive(props.viewModel.selectedBackground.value);
const selectedPoint = ref(null);
const hoveredPoint = ref(null);

const gradientStyle = computed(() => {
  const sortedPoints = [...gradient.points].sort((a, b) => a.left - b.left);
  const points = sortedPoints
    .map(
      (point) =>
        `rgba(${point.red}, ${point.green}, ${point.blue}, ${point.alpha}) ${point.left}%`
    )
    .join(", ");
  return {
    background: `linear-gradient(${gradient.degree}deg, ${points})`,
  };
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
  console.log("Selected point:", point);
  selectedPoint.value = point;
  if (point) {
    const { red, green, blue, alpha } = point;
    selectedPointColor.value = { r: red, g: green, b: blue, a: alpha };
  } else {
    selectedPointColor.value = null;
  }
};

const deleteSelectedPoint = () => {
  gradient.points = gradient.points.filter(
    (point) => point !== selectedPoint.value
  );
  selectedPoint.value = null;
};

watch(gradient, () => {
  // update gradientStyle
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

const dragStart = (point) => {
  selectedPoint.value = point;
};

const draggedPoint = ref(null);

const drag = (_event) => {
  if (!selectedPoint.value) return;
  const wrapper = document.querySelector(".points-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const left = ((_event.clientX - rect.left) / rect.width) * 100;
  selectedPoint.value.left = Math.max(0, Math.min(100, left));
};

const dragEnd = (event) => {
  if (!selectedPoint.value) return;

  const wrapper = document.querySelector(".points-wrapper");
  const rect = wrapper.getBoundingClientRect();
  const left = ((event.clientX - rect.left) / rect.width) * 100;

  selectedPoint.value.left = Math.max(0, Math.min(100, left));
  selectedPoint.value = null;
};
</script>

<style scoped>
.gradient-display {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
}
.points-wrapper {
  width: 100%;
  height: 20px;
  position: relative;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.2);
}
.point-marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;

  cursor: pointer;
}

.color-square {
  position: relative;
  width: 20px;
  height: 20px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.point-marker.hover {
  border: 8px solid rgba(0, 0, 0, 0.2);
}
</style>
