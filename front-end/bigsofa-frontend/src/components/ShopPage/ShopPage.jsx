import React, { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, Col, Empty, Row, Select, Spin, Typography, Alert, Input } from 'antd'
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import './ShopPage.css'
import { API_BASE_URL } from '../../config'

const { Title } = Typography

function ProductImage({ src, alt, fallback }) {
  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={(event) => {
        if (event.currentTarget.src !== fallback) {
          event.currentTarget.src = fallback
        }
      }}
      className="product-card__image"
    />
  )
}

ProductImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallback: PropTypes.string.isRequired,
}

const FALLBACK_IMAGE = 'https://placehold.co/800x600?text=Furniture+Image'
const MAX_DESCRIPTION_CHARACTERS = 110

function truncateDescription(description) {
  if (!description) {
    return ''
  }
  if (description.length <= MAX_DESCRIPTION_CHARACTERS) {
    return description
  }
  const truncated = description.slice(0, MAX_DESCRIPTION_CHARACTERS)
  const lastSpace = truncated.lastIndexOf(' ')
  const safeSlice = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated
  return `${safeSlice}…`
}

function ShopPage() {
  const {
    onAddToCart,
    onToggleFavorite,
    favorites,
    searchTerm,
    onSearchChange,
    onSearchSubmit,
  } = useOutletContext()
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [previewItem, setPreviewItem] = useState(null)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setPreviewItem(null)
      }
    }

    if (previewItem) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewItem])

  useEffect(() => {
    let active = true
    async function loadCategories() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`)
        if (!response.ok) {
          throw new Error('Failed to load categories')
        }
        const data = await response.json()
        if (active) {
          setCategories(data)
          if (data.length > 0) {
            setSelectedCategoryId(data[0].id)
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadCategories()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedCategoryId) {
      setItems([])
      return
    }

    let active = true
    async function loadFurniture() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/api/furniture?categoryId=${selectedCategoryId}`)
        if (!response.ok) {
          const text = await response.text()
          let parsed = null
          try {
            parsed = JSON.parse(text)
          } catch {
            parsed = null
          }
          throw new Error(parsed?.message || text || 'Failed to load furniture')
        }
        const data = await response.json()
        if (active) {
          const unique = data.filter((item, index, array) =>
            array.findIndex((candidate) => candidate.imageUrl === item.imageUrl) === index,
          )
          setItems(unique)
        }
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadFurniture()
    return () => {
      active = false
    }
  }, [selectedCategoryId])

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return items
    }
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, searchTerm])

  const formatPrice = (priceCents) => {
    const priceTzs = priceCents / 100
    return priceTzs.toLocaleString('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="shop-page">
      <div className="shop-page__search">
        <Input.Search
          placeholder="Search furniture..."
          allowClear
          value={searchTerm}
          onChange={(event) => onSearchChange?.(event.target.value)}
          onSearch={(value) => onSearchSubmit?.(value)}
        />
      </div>
      <div className="shop-page__header">
        <Title level={3} className="shop-page__title">
          Browse Furniture
        </Title>
        <Select
          className="shop-page__category-select"
          placeholder="Select category"
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          loading={loading && categories.length === 0}
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />
      </div>

      {error && <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} />}

      {loading && categories.length === 0 ? (
        <div className="shop-page__loading">
          <Spin tip="Loading furniture..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <Empty
          className="shop-page__empty"
          description={
            <span>{searchTerm ? 'No items match your search.' : 'No items uploaded for this category yet.'}</span>
          }
        />
      ) : (
        <Row gutter={[16, 16]} className="shop-page__grid">
          {filteredItems.map((item) => {
            const isFavorite = favorites.includes(item.id)
            const imageSrc = `${API_BASE_URL}${item.imageUrl}`

            return (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  hoverable
                  cover={(
                    <button
                      type="button"
                      className="product-card__image-button"
                      onClick={() => setPreviewItem(item)}
                      aria-label={`Preview ${item.name}`}
                    >
                      <ProductImage src={imageSrc} alt={item.name} fallback={FALLBACK_IMAGE} />
                    </button>
                  )}
                  className="product-card"
                >
                  <div className="product-card__info">
                    <div>
                      <div className="product-card__name">{item.name}</div>
                      {item.description ? (
                        <div className="product-card__description">
                          {truncateDescription(item.description)}
                        </div>
                      ) : null}
                    </div>
                    {typeof item.priceCents === 'number' && (
                      <div className="product-card__price">{formatPrice(item.priceCents)}</div>
                    )}
                  </div>
                  <div className="product-card__actions">
                    <button
                      type="button"
                      className={`product-card__action ${isFavorite ? 'is-favorite' : ''}`}
                      onClick={() => onToggleFavorite(item.id)}
                      aria-label={`Toggle favorite for ${item.name}`}
                    >
                      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                      <span>{isFavorite ? 'Favorited' : 'Add to favorites'}</span>
                    </button>
                    <button
                      type="button"
                      className="product-card__action"
                      onClick={() => onAddToCart({
                        id: item.id,
                        name: item.name,
                        priceCents: item.priceCents ?? 0,
                        imageUrl: imageSrc,
                      })}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <ShoppingCartOutlined />
                      <span>Add to cart</span>
                    </button>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}
      {previewItem && (
        <div className="preview-overlay" role="dialog" aria-modal="true">
          <button type="button" className="preview-overlay__backdrop" onClick={() => setPreviewItem(null)} aria-label="Close preview" />
          <div className="preview-overlay__content">
            <button
              type="button"
              className="preview-overlay__close"
              onClick={() => setPreviewItem(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            <img
              src={`${API_BASE_URL}${previewItem.imageUrl}`}
              alt={previewItem.name}
              className="preview-overlay__image"
            />
            <div className="preview-overlay__details">
              <h2>{previewItem.name}</h2>
              {previewItem.description ? <p>{previewItem.description}</p> : null}
              {typeof previewItem.priceCents === 'number' && (
                <p className="preview-overlay__price">
                  {formatPrice(previewItem.priceCents)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopPage
