<template>
    <div 
        @click="viewModel.handleElementSelected(element)" 
        @mouseover="viewModel.handleElementHovered(element)"
        @mouseleave="viewModel.handleElementDehovered()" 
        @dragstart="viewModel.handleDragStart()"
        :class="{ 
            'tree-text-component': true, 
            'selected-element': viewModel.getSelectedElement() == element,
            'hovered-element': viewModel.getHoveredElement() == element
        }"
    >
        <span class="material-icons">link</span>
        <p>
            {{ element?.getLabel() }}</p>
    </div>
</template>

<script lang="ts">
import { Link } from '@/models/link';
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel';

export default {
    props: {
        element: {
            type: Link,
            required: true,
        },
        viewModel: {
            type: BannerBuilderViewModel,
            required: true,
        }
    },
    methods: {
    }
};
</script>

<style scoped>
.tree-text-component {
    display: flex;
    cursor: default;
    border: solid transparent;
}

.hovered-element {
    border: solid #1482ff80;
}

.selected-element {
    border: solid #1482ff;
}
</style>
