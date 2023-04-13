<template>
  <div @dragleave="viewModel.handleDragOutside()" @drop="viewModel.handleDrop()" @dragover.prevent
      @dragenter.prevent class="flex m-10 drop-zone">
    <div >
      <div v-for="element in viewModel.getRootContainer().getChildren()" :key="element.getName()">
        <TreeContainerComponent :viewModel="viewModel" :element="element" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel'
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { Element } from '@/models/element';
import { Container } from '@/models/container';
import { Text } from '@/models/text';

import TreeContainerComponent from './TreeContainerComponent.vue';
import TreeTextComponent from './TreeTextComponent.vue';

export default defineComponent({
  components: {
    draggable: VueDraggableNext,
    TreeContainerComponent,
  },
  props: {
    viewModel: {
      type: BannerBuilderViewModel,
      required: true,
    }
  },
  methods: {
    getComponent(element: Element) {
      if (element instanceof Container) {
        return TreeContainerComponent;
      }

      if (element instanceof Text) {
        return TreeTextComponent;
      }
    },
  }
})
</script>