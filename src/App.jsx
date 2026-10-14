import { useState } from "react";
import "./index.css";

const genres = [
  "All",
  "Werewolf",
  "Mafia",
  "Erotica",
  "LGBTQ",
  "Billionaire Drama",
  "Vampire",
  "Paranormal",
  "Christian Romance",
];

const books = [
  {
    id: 1,
    title: "The Alpha's Forbidden Luna",
    author: "Author Divine",
    genre: "Werewolf",
    status: "Ongoing",
    length: "Long",
    chapters: 42,
    cover: "🐺",
    color: "cover-purple",
    description:
      "She was forbidden to every Alpha in the kingdom. Unfortunately, fate had other plans. When an ancient bond awakens, she discovers that her existence could destroy the very world she was born into.",
  },
  {
    id: 2,
    title: "Married to the Mafia King",
    author: "Author Heiress",
    genre: "Mafia",
    status: "Completed",
    length: "Long",
    chapters: 48,
    cover: "🖤",
    color: "cover-black",
    description:
      "One contract. One dangerous man. One marriage she never wanted. But the deeper she enters his world, the harder it becomes to distinguish between a prison and a home.",
  },
  {
    id: 3,
    title: "The Billionaire's Secret",
    author: "Author Lena",
    genre: "Billionaire Drama",
    status: "Ongoing",
    length: "Short",
    chapters: 18,
    cover: "💎",
    color: "cover-blue",
    description:
      "A chance encounter leads to a secret arrangement with the city's most powerful billionaire. Neither expects the truth to change everything.",
  },
  {
    id: 4,
    title: "Bound by Eternal Night",
    author: "Author Divine",
    genre: "Vampire",
    status: "Completed",
    length: "Long",
    chapters: 36,
    cover: "🌙",
    color: "cover-red",
    description:
      "For centuries, he has lived without a heart. Then a mysterious stranger walks into his life carrying the one secret that could end his immortality.",
  },
  {
    id: 5,
    title: "The Light After Forever",
    author: "Author Lena",
    genre: "Christian Romance",
    status: "Ongoing",
    length: "Short",
    chapters: 15,
    cover: "🕊️",
    color: "cover-gold",
    description:
      "After heartbreak changes everything she believes about love, she begins a journey of faith, forgiveness, and unexpected second chances.",
  },
  {
    id: 6,
    title: "Shadows of Another Life",
    author: "Author Heiress",
    genre: "Paranormal",
    status: "Ongoing",
    length: "Long",
    chapters: 31,
    cover: "🔮",
    color: "cover-teal",
    description:
      "She sees things nobody else can see. When the shadows begin speaking her name, she must uncover the truth behind a forgotten world.",
  },
  {
    id: 7,
    title: "Love Without Labels",
    author: "Author Lena",
    genre: "LGBTQ",
    status: "Completed",
    length: "Short",
    chapters: 20,
    cover: "💜",
    color: "cover-pink",
    description:
      "Two people from different worlds discover a connection neither expected. Their journey challenges their fears and changes what they thought love could be.",
  },
  {
    id: 8,
    title: "The Billionaire's Arrangement",
    author: "Author Divine",
    genre: "Billionaire Drama",
    status: "Ongoing",
    length: "Long",
    chapters: 27,
    cover: "🥀",
    color: "cover-purple",
    description:
      "A simple agreement was supposed to solve all her problems. But living under the same roof as a man who trusts nobody makes keeping their distance impossible.",
  },
  {
    id: 9,
    title: "A Dangerous Desire",
    author: "Author Heiress",
    genre: "Erotica",
    status: "Completed",
    length: "Short",
    chapters: 16,
    cover: "🌹",
    color: "cover-red",
    description:
      "An intense attraction leads to unexpected choices, complicated feelings, and a secret neither of them can afford to reveal.",
  },
];

