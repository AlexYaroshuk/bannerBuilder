<template>
  <div>
    <div class="gradient-display" :style="gradientStyle" v-if="isValidGradient"></div>

    <div v-for="(point, index) in gradient.points" :key="index" class="point-inputs" v-if="isValidGradient">
      <input type="range" min="0" max="100" v-model.number="point.left" />
      <input type="number" min="0" max="255" v-model.number="point.red" />
      <input type="number" min="0" max="255" v-model.number="point.green" />
      <input type="number" min="0" max="255" v-model.number="point.blue" />
      <input type="number" step="0.01" min="0" max="1" v-model.number="point.alpha" />
      <button @click="removePoint(index)">Remove</button>
    </div>

    <button @click="addPoint" v-if="isValidGradient">Add Point</button>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue';

const props = defineProps({
  gradient: {
    type: Object,
    required: true,
  },
});

const gradientRef = toRef(props, 'gradient');

const gradientStyle = computed(() => {
  const points = gradientRef.value.points
    .map((point) => `rgba(${point.red}, ${point.green}, ${point.blue}, ${point.alpha}) ${point.left}%`)
    .join(", ");
  return {
    background: `linear-gradient(${gradientRef.value.degree}deg, ${points})`,
  };
});

const addPoint = () => {
  gradientRef.value.points.push({ left: 50, red: 255, green: 255, blue: 255, alpha: 1 });
};

const isValidGradient = () => {
  return props.gradient && props.gradient.points
}

const removePoint = (index) => {
  gradientRef.value.points.splice(index, 1);
};
</script>

<style scoped>
.gradient-display {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
}
.point-inputs {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
