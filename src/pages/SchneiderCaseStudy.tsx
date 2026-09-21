import { useEffect, useState } from 'react'
import AnnotatedCard from '../components/case/AnnotatedCard'
import type { Annotation } from '../components/case/AnnotatedCard'
import BeforeAfterSlider from '../components/case/BeforeAfterSlider'
import BriefQuote from '../components/case/BriefQuote'
import DeviceFrame from '../components/case/DeviceFrame'
import ImageSlot from '../components/case/ImageSlot'
import SpokenQuote from '../components/case/SpokenQuote'
import cardAfter from '../card-after.png'
import cardBefore from '../card-before.png'
import compareScreen from '../compare.png'
import { useScrollSpy } from './useScrollSpy'
import './CaseStudy.css'
import './SchneiderCaseStudy.css'

// Drop image paths (from /public) in here as the assets arrive. null renders
// a neutral placeholder panel that holds the layout.
const IMAGES = {
  hero: null as string | null,
  originalCard: cardBefore as string | null,
  redesignedCard: cardAfter as string | null,
  compare: compareScreen as string | null,
}

const SECTIONS = [
  { id: 'overview', rail: 'Overview' },
  { id: 'role', rail: 'My role' },
  { id: 'brief', rail: 'The brief' },
  { id: 'card', rail: 'The card' },
  { id: 'beyond', rail: 'Beyond the card' },
  { id: 'no-ai', rail: 'Saying no to AI' },
  { id: 'feedback', rail: 'What we heard back' },
  { id: 'reflections', rail: 'Reflections' },
] as const

const SECTION_IDS = SECTIONS.map((section) => section.id)

const CARD_CHANGES: Annotation[] = [
  {
    title: 'Answer the first question first.',
    body: 'The original led with a price in a grey sidebar, with nothing saying whether $477 was the total or a rate. The redesign puts the total at the top in a full-width band, labeled as a total, with per-mile rate, distance and weight directly beneath.',
    x: 52,
    y: 7,
  },
  {
    title: 'Empty miles belong next to the pay.',
    body: 'Deadhead was buried as small grey text inside the route, one figure under the pickup and another under the drop. Deadhead is unpaid driving, so it now sits in one of three equal-weight tiles beside loaded and total rate per mile.',
    x: 93,
    y: 31,
  },
  {
    title: 'Is it still there?',
    body: 'We heard it plainly: "No updates on if a load gets taken, it just vanishes. Save something and on the next check it\'s just gone." Every card now shows whether the load is available and how long ago it was posted. A saved load that\'s been taken no longer disappears. It stays, turns fully grey, and is marked unavailable. On a small screen a colored tag alone is easy to miss, so the whole card changes.',
    x: 95,
    y: 5,
  },
  {
    title: 'Read it in the order you decide.',
    body: 'The original split numbers on the left and route on the right, so the eye zigzagged across the card. The redesign is one column: price, key numbers, route, action.',
    x: 8,
    y: 60,
  },
  {
    title: 'A clear next step.',
    body: 'The original offered Reload and an eye icon, with no way to book from the card. The redesign has a primary Book Now, a secondary Reload, and a bookmark in place of the eye, so saving is unmistakable.',
    x: 50,
    y: 91.5,
  },
  {
    title: 'Less to parse.',
    body: 'Pickup and drop windows went from two bold lines with weekdays to one line each. Shipper and consignee got labels. The unexplained red warning corner is gone, replaced by a named status badge.',
    x: 44,
    y: 56,
  },
]

// Marks the sticky rail as sitting over a dark section while one is in the
// band of the viewport where the rail lives (its sticky offset, 128px).
function useRailOnDark() {
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-rail-theme="dark"]')
    if (targets.length === 0) return

    let observer: IntersectionObserver | undefined

    const connect = () => {
      observer?.disconnect()
      const visible = new Set<Element>()
      const bottom = Math.max(0, window.innerHeight - 256)
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target)
            else visible.delete(entry.target)
          }
          setOnDark(visible.size > 0)
        },
        { rootMargin: `-128px 0px -${bottom}px 0px`, threshold: 0 },
      )
      targets.forEach((target) => observer?.observe(target))
    }

    connect()
    window.addEventListener('resize', connect)
    return () => {
      window.removeEventListener('resize', connect)
      observer?.disconnect()
    }
  }, [])

  return onDark
}

