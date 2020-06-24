<template lang="pug">
  div
    persons(:partnerNames="partnerNames" :founderNames="founderNames" :periodNames="periodNames" @changedFounders="onChangedFounders" @addPerson="onAddPerson" @removePerson="onRemovePerson" @addPartnerToPeriod="onAddPartnerToPeriods")
    periods(ref="periods" :periods="periods" @addPeriod="onAddPeriod" @changeWork="onChangeWork" @removePeriod="onRemovePeriod" @removePartner="onRemovePartner")
    b-button.mt-4(variant="success" @click="onClick") Emit Test Data
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch, Provide } from 'vue-property-decorator'
import { includes, uniq, pluck, clone, uniqBy, prop, sortBy } from 'ramda'
import dataset from '@/datasets/default'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'
import addPartnersToAllPeriods from '@/lib/addPartnersToAllPeriods'
import addPartnerToPeriods from '@/lib/addPartnerToPeriods'
import removePartnerFromAllPeriods from '@/lib/removePartnerFromAllPeriods'
import Persons from '@/components/Persons.vue'
import Periods from '@/components/Periods.vue'

@Component({
  components: {
    Persons,
    Periods,
  },
})
export default class PeriodsBuilder extends Vue {
  periods: Period[] = []
  partnerNames: string[] = []
  founderNames: string[] = []
  @Provide() isPartnerFounder = this.isFounder
  @Provide() isPartnerInPeriod = this.isPartnerNameInPeriod

  $refs!: {
    periods: Periods
  }

  mounted() {
    this.load()
  }

  load() {
    this.periods = dataset
    this.partnerNames = extractPartnerNames(dataset).sort()
    this.founderNames = extractFounderNames(dataset).sort()
  }

  get periodNames(): string[] {
    return pluck('name', this.periods)
  }

  onClick() {
    this.$emit('update', this.periods)
  }

  isFounder(partner: string): boolean {
    return includes(partner, this.founderNames)
  }

  isPartnerNameInPeriod(partnerName: string, periodName: string): boolean {
    const period = this.periods.find(
      (p: Period): boolean => p.name === periodName
    )
    if (!period) return false
    const partner = period!.partners.find(
      (p: Partner) => p.name === partnerName
    )
    if (!partner) return false
    return true
  }

  onChangeWork(periodsIndex: number, partnersIndex: number, work: number) {
    this.periods[periodsIndex].partners[partnersIndex].work = work
  }

  @Watch('founderNames')
  watchFounderNames() {
    // add a period if there are none yet
    if (!this.periods.length) {
      this.$refs.periods.addPeriod()
    }

    this.periods = addPartnersToAllPeriods(this.founderNames, this.periods)
  }

  onAddPerson(name: string) {
    // first person is founder
    if (this.partnerNames.length <= 0) {
      this.founderNames = clone(uniq([...this.founderNames, name]).sort())
    }
    this.partnerNames = clone(uniq([...this.partnerNames, name]).sort())
  }

  onChangedFounders(founders: string[]) {
    this.founderNames = clone(founders.sort())
  }

  onAddPeriod(period: Period) {
    this.periods.push(period)
  }

  onRemovePeriod() {
    this.periods = this.periods.slice(0, -1)
  }

  onRemovePartner(periodIndex: number, partnerIndex: number) {
    this.periods[periodIndex].partners.splice(partnerIndex, 1)
  }

  onRemovePerson(partnerName: string) {
    this.partnerNames = this.partnerNames.filter(
      (name: string): boolean => name !== partnerName
    )
    this.founderNames = this.founderNames.filter(
      (name: string): boolean => name !== partnerName
    )
    this.periods = removePartnerFromAllPeriods(partnerName, this.periods)
  }

  onAddPartnerToPeriods(partnerName: string, periodName: string) {
    this.periods = addPartnerToPeriods(partnerName, periodName, this.periods)
  }
}
</script>
