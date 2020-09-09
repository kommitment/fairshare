<template lang="pug">
  div
    bar-chart(:chart-data="chartData")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { pluck, clone } from 'ramda'
import BarChart from '@/components/BarChart.vue'
import getDatasets from '@/lib/chart/getDatasets'

@Component({
  components: { BarChart },
})
export default class PeriodsChart extends Vue {
  @Prop({ type: Array, default: [] }) periods!: Period[]

  get labels() {
    return pluck('name', clone(this.periods))
  }

  get chartData() {
    return {
      labels: this.labels,
      datasets: getDatasets('shares', this.periods),
    }
  }
}
</script>
