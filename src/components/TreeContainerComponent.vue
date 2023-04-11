<template>
  <div class="tree-container-component">
    {{ element?.getName() }}
    <div style="margin-left: 10px">
      <component
        v-for="el in element!.children"
        :is="getComponent(el)"
        :element="el"
      />
    </div>
  </div>
</template>

<script lang="ts">
import TreeTextComponent from "./TreeTextComponent.vue";
import TreeContainerComponent from "./TreeContainerComponent.vue";
import { Element } from "@/models/element";
import { Container } from "@/models/container";
import { Text } from "@/models/text";

export default {
  props: {
    element: {
      type: Container,
    },
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

    onHover() {},
  },
};
</script>

<style scoped>
.tree-container-component {
  cursor: default;
}

/* :hover {
    border: 2px solid hsl(212, 100%, 54%);
} */
</style>
