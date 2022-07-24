<script>
import { getData } from '../Api'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

export default {
  data: () => ({
    dataRangeOptions: ['Day', 'Week', 'Month', 'Year'],
    currentDataRange: 'Week',
    hasError: false,
  }),

  created() {
    // fetch on init
    this.fetchData()
  },

  watch: {
    // re-fetch whenever currentBranch changes
    currentDataRange: 'fetchData',
  },

  methods: {
    async fetchData() {
      try {
        this.hasError = false
        await getData(this.currentDataRange)
      } catch (error) {
        console.error(error)
        this.hasError = true
      }
    },
  },
}
</script>

<template>
  <div>
    <div class="currentDataSet">
      <span class="currentUnitOfMeasure">DL Bandwidth</span> - Last
      <v-select
        v-if="!error"
        class="currentDataRange"
        :items="dataRangeOptions"
        label="Range"
        v-model="currentDataRange"
      ></v-select>
    </div>
    <div class="graphArea">Graph goes here</div>
    <div class="dataSets">Data Sets go here</div>
  </div>
</template>

<style>
a {
  text-decoration: none;
  color: #42b883;
}

li {
  line-height: 1.5em;
  margin-bottom: 20px;
}

.author,
.date {
  font-weight: bold;
}
</style>
