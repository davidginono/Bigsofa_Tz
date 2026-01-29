import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Button, Drawer, Dropdown, Grid, Layout, Menu, Space, Typography, theme } from 'antd'
import {
  ShopOutlined,
  HomeOutlined,
  MenuOutlined,
  PhoneOutlined,
  SkinOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import logo from './assets/bigsofa.jpg'
import HomePage from './components/HomePage/HomePage'
import ShopPage from './components/ShopPage/ShopPage'
import ContactPage from './components/ContactPage/ContactPage'
import FurniturePage from './components/FurniturePage/FurniturePage'
import InteriorsPage from './components/InteriorsPage/InteriorsPage'
import ShowroomPage from './components/ShowroomPage/ShowroomPage'
import DiningPage from './components/DiningPage/DiningPage'
import OfficePage from './components/OfficePage/OfficePage'
import LivingRoomPage from './components/LivingRoomPage/LivingRoomPage'
import BedroomPage from './components/BedroomPage/BedroomPage'
import CartDrawer from './components/ShopPage/CartDrawer'
import { API_BASE_URL } from './config'
import './App.css'

const { Header, Content, Footer } = Layout
const { Title } = Typography
const { useBreakpoint } = Grid

function Sidebar({ onNavigate }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [openKeys, setOpenKeys] = useState([])
  const screens = useBreakpoint()

  const menuConfig = useMemo(
    () => [
      { key: 'home', icon: <HomeOutlined />, label: 'Home', path: '/' },
      {
        key: 'group:furniture',
        icon: <ShopOutlined />,
        label: 'Furniture',
        children: [
          { key: 'furniture-overview', label: 'Overview', path: '/furniture' },
          { key: 'furniture-living', label: 'Living Room', path: '/living-room' },
          { key: 'furniture-dining', label: 'Dining', path: '/dining' },
          { key: 'furniture-bedroom', label: 'Bedroom', path: '/bedroom' },
          { key: 'furniture-office', label: 'Office', path: '/office' },
        ],
      },
      {
        key: 'group:interiors',
        icon: <SkinOutlined />,
        label: 'Interiors',
        children: [
          { key: 'interiors-overview', label: 'Overview', path: '/interiors' },
        ],
      },
      {
        key: 'group:showroom',
        icon: <EnvironmentOutlined />,
        label: 'Showroom',
        children: [
          { key: 'showroom-overview', label: 'Our Space', path: '/showroom' },
        ],
      },
      { key: 'shop', icon: <ShopOutlined />, label: 'Shop', path: '/shop' },
      { key: 'contact', icon: <PhoneOutlined />, label: 'Contact', path: '/contact' },
    ],
    []
  )

  const keyToPath = useMemo(() => {
    const map = new Map()
    const traverse = (items) => {
      items.forEach((item) => {
        if (item.path && !map.has(item.key)) {
          map.set(item.key, item.path)
        }
        if (item.children) {
          traverse(item.children)
        }
      })
    }
    traverse(menuConfig)
    return map
  }, [menuConfig])

  const pathToKey = useMemo(() => {
    const map = new Map()
    keyToPath.forEach((path, key) => {
      if (!map.has(path)) {
        map.set(path, key)
      }
    })
    return map
  }, [keyToPath])

  const items = useMemo(
    () =>
      menuConfig.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children
          ? item.children.map((child) => ({
              key: child.key,
              label: child.label,
            }))
          : undefined,
      })),
    [menuConfig]
  )

  const findParentKey = useCallback(
    (path) => {
      const parent = menuConfig.find(
        (item) => item.children && item.children.some((child) => child.path === path)
      )
      return parent ? parent.key : null
    },
    [menuConfig]
  )

  useEffect(() => {
    const parent = findParentKey(location.pathname)
    if (parent) {
      setOpenKeys([parent])
    } else {
      setOpenKeys([])
    }
  }, [location.pathname, findParentKey])

  const handleOpenChange = (keys) => {
    if (screens.md) {
      setOpenKeys(keys)
    } else {
      const latest = keys.length ? [keys[keys.length - 1]] : []
      setOpenKeys(latest)
    }
  }

  const handleClick = ({ key }) => {
    const destination = keyToPath.get(key)
    if (destination) {
      navigate(destination)
      if (!screens.md) {
        setOpenKeys([])
      }
      if (onNavigate) {
        onNavigate()
      }
    }
  }

  const selectedKey = pathToKey.get(location.pathname)

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKey ? [selectedKey] : []}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      onClick={handleClick}
      items={items}
    />
  )
}