function SchneiderCaseStudy() {
  const activeId = useScrollSpy(SECTION_IDS)
  const railOnDark = useRailOnDark()

  return (
    <main className="case-study cs-schneider">
      <header className="case-study__hero" data-nav-theme="light">
        <div className="case-study__hero-inner">
          <p className="case-study__kicker">Case study</p>
          <h1 className="case-study__title">Schneider FreightPower Owner Operator App</h1>
        </div>
      </header>

      <div className="case-study__layout">
        <article className="case-study__content">
          <section id="overview" className="case-study__section">
            <div className="cs-hero-visual">
              <DeviceFrame
                src={IMAGES.hero}
                alt="The final load board in dark mode, shown on a phone"
              />
            </div>
            <h2>Drivers were doing the app's job</h2>
            <p className="cs-meta">Schneider · Capstone collaboration · 7 weeks</p>
            <dl className="cs-facts">
              <div>
                <dt>Role</dt>
                <dd>UX designer, UX researcher, frontend developer</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>4 Developers, 1 Data Engineer, 1 UX Designer</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Figma, React, Jira</dd>
              </div>
            </dl>
            <div className="cs-prose">
              <p>
                Owner-operators run their businesses from the truck, and on FreightPower they were
                doing most of the work themselves. Retyping the same rate and distance into every
                search. Holding one load's numbers in their head while checking another. Piecing
                together the trip home one search at a time. Working out tolls somewhere outside the
                app. And checking back on a saved load to find it simply gone. Every one of those
                minutes was a minute not earning.
              </p>
              <p>
                My team and I spent seven weeks rebuilding how they find, weigh and book loads, so
                the app does that work instead.
              </p>
            </div>
          </section>

          <section id="role" className="case-study__section">
            <h2>Where I sat on the team</h2>
            <div className="cs-prose">
              <p>
                I was the only designer on a team of six, alongside four developers and a data
                engineer. I ran the research, designed and prototyped the product, and proposed two
                of the features that ended up defining it: side-by-side load comparison and a
                multi-stop route map.
              </p>
              <p>
                Because I also write React, I didn't hand off a file and wait. I built the
                comparison feature, the home page and the preferences flow, and implemented dark
                mode across every screen.
              </p>
              <p>
                Screens built in parallel by different people don't naturally agree with each other.
                After the first build round, I went back through the whole app and rebuilt its
                structure around one consistent hierarchy, so it read as a single product rather
                than a set of pages. The design system wasn't a Figma file someone else interpreted.
                I was the one making the components agree.
              </p>
            </div>
          </section>

          <section id="brief" className="case-study__section">
            <h2>Three sentences that became the brief</h2>
            <div className="cs-prose">
              <p>
                I started with interviews, a hands-on audit of the existing platform, and a look at
                how competing load boards handle fast, high-stakes decisions. Three things people
                said ended up shaping almost every decision that followed.
              </p>
            </div>
            <div className="brief-quotes">
              <BriefQuote
                id="quote-1"
                quote={
                  '"Takes too long to put in what I want, the rate, distance and what not, and then go through lists on lists to find a load I can work with."'
                }
                problem="Every search started from zero, and the numbers that decide a load were hard to pick out."
                became="Saved preferences, recommended loads, and a rebuilt load card."
              />
              <BriefQuote
                id="quote-2"
                quote={
                  '"Have to remember information to compare loads. There isn\'t anything reliable and quick."'
                }
                problem="Weighing two loads meant holding one in your head while looking at the other."
                became="Side-by-side comparison."
              />
              <BriefQuote
                id="quote-3"
                quote={'"Say going from Chicago to Ohio, they\'ll want to pick up stuff on their way home."'}
                problem="Drivers plan trips, but the app only understood single loads."
                became="Multi-load booking on a route map."
              />
            </div>
          </section>

          <section id="card" className="case-study__section">
            <h2>The card is the product</h2>
            <div className="cs-prose">
              <p>
                A driver doesn't experience FreightPower as a platform. They experience it as a
                scroll of load cards, deciding on each one in a few seconds. Every decision happens
                on the card, so that's where most of the work had to land.
              </p>
            </div>
            <div className="cs-figure cs-figure--slider">
              <BeforeAfterSlider
                before={IMAGES.originalCard}
                after={IMAGES.redesignedCard}
                beforeAlt="The original load card"
                afterAlt="The redesigned load card"
                beforeLabel="Original"
                afterLabel="Redesign"
                ratio="560 / 602"
              />
            </div>
            <AnnotatedCard
              src={IMAGES.redesignedCard}
              alt="The redesigned load card"
              ratio="524 / 670"
              items={CARD_CHANGES}
            />
          </section>

          <section id="beyond" className="case-study__section">
            <h2>Four bets beyond the card</h2>
            <div className="cs-prose">
              <p>
                I call these bets because that's what they were: decisions made under uncertainty,
                each aimed at a problem drivers described.
              </p>
              <p>
                <strong>Recommended loads.</strong> Drivers were typing the same rate, distance and
                lane criteria into every search. I moved that into saved preferences and let the app
                surface matches, so searching becomes the exception rather than the starting point.
                Every recommendation carries one line explaining why it's there, like "near your
                last delivery" or "pays above standard," so the logic is never a black box.
              </p>
              <p>
                <strong>Side-by-side comparison.</strong> Drivers were memorizing numbers across
                screens because the product gave them nowhere to put them. Comparison lets them pin
                a few loads and see them together without leaving the flow they're in.
              </p>
            </div>
            <div className="cs-figure cs-figure--tall">
              <ImageSlot
                src={IMAGES.compare}
                alt="The compare screen: Load A and Load B side by side, with a Quicklook table below"
                ratio="804 / 1282"
              />
            </div>
            <div className="cs-prose">
              <p>
                <strong>Multi-load booking with a route map.</strong> Drivers think in trips, not
                single loads. I proposed booking loads in sequence against a map of the whole route,
                so "Chicago to Ohio and something on the way back" becomes one plan instead of three
                separate searches. One of our developers built the multi route search and map. A
                toggle lets drivers avoid or minimize toll roads, answering another complaint we
                heard: "Don't want to figure how much will be spent on tolls and stuff outside the
                app. Why can't it all be in one?"
              </p>
              <p>
                <strong>Dark mode.</strong> Drivers use this platform on the road at every hour of
                the day. I implemented a dark theme across the entire app.
              </p>
            </div>
          </section>

          <section
            id="no-ai"
            className="case-study__section cs-turning"
            data-nav-theme="light"
            data-rail-theme="dark"
          >
            <div className="cs-turning__inner">
              <h2>The feature we talked ourselves out of</h2>
              <div className="cs-prose">
                <p>
                  AI was the obvious move, and it was on the table early. An AI assistant the driver
                  could ask for loads would have made an easy demo.
                </p>
                <p>
                  Then we spoke with Schneider's business representatives, the people drivers call
                  when something goes wrong. Their read was blunt: drivers want a simple platform
                  where things are easy to find. They don't want to talk to an agent.
                </p>
                <p>
                  So we dropped it. Recommendations come from preferences drivers set themselves,
                  and each one says why it was chosen. Predictable, transparent, and entirely under
                  their control. It's a less impressive demo and a better product.
                </p>
              </div>
            </div>
          </section>

          <section id="feedback" className="case-study__section">
            <h2>From the people who hear every complaint</h2>
            <div className="cs-prose">
              <p>
                We didn't get to test with drivers before handoff. What we did get was a second
                round with Schneider's BOAs and BORs, the business representatives who field driver
                complaints and walk them through problems every day.
              </p>
            </div>
            <SpokenQuote
              speaker="girl"
              quote={'"Search feels so much more straightforward than what drivers currently use."'}
            />
            <SpokenQuote
              speaker="guy"
              quote={
                '"I like how you can compare loads without switching between screens to remember the information."'
              }
              echo={{ href: '#quote-2', label: 'Echoes the brief' }}
            />
            <div className="cs-prose cs-prose--after-quote">
              <p>
                That second comment is close to word for word the problem described in the first
                round. It was the clearest sign the comparison feature was aimed at the right thing.
              </p>
              <p>We handed the work to Schneider's team, and their feedback was positive.</p>
            </div>
          </section>

          <section id="reflections" className="case-study__section">
            <h2>What I'm taking with me</h2>
            <div className="cs-prose">
              <p>
                Looking back, the decision I'd defend hardest is one that never shipped. Dropping
                the AI assistant made for a simpler product, but it came from listening to the
                people who hear every driver complaint. Sometimes the most useful thing a designer
                brings is the case for leaving something out.
              </p>
              <p>
                What I'd do differently is how close we got to the person in the truck. Everything
                we validated came through the people who represent drivers: informed, close to the
                problem, but still not the person in the truck. I'd trade a week of polish for five
                sessions with owner-operators.
              </p>
            </div>
          </section>
        </article>

        <nav
          className={`case-study__rail${railOnDark ? ' case-study__rail--on-dark' : ''}`}
          aria-label="Sections in this case study"
        >
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={activeId === section.id ? 'is-active' : undefined}
                >
                  {section.rail}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}

export default SchneiderCaseStudy
