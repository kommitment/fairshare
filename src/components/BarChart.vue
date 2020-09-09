<script lang="ts">
import { Line, mixins } from 'vue-chartjs'
import { Component, Mixins } from 'vue-property-decorator'

const { reactiveProp } = mixins

@Component
export default class BarChart extends Mixins(Line, reactiveProp) {
  // @Prop({ type: Object, default: {} }) options!: {}

  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
    })
  }
}
</script>