Sidebar.propTypes = {
  onNavigate: PropTypes.func,
}

const NAV_GROUPS = [
  {
    key: 'furniture',
    label: 'Furniture',
    path: '/furniture',
    children: [
      { key: 'furniture-overview', label: 'Overview', path: '/furniture' },
      { key: 'furniture-living', label: 'Living Room', path: '/living-room' },
      { key: 'furniture-dining', label: 'Dining', path: '/dining' },
      { key: 'furniture-bedroom', label: 'Bedroom', path: '/bedroom' },
      { key: 'furniture-office', label: 'Office', path: '/office' },
    ],
  },
  {
    key: 'interiors',
    label: 'Interiors',
    path: '/interiors',
    children: [
      { key: 'interiors-overview', label: 'Studio Overview', path: '/interiors' },
      { key: 'interiors-services', label: 'Design Services', path: '/interiors#services' },
      { key: 'interiors-gallery', label: 'Projects Gallery', path: '/interiors#projects' },
    ],
  },
  {
    key: 'showroom',
    label: 'Showroom',
    path: '/showroom',
    children: [
      { key: 'showroom-plan', label: 'Plan Your Visit', path: '/showroom#visit' },
      { key: 'showroom-experience', label: 'Experience Highlights', path: '/showroom#highlights' },
      { key: 'showroom-gallery', label: 'Gallery', path: '/showroom#gallery' },
    ],
  },
  {
    key: 'shop',
    label: 'Shop',
    path: '/shop',
    children: [],
  },
  {
    key: 'contact',
    label: 'Contact',
    path: '/contact',
    children: [],
  },
]

function HeaderBar({
  onToggleSidebar,
  onNavigate,
  cartCount,
  onCartClick,
}) {
  const { token } = theme.useToken()
  const screens = useBreakpoint()
  const isTabletOrWider = screens.md || screens.sm
  const isDesktop = screens.md

  const handleNavigate = (path) => {
    if (!onNavigate) return
    const [pathname, hash] = path.split('#')

    const scrollToHash = () => {
      if (!hash) {
        return
      }
      const tryScroll = (attempts = 8) => {
        const target = document.getElementById(hash)
        if (target) {
          target.scrollIntoView({ block: 'start' })
        } else if (attempts > 0) {
          window.requestAnimationFrame(() => tryScroll(attempts - 1))
        }
      }
      window.requestAnimationFrame(() => tryScroll())
    }

    if (pathname === window.location.pathname) {
      scrollToHash()
    } else {
      onNavigate(pathname)
      scrollToHash()
    }
  }

  const navigation = (
    <nav className="app-header__nav" aria-label="Primary">
      <button
        type="button"
        className="app-header__nav-link"
        onClick={() => handleNavigate('/')}
        role="link"
      >
        <span>Home</span>
      </button>
      {NAV_GROUPS.map((group) => {
        const hasChildren = group.children && group.children.length > 0
        const menu = {
          items: (group.children || []).map((child) => ({
            key: child.key,
            label: (
              <button
                type="button"
                className="app-header__dropdown-link"
                onClick={() => handleNavigate(child.path)}
              >
                {child.label}
              </button>
            ),
          })),
        }

        const trigger = (
          <button
            type="button"
            className="app-header__nav-link"
            onClick={() => handleNavigate(group.path)}
            role="link"
          >
            <span>{group.label}</span>
            {hasChildren ? <DownOutlined className="app-header__nav-caret" /> : null}
          </button>
        )

        return hasChildren ? (
          <Dropdown
            key={group.key}
            menu={menu}
            trigger={['hover']}
            placement="bottom"
            overlayClassName="app-header__dropdown"
          >
            {trigger}
          </Dropdown>
        ) : (
          <div key={group.key} className="app-header__nav-item">
            {trigger}
          </div>
        )
      })}
    </nav>
  )

  return (
    <Header
      className="app-header"
      style={{
        '--header-bg': token.colorBgElevated,
        '--header-text': token.colorText,
      }}
    >
      {!isTabletOrWider && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          aria-label="Toggle navigation"
          className="app-header__toggle"
          onClick={onToggleSidebar}
        />
      )}
      <div className="app-header__brand">
        {screens.md ? (
          <>
            <img src={logo} alt="Bigsofa Tanzania emblem" className="app-header__brand-logo" />
            <Title level={3} className="app-header__title app-header__title--decorated">
              Bigsofa Tanzania
            </Title>
          </>
        ) : (
          <span className="app-header__title app-header__title--compact">Bigsofa Tanzania</span>
        )}
      </div>
      <div className="app-header__spacer" />
      {isTabletOrWider ? (
        <Space size="large" align="center" className="app-header__actions">
          {navigation}
          <Badge count={cartCount} size="small" data-testid="cart-badge">
            <Button
              type="text"
              icon={<ShoppingCartOutlined className="app-header__icon app-header__icon--cart" />}
              onClick={onCartClick}
              aria-label="Open cart"
            />
          </Badge>
        </Space>
      ) : (
        <Badge count={cartCount} size="small" data-testid="cart-badge">
          <Button
            type="text"
            icon={<ShoppingCartOutlined className="app-header__icon app-header__icon--cart" />}
            aria-label="Open cart"
            onClick={onCartClick}
          />
        </Badge>
      )}
    </Header>
  )
}

