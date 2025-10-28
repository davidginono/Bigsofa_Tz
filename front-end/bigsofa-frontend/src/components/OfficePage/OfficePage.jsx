import React, { useEffect } from 'react'
import './OfficePage.css'

const heroImage = 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2000&q=80'

const highlights = [
  {
    title: 'Tailored Workspaces',
    description: 'Modular desks, statement executive tables, and compact workstations suited to your square footage.'
  },
  {
    title: 'Ergonomic Seating',
    description: 'Performance task chairs and lounge seating that balance comfort with elevated design.'
  },
  {
    title: 'Storage & Screens',
    description: 'Credenzas, shelving, and flexible dividers that keep your studio organised and adaptable.'
  }
]

const suites = [
  {
    name: 'Executive Suite',
    blurb: 'Commanding desks paired with cabinetry and conference seating for leadership offices.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Collaborative Studio',
    blurb: 'Bench desks, soft seating, and writable partitions to encourage collective energy.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Home Office',
    blurb: 'Compact desks, concealed storage, and lighting plans for productive corners at home.',
    image: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

function OfficePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="office">
      <section className="office__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="office__hero-overlay">
          <span className="office__eyebrow">Bigsofa Tanzania</span>
          <h1>Office</h1>
        </div>
      </section>

      <section className="office__intro">
        <p className="office__intro-eyebrow">designed for productivity</p>
        <p>
          Bigsofa Tanzania curates office collections that bring warmth and professionalism to your workspace. From
          boardrooms to boutique agencies and refined home studies, we deliver furnishings that support focus, flow, and
          your brand story.
        </p>
      </section>

      <section className="office__highlights">
        {highlights.map((highlight) => (
          <article key={highlight.title} className="office__highlight-card">
            <h2>{highlight.title}</h2>
            <p>{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="office__suites">
        {suites.map((suite) => (
          <article key={suite.name} className="office__suite-card">
            <div
              className="office__suite-image"
              style={{ backgroundImage: `url(${suite.image})` }}
              role="img"
              aria-label={suite.name}
            />
            <div className="office__suite-body">
              <h2>{suite.name}</h2>
              <p>{suite.blurb}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default OfficePage
