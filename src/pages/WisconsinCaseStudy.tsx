import BeforeAfterSlider from '../components/case/BeforeAfterSlider'
import ImageSlot from '../components/case/ImageSlot'
import ColorSwatches from '../components/wcv/ColorSwatches'
import ConversionStats from '../components/wcv/ConversionStats'
import FloralReveal from '../components/wcv/FloralReveal'
import LaptopFrame from '../components/wcv/LaptopFrame'
import type { PageNote } from '../components/wcv/OldPageNotes'
import OldPageNotes from '../components/wcv/OldPageNotes'
import PageviewsChart from '../components/wcv/PageviewsChart'
import PhotoGrid from '../components/wcv/PhotoGrid'
import UsabilityStatCards from '../components/wcv/UsabilityStatCards'
import afterDesign from '../after-design.png'
import beforeDesign from '../before-design.png'
import floralArt from '../floral-art.png'
import grid1 from '../grid1.png'
import grid2 from '../grid2.png'
import grid3 from '../grid3.png'
import grid4 from '../grid4.png'
import grid5 from '../grid5.png'
import grid6 from '../grid6.png'
import heroWcv from '../hero-wcv.jpg'
import impactBand from '../impact-band.png'
import impactNumbers from '../impact-numbers.png'
import oldDesign1 from '../old-design1.png'
import oldDesign2 from '../old-design2.png'
import { useRailOnDark } from './useRailOnDark'
import { useScrollSpy } from './useScrollSpy'
import './CaseStudy.css'
import './WisconsinCaseStudy.css'

// Drop image paths (from /public or a local import) in here as the assets
// arrive. null renders a neutral placeholder panel that holds the layout.
const IMAGES = {
  hero: heroWcv as string | null,
  oldPage1: oldDesign1 as string | null,
  oldPage2: oldDesign2 as string | null,
  nextStepBefore: beforeDesign as string | null,
  nextStepAfter: afterDesign as string | null,
  turnoutMap: impactNumbers as string | null,
  turnoutBand: impactBand as string | null,
}

const COMMUNITY_PHOTOS = [
  { src: grid2, alt: 'The redesigned Native Vote hero, with a man in traditional regalia', caption: 'Wisconsin Native Vote' },
  { src: grid3, alt: 'A man in a patterned shirt speaking on video', caption: 'Protecting our power' },
  { src: grid1, alt: 'A woman speaking on video, captioned Your Vote is Your Voice', caption: 'Your Vote is Your Voice' },
  { src: grid6, alt: 'The Getting Started section, with buttons for registration and voting options', caption: 'Getting started' },
  { src: grid4, alt: 'The early and absentee voting resources section', caption: 'Early and absentee voting' },
  { src: grid5, alt: 'The Beyond the Numbers section with the Story Spotlight', caption: 'Beyond the numbers' },
]

const COLOR_SWATCHES: { tone: 'blue' | 'red' | 'dark' | 'white' | 'yellow'; name: string; meaning: string }[] = [
  { tone: 'blue', name: 'Blue', meaning: 'where you connect' },
  { tone: 'red', name: 'Red', meaning: 'the impact numbers' },
  { tone: 'dark', name: 'Dark', meaning: 'Looking Forward' },
  { tone: 'white', name: 'White', meaning: 'government partnership' },
  { tone: 'yellow', name: 'Yellow', meaning: 'the florals between' },
]

const TEST_STEPS = [
  'Each participant was randomly assigned one version.',
  'They completed three real tasks, with optional screen recordings to confirm whether they succeeded,',
  'Rated the site on the System Usability Scale.',
]

const SECTIONS = [
  { id: 'overview', rail: 'Overview' },
  { id: 'data', rail: 'The data' },
  { id: 'next-step', rail: 'The next step' },
  { id: 'numbers', rail: 'The numbers' },
  { id: 'color', rail: 'Color and florals' },
  { id: 'test', rail: 'The test' },
  { id: 'reflections', rail: 'Reflections' },
] as const

const SECTION_IDS = SECTIONS.map((section) => section.id)

const PAGEVIEWS = [
  { label: 'Voting Info', value: 5212, highlight: true },
  { label: 'Native Vote', value: 2089 },
  { label: 'Home', value: 1847 },
  { label: 'Staff', value: 615 },
]

const CONVERSIONS = [
  { value: '3.0%', label: 'Pledge to Vote pop-up', highlight: true },
  { value: '1.0%', label: 'Register to Vote button', detail: 'Seen 4,885 · clicked 59' },
]

const ANNOTATION_QUESTIONS = [
  "What's the message?",
  'Who is it for?',
  'What should they do next?',
  'What are we assuming?',
]

const RECURRING_ANSWERS = [
  'Text too dense to scan.',
  'Type too light to read.',
  "Actions that didn't look like actions.",
  "And the page's strongest evidence sitting inside paragraphs, where nobody skimming would ever find it.",
]

