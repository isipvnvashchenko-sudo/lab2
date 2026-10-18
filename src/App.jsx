import React from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { books } from './data/books';
import { useAuth, useCart, useTheme } from './state/AppProviders';

const money = (value) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  return (
    <header className="topbar">
      <NavLink to="/" className="brand"><span className="brand-mark">К</span><span>Книжная полка<small>истории для каждого</small></span></NavLink>
      <nav className="navigation">
        <NavLink end to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Каталог</NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Корзина <span className="count">{totalItems}</span></NavLink>
        {user ? (
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Кабинет</NavLink>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Вход</NavLink>
        )}
      </nav>
      <div className="header-actions">
        <button className="theme-button" onClick={toggleTheme} aria-label="Переключить тему">{theme === 'light' ? '☾' : '☀'} <span>{theme === 'light' ? 'Тёмная' : 'Светлая'}</span></button>
        {user && <button className="text-button" onClick={logout}>Выйти</button>}
      </div>
    </header>
  );
}

function BookCard({ book }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);
  const navigate = useNavigate();
  const add = () => {
    addToCart(book);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };
  return (
    <article className="book-card">
      <div className={`book-cover ${book.color}`}>
        <span className="cover-emoji">{book.emoji}</span>
        <span className="cover-label">КНИЖНАЯ ПОЛКА</span>
        <strong>{book.title}</strong>
        <span className="cover-author">{book.author}</span>
      </div>
      <div className="book-info">
        <span className="genre">{book.genre}</span>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <div className="book-bottom">
          <strong className="price">{money(book.price)}</strong>
          <button className="primary-button small" onClick={add}>{added ? 'Добавлено ✓' : 'В корзину +'}</button>
        </div>
        {added && <button className="subtle-link" onClick={() => navigate('/cart')}>Перейти в корзину →</button>}
      </div>
    </article>
  );
}

function Catalog() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">ВАША СЛЕДУЮЩАЯ ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ</span>
          <h1>Книги, к которым<br /><em>хочется возвращаться.</em></h1>
          <p>Собрали истории, которые вдохновляют, удивляют и остаются с вами надолго.</p>
          <a className="primary-button hero-button" href="#catalog">Выбрать книгу <span>↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun"></div><div className="art-book book-one">МИР<br/>ИСТОРИЙ</div><div className="art-book book-two">ЧИТАЙ<br/>МЕЧТАЙ</div><div className="art-book book-three">НОВЫЕ<br/>ГЛАВЫ</div>
          <span className="sparkle sparkle-one">✳</span><span className="sparkle sparkle-two">✦</span>
        </div>
      </section>
      <section id="catalog" className="catalog-section">
        <div className="section-heading"><div><span className="eyebrow">МАЛЕНЬКИЙ МИР БОЛЬШИХ ИСТОРИЙ</span><h2>Выберите свою книгу</h2></div><span className="book-count">{books.length} книг в подборке</span></div>
        <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} />)}</div>
      </section>
    </main>
  );
}

function Cart() {
  const { cart, removeFromCart, decreaseQuantity, addToCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  return (
    <main className="page inner-page">
      <span className="eyebrow">ВАШИ ВЫБРАННЫЕ ИСТОРИИ</span>
      <h1 className="page-title">Корзина</h1>
      {cart.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">▤</div><h2>Пока здесь тихо</h2><p>Добавьте в корзину книгу, которая привлечёт ваше внимание.</p><button className="primary-button" onClick={() => navigate('/')}>Перейти в каталог</button></div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-row" key={item.id}>
                <div className={`mini-cover ${item.color}`}>{item.emoji}</div>
                <div className="cart-book-info"><h3>{item.title}</h3><p>{item.author}</p><span>{money(item.price)} за шт.</span></div>
                <div className="quantity"><button onClick={() => decreaseQuantity(item.id)} aria-label="Уменьшить количество">−</button><span>{item.quantity}</span><button onClick={() => addToCart(item)} aria-label="Увеличить количество">+</button></div>
                <strong className="line-total">{money(item.price * item.quantity)}</strong>
                <button className="remove-button" onClick={() => removeFromCart(item.id)} aria-label={`Удалить ${item.title}`}>×</button>
              </article>
            ))}
            <button className="subtle-link clear-cart" onClick={clearCart}>Очистить корзину</button>
          </section>
          <aside className="order-summary"><h2>Ваш заказ</h2><div className="summary-line"><span>Книг</span><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} шт.</span></div><div className="summary-line"><span>Доставка</span><span className="free">Бесплатно</span></div><div className="summary-total"><span>Итого</span><strong>{money(totalPrice)}</strong></div><button className="primary-button checkout" onClick={() => navigate('/dashboard')}>Продолжить →</button><p className="summary-note">Оформление заказа не подключено.</p></aside>
        </div>
      )}
    </main>
  );
}

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const from = location.state?.from || '/dashboard';

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    login({ name: name.trim(), email: email.trim() });
    navigate(from, { replace: true });
  };

  return (
    <main className="page auth-page">
      <div className="auth-card">
        <span className="eyebrow" style={{justifyContent: 'center', display: 'flex'}}>ЛИЧНЫЙ КАБИНЕТ</span>
        <h1 className="page-title" style={{margin: '10px 0 25px', textAlign: 'center'}}>Вход</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Имя</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться?" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <button type="submit" className="primary-button checkout" style={{marginTop: '10px'}}>Войти →</button>
          <p className="summary-note">После входа вас перенаправит в кабинет.</p>
        </form>
      </div>
    </main>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;

  return (
    <main className="page inner-page">
      <span className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</span>
      <h1 className="page-title">Здравствуйте, {user.name}!</h1>
      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Профиль</h2>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className="dashboard-card">
          <h2>Корзина</h2>
          <p>Товаров: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
          <p>Сумма: {money(totalPrice)}</p>
          <button className="primary-button small" onClick={() => navigate('/cart')}>Открыть корзину</button>
        </div>
      </section>
    </main>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="page inner-page" style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <span className="eyebrow">404</span>
      <h1 className="page-title">Страница не найдена</h1>
      <p style={{marginBottom: '20px'}}>Похоже, такой истории на нашей полке нет.</p>
      <button className="primary-button" onClick={() => navigate('/')}>Вернуться в каталог</button>
    </main>
  );
}

export default function App() {
  const { theme } = useTheme();
  return (
    <div className={`app theme-${theme}`}>
      <Header />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}