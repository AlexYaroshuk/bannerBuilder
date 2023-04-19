<template>
    <div 
        @click="viewModel.handleElementSelected(element)" 
        @mouseover="viewModel.handleElementHovered(element)"
        @mouseleave="viewModel.handleElementDehovered()" 
        @dragstart="viewModel.handleDragStart()"
        :class="{ 
            'tree-text-component': true,
            'hovered-element': viewModel.getHoveredElement() == element, 
            'selected-element': viewModel.getSelectedElement() == element 
        }"
        >
        <span class="material-icons">text_format</span>
        <p>
            {{ element?.getText() }}</p>
    </div>
</template>

<script lang="ts">
import { Text } from '@/models/text';
import { BannerBuilderViewModel } from '@/viewmodels/bannerBuilderViewModel';

export default {
    props: {
        element: {
            type: Text,
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
