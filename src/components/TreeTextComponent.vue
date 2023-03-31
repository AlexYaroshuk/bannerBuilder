<template>
    <p>{{ element?.getText() }}</p>
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
.sidebar {
    color: black;
    background-color: #f5f5f5;
    padding: 1rem;
    width: 20%;
    float: right;
    transition: all 0.2s ease-in-out;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    overflow-y: scroll;
    z-index: 2;
}

.hidden {
    right: -20%;
}

.sidebar-button {
    padding: 1rem;
    float: right;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2;
}

.status-text {
    display: flex;
    font-weight: 600;
    font-size: small;
    padding-left: 4px;
    padding-right: 4px;
}

.status-text-inherited-color {
    color: rgb(154, 67, 253);
    background-color: rgba(154, 67, 253, 0.2);
}

.status-text-selected-color {
    color: rgba(0, 123, 255);
    background-color: rgba(0, 123, 255, 0.2);
}
</style>
