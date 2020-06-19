<template lang="pug">
  b-card
    b-form
      p Persons
      b-card-group.mb-4
        template(v-for="(p, idx) in sort(partnerNames)" deck)
          b-card(:title="p")
            b-card-text
              b-link(@click="onClickType(p)") {{isFounder(p) ? 'founder' : 'partner'}}

      p Periods
      template(v-for="(period, idx) in periods")
        b-card.mb-2(:title="period.date")
          b-card-group.mb-4
            template(v-for="(p, idx) in sortByPartnerName(period.partners)")
              b-card(:title="p.name" :sub-title="isFounder(p.name) ? 'founder' : 'partner'")
                b-card-text
                  div() Contribution {{p.work * 100}}%
                    b-form-input(type="range" min="0" max="1" step="0.05")
                  div(v-if="p.returnedFairShares") Returned FairShares {{p.returnedFairShares * 100}}%

      b-button.mt-4(@click="onClick") Emit Test Data
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch } from 'vue-property-decorator'
import {
  includes,
  prop,
  without,
  ascend,
  sort,
  sortBy,
  identity,
  concat,
  map,
} from 'ramda'
import dataset from '@/datasets/default'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'

@Component({
  methods: {
    sort: sort(ascend(identity)),
    sortByPartnerName: sortBy(prop('name')),
  },
})
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

  isFounder(partner: string): boolean {
    return includes(partner, this.founderNames)
  }

  onClickType(partnerName: string) {
    this.founderNames = this.isFounder(partnerName)
      ? without([partnerName], this.founderNames)
      : concat([partnerName], this.founderNames)
  }

  @Watch('founderNames')
  watchFounderNames() {
    // add founder to first period
    if (!this.periods.length) return
    const partners = map(
      (name: string) => ({ name, work: 1 }),
      this.founderNames
    )
    this.periods[0].partners = partners
  }
}
</script>
