<template lang="pug">
  div
    bar-chart(:chart-data="chartData")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { pluck, clone, pipe } from 'ramda'
import BarChart from '@/components/BarChart.vue'
import getDatasets from '@/lib/chart/getDatasets'
import addBorderWidth from '@/lib/chart/addBorderWidth'
import addBorderColors from '@/lib/chart/addBorderColors'
import addBackgroundColors from '@/lib/chart/addBackgroundColors'
import { getBorderColors, getBackgroundColors } from '@/lib/chart/colors'

@Component({
  components: { BarChart },
})
export default class PeriodsChart extends Vue {
  @Prop({ type: Array, default: [] }) periods!: Period[]

  get labels() {
    return pluck('name', clone(this.periods))
  }

  get chartData() {
    const datasets = pipe(
      () => clone(this.periods),
      getDatasets('shares'),
      addBorderWidth(1),
      addBorderColors(getBorderColors()),
      addBackgroundColors(getBackgroundColors())
    )()

    return {
      labels: this.labels,
      datasets,
    }
  }
}
</script>
