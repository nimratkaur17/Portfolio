import BeforeAfterSlider from '../components/case/BeforeAfterSlider'
import ColorFloralScrollDemo from '../components/wcv/ColorFloralScrollDemo'
import DashboardEvidence from '../components/wcv/DashboardEvidence'
import ImpactStatsBand from '../components/wcv/ImpactStatsBand'
import LaptopFrame from '../components/wcv/LaptopFrame'
import type { PageNote } from '../components/wcv/OldPageNotes'
import OldPageNotes from '../components/wcv/OldPageNotes'
import SkimBeforeAfter from '../components/wcv/SkimBeforeAfter'
import StorySpotlight from '../components/wcv/StorySpotlight'
import TurnoutExtraction from '../components/wcv/TurnoutExtraction'
import UsabilityStatCards from '../components/wcv/UsabilityStatCards'
import buttonsAnalytics from '../buttons-analytics.png'
import impactNumbers from '../impact-numbers.png'
import note1 from '../note1.png'
import note2 from '../note2.png'
import note3 from '../note3.png'
import note5 from '../note5.png'
import oldDesign1 from '../old-design1.png'
import oldDesign2 from '../old-design2.png'
import votingAnalytics from '../voting-analytics.png'
import { useRailOnDark } from './useRailOnDark'
import { useScrollSpy } from './useScrollSpy'
import './CaseStudy.css'
import './WisconsinCaseStudy.css'

// Drop image paths (from /public or a local import) in here as the assets
// arrive. null renders a neutral placeholder panel that holds the layout.
const IMAGES = {
  hero: null as string | null,
  pageviewsChart: votingAnalytics as string | null,
  conversionChart: buttonsAnalytics as string | null,
  oldPage1: oldDesign1 as string | null,
  oldPage2: oldDesign2 as string | null,
  // The old page's actions sidebar. No screenshot of the redesigned
  // "Connect with Us" band exists yet, so the slider's after side is a
  // placeholder until that arrives.
  nextStepBefore: oldDesign2 as string | null,
  nextStepAfter: null as string | null,
  turnoutGraphic: impactNumbers as string | null,
  spotlightPhotos: [null, null, null, null] as (string | null)[],
}

const SECTIONS = [
  { id: 'overview', rail: 'Overview' },
  { id: 'data', rail: 'The data' },
  { id: 'next-step', rail: 'The next step' },
  { id: 'numbers', rail: 'The numbers' },
  { id: 'skim', rail: 'Built to skim' },
  { id: 'color', rail: 'Color and florals' },
  { id: 'test', rail: 'The test' },
  { id: 'reflections', rail: 'Reflections' },
] as const

const SECTION_IDS = SECTIONS.map((section) => section.id)

const PAGE_NOTES: PageNote[] = [
  {
    id: 'dense',
    label: 'Text too dense to scan.',
    page: 0,
    x: 50,
    y: 30,
    noteImage: note5,
  },
  {
    id: 'light',
    label: 'Type too light to read.',
    page: 1,
    x: 30,
    y: 8,
    noteImage: note2,
  },
  {
    id: 'actions',
    label: "Actions that didn't look like actions.",
    page: 1,
    x: 18,
    y: 30,
    noteImage: note3,
  },
  {
    id: 'evidence',
    label: "The page's strongest evidence sat inside paragraphs, where nobody skimming would ever find it.",
    page: 1,
    x: 60,
    y: 92,
    noteImage: note1,
  },
]

