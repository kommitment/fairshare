<template lang="pug">
  div
    .row
      .col
        p.lead
          | Input parameters of FairShare is a set of revenue related data per persiod (e.g. per year).
          br
          | FairShare will calculate the
          |           share of every partner of the company and show the change of his/her share per period. So the plan.

        periods-builder(@update="onUpdate")

        form.my-4
          .row
            .col.col-sm-6.col-md-3
              .form-group
                label Founders keep shares:&nbsp;
                  span {{foundersShares}}%
                input.slider(type="range" min="0" :max="maxFoundersShares" step="0.1" v-model="foundersShares")
    .row
      .col
        .p-3
          #chartId
    .row
      .col
        .p-3
          #filterDiv
    .row
      .col
        .p-3
          #page-wrap
    .row
      .col
        pre {{dataset}}

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import calculateShares from '@/lib/calculateShares/'
import PeriodsBuilder from '@/components/PeriodsBuilder.vue'

@Component({
  components: {
    PeriodsBuilder,
  },
})
export default class Demo extends Vue {
  foundersShares: number = 6.5
  periods: Period[] = []

  onUpdate(periods: Period[]) {
    this.periods = periods
  }

  get maxFoundersShares() {
    if (!this.periods.length) return 0
    const numberOfPartners = this.periods[0].partners.length
    return Math.floor(100 / numberOfPartners)
  }

  get dataset() {
    if (!this.periods.length) return []
    return calculateShares(this.periods, this.foundersShares / 100)
  }
}
</script>
