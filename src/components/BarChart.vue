<script lang="ts">
import { Bar, mixins } from 'vue-chartjs'
import { Component, Mixins } from 'vue-property-decorator'

const { reactiveProp } = mixins
const toPercent = (val: any, precision: number = 4): string =>
  new Intl.NumberFormat('de-DE', {
    maximumSignificantDigits: precision,
  }).format(val * 100)

@Component
export default class BarChart extends Mixins(Bar, reactiveProp) {
  options: any = {
    title: {
      display: true,
      text: 'Verteilung der FairShares unter den Mitmachern',
    },
    responsive: true,
    tooltips: {
      callbacks: {
        label(tooltipItem: any, data: any) {
          return `${data.datasets[tooltipItem.datasetIndex].label}: ${toPercent(
            tooltipItem.yLabel
          )}%`
        },
      },
    },
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [
        {
          stacked: true,
          ticks: {
            callback: (val: any) => `${toPercent(val)}%`,
          },
        },
      ],
    },
  }

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
