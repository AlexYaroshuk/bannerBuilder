<template>
    <div 
        :class="{ 
            'tree-text-component': true, 
            'selected-element': viewModel.getCurrentSelectedElement() == element,
            'hovered-element': viewModel.getCurrentHoveredElement() == element
        }"
        @mouseover="viewModel.handleHover(element)" 
        @mouseleave="viewModel.handleDehover()"
        @click="viewModel.handleElementSelect(element)"
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
