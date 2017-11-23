# Warum
FairShair entsteht aus der Idee, ein Simulationsspiel für Firmen und Teilhaber mit möglichst einfachen Regeln zu haben. Dabei sollen folgende Ziele erreicht werden: 

	- die Firma überlebt möglichst lange
	- Unternehmergeist lohnt sich
	- Gründen und Aufbauen lohnt sich 
	- auch für Späteinsteiger lohnt sich der Einstieg

Be a strong dwarf, so that future giants may stay on your shoulders

# Regeln
Hier einmal die ersten Regeln.

- Anteilseigner müssen zunächst einmal zu 100% mitmachen. Wenn Du mitmachst, dann ganz. Dann sollte es also keine Erlöse außerhalb kommtiment geben. Zumindest keine solchen die in Konkurrenz zu kommitment stehen könnten. Später können sie auch einmal ein Sabattical machen und dann wiederkommen, oder sie können in Rente gehen.
- Die Anteile sollen nur bei Menschen liegen, die bei kommtiment mitmachen
- Jeder Anteilseigner hat gleiches Stimmrecht, Anteile ohne Arbeit in der Firma verlieren Strimmrecht.
- Der Wert der Firma ermittelt sich aus dem kommtiment-Anteil des letzten Jahres mal dem Wertfaktur (derzeit 5). 
- die Verteilung des Firmenwertes erfolgt nach den tatsächlich seit Firmengründung eingebrachten kommitment-Anteilen. (Eventuell kommt hier noch ein Entropiefaktor hinzu).
- neue Kommanditisten werden über einen Zeitraum von *Vesting* Jahren (#VJ) aufgenommen, d.h. sie haben #VJ Jahre lang die Möglichkeit, einen Teil von 1/#VJ Arbeitsanteilen an der Firma zu bekommen (TODO: das führte ohne Gehaltsanpassung u.U. zu sehr gut verdienenden Fachkräften im normalerweise niedrigeren Lohnbereich). #VJ, die Anzahl der Vestingjahre sollte bei 3,4 oder 5 Jahren liegen (TODO: Das müssen wir einmal durchsimulieren).
- ?? (5) % Firma bleiben bei den Gründern und werden nie verteilt --> *founderShares*

# Ablauf
1. Am Ende einer Periode (eines Geschäftsjahres) wird ermittelt, wer zu wie vielen Teilen mitgearbeitet hat (und wer in Rente ist oder ein Sabbatical gemacht hat). Für Personen, die noch im Vesting sind, wird der Vesting*Arbeits-Prozentsatz  ermittelt. Die Summe der Personen * Arbeitsanteil * Vesting ergibt die gesamte in diesem Jahr gevestete Arbeitskraft (*VestedKapa*).
2. Der Gewinn der Firma wird ermittelt.
3. Die neue Anteilsverteilung wird ermittelt. Dazu erhält jeder, der in der Periode mitgearbeitet hat, eine Anzahl von Punkten, die dem Gewinn der Firma mal seinem  Vesting*Arbeits-Prozentsatz geteilt durch *VestedKapa*. Diese Punkte werden zu den Punkten aus vergangenen Perioden hinzugezählt.
4. Daraus ergibt sich für alle Personen der neuen Anteil an der Firma, abzüglich eventuell einbehaltener founderShares.
5. Der Jahresgewinn der Firma wird entsprechend der Anteile verteilt. 


# getting started
Fairshare ist ein Programm, dass komplett im Browser läuft (js + d3). Einfach auschecken und fairShare.html öffnen.

#  der Input

In der ersten Version ist Folgender:

auf der Webseite (fairShare.html) im Formular:
vesting duration[years]: 4

vesting is the numer of years that someone new has to wait, until he/she gets the same distribution as someone, who has been in the company longer. Each year a newcomer will get 1/vestingDuration more shares (until 100%). So, if vestingduration is 4, then each year the newcomer gets 25% more shares at the end of the year... 
companyValueFactor[years]: 5? 

founders keep [%] shares(5?): 
This is the share, that a founder will not give up in the distribution process. 



In data/szenario3.js:
- Periode/Zeitpunkt der Einzahlung / Abrechnung [Datum]
- Betrag der erwirtschaftet wurde (Eintrag)
- Personen (die mitgemacht haben und zu welchem Anteil]
	
Beispiel:

	var data = [
		{
		Abrechenzeitpunkt: "2016-12-31",
		Contribution: "97000",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
	},
	{
		Abrechenzeitpunkt: "2017-12-31",
		Contribution: "120000",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
	},
	{
		Abrechenzeitpunkt: "2018",
		Contribution: "140000",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Ben W.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
	}
	, {
		Abrechenzeitpunkt: "2019",
		Contribution: "170000	",
		kommanditisten: [
			{ Name: "Anke N.", Arbeit: "100%" },
			{ Name: "Ralf W.", Arbeit: "100%" },
			{ Name: "Ben W.", Arbeit: "100%" },
			{ Name: "Katja R.", Arbeit: "100%" },
			{ Name: "Johannes M.", Arbeit: "100%" }]
		}
	]

	
#  der Output
Das Programm spuckt folgende Daten aus:

- Abrechenzeitpunkt: ein Zeitpunkt	
- k-Contribution / Ausschüttung: Erlös der Firma
- k-value: Wert der Firma (und ein paar Checksummen)
- k-ContributionSum: die Summe aller Anteilspunkte
- vestedKapa: wie viele Personen haben in dieser Periode mitgemacht
-  je Person:
	- bei Gründern der Anteil der Firma, die nicht umverteilt wird
	- Vesting: 
	- Arbeit: zu wieviel Prozent hat die Person in diesem Jahr gearbeitet.
	- Contribution: Der Anteil in dieser Periode am Firmenerlös.
	-  Anteilssumme = die seit der Gründung erbrachten kommitment-Anteile (Summe|Perioden (Eintrag*Arbeit))
	-  ProzAnteil = der prozentuale Anteil an kommitment = Anteilssumme / k-Anteilssumme
	-  AnteilAbsolut = der absolute Anteil in € =  ProzAnteil * Firmenwert
	- die sich in dieser Periode ergebende Ausschüttung

	
# weitere nocht nicht implementierte Spiel-Ideen
- es gibt Spielrunden (etwa durch Simulation von Jahren)
- es gibt persönliche Zielvereinbarungen (etwa: jährlich: Einkünfte, Firmenziele, Urlaub/Freizeit, persönliche Horizonterweiterungen --> Avatar ausbauen / Profilschärfung)
- möglichst viele Mitspieler finden
