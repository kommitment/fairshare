# Warum
FairShair entsteht aus der Idee, ein Simulationsspiel für Firmen und Teilhaber mit möglichst einfachen Regeln zu haben. Dabei sollen folgende Prinzipien gelten:
	
	- die Firma überlebt möglichst lange
	- Unternehmergeist lohnt sich
	- Gründen und Aufbauen lohnt sich 
	- auch für Späteinsteiger lohnt sich der Einstieg
		- (vielleicht, weil das Spiel in Runden stattfindet)

Be a strong dwarf, so that future giants may stay on your shoulders

# Ziele

- persönlich einen guten Jahresabschluss zu machen
- ein gutes Leben zu führen (eventuell über einen guten Ausstieg / Alterssicherung)
- die Firma zum Erfolg bringen (d.h. der eigene Ausstieg beschädigt nicht die Firma)

# Spiel-Ideen

- es gibt Spielrunden (etwa durch Simulation von Jahren)
- es gibt persönliche Zielvereinbarungen (etwa: jährlich: Einkünfte, Firmenziele, Urlaub/Freizeit, persönliche Horizonterweiterungen --> Avatar ausbauen / Profilschärfung)
- möglichst viele Mitspieler finden

# Regeln
Hier einmal die ersten Regeln.

- Anteilseigner müssen zunächst einmal zu 100% mitmachen. Wenn Du mitmachst, dann ganz. Dann sollte es also keine Erlöse außerhalb kommtiment geben. Zumindest keine solchen die in Konkurrenz zu kommitment stehen könnten. Später können sie auch einmal ein Sabattical machen und dann wiederkommen, oder sie können in Rente gehen.
- Die Anteile sollen nur bei Menschen liegen, die bei kommtiment mitmachen
- Jeder Anteilseigner hat gleiches Stimmrecht, Anteile ohne Arbeit in der Firma verlieren Strimmrecht
- Der Wert der Firma ermittelt sich aus dem kommtiment-Anteil des letzten Jahres mal dem Wertfaktur (derzeit 5). 
- die Verteilung des Firmenwertes erfolgt nach den tatsächlich seit Firmengründung eingebrachten kommitment-Anteilen. (Eventuell kommt hier noch ein Entropiefaktor hinzu).
- neue Kommanditisten werden über einen Zeitraum von *Vesting* Jahren (#VJ) aufgenommen, d.h. sie haben #VJ Jahre lang die Möglichkeit, einen Teil von 1/#VJ Arbeitsanteilen an der Firma zu bekommen (TODO: das führte ohne Gehaltsanpassung u.U. zu sehr gut verdienenden Fachkräften im normalerweise niedrigeren Lohnbereich). #VJ, die Anzahl der Vestingjahre sollte bei 3,4 oder 5 Jahren liegen (TODO: Das müssen wir einmal durchsimulieren).
- ?? (5) % Firma bleiben bei den Gründern


#  der Input

In der ersten Version ist Folgender:

- Wertfaktor = Der Wertfaktor sind die Anzahl Jahre, nach denen sich bei gleicher Wirtschaftslage der Firmenwert im Vergleich zu heute verdoppelt hat.
- Periode/Zeitpunkt der Einzahlung / Abrechnung [Datum]
- Betrag der erwirtschaftet wurde
- Personen (die mitgemacht haben und zu welchem Anteil]
	
Beispiel:

	[
	{ 
	Abrechenzeitpunkt : 2016-04-13,
	Eintrag : "1500€",
	Beteiligte : [
		{ Name : "Anke Nehrenberg", Arbeit : "100%" },
		{ Name : "Ralf Wirdemann", Arbeit : "100%" },
		{ Name : "Johannes Mainusch", Arbeit : "100%" }]
	},
	{ 
	Abrechenzeitpunkt : 2016-12-31,
	Eintrag : "99.999€",
	Beteiligte : [
		{ Name : "Anke Nehrenberg", Arbeit : "100%" },
		{ Name : "Ralf Wirdemann", Arbeit : "100%" },
		{ Name : "Johannes Mainusch", Arbeit : "100%" }]
	},
	{ 
	Abrechenzeitpunkt : 2017-12-31, 
	Eintrag : "120.000€",
	Beteiligte : [
		{ Name : "Anke Nehrenberg", Arbeit : "100%" },
		{ Name : "Ralf Wirdemann", Arbeit : "100%" },
		{ Name : "Johannes Mainusch", Arbeit : "100%" }]
	},
	{ 
	Abrechenzeitpunkt : 2018,
	Eintrag : "140.000€",
	Beteiligte : [
		{ Name : "Anke Nehrenberg", Arbeit : "100%" },
		{ Name : "Ralf Wirdemann", Arbeit : "100%" },
		{ Name : "Ben Wiedenmann", Arbeit : "50%" },
		{ Name : "Johannes Mainusch", Arbeit : "100%" }]
	},
	{ 
	Abrechenzeitpunkt : 2018,
	Eintrag : "150.000€",
	Beteiligte : [
		{ Name : "Anke Nehrenberg", Arbeit : "100%" },
		{ Name : "Ralf Wirdemann", Arbeit : "100%" },
		{ Name : "Ben Wiedenmann", Arbeit : "100%" },
		{ Name : "Johannes Mainusch", Arbeit : "100%" }]
	}
	]

	
#  der Output
Das Programm spuckt folgnde Daten aus:

-  Perionde
-  Firmenwert = Eintrag * Wertfaktor 
-  k-Anteilssumme = seit Gründung erbrachte kommitment-Anteile
-  je Person:
	-  Anteilssumme = die seit der Gründung erbrachten kommitment-Anteile (Summe|Perioden (Eintrag*Arbeit))
	-  ProzAnteil = der prozentuale Anteil an kommitment = Anteilssumme / k-Anteilssumme
	-  AnteilAbsolut = der absolute Anteil in € =  ProzAnteil * Firmenwert

	