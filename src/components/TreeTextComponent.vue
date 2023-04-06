<template>
    <p class="tree-text-component">{{ element?.getText() }}</p>
</template>

<script lang="ts">
import { ElementText } from '@/models/text';

export default {
    props: {
        element: {
            type: ElementText,
        },
    },
};
</script>

<style scoped>
.tree-text-component {
    cursor: default;
}
</style>
