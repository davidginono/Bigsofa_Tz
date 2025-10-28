import { useEffect } from 'react'
import './AboutPage.css'

function AboutPage() {
  useEffect(() => {
    const animatedSections = document.querySelectorAll('.about-page__fade')
    if (!animatedSections.length) {
      return
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      animatedSections.forEach((section) => section.classList.add('is-visible'))
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
      { threshold: 0.2 }
    )

    animatedSections.forEach((section) => observer.observe(section))

    return () => {
      animatedSections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <div className="about-page">
      <section className="about-page__hero about-page__fade">
        <div className="about-page__overlay">
          <span className="about-page__eyebrow">Our Story</span>
          <h1>Bespoke craftsmanship rooted in Tanzanian design heritage.</h1>
        </div>
      </section>

      <section className="about-page__intro about-page__fade">
        <h2>About Us</h2>
        <p>
          Bigsofa Tanzania is your premier destination for high-quality furniture that combines style, comfort, and durability.
          We believe every space deserves beautiful, functional design tailored to the way you live, work, and gather.
        </p>
      </section>

      <section className="about-page__content about-page__fade">
        <article className="about-page__block">
          <h3>Our Mission</h3>
          <p>
            To provide exceptional furniture solutions that transform houses into homes, offering both timeless classics and
            contemporary design to suit every budget and preference.
          </p>
        </article>

        <article className="about-page__block about-page__block--list">
          <h3>Why Choose Us?</h3>
          <ul>
            <li>Premium quality materials and craftsmanship</li>
            <li>Wide selection of styles and designs</li>
            <li>Custom upholstery and finish options</li>
            <li>Tailored interiors and showroom styling</li>
            <li>Reliable delivery and white-glove installation</li>
            <li>Exceptional client support from concept to completion</li>
          </ul>
        </article>
      </section>
    </div>
  )
}

export default AboutPage
