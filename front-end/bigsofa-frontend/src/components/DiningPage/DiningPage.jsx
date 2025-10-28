import React, { useEffect, useRef } from 'react'
import './DiningPage.css'

const heroImage = 'https://lh3.googleusercontent.com/p/AF1QipOkUO4o8AuoymTXbK8-JJ3Fei1rIhCyWV_mvh1f=s1360-w1360-h1020-rw'

const experiences = [
  {
    title: 'Gatherings, Elevated',
    description:
      'Whether you host intimate dinners or lively celebrations, our dining settings blend comfort with statement-making silhouettes.',
  },
  {
    title: 'Tailored for Tanzania',
    description:
      'Teak, mahogany, and woven accents are sourced locally, ensuring durability in coastal climates and a distinct East African warmth.',
  },
  {
    title: 'Turnkey Styling',
    description:
      'From tableware to lighting, our designers can layer the finishing touches so your dining room is guest-ready from day one.',
  },
]

const collections = [
  {
    name: 'Dining Tables',
    blurb: 'Solid wood slabs, extendable tables, and round pedestal options sized for any room.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipMX9aqGNQt9QEpkgfv1RNky20bJA9CM2AiHHJJt=s1360-w1360-h1020-rw',
  },
  {
    name: 'Seating',
    blurb: 'Upholstered dining chairs, benches, and stools crafted for comfort through long evenings.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipOAYeg7wTSn8gC_ogz22VEd9XW7GxXn4lnY_RR-=s1360-w1360-h1020-rw',
  },
  {
    name: 'Storage & Bars',
    blurb: 'Sideboards, buffets, and bar cabinets with considered storage for linens, glassware, and more.',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

function DiningPage() {
  const heroRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return undefined

    hero.style.setProperty('--dining-parallax-image', `url(${heroImage})`)

    const updateParallax = () => {
      const rect = hero.getBoundingClientRect()
      const offset = rect.top * -0.3
      hero.style.setProperty('--dining-parallax-offset', `${offset}px`)
    }

    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateParallax)
    }
  }, [])

  return (
    <div className="dining">
      <section
        ref={heroRef}
        className="dining__hero dining__hero--parallax"
        style={{
          '--dining-parallax-image': `url(${heroImage})`,
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="dining__hero-overlay">
          <span className="dining__eyebrow">Bigsofa Tanzania</span>
          <h1>Dining</h1>
        </div>
      </section>

      <section className="dining__intro">
        <p className="dining__intro-eyebrow">setting the scene</p>
        <p>
          Our dining pieces invite people to linger—crafted with generous proportions, timeless finishes, and tactile
          fabrics. From beach villas to urban apartments, we tailor dining spaces that feel grounded, inviting, and ready
          for every shared meal.
        </p>
      </section>

      <section className="dining__experiences">
        {experiences.map((experience) => (
          <article key={experience.title} className="dining__experience-card">
            <h2>{experience.title}</h2>
            <p>{experience.description}</p>
          </article>
        ))}
      </section>

      <section className="dining__collections">
        {collections.map((collection) => (
          <article key={collection.name} className="dining__collection-card">
            <div
              className="dining__collection-image"
              style={{ backgroundImage: `url(${collection.image})` }}
              role="img"
              aria-label={collection.name}
            />
            <div className="dining__collection-body">
              <h2>{collection.name}</h2>
              <p>{collection.blurb}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

export default DiningPage
