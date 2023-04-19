<template>
    <div>
        <div v-if="element != viewModel.getRootContainer()" class="tree-container-component-text"
            :class="{ 'hovered-element': viewModel.getCurrentHoveredElement() == element }"
            @mouseover="viewModel.handleHover(element)" @mouseleave="viewModel.handleDehover()">
            <span class="material-icons">check_box_outline_blank</span>
            <p>{{ element.getName() }}</p>
        </div>
        <draggable :list="element.getChildren()" group="{{ element.getName() }}">
            <div v-for="el in element.getChildren()" :key="el.getName()">
                <div>
                    <component :class="[element != viewModel.getRootContainer() ? 'children-container' : '']"
                        :is="getComponent(el)" :viewModel="viewModel" :element="el" />
                </div>
            </div>
        </draggable>
    </div>
</template>

<script lang="ts">
import { Element } from '@/models/element';
import { Container } from '@/models/container';
import { Text } from '@/models/text';
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel';
import { VueDraggableNext } from 'vue-draggable-next';

import TreeTextComponent from './TreeTextComponent.vue';
import TreeContainerComponent from './TreeContainerComponent.vue';

export default {
    components: {
        draggable: VueDraggableNext,
    },
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
.tree-container-component-text {
    display: flex;
    cursor: default;
    margin-bottom: 10px;
    border: solid transparent;
}

.children-container {
    margin-bottom: 10px;
    margin-left: 10px;
}

.hovered-element {
    border: solid #1482ff80;
}
</style>