// Recreated as real text from photos of the physical sticky notes - same
// words, same color, same signature - so they're never blurry or cropped.
const PAGE_NOTES: PageNote[] = [
  {
    id: 'dense',
    label: 'Text too dense to scan.',
    page: 0,
    x: 50,
    y: 30,
    note: {
      color: 'salmon',
      blocks: [
        { text: 'how can we present this in a way that will prompt people to read it' },
        { text: 'lwv example', bullet: true },
      ],
      author: 'Nimrat',
    },
  },
  {
    id: 'grouping',
    label: 'Eleven documents in one list, nothing grouped.',
    page: 0,
    x: 75,
    y: 68,
    note: {
      color: 'purple',
      blocks: [{ text: 'Eleven documents in one list, nothing grouped or prioritized.' }],
      author: 'Nimrat',
    },
  },
  {
    id: 'light',
    label: 'Type too light to read.',
    page: 1,
    x: 30,
    y: 8,
    note: {
      color: 'blue',
      blocks: [
        { text: 'increase contrast to meet WCAG standards' },
        { text: 'or simplify section background colors' },
      ],
      author: 'Ingrid Rivera-Mendez',
    },
  },
  {
    id: 'actions',
    label: "Actions that didn't look like actions.",
    page: 1,
    x: 18,
    y: 30,
    note: {
      color: 'tan',
      blocks: [
        { text: "CTA buttons don't look clickable", bullet: true },
        { text: 'interactive hover?', bullet: true, indent: true },
        { text: 'scroll buttons feel out of place for the image carousel', bullet: true },
      ],
      author: 'shivani',
    },
  },
  {
    id: 'videos',
    label: 'Five videos compete for attention.',
    page: 1,
    x: 70,
    y: 58,
    note: {
      color: 'green',
      blocks: [{ text: 'Five videos compete for attention. Which one matters?' }],
      author: 'Nimrat',
    },
  },
  {
    id: 'evidence',
    label: "The page's strongest evidence sat inside paragraphs, where nobody skimming would ever find it.",
    page: 1,
    x: 60,
    y: 92,
    note: {
      color: 'blue',
      blocks: [
        { text: 'Highlight the quote and stats more by separating it from the rest of the paragraph text' },
      ],
      author: 'Nimrat',
    },
  },
]

