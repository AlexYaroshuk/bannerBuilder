<template>
  <div>
    <main>
      <Wrapper></Wrapper>
    </main>
  </div>
</template>

<script>
import Wrapper from "./components/Wrapper.vue";

import "@fortawesome/fontawesome-free/css/all.css";

export default {
  components: {
    Wrapper,
  },
};
</script>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

main {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
