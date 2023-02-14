<template>
    <aside :class="['sidebar', {'hidden': !isVisible}]">
        <h3>Sidebar</h3>
        <p>This is the content of the sidebar</p>
        <button @click="toggleVisibility">Hide</button>
    </aside>
</template>
<script>
export default {
    data() {
        return {
            isVisible: true,
        };
    },
    methods: {
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        },
    },
};
</script>
<style scoped>
.sidebar {
    color: black;
    background-color: #f5f5f5;
    padding: 1rem;
    width: 25%;
    float: left;
    transition: all 0.5s ease-in-out;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}

.hidden {
    left: -25%;
}
</style>