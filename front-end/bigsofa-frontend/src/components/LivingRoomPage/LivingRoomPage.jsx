import React from 'react'
import './LivingRoomPage.css'

const heroImage = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=2000'

const highlights = [
  {
    title: 'Layered Comfort',
    description:
      'Ground each space with plush sectionals, accent chairs, and ottomans designed for everyday lounging.',
  },
  {
    title: 'Durable Materials',
    description:
      'Performance fabrics, kiln-dried hardwoods, and rattan accents withstand coastal climates with ease.',
  },
  {
    title: 'Styling Support',
    description:
      'From layout planning to art placement, our design partners help you compose a living room that reflects you.',
  },
]

const vignettes = [
  {
    name: 'Sofas & Sectionals',
    blurb: 'Modular seating, chaise lounges, and compact sofas tailored to both apartments and villas.',
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Accent Seating',
    blurb: 'Rocking chairs, statement occasional chairs, and poufs that add personality to any corner.',
    image: 'https://images.pexels.com/photos/3705528/pexels-photo-3705528.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Tables & Storage',
    blurb: 'Coffee tables, consoles, and media units crafted from teak, mango, and metalwork.',
    image: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

function LivingRoomPage() {
  return (
    <div className="living">
      <section className="living__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="living__hero-overlay">
          <span className="living__eyebrow">Bigsofa Tanzania</span>
          <h1>Living Room</h1>
        </div>
      </section>

      <section className="living__intro">
        <p className="living__intro-eyebrow">comfort first, style always</p>
        <p>
          Lounge-ready layouts begin with the right foundation. Our living room collection pairs generous silhouettes with
          resilient materials so every sofa, chair, and table stands up to daily life in Tanzania. Mix and match pieces from
          this edit to create a social hub that invites conversation and relaxation.
        </p>
      </section>

      <section className="living__highlights">
        {highlights.map((highlight) => (
          <article key={highlight.title} className="living__highlight-card">
            <h2>{highlight.title}</h2>
            <p>{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="living__vignettes">
        {vignettes.map((vignette) => (
          <article key={vignette.name} className="living__vignette-card">
            <div
              className="living__vignette-image"
              style={{ backgroundImage: `url(${vignette.image})` }}
              role="img"
              aria-label={vignette.name}
            />
            <div className="living__vignette-body">
              <h2>{vignette.name}</h2>
              <p>{vignette.blurb}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default LivingRoomPage
