<template>
    <div draggable="true" @drag="viewModel.handleDragStart(element)" @dragover="viewModel.handleDragOver(element)"
        @dragenter.prevent @dragover.prevent>
        <div style="margin: 5px;">
            <div>
                {{ element.getName() }}
            </div>
            <div style="margin-left: 10px;" v-for="el in element.getChildren()" :key="el.getName()">
                <component :is="getComponent(el)" :viewModel="viewModel" :element="el" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Element } from '@/models/element';
import { Container } from '@/models/container';
import { Text } from '@/models/text';
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel';

import TreeTextComponent from './TreeTextComponent.vue';
import TreeContainerComponent from './TreeContainerComponent.vue';

export default {
    props: {
        element: {
            type: Container,
            required: true,
        },
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