HeaderBar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
  cartCount: PropTypes.number.isRequired,
  onCartClick: PropTypes.func.isRequired,
}
HeaderBar.defaultProps = {
  onNavigate: undefined,
}

function AppLayout() {
  const { token } = theme.useToken()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [submittingOrder, setSubmittingOrder] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const handleSearchSubmit = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const handleToggleFavorite = useCallback((productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      }
      return [...prev, productId]
    })
  }, [])

  const handleAddToCart = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id)
      if (existing) {
        return prev.map((entry) => (entry.id === item.id
          ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
          : entry))
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }]
    })
    setOrderSuccess(null)
    setOrderError(null)
    setIsCartOpen(true)
  }, [])

  const handleUpdateCartQuantity = useCallback((itemId, quantity) => {
    setCartItems((prev) => {
      if (!quantity || quantity <= 0) {
        return prev.filter((item) => item.id !== itemId)
      }
      return prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    })
  }, [])

  const handleRemoveCartItem = useCallback((itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const handleCheckout = useCallback(async (details) => {
    if (cartItems.length === 0) {
      return
    }
    setSubmittingOrder(true)
    setOrderError(null)
    setOrderSuccess(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: details.customerName,
          email: details.email,
          phone: details.phone,
          addressLine1: details.addressLine1,
          addressLine2: details.addressLine2,
          city: details.city,
          items: cartItems.map((item) => ({
            furnitureItemId: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.message || 'Failed to place order')
      }

      const data = await response.json()
      setOrderSuccess(`Order #${data.id} received. We will contact you shortly!`)
      setCartItems([])
    } catch (error) {
      setOrderError(error.message)
    } finally {
      setSubmittingOrder(false)
    }
  }, [cartItems])

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])

  const outletContext = useMemo(
    () => ({
      onAddToCart: handleAddToCart,
      onToggleFavorite: handleToggleFavorite,
      favorites,
      searchTerm,
      onSearchChange: handleSearchChange,
      onSearchSubmit: handleSearchSubmit,
    }),
    [favorites, handleAddToCart, handleToggleFavorite, handleSearchChange, handleSearchSubmit, searchTerm],
  )

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <Layout
      className="app-root-layout"
      style={{
        '--header-bg': token.colorBgElevated,
        '--header-text': token.colorText,
        '--content-bg': token.colorBgContainer,
        '--content-border-radius': `${token.borderRadius}px`,
      }}
    >
      <Drawer
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        placement="left"
        closable
        width={280}
        bodyStyle={{ padding: 0, overflow: 'hidden' }}
        className="app-drawer"
      >
        <div className="sidebar-brand">
          <img src={logo} alt="Bigsofa Tanzania logo" className="sidebar-brand__logo" />
        </div>
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </Drawer>
      <HeaderBar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onNavigate={navigate}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      <Content className="content-container">
        <div className="content-inner">
          <Outlet context={outletContext} />
        </div>
      </Content>
      <Footer className="app-footer">
        © {new Date().getFullYear()} Bigsofa Tanzania
      </Footer>
      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
        submitting={submittingOrder}
        error={orderError}
        successMessage={orderSuccess}
      />
    </Layout>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="furniture" element={<FurniturePage />} />
        <Route path="interiors" element={<InteriorsPage />} />
        <Route path="showroom" element={<ShowroomPage />} />
        <Route path="living-room" element={<LivingRoomPage />} />
        <Route path="bedroom" element={<BedroomPage />} />
        <Route path="dining" element={<DiningPage />} />
        <Route path="office" element={<OfficePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
