import React, { useEffect } from 'react'
import './InteriorsPage.css'

const heroImage = 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1600'

const projects = [
  {
    name: 'Seaside Residence',
    location: 'Masaki, Dar es Salaam',
    description: 'Airy living spaces layered with natural fibers, woven lighting, and hand-carved accents for a relaxed coastal retreat.',
    image: 'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=1400',
  },
  {
    name: 'Urban Penthouse',
    location: 'City Centre',
    description: 'Contemporary minimalism softened with textured upholstery, bespoke millwork, and curated art moments.',
    image: 'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=1400',
  },
  {
    name: 'Boutique Guest House',
    location: 'Arusha',
    description: 'Warm-toned timbers, artisanal lighting, and layered textiles create a welcoming hospitality experience.',
    image: 'https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg?auto=compress&cs=tinysrgb&w=1400',
  },
]

const services = [
  {
    title: 'Concept & Moodboarding',
    summary: 'We translate your lifestyle into colour palettes, textures, and visual narratives.'
  },
  {
    title: 'Space Planning',
    summary: 'Scaled layouts that optimize flow, light, and function across every room.'
  },
  {
    title: 'Project Delivery',
    summary: 'Procurement, site coordination, and styling handled from concept to completion.'
  },
]

function InteriorsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="interiors">
      <section className="interiors__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="interiors__hero-overlay">
          <span className="interiors__eyebrow">Bigsofa Tanzania</span>
          <h1>Interiors</h1>
        </div>
      </section>

      <section className="interiors__intro" id="overview">
        <p className="interiors__intro-eyebrow">tailored interior projects</p>
        <p>
          From initial concept to the final styling session, our design studio crafts interiors that honour Tanzanian
          craft and contemporary sensibilities. Each project is a collaboration—balancing how you live with the beauty of
          elevated materials and thoughtful detailing.
        </p>
      </section>

      <section className="interiors__projects" id="projects">
        {projects.map((project) => (
          <article key={project.name} className="interiors__project-card">
            <div
              className="interiors__project-image"
              style={{ backgroundImage: `url(${project.image})` }}
              role="img"
              aria-label={project.name}
            />
            <div className="interiors__project-body">
              <h2>{project.name}</h2>
              <span>{project.location}</span>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="interiors__services" id="services">
        <div className="interiors__services-inner">
          <h3>Studio services</h3>
          <div className="interiors__services-grid">
            {services.map((service) => (
              <div key={service.title} className="interiors__service-card">
                <h4>{service.title}</h4>
                <p>{service.summary}</p>
              </div>
            ))}
          </div>
          <p className="interiors__cta">Book a consultation to begin your project with Bigsofa Tanzania Interiors.</p>
        </div>
      </section>
    </div>
  )
}

export default InteriorsPage
