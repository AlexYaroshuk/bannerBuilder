<template>
  <div id="app">
    <VColorPicker
      :canvas="canvas"
      :color="color"
      :isGradient="isGradient"
      :gradient="gradient"
      :presetEnabled="true"
      :historyEnabled="true"
      :eyeDropperEnabled="true"
      :onStartChange="color => onChange(color, 'start')"
      :onChange="color => onChange(color, 'change')"
      :onEndChange="color => onChange(color, 'end')"
    />

    <canvas id="canv" width="600" height="400" class="absolute right-4 top-4 bg-gray-200 rounded-md" ref="canvas"></canvas>
  </div>
  <button @click="test()">test</button>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'
import { VColorPicker } from '@envis/vcolor-picker'
import '@envis/vcolor-picker/dist/style.css'

const props = defineProps({
  color: Object,
  viewModel: Object,
  isGradient: Boolean,
  gradient: Object,
})


const colorRef = ref(props.color)
const canvas = ref({})
const isGradient = props.isGradient

watch(
  () => props.color,
  (newColor) => {
    colorRef.value = newColor
  },
  { deep: true }
)

const rgbaToCssColor = (rgba) => {
  return `rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, ${rgba.alpha})`
}

const onChange = (attrs, name) => {
  colorRef.value = { ...attrs }
  if (name === 'change' || name === 'end') {
    const cssColor = rgbaToCssColor(attrs)
    props.viewModel.selectedBackground.value = cssColor
  }
}

const gradient = ref({
  type: 'linear',
  degree: 0,
  points: [
    {
      left: 0,
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    },
    {
      left: 100,
      red: 255,
      green: 0,
      blue: 0,
      alpha: 1
    }
  ]      
})

function test() {
    console.log("🚀 ~ isGradient:", isGradient)
  console.log("🚀 ~ gradient:", gradient)

}
</script>
