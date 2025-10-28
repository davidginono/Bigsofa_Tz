import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

import heroImage from '../../assets/home-hero.jpg'
import AboutPage from '../AboutPage/AboutPage'

const services = [
  {
    title: 'Furniture',
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1280',
    description: 'Curated collections ranging from timeless classics to contemporary icons.',
    route: '/furniture',
  },
  {
    title: 'Interiors',
    image: 'https://images.pexels.com/photos/3705531/pexels-photo-3705531.jpeg?auto=compress&cs=tinysrgb&w=1280',
    description: 'Personalized interior styling that gives every room a distinct character.',
    route: '/interiors',
  },
  {
    title: 'Showroom',
    image: 'https://images.pexels.com/photos/3965520/pexels-photo-3965520.jpeg?auto=compress&cs=tinysrgb&w=1280',
    description: 'Experience Bigsofa Tanzania in person at our immersive showroom.',
    route: '/showroom',
  },
]

function HomePage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const sections = document.querySelectorAll('.home__fade')
    if (!sections.length) {
      return
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 }
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return undefined

    hero.style.setProperty('--hero-image', `url(${heroImage})`)

    const updateParallax = () => {
      const rect = hero.getBoundingClientRect()
      const offset = rect.top * -0.25
      hero.style.setProperty('--parallax-offset', `${offset}px`)
    }

    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateParallax)
    }
  }, [])

  return (
    <div className="home">
      <section
        ref={heroRef}
        className="home__hero home__layer home__fade"
        style={{
          '--hero-image': `url(${heroImage})`,
          background: `url(${heroImage}) center/cover no-repeat`,
        }}
      >
        <div className="home__hero-overlay">
          <span className="home__hero-eyebrow">The Bigsofa Workshop</span>
          <h1 className="home__headline">Welcome to Bigsofa Tanzania</h1>
          <p className="home__tagline">
            Bespoke furniture, interiors, and showroom experiences handcrafted in Tanzania.
          </p>
        </div>
      </section>

      <section className="home__whatwedo home__layer home__fade">
        <p className="home__section-eyebrow">/ what we do /</p>
        <div className="home__services">
          {services.map((service) => (
            <article
              key={service.title}
              className="home__service-card"
              role="button"
              tabIndex={0}
            onClick={() => navigate(service.route)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(service.route)
                }
              }}
            >
              <div
                className="home__service-image"
                style={{ backgroundImage: `url(${service.image})` }}
                role="img"
                aria-label={service.title}
              />
              <div className="home__service-overlay">
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home__about-wrapper home__layer home__fade" id="about">
        <div className="home__about-viewport">
          <AboutPage />
        </div>
      </section>
    </div>
  )
}

export default HomePage
