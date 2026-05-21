<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData
} from 'chart.js'

// Register ChartJS modules
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  chartData: ChartData<'bar'>
  title?: string
}>()

// Default options for responsive premium styling
const defaultOptions = computed<ChartOptions<'bar'>>(() => ({
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
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif',
          size: 11
        }
      }
    },
    y: {
      border: {
        dash: [4, 4]
      },
      grid: {
        color: '#f0f0f0'
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif',
          size: 11
        },
        stepSize: 1
      }
    }
  }
}))
</script>

<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="defaultOptions" />
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
