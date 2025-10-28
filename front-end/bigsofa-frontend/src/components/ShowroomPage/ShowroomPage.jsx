import React, { useEffect } from 'react'
import heroImage from './assets/hero.jpeg'
import './ShowroomPage.css'



const experienceHighlights = [
  {
    title: 'Curated Vignettes',
    description: 'Walk through fully styled living, dining, and outdoor settings to spark ideas for your own spaces.',
  },
  {
    title: 'Material Library',
    description: 'Explore swatches of hardwoods, rattan, stone, and upholstery with guidance from our design team.',
  },
  {
    title: 'On-site Consultation',
    description: 'Meet our specialists for space planning and product recommendations tailored to your needs.',
  },
]

const visitingDetails = [
  {
    label: 'Location',
    value: 'Meru Street, Njiro Rd, 23114 — Big Sofa Tanzania',
  },
  {
    label: 'Hours',
    value: 'Sunday – Friday: 3:00 PM',
  },
  {
    label: 'Contact',
    value: '0767241639 / hello@bigsofatanzania.com',
  },
]

function ShowroomPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const galleryImages = [
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipM3rb1y-C22Z-bOjBz3NccbBWXVt0QnzwZ7aPEy=s1360-w1360-h1020-rw',
      alt: 'Showroom floor display at Big Sofa Tanzania',
    },
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipPSK-oNlFU7gF8c2j_Kt06dJUAVPFmemaXk_U8h=s1360-w1360-h1020-rw',
      alt: 'Accent chairs showcased by Big Sofa Tanzania',
    },
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipPakNMigwLn2pWZ64QN6itAeTdEC_UzXhlLjTIz=s1360-w1360-h1020-rw',
      alt: 'Upholstered sofa collection at Big Sofa Tanzania',
    },
    {
      src: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrQtCnnQ8fFIm1ZP-QzmQG1JGy1vaYH4VIFLkFjdbd9IdL-KMbjoCJVKkmEC9EvFzuopWCyalt-4KKr38JUbmQFbHAYF6UTcRZlQmsM6ybNKbjXjW1SMMtKuYwr7pcLIvPHVpDZrrM1TF2K=s1360-w1360-h1020-rw',
      alt: 'Full leather sofa set available from Big Sofa Tanzania',
    },
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipMEbEAG3bO-F1kVEE0KCjojAJO05u4jDMggYl0O=s1360-w1360-h1020-rw',
      alt: 'Exterior signage for Big Sofa Tanzania showroom',
    },
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipOQyOQpznKPNyR_EYwkBBvv_iRgZCpArSpDnx4-=s1360-w1360-h1020-rw',
      alt: 'Bright lounge vignette inside Big Sofa Tanzania showroom',
    },
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipMQO0PpayEkz1CDwbVbdWE57OUeJB1GRfnob3YK=s1360-w1360-h1020-rw',
      alt: 'Exterior signage for Big Sofa Tanzania showroom',
    },
    
    {
      src: 'https://lh3.googleusercontent.com/p/AF1QipPxcNRlfZYrAkvPx2Ox7Ik8Iyd7ilcSwzJUKcUZ=s1360-w1360-h1020-rw',
      alt: 'Wide interior view of Big Sofa Tanzania seating collection',
    },
   
   
   
    
  ]

  return (
    <div className="showroom">
      <section className="showroom__hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="showroom__hero-overlay">
          <span className="showroom__eyebrow">Visit Us</span>
          <h1>Showroom</h1>
        </div>
      </section>

      <section className="showroom__intro" id="overview">
        <p className="showroom__intro-eyebrow">experience bigsofa tanzania</p>
        <p>
          Step into our light-filled showroom and experience the craftsmanship, comfort, and warmth of Bigsofa Tanzania.
          Each vignette is curated to demonstrate how our furniture, lighting, and decor come together for inspiring
          interiors. Enjoy a coffee, browse at your own pace, or sit down with our team for a one-on-one consultation.
        </p>
      </section>

      <section className="showroom__highlights" id="highlights">
          {experienceHighlights.map((highlight) => (
            <article key={highlight.title} className="showroom__highlight-card">
              <h2>{highlight.title}</h2>
              <p>{highlight.description}</p>
            </article>
        ))}
      </section>

      <section className="showroom__visit" id="visit">
        <div className="showroom__visit-inner">
          <div className="showroom__visit-info">
            <h3>Plan your visit</h3>
            <ul>
              {visitingDetails.map(({ label, value }) => (
                <li key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
            <p>
              We recommend booking an appointment for dedicated design time, but walk-ins are always welcome. Ask about
              private shopping hours for trade partners and turnkey styling packages.
            </p>
            <a className="showroom__cta-button" href="mailto:hello@bigsofatanzania.com">
              Arrange a visit
            </a>
          </div>
          <div className="showroom__visit-map">
            <iframe
              title="Bigsofa Tanzania Showroom"
              src="https://maps.google.com/maps?q=Meru%20Street%2C%20TZ%2C%20Njiro%20Rd%2C%2023114%2C%20Big%20Sofa%20Tanzania&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="showroom__gallery" id="gallery">
        {galleryImages.map((image) => (
          <figure key={image.src} className="showroom__gallery-item">
            <img src={image.src} alt={image.alt} loading="lazy" referrerPolicy="no-referrer" />
          </figure>
        ))}
      </section>
    </div>
  )
}

export default ShowroomPage
