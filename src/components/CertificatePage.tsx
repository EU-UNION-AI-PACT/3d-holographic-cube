import { useEffect } from 'react'
import { Card } from '@/components/ui/card'

export default function CertificatePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal')
        }
      })
    }, { threshold: 0.1 })

    const cards = document.querySelectorAll('.cert-card')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Card className="cert-card bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl">
          <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Certificate of Recognition
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
              <span>A.d.L. ST. Daniel Curil Indium Red Pohl</span>
              <span>•</span>
              <span>EU-UNION Expert</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-semibold">
                European Commission
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-semibold">
                Detmold · Nordrhein-Westfalen · Deutschland
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-semibold">
                EU-UNION Expert · Verifiziert
              </span>
            </div>
            <p className="text-base leading-relaxed">
              ᚺᛖᚾᛟᛊᛊ ᚨᛗᛒᚨᛋᛋᚨᛞᛟᚱ ᛟᚱᚷᚨᚾᛁᛊᚨᛏᛁᛟᚾ – ערכים (Erekhîm), Creating values, 
              Creando valores, Criando valores, 创造价值 (Chuàngzào jiàzhí), Создание ценностей 
              (Sozdaniye tsennostey), मूल्यों की रचना (Mūlyōṁ kī racanā).
            </p>
            <p className="text-accent italic text-lg">
              "In Harmonia Divitiae — In Harmonie liegt der wahre Reichtum."
            </p>
          </div>
        </Card>

        <Card className="cert-card bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl">
          <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold">🕊️ EU-UNION-COMMISSION | CERTIFICATE OF RECOGNITION</h2>
            <div className="text-sm text-muted-foreground mt-2">
              Reference No.: EX2025D1218310 | D-U-N-S Number: 315676980
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="font-semibold">Issued: 5 August 2025 - Brussels / Strasbourg / Detmold</p>
            <p className="font-semibold">Official EU-UN Summary (English)</p>
            
            <dl className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
              <dt className="text-muted-foreground font-semibold">Name</dt>
              <dd className="font-semibold">Daniel Pohl</dd>
              
              <dt className="text-muted-foreground font-semibold">Official Correspondence Address</dt>
              <dd>Detmold, Germany</dd>
              
              <dt className="text-muted-foreground font-semibold">Position</dt>
              <dd className="text-accent font-semibold">
                EU-UNION Expert for Ethical Innovation, Symbolic Diplomacy & Sovereign Digital Infrastructure
              </dd>
              
              <dt className="text-muted-foreground font-semibold">Recognized by</dt>
              <dd>
                EU-UNION-COMMISSION (<span className="text-accent font-semibold">EX2025D1218310</span>)
              </dd>
            </dl>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Fields of Expertise:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Strategic Technological Innovation</li>
                <li>Interinstitutional Symbol Governance</li>
                <li>Trans-European Ethical Integration</li>
                <li>Peacebuilding through Orbit-Diplomacy</li>
                <li>Decentralized AI Ethics & Blockchain Policy Input</li>
              </ul>
            </div>
            
            <p className="font-semibold">
              Mission: Building bridges between technology, spirituality, and peace.
            </p>
            <p className="font-semibold">
              Founder & CEO of Hnoss | PrismanTHarIOn | StarsLightsMovements.
            </p>
            
            <dl className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
              <dt className="text-muted-foreground font-semibold">Web</dt>
              <dd>
                <a 
                  href="https://europea-un-world-lfx-peace-eu-gov-int.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors break-all"
                >
                  europea-un-world-lfx-peace-eu-gov-int.netlify.app
                </a>
              </dd>
              
              <dt className="text-muted-foreground font-semibold">LinkedIn</dt>
              <dd className="text-primary">holythreekingstreecrowns | holythreekingsacreddanielpohl</dd>
              
              <dt className="text-muted-foreground font-semibold">Email</dt>
              <dd className="text-primary">statesflowwishes@outlook.ie | statesflowwishes@outlook.it</dd>
            </dl>
          </div>
        </Card>

        <Card className="cert-card bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl">
          <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold">🌟 Die Daniel Pohl Chronicles 🌟</h2>
            <div className="text-sm text-muted-foreground mt-2 italic">
              "Eine Reise von Lippstadt zu den Sternen - Visionär, Innovator, Friedensbringer"
            </div>
          </div>
          <div className="p-6 space-y-6">
            <p className="font-semibold">
              Referenznummer: <span className="text-accent">EX2025D1218310</span> | D-U-N-S Nummer: 315676980
            </p>
            
            <div className="p-4 bg-primary/10 border-l-4 border-primary rounded">
              <h4 className="font-semibold text-lg mb-2">📍 Die Ursprungsgeschichte</h4>
              <p>
                Geboren am 6. Januar 1988 in Lippstadt - dem Dreikönigstag, ein Zeichen des Schicksals 
                für einen zukünftigen Wegweiser der Menschheit. Heute in Detmold, nahe dem Hermannsdenkmal, 
                wo Geschichte und Zukunft aufeinandertreffen.
              </p>
            </div>

            <div className="p-4 bg-accent/10 border-l-4 border-accent rounded">
              <h4 className="font-semibold text-lg mb-2">✨ Spirituelle Wurzeln & Berufung</h4>
              <p className="italic mb-3">
                Ich stehe in der Linie der Heiligen Drei Könige, des Sankt Patrick und des 
                Dominikaner-Ordens; meine Taufe zu Ostern 1988 im Bistum Münster markierte den Beginn 
                eines Weges zwischen Glaube, Wissen und Tat.
              </p>
              <p>
                Diese spirituelle Grundlage durchzieht all meine Arbeit - von der Technologie bis zur 
                Diplomatie. Jede Innovation trägt den Samen des Friedens, jede Entscheidung die Weisheit 
                der Jahrhunderte.
              </p>
            </div>

            <div className="p-4 bg-primary/10 border-l-4 border-primary rounded">
              <h4 className="font-semibold text-lg mb-2">🚀 Die Mission: Back2Future - Back2Reality</h4>
              <p className="mb-3">
                Meine Arbeit steht unter dem Zeichen von{' '}
                <span className="text-accent font-semibold">
                  'Back2Future - Back2Reality - StarLightsMovements'
                </span>
                {' '}eine Vision für Menschlichkeit im Zeitalter der Maschinen.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Back2Future:</strong> Alte Weisheit mit neuer Technologie verbinden</li>
                <li><strong>Back2Reality:</strong> Bodenständige Lösungen für reale Probleme</li>
                <li><strong>StarLightsMovements:</strong> Hoffnung und Inspiration für kommende Generationen</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg border-2 border-accent/40">
              <p className="text-xl font-semibold text-accent mb-2">
                D. Pohl (e.Signature) - EU-UNION Expert
              </p>
              <p className="text-lg italic text-primary">
                "Freezy Times - Cool denken, Cloud handeln."
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Zertifiziert am 18. Oktober 2025, 14:09 Uhr MEZ
              </p>
            </div>
          </div>
        </Card>

        <Card className="cert-card bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl">
          <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold">🌍 WTHCOCHTW Recognition Framework</h2>
            <div className="text-sm text-muted-foreground mt-2">
              Worldwide Technology & Harmony Connections Orders / Royals Haven · Trades & Wealths
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="font-semibold">
              EU-UNION-COMMISSION — Recognition Framework
              <br />
              Reference: <span className="text-accent">EX2025D1218310</span>
            </p>
            <p className="text-accent italic text-lg">
              „In Harmonia Divitiae — In Harmonie liegt der wahre Reichtum."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <h3 className="text-lg font-semibold mb-3">Präambel</h3>
                <p className="text-sm">
                  In Anerkennung der fortschreitenden Verschmelzung von Technologie, globaler 
                  Kultur und menschlicher Verantwortung wird mit dem WTHCOCHTW eine neue Sphäre der 
                  Partnerschaft errichtet.
                </p>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                <h3 className="text-lg font-semibold mb-3">Grundprinzipien</h3>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Ethik über Effizienz</li>
                  <li>Kooperation statt Konkurrenz</li>
                  <li>Transparenz als Adel</li>
                  <li>Wissen als Reichtum</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="cert-card bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl">
          <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-2xl font-bold">✨ Ethos & Lichtkodex</h2>
            <div className="text-sm text-muted-foreground mt-2">
              Auszug „Der Kodex meines Geistes"
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="italic text-muted-foreground">
              Ein Bekenntnis zu Licht, Freiheit und Menschlichkeit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                <h3 className="text-lg font-semibold mb-3">Was ich ablehne</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Krieg – denn er löscht das Licht in Kinderaugen</li>
                  <li>• Missgunst & Gier – sie knebeln das Herz</li>
                  <li>• Neid – er zerstört die Schönheit im Selbst</li>
                  <li>• Rache – sie bindet an vergangene Schatten</li>
                </ul>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <h3 className="text-lg font-semibold mb-3">Was ich bejahe</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Entwicklung – Stillstand verrät das innere Feuer</li>
                  <li>• Innovation – schöpferische Kraft des Geistes</li>
                  <li>• Musik – heilt, was Worte nicht erreichen</li>
                  <li>• Spirituelle Wissenschaft & Technologie</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
              <h3 className="text-lg font-semibold mb-3">Der Lebensbaum der 7 Goldenen Sonnen</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-2 bg-accent/20 rounded">☀️ 7 Goldene: Menschlichkeit</div>
                <div className="p-2 bg-accent/20 rounded">☀️ 6 Heilige: Alchemie</div>
                <div className="p-2 bg-accent/20 rounded">☀️ 5: Freiheit</div>
                <div className="p-2 bg-accent/20 rounded">☀️ 4: Mitgefühl</div>
                <div className="p-2 bg-accent/20 rounded">☀️ 3: Gemeinschaft</div>
                <div className="p-2 bg-accent/20 rounded">☀️ 2: Vergebung</div>
                <div className="p-2 bg-accent/20 rounded">☀️ 1: Wahrheit</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        .cert-card {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .cert-card.reveal {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