function WisconsinCaseStudy() {
  const activeId = useScrollSpy(SECTION_IDS)
  const railOnDark = useRailOnDark()

  return (
    <main className="case-study cs-wcv">
      <header className="case-study__hero" data-nav-theme="light">
        <div className="case-study__hero-inner">
          <p className="case-study__kicker">Case study</p>
          <h1 className="case-study__title">Wisconsin Conservation Voices, Native Vote</h1>
        </div>
      </header>

      <div className="case-study__layout">
        <article className="case-study__content">
          <section id="overview" className="case-study__section">
            <div className="cs-hero-visual">
              <LaptopFrame src={IMAGES.hero} alt="The redesigned Native Vote page" />
            </div>
            <h2>Most people had two minutes</h2>
            <p className="cs-meta">Design Interactive cohort · 7 weeks · 8 designers</p>
            <dl className="cs-facts">
              <div>
                <dt>Role</dt>
                <dd>UX designer, UX researcher</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>Figma, Squarespace</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Web design, UX research, usability testing</dd>
              </div>
            </dl>
            <div className="cs-prose">
              <p>
                Wisconsin Conservation Voices runs Wisconsin Native Vote, a nonpartisan program
                that helps Native communities across the state register and vote. Its website sits
                at around 500 visits a month most of the year, then climbs to nearly 4,000 in
                October. People arrive when an election is close, and they stay about two minutes.
              </p>
              <p>
                That's the window. Someone lands needing to know where to vote or what documents to
                bring, and the page has two minutes to get them there.
              </p>
              <p>
                The information was all on the site. It was buried in long paragraphs, flat
                infographic images too small to read, and actions tucked into a side column. We
                split the work across the cohort, and the Native Vote page was mine.
              </p>
            </div>
          </section>

          <section id="data" className="case-study__section">
            <h2>What a year of clicks told us</h2>
            <div className="cs-prose">
              <p>
                Before changing anything, we went through a year of the site's Squarespace
                analytics. Two numbers decided most of what came next.
              </p>
              <p>
                <strong>Voting Info is the front door, and the exit.</strong> It drew 5,212 views,
                more than twice any other page. People spent about two minutes there, and nine in
                ten left without going anywhere else.
              </p>
              <p>
                <strong>A pop-up beat the page's own buttons.</strong> Register to Vote was seen by
                4,885 people and clicked by 59, a rate of 1.0%. The Pledge to Vote pop-up, asking
                for something similar, converted at 3.0%. People weren't uninterested. The page's
                own buttons just weren't doing the work.
              </p>
            </div>

            <DashboardEvidence
              items={[
                {
                  src: IMAGES.pageviewsChart,
                  alt: 'Squarespace top pageviews by page, with Voting Info far ahead of every other page',
                  caption: 'Top pageviews by page',
                  ratio: '1576 / 1028',
                  annotation: { label: '5,212 views, Voting Info', x: 10, y: 34 },
                },
                {
                  src: IMAGES.conversionChart,
                  alt: 'Squarespace button conversions by button, with the Pledge to Vote pop-up ahead of Register to Vote',
                  caption: 'Button conversions by button',
                  ratio: '1572 / 1028',
                  annotation: { label: '3.0% vs 1.0%', x: 84, y: 86 },
                },
              ]}
            />

            <div className="cs-prose cs-prose--after-figure">
              <p>
                The numbers showed where people struggled. To find out why, we annotated every
                section of the old pages against the same four questions: what's the message, who
                is it for, what should they do next, and what are we assuming?
              </p>
              <p>
                The answers kept landing in the same places. Text too dense to scan. Type too light
                to read. Actions that didn't look like actions. And the page's strongest evidence
                sitting inside paragraphs, where nobody skimming would ever find it.
              </p>
            </div>

            <OldPageNotes
              pages={[
                { src: IMAGES.oldPage1, alt: 'The old Voting Info page' },
                { src: IMAGES.oldPage2, alt: 'The old Native Vote page' },
              ]}
              notes={PAGE_NOTES}
            />
          </section>

          <section id="next-step" className="case-study__section">
            <h2>Make the next step impossible to miss</h2>
            <div className="cs-prose">
              <p>
                The analytics said people act when the action is obvious. The old page hid its
                actions in a narrow left column, underneath a paragraph about who to email. Links
                to a governor's proclamation and a thank you letter sat mid sentence, in the middle
                of a block of text.
              </p>
              <p>
                I gave the actions a band of their own: a full-width blue section, "Connect with
                Us", with donate, contact and follow side by side. The documents became buttons on
                their own lines instead of links inside a paragraph.
              </p>
              <p>
                The old footer was an address and one button. The new one is three columns, About,
                Get in Touch and Take Action, so even someone who scrolls straight to the bottom
                lands on a next step.
              </p>
            </div>

            <div className="wcv-slider">
              <BeforeAfterSlider
                before={IMAGES.nextStepBefore}
                after={IMAGES.nextStepAfter}
                beforeAlt="The old Native Vote page, with its actions in a narrow sidebar"
                afterAlt="The redesigned Native Vote page, with a full-width Connect with Us band"
                beforeLabel="Original"
                afterLabel="Redesign"
                ratio="1146 / 1084"
              />
            </div>
          </section>

          <section id="numbers" className="case-study__section">
            <h2>The proof was hiding in the paragraphs</h2>
            <div className="cs-prose">
              <p>
                Turnout rose in every tribal community Native Vote worked in. The program reached
                23,000 households and knocked on 4,500 doors.
              </p>
              <p>
                On the old page you would never know. The turnout figures were written into
                sentences. The two infographics were flat images dropped into a narrow column, at a
                size that made them close to unreadable. The strongest argument on the page was
                also the hardest part to see.
              </p>
            </div>

            <TurnoutExtraction graphic={IMAGES.turnoutGraphic} />

            <div className="wcv-band" data-nav-theme="light" data-rail-theme="dark">
              <div className="wcv-band__inner">
                <ImpactStatsBand
                  heading="Our Impact in Numbers"
                  stats={[
                    { value: 23000, label: 'Households reached' },
                    { value: 4500, label: 'Doors knocked' },
                  ]}
                />
              </div>
            </div>

            <div className="cs-prose cs-prose--after-figure">
              <p>
                I pulled all of it out. Turnout became a map of Wisconsin with a circle over each
                community, sized to its increase, alongside the figures as a list you can read at a
                glance. The program's totals became "Our Impact in Numbers", a full-width red band
                with eight figures set large enough to read from across the room.
              </p>
              <p>
                The story underneath the numbers got the same treatment. The account of Chief
                Robert Buffalo casting his ballot had been four paragraphs deep in the text. It's
                now a Story Spotlight with its own frame and its own question as a subheading, next
                to a carousel of photographs from the community.
              </p>
            </div>

            <StorySpotlight
              body="The account of Chief Robert Buffalo casting his ballot, told in his own words."
              photos={IMAGES.spotlightPhotos}
            />
          </section>

          <section id="skim" className="case-study__section">
            <h2>Less wall, more path</h2>
            <div className="cs-prose">
              <p>Two minutes means most people skim. The old page asked them to read instead.</p>
              <p>
                Five YouTube embeds ran down the page in an uneven grid, each one competing with the
                next. I kept one, and replaced the rest with a single button to the channel. Long
                blocks of text were broken into shorter sections with headings worth scanning, and
                on Voting Info, detail moved into accordions so it's there for anyone who wants it
                without standing between everyone else and the next thing.
              </p>
              <p>
                Low contrast was a recurring complaint about the old site, so text and background
                pairings in the redesign were checked against WCAG contrast guidance.
              </p>
            </div>

            <SkimBeforeAfter />
          </section>

          <section id="color" className="case-study__section">
            <h2>Color as a way of knowing where you are</h2>
            <div className="cs-prose">
              <p>
                The old page was blue headings on white, top to bottom. Nothing told you that you
                had moved from one idea to another.
              </p>
              <p>
                The redesign runs in full-width bands: blue where you connect, red for the impact
                numbers, dark behind Looking Forward, white for the government partnership. Between
                them, yellow accent illustrations inspired by Ojibwe floral art carry the rhythm and
                a sense of the communities the program serves.
              </p>
            </div>

            <ColorFloralScrollDemo />
          </section>

          <section id="test" className="case-study__section">
            <h2>Two sites, one set of tasks</h2>
            <div className="cs-prose">
              <p>
                We tested the redesign against the live site. The program exists for Native voters
                in Wisconsin, so we recruited through Tribal Libraries, Archives &amp; Museums and
                our own networks, to make sure the feedback reflected the people the site is for.
              </p>
              <p>
                Each participant was randomly assigned one version. They completed three real
                tasks, with optional screen recordings to confirm whether they succeeded, then rated
                the site on the System Usability Scale.
              </p>
            </div>

            <UsabilityStatCards />

            <div className="cs-prose cs-prose--after-figure">
              <p>
                On the old site, testers described sections as text-dense and hard to read against
                their backgrounds. Neither came up for the redesign.
              </p>
              <p>
                We handed WCV the designs and a set of implementation guidelines for Squarespace.
                Their team built it, and it's the Native Vote page today.
              </p>
            </div>

            {/* TODO: point this at the live Native Vote page once the URL is confirmed. */}
            <a className="wcv-live-link" href="#">
              View the live Native Vote page
            </a>
          </section>

          <section id="reflections" className="case-study__section">
            <h2>What I'm taking with me</h2>
            <div className="cs-prose">
              <p>Everything I changed on that page was already on it.</p>
              <p>
                Register to Vote had been seen 4,885 times and clicked 59. The turnout figures the
                program had spent years earning were sitting inside paragraphs. The story about
                Chief Robert Buffalo was four paragraphs deep. None of it was missing. All of it was
                present, and almost none of it was reaching anyone.
              </p>
              <p>
                That's the thing I took from this project. On a page, being there and being found
                are not the same condition, and the distance between them is where the work is. I
                didn't give Native Vote anything it didn't have. I made what it already had harder
                to walk past.
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

export default WisconsinCaseStudy
