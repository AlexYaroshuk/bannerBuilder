<template>
    <div class="tree-text-component" :class="{ 'hovered-element': viewModel.getCurrentHoveredElement() == element }"
        @mouseover="viewModel.handleHover(element)" @mouseleave="viewModel.handleDehover()">
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
    gap: 5;
}

.hovered-element {
    border-style: solid;
    border-color: blue;
}
</style>
