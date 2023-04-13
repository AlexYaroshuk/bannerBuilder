<template>
    <p class="tree-text-component">
        {{ element?.getText() }}</p>
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
    cursor: default;
}

/* :hover {
    border: 2px solid hsl(212, 100%, 54%);
} */
</style>
