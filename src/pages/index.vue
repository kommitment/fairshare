<template lang="pug">
  b-container(fluid="lg")
    b-row.justify-content-center
      b-col(cols="6" sm="4" md="3")
        img.mb-4.img-fluid(src="~assets/img/fairshare-pie.png")

    b-row.mb-4
      b-col
        h1 FairShare - einfach "fairteilen"

        p FairShare entsteht aus der Idee, eine Simulation zur Verteilung der Anteile einer Firma (im weiteren *die Firma* genannt) mit möglichst einfachen Regeln zu haben. Dabei sollen folgende Ziele erreicht werden:

        ul
          li Anteile der Firma verteilen sich mit der Zeit auf alle, die mitmachen.
          li Die Firma überlebt möglichst lange.
          li Unternehmergeist lohnt sich.
          li Gründen und Aufbauen lohnt sich.
          li Auch für Späteinsteiger lohnt sich der Einstieg.

        p Bei FairShare geht es um die Verteilung der Anteile eines Unternehmens. Wie am Jahresende Gewinne verteilt werden, beantwortet Fairshare nicht. Das gehört in einen Gesellschaftervertrag.

    b-row.justify-content-center.my-4
      b-col(md="7")
        b-btn(variant="info" block size="lg" to="demo")
          h4.mb-0 Zur Demo &raquo;
          small Probier aus, wie es funktioniert!

    b-row.my-4.pt-2
      b-col
        h2 Entstehungsgeschichte
        p FairShare ist Bestandteil unseres "Betriebssystems" bei <a href="https://www.kommitment.works/" target="_blank">kommitment GmbH &amp; Co. KG</a>. Wir laufen nun seit 2016 so und haben damit einige Erfahrungen gesammelt. Bei Interesse frage gerne nach!

    b-row.mt-4
      b-col.pt-2(cols="12" md="6")

        h2 Regeln
        h4 FairShares
        p Jedes Jahr wird jeder Person, die mitgemacht hat ein Anteil ausgegeben. Hat jemand nur in Teilzeit mitgemacht, so wird nur der entsprechende Teil eines FairShares ausgegeben.
        h4 Faktor Arbeit
        p Sagt aus, zu wie viel Prozent die Person in diesem Jahr mitgearbeitet hat. Wenn jemand in einem Jahr nicht mitmacht oder in Rente gegangen ist, so wird sein Faktor Arbeit auf Null gesetzt, d.h. sie/er bekommt in dem laufenden Jahr keine neuen Anteile, behält jedoch die Anteile aus den Vorjahren.
        h4 FounderShares
        p  Insgesamt x% der Firma bleiben zu jeweils gleichen Teilen bei den Gründern und werden nie verteilt.
        h4 Rückkauf von Anteilen
        p Sollte die Firma Anteile eines Anteilseigners zurückkaufen, so gehen die zugehörigen Fairshares nach dem Rückkauf unter.

      b-col.pt-2
        h2 Ablauf
        p Am Ende einer Periode (eines Geschäftsjahres) wird ermittelt, wer zu wievielen Teilen mitgearbeitet hat (und wer in Rente ist oder ein Sabbatical gemacht hat). Jeder Teilhabende, die/der mitgearbeitet hat bekommt einen Anteil entsprechend seine/r Mitarbeit. Jemand die/der nur eine halbe Stelle hat, bekommt so beispielsweise nur einen halben Anteil.
        h4 Beispiel
        p Ohne founderShares = 0% founderShares
        p <b>2016</b>: Bob, Alice, und Fred haben zu 100% mitgearbeitet. Jeder bekommt einen Anteil. Insgesamt gibt es am Jahresende 3 Anteile in der Firma. Die Anteile verteilen sich so:
        ul
          li Bob: 1/3 Anteil = 33%
          li Alice: 1/3 Anteil = 33%
          li Fred: 1/3 Anteil = 33%
        p <b>2017</b>: zusätzlich startet nun Ellen mit einer 50% Stelle und Nancy in Vollzeit. Bob, Alice und Fred sind auch weiterhin dabei.
        p Anteile am Jahresende gesamt: 3 (aus 2016) + 4,5 aus 2017 ergibt 7,5 Anteile. Die Anteile verteilen sich nun so:
        ul
          li Bob: 2/7,5 Anteile = 26,6%
          li Alice: 2/7,5 Anteile = 26,6%
          li Fred: 2/7,5 Anteile = 26,6%
          li Ellen (50%): 0,5/7,5 Anteile = 13,3%
          li Nancy: 1/7,5 Anteile = 6,6%

    b-row.my-4.pb-4
      b-col.pt-2(cols="12" md="6")
        h2 Eingabewerte
        p Beim Aufrufen der Demo werden die Initial-Werte aktuell aus einem Default-Datensatz geladen:
        p
          a(href="https://github.com/kommitment/fairshare/blob/master/src/datasets/default.ts" target="_blank") https://github.com/kommitment/fairshare/blob/master/src/datasets/default.ts
        p Alle Werte lassen sich über die Oberfläche anpassen.
      b-col.pt-2(cols="12" md="6")
        h2 Teilen
        b-row
          b-col(cols="4")
            img.img-fluid(src="~assets/img/fairshare-qr-code.png")

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'nuxt-class-component'

@Component({})
export default class Index extends Vue {}
</script>
