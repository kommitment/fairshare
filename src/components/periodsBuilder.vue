<template lang="pug">
  b-card
    div
      b-row.mb-3
        b-col
          h5 Persons
        b-col.col-auto
          new-person-form(@submit="onSubmitNewPersonForm")
      b-card(v-if="!partnerNames.length")
        b-card-text.text-center No persons yet. Use the "+" button.
      b-card-group.mb-4
        template(v-for="(p, idx) in partnerNames" deck)
          b-card(:title="p")
            b-card-text
              b-link(@click="onClickType(p)") {{isFounder(p) ? 'founder' : 'partner'}}

      b-row.mb-3
        b-col
          h5 Periods
        b-col.col-auto
          b-btn(@click="onClickAddPeriod") +
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
import { includes, prop, without, sortBy, concat } from 'ramda'
import newPersonForm from '@/components/newPersonFom.vue'
import dataset from '@/datasets/default'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'
import getPartnersFromLatestPeriod from '@/lib/getPartnersFromLatestPeriod'
import addFoundersToAllPeriods from '@/lib/addFoundersToAllPeriods'

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
    // this.load()
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
    // first person is founder which cannot be changed
    if (this.partnerNames.length === 1) return
    // founder cannot be changed if there are no other founders
    if (this.isFounder(partnerName) && this.founderNames.length === 1) return

    this.founderNames = this.isFounder(partnerName)
      ? without([partnerName], this.founderNames)
      : concat([partnerName], this.founderNames)
  }

  onChangeWork(periodsIndex: number, partnersIndex: number, work: number) {
    this.periods[periodsIndex].partners[partnersIndex].work = work
  }

  @Watch('founderNames')
  watchFounderNames() {
    // add a period if there are none yet
    if (!this.periods.length) {
      this.addPeriod()
    }

    this.periods = addFoundersToAllPeriods(this.founderNames, this.periods)
  }

  onSubmitNewPersonForm(name: string) {
    // first person is founder
    if (this.partnerNames.length <= 0) {
      this.founderNames.push(name)
    }
    this.partnerNames.push(name)
    this.partnerNames.sort()
  }

  onClickAddPeriod() {
    this.addPeriod()
  }

  addPeriod() {
    const date = `Year ${this.periods.length + 1}`
    const partners: Partner[] = getPartnersFromLatestPeriod(this.periods)
    this.periods.push({ date, partners })
  }
}
</script>
