<template>
  <div
    class="container"
    :class="{ 'container--selected': isSelected }"
    @click="handleContainerClick"
  >
    <div class="name" v-if="isSelected">{{ name }}</div>
    <div class="child" v-if="children && children.length">
      <div
        v-for="(child, index) in children"
        :key="index"
        class="child-item"
        :class="{ 'child-item--selected': child.isSelected }"
        @click="selectChild(child)"
        :data-key="index"
      >
        <Text
          @click="selectChild(child)"
          v-if="child.type && child.type === 'text'"
          :text="child.value"
          :containerName="name"
          :key="'text-' + index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Text from "./Text.vue";

export default {
  data() {
    return {
      currentContainerIndex: null,
    };
  },

  props: {
    children: {
      type: Array,
      default: [],
    },
    index: {
      type: Number,
      default: null,
    },

    isSelected: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {
    selectChild(child) {
      this.$emit("select-child", child, this.name);
    },

    handleContainerClick(event) {
      let childItem = event.target.closest(".child-item");
      if (childItem) {
        let childIndex = parseInt(childItem.getAttribute("data-key"));
        let child = this.children[childIndex];
        this.selectChild(child);
        this.$emit("select-container", this.index);
      } else {
        this.$emit("deselect-all");
        this.$emit("select-container", this.index);
      }
    },
  },

  components: {
    Text,
  },
};
</script>

<style scoped>
/* Add this line to give the parent element a position */
.container--selected {
  border: 2px solid #1280ff;

  /*   position: relative; */
}
.container:not(.selected):hover {
  border: 2px solid #1280ff;
}
.container--selected .name {
  position: absolute;
  top: 0;
  left: 0;
  font-size: small;
  background-color: #1280ff;
  color: white;
  padding: 0px 4px;
}

.child {
  display: flex;
  align-items: center;
  padding: 16px;
  flex: 1;
  /* Add this line to give the parent element a position */
}
.child-item {
  display: flex;
  z-index: 1;
  border: 2px solid transparent;
  /*   align-items: center;
  padding: 16px;
  flex: 1; */
  /* Add this line to give the parent element a position */
}
.child-item--selected {
  border: 2px solid #1280ff;
  /* Add this line to give the parent element a position */
}
.child-item:not(.selected):hover {
  border: 2px solid #1280ff;
}
</style>
