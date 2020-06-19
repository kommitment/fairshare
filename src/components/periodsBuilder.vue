<template lang="pug">
  b-card
    b-form
      p Persons
      b-card-group.mb-4
        template(v-for="(p, idx) in partnerNames.sort()" deck)
          b-card(:title="p" :sub-title="isFounder(p) ? '⭐ founder' : 'partner'")

      p Periods
      template(v-for="(period, idx) in periods")
        b-card.mb-2(:title="period.date")
          b-card-group.mb-4
            template(v-for="(p, idx) in getPartnersSortedByName(period.partners)")
              b-card(:title="p.name" :sub-title="isFounder(p.name) ? '⭐ founder' : 'partner'")
                b-card-text
                  div Contribution {{p.work * 100}}%
                  div(v-if="p.returnedFairShares") Returned FairShares {{p.returnedFairShares * 100}}%

      b-button.mt-4(@click="onClick") Emit Test Data
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { includes, sortBy, prop } from 'ramda'
import dataset from '@/datasets/default'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'

@Component({})
export default class PeriodsBuilder extends Vue {
  periods: Period[] = []
  partnerNames: string[] = []
  founderNames: string[] = []

  mounted() {
    this.load()
  }

  load() {
    this.periods = dataset
    this.partnerNames = extractPartnerNames(dataset)
    this.founderNames = extractFounderNames(dataset)
  }

  onClick() {
    this.$emit('update', this.emittablePeriods)
  }

  get emittablePeriods() {
    return this.periods
  }

  get founders(): Partner[] {
    return this.periods.length ? this.periods[0].partners : []
  }

  isFounder(partner: string): boolean {
    return includes(partner, this.founderNames)
  }

  getPartnersSortedByName(partners: Partner[]): Partner[] {
    return sortBy(prop('name'), partners)
  }
}
</script>
