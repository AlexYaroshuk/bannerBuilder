<template>
  <div v-if="this.viewModel.getRootContainer().getChildren().length === 0">
    <h3>No layers</h3>
    <br />
    When you add a component, you'll see it here.
  </div>
  <draggable class="dragArea list-group w-full" :list="this.viewModel.getRootContainer().getChildren()" @change="log">
    <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-for="element in this.viewModel.getRootContainer().getChildren()" :key="element.name">
      {{ element.name }}
    </div>
  </draggable>
</template>

<script>
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel'
import TreeContainerComponent from './TreeContainerComponent.vue';
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  components: {
    draggable: VueDraggableNext,
    TreeContainerComponent
  },
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      default: null,
    },
  },
};
</script>

<style scoped></style>
