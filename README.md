# fairShare - einfach fairteilen
(Zur Vereinfachung wurde im Vergleich zu vorhergehenden Versionen  das *Vesting* ausgebaut und ebenso die Kopplung der ausgegebenen fairShares and den jährlichen Umsatz)

![](img/fairShare.png)

FairShare entsteht aus der Idee, eine Simulation zur Verteilung der Anteile einer Firma (im weiteren *die Firma* genannt) mit möglichst einfachen Regeln zu haben. Dabei sollen folgende Ziele erreicht werden:

	- Anteile der Firma verteilen sich mit der Zeit auf alle, die mitmachen
	- die Firma überlebt möglichst lange
	- Unternehmergeist lohnt sich
	- Gründen und Aufbauen lohnt sich
	- auch für Späteinsteiger lohnt sich der Einstieg

Bei fairShare geht es um die Verteilung der Anteile eines Unternehmens. Wie am Jahresende Gewinne verteilt werden, beantwortet fairshare nicht, das gehört in einen Gesellschaftervertrag.

# Demo
[see how it works: fairShare.html](https://kommitment.github.io/fairshare/fairShare.html)

# Regeln

1. ___fairShares___: Jede Jahr wird jeder Person, die mitgemacht haben ein Anteil ausgegeben. Hat jemand nur Teilzeit mitgemacht, so wird nur der entsprechende Teil eines fairShares ausgegeben.

2. Faktor ___Arbeit___: sagt aus, zu wie viel Prozent die Person in diesem Jahr mitgearbeitet hat. Wenn jemand in einem Jahr nicht mitmacht oder in Rente gegangen ist, so wird sein Faktor *Arbeit* auf Null gesetzt, d.h. sie/er bekommt in dem laufenden Jahr keine neuen Anteile, behält jedoch die Anteile aus dem Vorjahr.

3. ___founderShares___: Insgesamt xx% der Firma bleiben zu jeweils gleichen Teilen bei den Gründern und werden nie verteilt.

4. ___Rückkauf___ von Anteilen:
Sollte *die Firma* Anteile eines Anteilseigners zurückkaufen, so gehen die zugehörigen Fairshares nach dem Rückkauf unter.


# Ablauf
Am Ende einer Periode (eines Geschäftsjahres) wird ermittelt, wer zu wie vielen Teilen mitgearbeitet hat (und wer in Rente ist oder ein Sabbatical gemacht hat). Jeder Teilhaber, der mitgearbeitet hat bekommt einen Anteil entsprechend seiner Mitarbeit. Jemand der nur eine halbe Stelle hat, bekommt so beispielsweise nur einen halben Anteil

Beispiel (ohne founderShares = 0% founderShares):
2016: Bob, Alice, und Fred haben zu 100% mitgearbeitet. Jeder bekommt einen Anteil. Insgesamt gibt es am Jahresende 3 Anteile in der Firma. Die Anteile verteilen sich so:
- Bob: 1/3 Anteil = 33%
- Alice: 1/3 Anteil = 33%
- Fred: 1/3 Anteil = 33%
2017: zusätzlich startet nun Ellen mit einer 50% Stelle und Nancy in Vollzeit. Bob, Alice und Fred sind auch weiterhin dabei.
Anteile am Jahresende gesamt: 3 (aus 2016) + 4,5 aus 2017 ergibt 7,5 Anteile. Die Anteile verteilen sich nun so:
- Bob: 2/7,5 Anteile = 26,6%
- Alice: 2/7,5 Anteile = 26,6%
- Fred: 2/7,5 Anteile = 26,6%
- Ellen (50%): 0,5/7,5 Anteile = 13,3%
- Nancy: 1/7,5 Anteile = 6,6%


# getting started
fairShare ist ein Programm, dass komplett im Browser läuft (js + d3). Einfach auschecken und fairShare.html öffnen.

# der Input

Auf der Webseite (fairShare.html) im Formular:

founderShares [%] shares(6,5?):
Das ist der Prozentsatz der Anteile, den die Gründer der ersten Periode behalten und nicht in die Verteilung geben.

In data/szenario2017-01.js:
- Periode/Zeitpunkt der Einzahlung / Abrechnung [Datum]
- Betrag der erwirtschaftet wurde (Eintrag)
- Personen (die mitgemacht haben und zu welchem Anteil]

Beispiel:

	var data = [
		{
		Abrechenzeitpunkt: "2016-12-31",
		Contribution: "324149.68",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
	},
	{
		Abrechenzeitpunkt: "2017-12-31",
		Contribution: "547152.82",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
	},
	{
		Abrechenzeitpunkt: "2018",
		Contribution: "600000",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%", returning: "100%" },
			{ Name: "Ben W.", Arbeit: "100%" },
			{ Name: "Katja R.", Arbeit: "25%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
	}
	, {
		Abrechenzeitpunkt: "2019",
		Contribution: "600000	",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Ben W.", Arbeit: "100%" },
			{ Name: "Katja R.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
		}
	]


#  der Output
Beispiel hier: https://krukas.dyn.amicdns.de/fairShare/fairShair.html?vestingDuration=3&companyValueFactor=5&foundersShares=7&switch=develop&dataFile=szenario04.js#

Das Programm spuckt folgende Daten aus:

- Abrechenzeitpunkt: ein Zeitpunkt
- k-Contribution / Ausschüttung: Erlös der Firma
- k-ContributionSum: die Summe aller Anteilspunkte
- Sum*Arbeit: wie viele Personen haben in dieser Periode  mitgemacht
-  je Person:
	- bei Gründern der Anteil der Firma, die nicht umverteilt wird
	- Arbeit: zu wieviel Prozent hat die Person in diesem Jahr gearbeitet.
	- Contribution: Der Anteil in dieser Periode am Firmenerlös.
	-  fairShares = die seit der Gründung erbrachten *die Firma*-Anteile (Summe|Perioden (Eintrag___Arbeit))
	-  ProzAnteil = der prozentuale Anteil an *die Firma* = Anteilssumme / k-Anteilssumme

# QR-Code to share
![](img/QR-code-fairshare.jpg)
