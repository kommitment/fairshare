<script lang="ts">
import { Bar, mixins } from 'vue-chartjs'
import { Component, Mixins } from 'vue-property-decorator'

const { reactiveProp } = mixins

@Component
export default class BarChart extends Mixins(Bar, reactiveProp) {
  options: any = {
    title: {
      display: true,
      text: 'Verteilung der FairShares unter den Mitmachern',
    },
    responsive: true,
    scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] },
  }

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
