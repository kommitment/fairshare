<script lang="ts">
import { Bar, mixins } from 'vue-chartjs'
import { Component, Mixins } from 'vue-property-decorator'

const { reactiveProp } = mixins

@Component
export default class BarChart extends Mixins(Bar, reactiveProp) {
  // @Prop({ type: Object, default: {} }) options!: {}

  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
    })
  }
}
</script>
