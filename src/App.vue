<template>
  <div>
    <header>
      <!--       <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

      <div class="wrapper">
        <HelloWorld msg="You did it!" />
      </div>
    </header>

    <main>
      <Wrapper></Wrapper>
      <Sidebar />
      <TheWelcome />
      <!--       <Banner />
      <Text /> -->
    </main>
  </div>
</template>

<script>
/* import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue"; */
import Wrapper from "./components/Wrapper.vue";
import Sidebar from "./components/Sidebar.vue";
/* import Banner from "./components/Banner.vue";
import Text from "./components/Text.vue"; */

import "@fortawesome/fontawesome-free/css/all.css";

export default {
  components: {
    /*     HelloWorld,
        TheWelcome, */
    Sidebar,
    /*     Banner,
    Text, */
    Wrapper,
  },
};
</script>

<style scoped>
header {
  line-height: 1.5;
}

/* .logo {
  display: block;
  margin: 0 auto 2rem;
} */

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
  display: block;
  height: auto;
}
</style>
