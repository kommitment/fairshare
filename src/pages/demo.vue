<template lang="pug">
  div
    .row
      b-col(cols="12" lg="6")
        div.sticky-top
          periods-chart(:periods="periods")

      b-col(cols="12" lg="6").bg-light
        periods-builder(@update="onUpdate")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import PeriodsBuilder from '@/components/PeriodsBuilder.vue'
import PeriodsChart from '@/components/PeriodsChart.vue'

@Component({
  components: {
    PeriodsBuilder,
    PeriodsChart,
  },
})
export default class Demo extends Vue {
  periods: Period[] = []

  onUpdate(periods: Period[]) {
    this.periods = periods
  }
}
</script>
