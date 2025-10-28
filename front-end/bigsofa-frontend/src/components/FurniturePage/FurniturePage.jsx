import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './FurniturePage.css'

const heroImage =
  'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=2000&q=80'

const collections = [
  {
    name: 'Living Room',
    blurb: 'Statement sofas, accent chairs, and coffee tables that anchor your gathering space.',
    image: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200',
    route: '/living-room',
  },
  {
    name: 'Dining',
    blurb: 'Solid-wood tables, upholstered seating, and sideboards ready for every occasion.',
    image: 'https://hips.hearstapps.com/hmg-prod/images/hbx010125larkinteriors-006-6787ebab949a7.jpg?crop=1xw:1xh;center,top&resize=1600:*',
    route: '/dining',
  },
  {
    name: 'Bedroom',
    blurb: 'Beds, nightstands, and storage pieces crafted for restorative retreats.',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
    route: '/bedroom',
  },
  {
    name: 'Office',
    blurb: 'Desks, task seating, and storage solutions designed for productive workspaces.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
    route: '/office',
  },
]

const highlights = [
  'Locally crafted hardwood pieces with a lifetime of character.',
  'Tailored upholstery options, including performance fabrics and full-grain leather.',
  'White-glove delivery and installation throughout Tanzania.',
]

function FurniturePage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="furniture">
      <section className="furniture__hero" style={{ backgroundImage: `url(${heroImage})` }} id="overview">
        <div className="furniture__hero-overlay">
          <span className="furniture__eyebrow">Bigsofa Tanzania</span>
          <h1>Furniture</h1>
        </div>
      </section>

      <section className="furniture__intro">
        <p className="furniture__intro-eyebrow">about our furniture</p>
        <p>
          The Bigsofa Tanzania furniture collection is handmade with care, combining honest materials with refined
          proportions. Each piece is imagined to live beautifully in tropical climates—breathable hardwoods, artisanal
          weaving, and cushions engineered for all-day comfort. From statement-making sofas to dining companions and
          adaptable storage, our collection is curated so you can build rooms that feel distinctly yours.
        </p>
      </section>

      <section className="furniture__collections">
        {collections.map((collection) => (
          <article
            key={collection.name}
            className={`furniture__collection-card${collection.route ? ' furniture__collection-card--clickable' : ''}`}
            role={collection.route ? 'button' : undefined}
            tabIndex={collection.route ? 0 : undefined}
            onClick={() => collection.route && navigate(collection.route)}
            onKeyDown={(event) => {
              if (collection.route && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                navigate(collection.route)
              }
            }}
          >
            <div
              className="furniture__collection-image"
              style={{ backgroundImage: `url(${collection.image})` }}
              role="img"
              aria-label={collection.name}
            />
            <div className="furniture__collection-body">
              <h2>{collection.name}</h2>
              <p>{collection.blurb}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="furniture__details">
        <div className="furniture__details-inner">
          <h3>Why clients choose Bigsofa Tanzania</h3>
          <ul>
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p>
            Visit our showroom to experience the textures, comfort, and craftsmanship first-hand, or connect with our
            design specialists for a personalized consultation.
          </p>
        </div>
      </section>
    </div>
  )
}

export default FurniturePage
