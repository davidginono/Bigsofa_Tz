import React from 'react'
import './BedroomPage.css'

const heroImage = 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=2000'

const rituals = [
  {
    title: 'Restful Foundations',
    description:
      'Beds crafted with solid hardwood frames, supportive slats, and upholstered headboards for tailored comfort.',
  },
  {
    title: 'Storage That Calms',
    description:
      'Nightstands, dressers, and wardrobes designed to hide clutter while keeping everyday essentials within reach.',
  },
  {
    title: 'Layers of Softness',
    description:
      'Add linen bedding, woven throws, and accent lighting to create a sanctuary that is both breezy and warm.',
  },
]

const suites = [
  {
    name: 'Beds & Headboards',
    blurb: 'Platform beds, upholstered frames, and statement headboards sized from single to king.',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Nightstands & Dressers',
    blurb: 'Storage pieces with soft-close hardware and handfinished timbers to organize every bedside ritual.',
    image: 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Finishing Touches',
    blurb: 'Benches, mirrors, and accent lighting that elevate the mood and make small rooms feel expansive.',
    image: 'https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

function BedroomPage() {
  return (
    <div className="bedroom">
      <section className="bedroom__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="bedroom__hero-overlay">
          <span className="bedroom__eyebrow">Bigsofa Tanzania</span>
          <h1>Bedroom</h1>
        </div>
      </section>

      <section className="bedroom__intro">
        <p className="bedroom__intro-eyebrow">slow down & recharge</p>
        <p>
          Whether you are staging a guest retreat or a master suite, our bedroom edit is curated for restorative nights.
          Pair softly upholstered beds with tactile textiles, and complete the scene with thoughtful storage and ambient
          lighting.
        </p>
      </section>

      <section className="bedroom__rituals">
        {rituals.map((ritual) => (
          <article key={ritual.title} className="bedroom__ritual-card">
            <h2>{ritual.title}</h2>
            <p>{ritual.description}</p>
          </article>
        ))}
      </section>

      <section className="bedroom__suites">
        {suites.map((suite) => (
          <article key={suite.name} className="bedroom__suite-card">
            <div
              className="bedroom__suite-image"
              style={{ backgroundImage: `url(${suite.image})` }}
              role="img"
              aria-label={suite.name}
            />
            <div className="bedroom__suite-body">
              <h2>{suite.name}</h2>
              <p>{suite.blurb}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default BedroomPage
