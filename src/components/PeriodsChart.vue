<template lang="pug">
  div
    bar-chart(:chart-data="chartData")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { pluck, clone } from 'ramda'
import BarChart from '@/components/BarChart.vue'

@Component({
  components: { BarChart },
})
export default class PeriodsChart extends Vue {
  @Prop({ type: Array, default: [] }) periods!: Period[]

  get labels() {
    return pluck('name', clone(this.periods))
  }

  get dataSumWork() {
    return pluck('sumWork', clone(this.periods))
  }

  get dataAccumWork() {
    return pluck('accumWork', clone(this.periods))
  }

  get dataSharesInDistribution() {
    return pluck('sharesInDistribution', clone(this.periods))
  }

  get chartData() {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'Sum Work',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: this.dataSumWork,
        },
        {
          label: 'Accum Work',
          backgroundColor: 'rgba(153, 102, 255, 0.2',
          borderColor: 'rgba(153, 102, 255, 1',
          borderWidth: 1,
          data: this.dataAccumWork,
        },
        {
          label: 'SharesInDistrution',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          data: this.dataSharesInDistribution,
        },
      ],
    }
  }

  getRandomInt() {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }
}
</script>
