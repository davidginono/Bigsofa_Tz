import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from '../App'

function renderApp(initialEntries = ['/']) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => [],
    }),
  )
  if (typeof window.scrollTo !== 'function') {
    window.scrollTo = vi.fn()
  } else {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Bigsofa Tanzania App', () => {
  it('renders home page by default', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: 'Welcome to Bigsofa Tanzania' })).toBeInTheDocument()
  })

  it('supports searching and interacting with shop products', async () => {
    const categories = [{ id: 1, name: 'Sofas' }]
    const items = [
      { id: 11, name: 'Modern Sofa', description: 'Comfy', priceCents: 49900, imageUrl: '/api/furniture/11/image' },
      { id: 12, name: 'Desk', description: 'Workstation', priceCents: 25900, imageUrl: '/api/furniture/12/image' },
    ]

    globalThis.fetch.mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.url
      if (url.endsWith('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: async () => categories,
        })
      }
      if (url.includes('/api/furniture')) {
        return Promise.resolve({
          ok: true,
          json: async () => items,
        })
      }
      return Promise.reject(new Error(`Unexpected fetch call to ${url}`))
    })

    const user = userEvent.setup()
    renderApp(['/shop'])
    expect(await screen.findByText('Modern Sofa')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('Search furniture...')
    await user.clear(searchInput)
    await user.type(searchInput, 'Desk')

    expect(await screen.findByText('Desk')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Modern Sofa')).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Toggle favorite for Desk' }))
    expect(screen.getByRole('button', { name: 'Toggle favorite for Desk' })).toHaveTextContent('Favorited')

    await user.click(screen.getByRole('button', { name: 'Add Desk to cart' }))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
  })

  it('shows a useful retry message when the catalogue API returns HTML', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'text/html',
      },
      json: async () => {
        throw new SyntaxError("Unexpected token '<'")
      },
    })

    renderApp(['/shop'])

    expect(await screen.findByText('We could not load the furniture catalogue')).toBeInTheDocument()
    expect(screen.getByText('The furniture service returned an unexpected response. Please try again shortly.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.queryByText('No items uploaded for this category yet.')).not.toBeInTheDocument()
  })
})
