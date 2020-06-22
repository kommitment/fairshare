<template lang="pug">
  b-card
    b-form
      b-row.mb-3
        b-col
          h5 Persons
        b-col.col-auto
          new-person-form(@submit="onSubmitNewPersonForm")
      b-card-group.mb-4
        template(v-for="(p, idx) in partnerNames" deck)
          b-card(:title="p")
            b-card-text
              b-link(@click="onClickType(p)") {{isFounder(p) ? 'founder' : 'partner'}}

      p Periods
      template(v-for="(period, periodsIndex) in periods")
        b-card.mb-2(:title="period.date" :sub-title="periodsIndex === 0 ? 'Founding Phase' : ''")
          b-card-group.mb-4
            template(v-for="(p, partnersIndex) in sortByPartnerName(period.partners)")
              b-card(:title="p.name" :sub-title="isFounder(p.name) ? 'founder' : 'partner'")
                b-card-text
                  div() Contribution {{p.work * 100}}%
                    b-form-input(type="range" min="0" max="1" step="0.05" :value="p.work" @input="onChangeWork(periodsIndex, partnersIndex, $event)")
                  div(v-if="p.returnedFairShares") Returned FairShares {{p.returnedFairShares * 100}}%

      b-button.mt-4(@click="onClick") Emit Test Data
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch } from 'vue-property-decorator'
import { includes, prop, without, sortBy, concat, map } from 'ramda'
import newPersonForm from '@/components/newPersonFom.vue'
import dataset from '@/datasets/default'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'

const sortByPartnerName = sortBy(prop('name'))

@Component({
  components: {
    newPersonForm,
  },
})
export default class PeriodsBuilder extends Vue {
  periods: Period[] = []
  partnerNames: string[] = []
  founderNames: string[] = []
  showNewEmptyPerson: boolean = false
  newPersonName: string = ''

  mounted() {
    this.load()
  }

  load() {
    this.periods = dataset
    this.partnerNames = extractPartnerNames(dataset).sort()
    this.founderNames = extractFounderNames(dataset).sort()
  }

  sortByPartnerName(partners: Partner[]): Partner[] {
    return sortByPartnerName(partners)
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

  onChangeWork(periodsIndex: number, partnersIndex: number, work: number) {
    this.periods[periodsIndex].partners[partnersIndex].work = work
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

  onSubmitNewPersonForm(name: string) {
    this.partnerNames.push(name)
    this.partnerNames.sort()
  }
}
</script>
