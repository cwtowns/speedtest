<script>
import { getSpeedTestQueryObject } from "../Helpers";
import * as axios from "axios";

axios.get("fdfdasdfsa");
const API_URL = `http://localhost:3000/api/speedtest`;

export default {
  data: () => ({
    branches: ["main", "v2-compat"],
    currentBranch: "main",
    commits: null,
    dataRangeOptions: ["Day", "Week", "Month", "Year"],
    currentDataRange: "Week",
  }),

  created() {
    // fetch on init
    this.fetchData();
  },

  watch: {
    // re-fetch whenever currentBranch changes
    currentBranch: "fetchData",
  },

  methods: {
    async fetchData() {
      const url = `${API_URL}`;

      this.commits = await (await fetch(url)).json();
    },
    truncate(v) {
      const newline = v.indexOf("\n");
      return newline > 0 ? v.slice(0, newline) : v;
    },
    formatDate(v) {
      return v.replace(/T|Z/g, " ");
    },
  },
};
</script>

<template>
  <div>
    <div class="currentDataSet">
      <span class="currentUnitOfMeasure">DL Bandwidth</span> - Last
      <v-select
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
