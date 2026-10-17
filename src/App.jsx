import { useState } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Library,
  Bell,
  UserRound,
  Wallet,
  Settings,
  Headphones,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  LockKeyhole,
  LogIn,
  UserPlus,
  BookMarked,
  CreditCard,
  CircleHelp,
} from 'lucide-react';
import { supabase } from './lib/supabase';

const GENRES = [
  'All',
  'Werewolf',
  'Mafia',
  'Billionaire Drama',
  'Vampire',
  'Paranormal',
  'LGBTQ',
  'Erotica',
  'Christian Romance',
];

const SAMPLE_BOOKS = [
  {
    id: 'sample-1',
    title: "The Alpha's Forbidden Luna",
    author_name: 'Divine',
    genre: 'Werewolf',
    status: 'Ongoing',
    synopsis:
      'Bound by a secret neither can escape, an Alpha and the woman destined to change his world must choose between duty and desire.',
    cover_url: '',
  },
  {
    id: 'sample-2',
    title: 'Married to the Mafia King',
    author_name: 'Heiress',
    genre: 'Mafia',
    status: 'Ongoing',
    synopsis:
      'A marriage arranged to settle a dangerous debt becomes a battle of secrets, loyalty, and unexpected feelings.',
    cover_url: '',
  },
  {
    id: 'sample-3',
    title: 'The Billionaire’s Secret',
    author_name: 'Fictional World',
    genre: 'Billionaire Drama',
    status: 'Completed',
    synopsis:
      'She wanted a fresh start. He needed someone who would never discover the truth behind his fortune.',
    cover_url: '',
  },
  {
    id: 'sample-4',
    title: 'Marked by Midnight',
    author_name: 'Fictional World',
    genre: 'Paranormal',
    status: 'Ongoing',
    synopsis:
      'An unexplained mark draws a young woman into a world that should never have existed.',
    cover_url: '',
  },
  {
    id: 'sample-5',
    title: 'The Vampire’s Promise',
    author_name: 'Fictional World',
    genre: 'Vampire',
    status: 'Completed',
    synopsis:
      'A promise made centuries ago returns to change two lives forever.',
    cover_url: '',
  },
  {
    id: 'sample-6',
    title: 'A Love Beyond Time',
    author_name: 'Fictional World',
    genre: 'Christian Romance',
    status: 'Ongoing',
    synopsis:
      'Two people rebuilding their lives discover that hope can arrive when it is least expected.',
    cover_url: '',
  },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

function App() {
  const [page, setPage] = useState('home');
  const [genre, setGenre] = useState('All');
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState(SAMPLE_BOOKS);
  const [selectedBook, setSelectedBook] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [walletMenu, setWalletMenu] = useState(false);

  async function loadBooks() {
    const { data, error } = await supabase
      .from('books')
      .select(
        'id, title, cover_url, genre, length, status, synopsis, author_name, tags'
      )
      .limit(100);

    if (error) {
      console.error('Could not load books:', error.message);
      return;
    }

    if (data?.length) {
      setBooks(data);
    }
  }

  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUser(session.user);
    }
  }

  useState(() => {
    loadBooks();
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const visibleBooks = books.filter((book) => {
    const matchesGenre =
      genre === 'All' || book.genre === genre;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      book.title?.toLowerCase().includes(query) ||
      book.author_name?.toLowerCase().includes(query) ||
      book.genre?.toLowerCase().includes(query);

    return matchesGenre && matchesSearch;
  });

  async function handleAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (authMode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: { name: authName },
          },
        });

        if (error) throw error;

        if (data.session) {
          setUser(data.user);
          setPage('profile');
          setMessage('Your account has been created.');
        } else {
          setMessage(
            'Check your email to confirm your account, then sign in.'
          );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        setUser(data.user);
        setPage('profile');
        setMessage('Welcome back.');
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    setUser(null);
    setPage('home');
    setMessage('You have signed out.');
  }

  function navigate(nextPage) {
    setPage(nextPage);
    setSelectedBook(null);
    setMobileMenu(false);
    setWalletMenu(false);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openBook(book) {
    setSelectedBook(book);
    setPage('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isDark = darkMode;

  return (
    <div className={isDark ? 'app dark' : 'app light'}>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate('home')}
          aria-label="Fictional World Library home"
        >
          <span className="brand-icon">
            <BookOpen size={24} />
          </span>
          <span className="brand-name">
            FICTIONAL <strong>WORLD</strong>
            <small>LIBRARY</small>
          </span>
        </button>

        <div className="desktop-search">
          <Search size={18} />
          <input
            aria-label="Search books"
            placeholder="Search books or authors..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage('home');
            }}
          />
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle appearance"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            className="icon-button"
            onClick={() => navigate('notifications')}
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>

          <button
            className="header-account"
            onClick={() => navigate('profile')}
          >
            <UserRound size={17} />
            <span>{user ? 'My Account' : 'Sign in'}</span>
          </button>

          <button
            className="icon-button mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Open menu"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {mobileMenu && (
        <nav className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          <button onClick={() => navigate('wallet')}>
            <Wallet size={18} /> Wallet
          </button>
          <button onClick={() => navigate('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
      )}

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <p className="sidebar-heading">DISCOVER</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  page === item.id ? 'active' : ''
                }`}
                onClick={() => navigate(item.id)}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <p className="sidebar-heading">YOUR ACCOUNT</p>
            <button
              className={`nav-item ${
                page === 'wallet' ? 'active' : ''
              }`}
              onClick={() => navigate('wallet')}
            >
              <Wallet size={19} />
              <span>Wallet</span>
            </button>

            <button
              className={`nav-item ${
                page === 'subscription' ? 'active' : ''
              }`}
              onClick={() => navigate('subscription')}
            >
              <CreditCard size={19} />
              <span>Subscription</span>
            </button>

            <button
              className={`nav-item ${
                page === 'settings' ? 'active' : ''
              }`}
              onClick={() => navigate('settings')}
            >
              <Settings size={19} />
              <span>Settings</span>
            </button>
          </div>

          <div className="sidebar-bottom">
            <div className="help-box">
              <CircleHelp size={23} />
              <strong>Need help?</strong>
              <p>We're here to help with your reading experience.</p>
              <button onClick={() => navigate('customer-service')}>
                Contact support <ChevronRight size={15} />
              </button>
            </div>
            <small>© {new Date().getFullYear()} Fictional World</small>
          </div>
        </aside>

        <main className="main-content">
          {message && (
            <div className="message-banner" role="status">
              <span>{message}</span>
              <button
                className="message-close"
                onClick={() => setMessage('')}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {page === 'home' && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <span className="eyebrow">
                    YOUR NEXT OBSESSION STARTS HERE
                  </span>
                  <h1>
                    Every story
                    <br />
                    opens a <em>new world.</em>
                  </h1>
                  <p>
                    Discover unforgettable characters, unexpected
                    twists, and stories that stay with you long after
                    the final page.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() =>
                      document
                        .getElementById('discover')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Explore stories <ChevronRight size={18} />
                  </button>
                </div>
                <div className="hero-art">
                  <div className="hero-orbit orbit-one" />
                  <div className="hero-orbit orbit-two" />
                  <BookOpen size={94} strokeWidth={1} />
                  <span className="hero-art-caption">
                    STORIES WITHOUT LIMITS
                  </span>
                </div>
              </section>

              <section className="genre-section" id="discover">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">FIND YOUR NEXT READ</span>
                    <h2>Explore genres</h2>
                  </div>
                </div>
                <div className="genre-list">
                  {GENRES.map((item) => (
                    <button
                      key={item}
                      className={`genre-chip ${
                        genre === item ? 'selected' : ''
                      }`}
                      onClick={() => setGenre(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              <BookSection
                title="Discover your next favourite"
                subtitle="Stories selected for your next reading session"
                books={visibleBooks}
                onBookClick={openBook}
              />

              <BookSection
                title="Ongoing stories"
                subtitle="Follow every new chapter"
                books={visibleBooks.filter(
                  (book) => book.status?.toLowerCase() === 'ongoing'
                )}
                onBookClick={openBook}
              />

              <BookSection
                title="Completed stories"
                subtitle="Enjoy the story from beginning to end"
                books={visibleBooks.filter(
                  (book) => book.status?.toLowerCase() === 'completed'
                )}
                onBookClick={openBook}
              />
            </>
          )}

          {page === 'book' && selectedBook && (
            <section className="page-section book-detail">
              <button
                className="back-button"
                onClick={() => navigate('home')}
              >
                ← Back to discovery
              </button>
              <div className="book-detail-layout">
                <BookCover book={selectedBook} large />
                <div className="book-detail-copy">
                  <span className="eyebrow">{selectedBook.genre}</span>
                  <h1>{selectedBook.title}</h1>
                  <p className="book-author">
                    By {selectedBook.author_name || 'Unknown author'}
                  </p>
                  <span className="status-pill">
                    {selectedBook.status || 'Ongoing'}
                  </span>
                  <p className="book-synopsis">
                    {selectedBook.synopsis ||
                      'Discover this story on Fictional World Library.'}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => {
                      if (!user) {
                        setAuthMode('login');
                        navigate('profile');
                        setMessage('Sign in to begin reading.');
                      } else {
                        navigate('reader');
                        setMessage(
                          'Chapter reading will be connected to the secure chapter system.'
                        );
                      }
                    }}
                  >
                    <BookOpen size={18} /> Start reading
                  </button>
                </div>
              </div>
            </section>
          )}

          {page === 'reader' && (
            <section className="page-section">
              <h1>Reading room</h1>
              <p>
                Secure chapter loading and unlocking will use your
                existing Supabase chapter functions.
              </p>
              <div className="notice-box">
                <LockKeyhole size={22} />
                <div>
                  <strong>Reading system integration</strong>
                  <p>
                    The chapter list, content loading, and coin
                    deductions must be connected before readers can
                    unlock paid chapters.
                  </p>
                </div>
              </div>
            </section>
          )}

          {page === 'library' && (
            <section className="page-section">
              <PageTitle
                eyebrow="YOUR READING SPACE"
                title="My Library"
                description="Keep track of the stories you love."
              />
              {!user ? (
                <EmptyState
                  icon={Library}
                  title="Your library awaits"
                  text="Sign in to access your saved books and reading history."
                  action="Sign in"
                  onAction={() => navigate('profile')}
                />
              ) : (
                <EmptyState
                  icon={BookMarked}
                  title="Your library is ready"
                  text="Saved books and reading progress will appear here when library integration is connected."
                />
              )}
            </section>
          )}

          {page === 'notifications' && (
            <section className="page-section">
              <PageTitle
                eyebrow="STAY UP TO DATE"
                title="Notifications"
                description="Updates about your books and account."
              />
              <EmptyState
                icon={Bell}
                title="You're all caught up"
                text="New chapter alerts and account notifications will appear here."
              />
            </section>
          )}

          {page === 'profile' && (
            <section className="page-section auth-page">
              {!user ? (
                <div className="auth-card">
                  <span className="eyebrow">YOUR READING JOURNEY</span>
                  <h1>
                    {authMode === 'register'
                      ? 'Create your account'
                      : 'Welcome back'}
                  </h1>
                  <p>
                    {authMode === 'register'
                      ? 'Join Fictional World Library and discover your next favourite story.'
                      : 'Sign in to continue your reading journey.'}
                  </p>

                  <form onSubmit={handleAuth}>
                    {authMode === 'register' && (
                      <label>
                        Your name
                        <input
                          type="text"
                          value={authName}
                          onChange={(event) =>
                            setAuthName(event.target.value)
                          }
                          placeholder="Enter your name"
                          required
                        />
                      </label>
                    )}

                    <label>
                      Email address
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(event) =>
                          setAuthEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        required
                      />
                    </label>

                    <label>
                      Password
                      <input
  
