<template>
    <div class="banner" @mouseover="showOptions = true" @mouseleave="showOptions = false">
        {{ message }}

        <OptionsButton :is-active="showOptions" />
    </div>
</template>

<script>
import OptionsButton from './OptionsButton.vue';

export default {
    components: {
        OptionsButton
    },
    props: {
        message: {
            type: String,
            default: "Some default text."
        }
    },
    data() {
        return {
            showOptions: false
        };
    }
};
</script>

<style scoped>
.banner {
    padding: 1rem;
    background-color: purple;
    opacity: 0.5;
    color: white;
    width: 600px;
    height: 200px;
    align-self: center;
    position: relative;
    /* Add this line to give the parent element a position */
}
</style>
