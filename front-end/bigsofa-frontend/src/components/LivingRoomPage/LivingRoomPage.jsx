import React from 'react'
import { Helmet } from 'react-helmet-async'
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
    image: 'https://m.media-amazon.com/images/I/81vVSqIFmwL._AC_SX679_.jpg',
  },
  {
    name: 'Accent Seating',
    blurb: 'Rocking chairs, statement occasional chairs, and poufs that add personality to any corner.',
    image: 'https://m.media-amazon.com/images/I/71XATi8y8kL._AC_UL320_.jpg',
  },
  {
    name: 'Tables & Storage',
    blurb: 'Coffee tables, consoles, and media units crafted from teak, mango, and metalwork.',
    image: 'https://m.media-amazon.com/images/I/71OG00IXCbL._AC_UL320_.jpg',
  },
]

function LivingRoomPage() {
  return (
    <div className="living">
      <Helmet>
        <title>Living Room Furniture | BigSofa Tanzania</title>
        <meta
          name="description"
          content="Discover sofas, sectionals, accent chairs, and tables for living rooms in Tanzania."
        />
        <meta
          name="keywords"
          content="living room furniture Tanzania, sofas, sectionals, coffee tables, accent chairs, media units"
        />
        <meta name="author" content="BigSofa Tanzania" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />
        <link rel="canonical" href="https://bigsofatanzania.com/living-room" />
      </Helmet>
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
