<template>
  <v-app>
    <v-main>
      <SpeedTest />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SpeedTest from './components/SpeedTest.vue'

export default defineComponent({
  name: 'App',

  components: {
    SpeedTest,
  },

  data() {
    return {
      //
    }
  },
})
</script>
