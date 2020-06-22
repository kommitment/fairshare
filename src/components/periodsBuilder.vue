<template lang="pug">
  b-card
    persons(:partnerNames="partnerNames" :founderNames="founderNames" @changedFounders="onChangedFounders" @addPerson="onAddPerson")
    periods-component(ref="periods" :periods="periods" @addPeriod="onAddPeriod" @changeWork="onChangeWork" @removePeriod="onRemovePeriod")
    b-button.mt-4(@click="onClick") Emit Test Data
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { Watch, Provide } from 'vue-property-decorator'
import { includes, uniq } from 'ramda'
import dataset from '@/datasets/default'
import extractPartnerNames from '@/lib/extractPartnerNames'
import extractFounderNames from '@/lib/extractFounderNames'
import addFoundersToAllPeriods from '@/lib/addFoundersToAllPeriods'
import Persons from '@/components/persons.vue'
import PeriodsComponent from '@/components/periods.vue'

@Component({
  components: {
    Persons,
    PeriodsComponent,
  },
})
export default class PeriodsBuilder extends Vue {
  periods: Period[] = []
  partnerNames: string[] = []
  founderNames: string[] = []
  @Provide() isPartnerFounder = this.isFounder

  $refs!: {
    periods: PeriodsComponent
  }

  mounted() {
    // this.load()
  }

  load() {
    this.periods = dataset
    this.partnerNames = extractPartnerNames(dataset).sort()
    this.founderNames = extractFounderNames(dataset).sort()
  }

  onClick() {
    this.$emit('update', this.periods)
  }

  isFounder(partner: string): boolean {
    return includes(partner, this.founderNames)
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

    this.periods = addFoundersToAllPeriods(this.founderNames, this.periods)
  }

  onAddPerson(name: string) {
    // first person is founder
    if (this.partnerNames.length <= 0) {
      this.founderNames = uniq([...this.founderNames, name])
    }
    this.partnerNames = uniq([...this.partnerNames, name])
    this.partnerNames.sort()
  }

  onChangedFounders(founders: string[]) {
    this.founderNames = founders
  }

  onAddPeriod(period: Period) {
    this.periods.push(period)
  }

  onRemovePeriod() {
    this.periods = this.periods.slice(0, -1)
  }
}
</script>
