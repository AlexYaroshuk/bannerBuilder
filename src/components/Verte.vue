<template>
    <verte picker="square" model="rgb"></verte>
</template>

<script>
import Verte from 'verte';
import 'verte/dist/verte.css';
// register component globally
Vue.component('verte', Verte);

new Vue({
    el: '#app',
    // OR register locally
    components: { Verte }
});
</script>