<template>
  <Chart :options="barChartOptionCreator()" />
</template>
<script setup>
import Chart from "./Chart.vue";
import barChartOptionCreator from "./barChartOptions.js";
</script>
<style scoped></style>