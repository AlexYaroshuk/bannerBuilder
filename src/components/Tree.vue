<template>
  <div>
    <TreeContainerComponent :viewModel="viewModel" :element="viewModel.getRootContainer()" />
  </div>
</template>

<script lang="ts">
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel'
import { defineComponent } from 'vue'
import { Element } from '@/models/element';
import { Container } from '@/models/container';
import { Text } from '@/models/text';

import TreeContainerComponent from './TreeContainerComponent.vue';
import TreeTextComponent from './TreeTextComponent.vue';

export default defineComponent({
  components: {
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