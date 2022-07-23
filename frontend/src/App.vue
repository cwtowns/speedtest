<script lang="ts">
import { defineComponent } from "vue";
import SpeedTest from "./components/SpeedTest.vue";

export default defineComponent({
  name: "App",
  components: {
    SpeedTest,
  },
});
</script>

<template>
  <SpeedTest />
</template>
