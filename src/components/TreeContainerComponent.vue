<template>
    <div class="tree-container-component">
        {{ element?.getName() }}
        <div style="margin-left: 10px;">
            <component v-for="el in element!.children" :is="getComponent(el)" :element="el" />
        </div>
    </div>
</template>

<script lang="ts">
import TreeTextComponent from './TreeTextComponent.vue';
import TreeContainerComponent from './TreeContainerComponent.vue';
import { Element } from '@/models/element';
import { ElementContainer } from '@/models/container';
import { ElementText } from '@/models/text';

export default {
    props: {
        element: {
            type: ElementContainer,
        },
    },

    methods: {
        getComponent(element: Element) {
            if (element instanceof ElementContainer) {
                return TreeContainerComponent;
            }

            if (element instanceof ElementText) {
                return TreeTextComponent;
            }
        }
    }
};
</script>

<style scoped>
.tree-container-component {
    cursor: default;
}

:hover {
    border-style: solid;
    border-color: blue;
}
</style>
