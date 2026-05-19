<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartOptions,
  type ChartData
} from 'chart.js'

// Register ChartJS modules
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  chartData: ChartData<'doughnut'>
  title?: string
}>()

// Default options for responsive premium styling
const defaultOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: 'Inter, sans-serif',
          size: 12,
          weight: 500
        },
        usePointStyle: true,
        padding: 20
      }
    },
    title: {
      display: !!props.title,
      text: props.title || '',
      align: 'start',
      font: {
        family: 'Outfit, sans-serif',
        size: 16,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      }
    }
  },
  cutout: '70%'
}))
</script>

<template>
  <div class="chart-wrapper">
    <Doughnut :data="chartData" :options="defaultOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