function App() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [activePage, setActivePage] = useState("Home");
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredBooks = books.filter((book) => {
    const matchesGenre =
      activeGenre === "All" || book.genre === activeGenre;

    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  const ongoingBooks = filteredBooks.filter(
    (book) => book.status === "Ongoing"
  );

  const completedBooks = filteredBooks.filter(
    (book) => book.status === "Completed"
  );

  function changePage(page) {
    setActivePage(page);
    setSelectedBook(null);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openGenre(genre) {
    setActiveGenre(genre);
    setActivePage("Home");
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => changePage("Home")}
          aria-label="Fictional World home"
        >
          <img
            src="/logo.png"
            alt="Fictional World Library"
            className="brand-logo"
          />
          <span className="brand-name">
            FICTIONAL <span>WORLD</span>
          </span>
        </button>

        <div className="desktop-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search stories or authors..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle appearance"
            aria-label="Toggle appearance"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <button
            className="login-button"
            onClick={() => changePage("Profile")}
          >
            Sign in
          </button>
        </div>
      </header>

      <main className="main-content">
        {activePage === "Home" && !selectedBook && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">
                  YOUR NEXT OBSESSION STARTS HERE
                </span>

                <h1>
                  Every world
                  <br />
                  has a <span>story.</span>
                </h1>

                <p>
                  Discover unforgettable characters, impossible love,
                  dangerous secrets, and endless adventures.
                </p>

                <button
                  className="primary-button"
                  onClick={() => {
                    document
                      .getElementById("discover")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Stories <span>→</span>
                </button>

                <div className="hero-stats">
                  <div>
                    <strong>8</strong>
                    <span>Genres</span>
                  </div>
                  <div>
                    <strong>∞</strong>
                    <span>Possibilities</span>
                  </div>
                  <div>
                    <strong>24/7</strong>
                    <span>Read anytime</span>
                  </div>
                </div>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="moon">☾</div>
                <div className="floating-book">✦</div>
                <div className="hero-orbit orbit-one"></div>
                <div className="hero-orbit orbit-two"></div>
                <div className="hero-caption">
                  <span>TURN THE PAGE</span>
                  <strong>Enter another world.</strong>
                </div>
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
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={
                      activeGenre === genre
                        ? "genre-chip selected"
                        : "genre-chip"
                    }
                    onClick={() => openGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </section>

            <section className="book-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
                  <h2>
                    {activeGenre === "All"
                      ? "Ongoing stories"
                      : `${activeGenre} stories`}
                  </h2>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActiveGenre("All")}
                >
                  View all →
                </button>
              </div>

              <div className="book-grid">
                {ongoingBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => setSelectedBook(book)}
                  />
                ))}
              </div>

              {ongoingBooks.length === 0 && (
                <p className="empty-message">
                  No ongoing stories found. Try another genre.
                </p>
              )}
            </section>

            <section className="book-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">THE STORY IS COMPLETE</span>
                  <h2>Completed stories</h2>
                </div>
              </div>

              <div className="book-grid">
                {completedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => setSelectedBook(book)}
                  />
                ))}
              </div>

              {completedBooks.length === 0 && (
                <p className="empty-message">
                  No completed stories found.
                </p>
              )}
            </section>
          </>
        )}

        {activePage === "Home" && selectedBook && (
          <section className="book-details">
            <button
              className="back-button"
              onClick={() => setSelectedBook(null)}
            >
              ← Back to stories
            </button>

            <div className="details-layout">
              <div
                className={`detail-cover ${selectedBook.color}`}
              >
                <span className="cover-decoration">
                  {selectedBook.cover}
                </span>
                <span className="cover-brand">FICTIONAL WORLD</span>
              </div>

              <div className="details-info">
                <span className="eyebrow">{selectedBook.genre}</span>
                <h1>{selectedBook.title}</h1>
                <p className="detail-author">
                  By {selectedBook.author}
                </p>

                <div className="detail-tags">
                  <span>{selectedBook.status}</span>
                  <span>{selectedBook.length} story</span>
                  <span>{selectedBook.chapters} chapters</span>
                </div>

                <h3>About this story</h3>
                <p className="detail-description">
                  {selectedBook.description}
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    alert(
                      "The chapter reader will be connected to Supabase in Part 2."
                    )
                  }
                >
                  Start Reading →
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    alert(
                      "Your personal library will be connected in Part 2."
                    )
                  }
                >
                  + Add to Library
                </button>
              </div>
            </div>
          </section>
        )}

        {activePage !== "Home" && (
          <section className="placeholder-page">
            <span className="placeholder-icon">
              {activePage === "Library" && "▤"}
              {activePage === "Notifications" && "♧"}
              {activePage === "Profile" && "◉"}
              {activePage === "Wallet" && "◇"}
              {activePage === "Customer Service" && "✉"}
              {activePage === "Settings" && "⚙"}
            </span>

            <span className="eyebrow">FICTIONAL WORLD LIBRARY</span>
            <h1>{activePage}</h1>

            <p>
              This section will be connected to your Supabase
              database in the next parts.
            </p>

            <button
              className="primary-button"
              onClick={() => changePage("Home")}
            >
              Return Home →
            </button>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="" />
          <div>
            <strong>FICTIONAL WORLD</strong>
            <span>All Readers · All Genres · Endless Stories</span>
          </div>
        </div>

        <p>© {new Date().getFullYear()} Fictional World Library</p>
      </footer>

      <nav className="bottom-nav">
        <NavButton
          icon="⌂"
          label="Home"
          active={activePage === "Home"}
          onClick={() => changePage("Home")}
        />

        <NavButton
          icon="▤"
          label="Library"
          active={activePage === "Library"}
          onClick={() => changePage("Library")}
        />

        <button
          className={
            menuOpen ? "nav-button menu-active" : "nav-button"
          }
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="nav-icon">•••</span>
          <span>More</span>
        </button>

        <NavButton
          icon="♧"
          label="Notifications"
          active={activePage === "Notifications"}
          onClick={() => changePage("Notifications")}
        />

        <NavButton
          icon="◉"
          label="Profile"
          active={activePage === "Profile"}
          onClick={() => changePage("Profile")}
        />
      </nav>

      {menuOpen && (
        <div className="menu-popup">
          <button onClick={() => changePage("Wallet")}>
            ◇ <span>Wallet</span>
          </button>
          <button onClick={() => changePage("Customer Service")}>
            ✉ <span>Customer Service</span>
          </button>
          <button onClick={() => changePage("Settings")}>
            ⚙ <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, onClick }) {
  return (
    <button className="book-card" onClick={onClick}>
      <div className={`book-cover ${book.color}`}>
        <span className="cover-decoration">{book.cover}</span>
        <span className="cover-brand">FICTIONAL WORLD</span>

        <span className="cover-status">
          {book.status === "Completed" ? "COMPLETE" : "ONGOING"}
        </span>
      </div>

      <div className="book-card-info">
        <span className="book-genre">{book.genre}</span>
        <h3>{book.title}</h3>
        <p>{book.author}</p>

        <div className="book-card-bottom">
          <span>{book.chapters} chapters</span>
          <span>Read →</span>
        </div>
      </div>
    </button>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      className={active ? "nav-button active" : "nav-button"}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default App;