function WisconsinCaseStudy() {
  const activeId = useScrollSpy(SECTION_IDS)
  const railOnDark = useRailOnDark()

  return (
    <main className="case-study cs-wcv">
      <header className="case-study__hero">
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

          <section
            id="data"
            className="case-study__section cs-data"
            data-nav-theme="light"
            data-rail-theme="dark"
          >
            <div className="cs-data__inner">
              <div className="cs-data__top">
                <h2>What a year of clicks told us</h2>
                <div className="cs-prose cs-data__intro">
                  <p>
                    Before changing anything, we went through a year of the site's Squarespace
                    analytics. Two numbers decided most of what came next.
                  </p>
                </div>
              </div>

              <div className="findings-grid">
                <div className="finding-card">
                  <p className="finding-card__label">Finding 1 · Top pageviews by page</p>
                  <h3 className="finding-card__title">
                    Voting Info is the front door, and the exit.
                  </h3>
                  <PageviewsChart rows={PAGEVIEWS} />
                  <p className="finding-card__body">
                    It drew 5,212 views, more than twice any other page. People spent about two
                    minutes there, and nine in ten left without going anywhere else.
                  </p>
                </div>
                <div className="finding-card">
                  <p className="finding-card__label">Finding 2 · Button conversions by button</p>
                  <h3 className="finding-card__title">A pop-up beat the page's own buttons.</h3>
                  <ConversionStats stats={CONVERSIONS} />
                  <p className="finding-card__body">
                    Register to Vote was seen by 4,885 people and clicked by 59, a rate of 1.0%.
                    The Pledge to Vote pop-up, asking for something similar, converted at 3.0%.
                    People weren't uninterested.{' '}
                    <strong>The page's own buttons just weren't doing the work.</strong>
                  </p>
                </div>
              </div>

              <div className="cs-data__annotate">
                <div className="cs-data__annotate-text">
                  <p>
                    The numbers showed where people struggled. To find out why, we annotated every
                    section of the old pages against the same four questions:
                  </p>
                  <ul className="question-tiles">
                    {ANNOTATION_QUESTIONS.map((question) => (
                      <li key={question} className="question-tile">
                        {question}
                      </li>
                    ))}
                  </ul>
                  <p className="cs-data__answers-lead">
                    The answers kept landing in the same places.
                  </p>
                  <ol className="answers-list">
                    {RECURRING_ANSWERS.map((answer, index) => (
                      <li key={answer} className="answers-list__item">
                        <span className="answers-list__num" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>{answer}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="cs-data__annotate-old">
                  <OldPageNotes
                    pages={[
                      { src: IMAGES.oldPage1, alt: 'The old Voting Info page' },
                      { src: IMAGES.oldPage2, alt: 'The old Native Vote page' },
                    ]}
                    notes={PAGE_NOTES}
                  />
                </div>
              </div>
            </div>
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
              <LaptopFrame scrollable>
                <BeforeAfterSlider
                  before={IMAGES.nextStepBefore}
                  after={IMAGES.nextStepAfter}
                  beforeAlt="The old Native Vote page, with its actions in a narrow sidebar"
                  afterAlt="The redesigned Native Vote page, with a full-width Connect with Us band"
                  beforeLabel="Original"
                  afterLabel="Redesign"
                  ratio="564 / 1082"
                />
              </LaptopFrame>
            </div>
          </section>

          <section id="numbers" className="case-study__section">
            <h2>The proof was hiding in the paragraphs</h2>
            <div className="wcv-numbers">
              <div className="cs-prose wcv-numbers__text">
                <p>
                  Turnout rose in every tribal community Native Vote worked in. The program reached
                  23,000 households and knocked on 4,500 doors.
                </p>
                <p>
                  On the old page you would never know. The turnout figures were written into
                  sentences. The two infographics were flat images dropped into a narrow column, at
                  a size that made them close to unreadable. The strongest argument on the page was
                  also the hardest part to see.
                </p>
                <p>
                  I pulled all of it out. Turnout became a map of Wisconsin with a circle over each
                  community, sized to its increase, alongside the figures as a list you can read at
                  a glance. The program's totals became "Our Impact in Numbers", a full-width red
                  band with eight figures set large enough to read from across the room.
                </p>
              </div>

              <div className="wcv-numbers__screens">
                <ImageSlot
                  src={IMAGES.turnoutMap}
                  alt="Impacts on voter turnout: a list of turnout increases by community next to a map of Wisconsin with a circle sized to each one"
                  ratio="1314 / 914"
                />
                <ImageSlot
                  src={IMAGES.turnoutBand}
                  alt="Our Impact in Numbers: eight figures including 23,000 households reached and 4,500 doors knocked on"
                  ratio="447 / 164"
                />
              </div>
            </div>
          </section>

          <section id="color" className="case-study__section cs-color">
            <div className="cs-color__top">
              <h2>Color as a way of knowing where you are</h2>
              <div className="cs-prose cs-color__intro">
                <p>
                  The old page was blue headings on white, top to bottom. Nothing told you that
                  you had moved from one idea to another.
                </p>
              </div>
            </div>

            <div className="cs-prose">
              <p>The redesign runs in full-width bands, each color doing a job:</p>
            </div>

            <ColorSwatches swatches={COLOR_SWATCHES} />

            <FloralReveal src={floralArt} />
            <PhotoGrid photos={COMMUNITY_PHOTOS} />
          </section>

          <section
            id="test"
            className="case-study__section cs-test"
            data-nav-theme="light"
            data-rail-theme="dark"
          >
            <div className="cs-test__inner">
              <h2>Two sites, one set of tasks</h2>
              <div className="cs-prose">
                <p>
                  We tested the redesign against the live site. The program exists for Native
                  voters in Wisconsin, so we recruited through Tribal Libraries, Archives &amp;
                  Museums and our own networks, to make sure the feedback reflected the people the
                  site is for.
                </p>
              </div>

              <ol className="test-steps">
                {TEST_STEPS.map((step, index) => (
                  <li key={step} className="test-step">
                    <span className="test-step__num" aria-hidden="true">
                      {index + 1}
                    </span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>

              <UsabilityStatCards />

              <div className="cs-prose cs-prose--after-figure">
                <p>
                  On the old site, testers described sections as text-dense and hard to read
                  against their backgrounds. Neither came up for the redesign.
                </p>
                <p>
                  We handed WCV the designs and a set of implementation guidelines for
                  Squarespace. Their team built it, and it's the Native Vote page today.
                </p>
              </div>

              <a
                className="wcv-live-link wcv-live-link--on-dark"
                href="https://www.conservationvoices.org/nativevote"
                target="_blank"
                rel="noopener noreferrer"
              >
                View the live Native Vote page
              </a>
            </div>
          </section>

          <section id="reflections" className="case-study__section">
            <h2>What I'm taking with me</h2>
            <p className="cs-reflect__statement">
              Everything I changed on that page was already on it.
            </p>
            <div className="cs-prose">
              <p>
                Register to Vote had been seen 4,885 times and clicked 59. The turnout figures the
                program had spent years earning were sitting inside paragraphs. The story about
                Chief Robert Buffalo was four paragraphs deep. None of it was missing. All of it was
                present, and almost none of it was reaching anyone.
              </p>
              <p>
                That's the thing I took from this project. On a page, being there and being found
                are not the same condition, and the distance between them is where the work is. I
                didn't give Native Vote anything it didn't have.{' '}
                <span className="cs-reflect__close">
                  I made what it already had harder to walk past.
                </span>
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
