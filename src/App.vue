<template>
  <div>
    <header>
      <!--       <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->

      <div class="wrapper"></div>
    </header>

    <main>
      <Wrapper></Wrapper>
      <SidebarLeft />
      <!--       <SidebarRight /> -->

      <!--       <Banner />
      <Text /> -->
    </main>
  </div>
</template>

<script>
/* import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue"; */
import Wrapper from "./components/Wrapper.vue";
import SidebarLeft from "./components/SidebarLeft.vue";
import SidebarRight from "./components/SidebarRight.vue";
/* import Banner from "./components/Banner.vue";
import Text from "./components/Text.vue"; */

import "@fortawesome/fontawesome-free/css/all.css";

export default {
  components: {
    /*     HelloWorld,
        TheWelcome, */
    SidebarLeft,
    SidebarRight,
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
