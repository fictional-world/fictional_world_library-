import { useState, useEffect } from "react";
import {
  Search,
  Home,
  Library,
  Bell,
  User,
  Menu,
  Wallet,
  Settings,
  Headphones,
  BookOpen,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  LogIn,
  X,
  Plus,
} from "lucide-react";

import { supabase } from "./supabase.js";
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

const sampleBooks = [
  {
    id: "sample-1",
    title: "The Alpha's Forbidden Luna",
    author: "Divine",
    genre: "Werewolf",
    cover: "/logo.png",
    synopsis:
      "She was the one woman he could never claim. But fate had other plans for the Alpha and the woman destined to change his world.",
    status: "Ongoing",
    length: "Long",
    chapters: 45,
    tags: ["Werewolf", "Romance", "Alpha"],
  },
  {
    id: "sample-2",
    title: "Married to the Mafia King",
    author: "Heiress",
    genre: "Mafia",
    cover: "/logo.png",
    synopsis:
      "A marriage she never wanted binds her to a dangerous man. In his world, love can be more dangerous than betrayal.",
    status: "Ongoing",
    length: "Long",
    chapters: 38,
    tags: ["Mafia", "Romance", "Drama"],
  },
  {
    id: "sample-3",
    title: "The Billionaire's Secret",
    author: "Rose",
    genre: "Billionaire Drama",
    cover: "/logo.png",
    synopsis:
      "One unexpected meeting changes everything when a powerful billionaire discovers the woman he underestimated holds his greatest secret.",
    status: "Completed",
    length: "Short",
    chapters: 20,
    tags: ["Billionaire", "Romance", "Drama"],
  },
  {
    id: "sample-4",
    title: "Bound by Eternal Night",
    author: "Luna",
    genre: "Vampire",
    cover: "/logo.png",
    synopsis:
      "An ancient secret connects a mortal woman to a vampire who has spent centuries avoiding the one thing he cannot control: love.",
    status: "Ongoing",
    length: "Long",
    chapters: 52,
    tags: ["Vampire", "Paranormal", "Romance"],
  },
  {
    id: "sample-5",
    title: "The Light After Forever",
    author: "Grace",
    genre: "Christian Romance",
    cover: "/logo.png",
    synopsis:
      "After heartbreak takes away everything she believed in, a new beginning challenges her to rediscover faith, forgiveness, and love.",
    status: "Completed",
    length: "Short",
    chapters: 18,
    tags: ["Christian Romance", "Faith", "Love"],
  },
  {
    id: "sample-6",
    title: "Shadows of Another Life",
    author: "Avery",
    genre: "Paranormal",
    cover: "/logo.png",
    synopsis:
      "Strange dreams and unexplained memories lead a young woman toward a truth that could change her understanding of reality.",
    status: "Ongoing",
    length: "Long",
    chapters: 41,
    tags: ["Paranormal", "Mystery", "Romance"],
  },
  {
    id: "sample-7",
    title: "Love Without Labels",
    author: "Jordan",
    genre: "LGBTQ",
    cover: "/logo.png",
    synopsis:
      "Two people from different worlds find a connection that challenges their fears and everything they thought they knew about love.",
    status: "Completed",
    length: "Short",
    chapters: 22,
    tags: ["LGBTQ", "Romance", "Drama"],
  },
  {
    id: "sample-8",
    title: "The Billionaire's Arrangement",
    author: "Victoria",
    genre: "Billionaire Drama",
    cover: "/logo.png",
    synopsis:
      "A business arrangement is supposed to be simple. But living under the same roof makes keeping their hearts out of the deal impossible.",
    status: "Ongoing",
    length: "Long",
    chapters: 35,
    tags: ["Billionaire", "Romance", "Drama"],
  },
  {
    id: "sample-9",
    title: "A Dangerous Desire",
    author: "Scarlett",
    genre: "Mafia",
    cover: "/logo.png",
    synopsis:
      "Drawn into a world of power and dangerous secrets, she must decide whether the man she desires is worth the risk.",
    status: "Ongoing",
    length: "Short",
    chapters: 16,
    tags: ["Mafia", "Romance", "Suspense"],
  },
];

function formatBook(book) {
  return {
    id: book.id,
    title: book.title || "Untitled Book",
    author: book.author_name || book.author || "Unknown Author",
    genre: book.genre || "Romance",
    cover: book.cover_url || book.cover || "/logo.png",
    synopsis: book.synopsis || "Discover this story on Fictional World Library.",
    status:
      String(book.status || "Ongoing").toLowerCase() === "completed"
        ? "Completed"
        : "Ongoing",
    length:
      String(book.length || "long").toLowerCase() === "short"
        ? "Short"
        : "Long",
    chapters: Number(book.chapter_count || book.chapters || 0),
    tags: Array.isArray(book.tags)
      ? book.tags
      : typeof book.tags === "string"
        ? book.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
  };
}

function BookCard({ book, onClick }) {
  return (
    <button className="book-card" onClick={() => onClick(book)}>
      <div className="book-cover">
        <img
          src={book.cover}
          alt={book.title}
          onError={(event) => {
            event.currentTarget.src = "/logo.png";
          }}
        />

        <span className="book-status">{book.status}</span>
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="book-author">By {book.author}</p>

        <div className="book-meta">
          <span>{book.genre}</span>
          <span>{book.length}</span>
        </div>
      </div>
    </button>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      className={`nav-button ${active ? "active" : ""}`}
      onClick={onClick}
      aria-label={label}
    >
      <Icon size={21} />
      <span>{label}</span>
    </button>
  );
    }export default function App() {
  const [books, setBooks] = useState(sampleBooks);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("Home");
  const [selectedBook, setSelectedBook] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Could not load books:", error.message);
          return;
        }

        if (active && data && data.length > 0) {
          setBooks(data.map(formatBook));
        }
      } catch (error) {
        console.error("Book loading error:", error);
      } finally {
        if (active) {
          setLoadingBooks(false);
        }
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const filteredBooks = books.filter((book) => {
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;

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

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function openPage(page) {
    setActivePage(page);
    setSelectedBook(null);
    setMenuOpen(false);
  }

  function openBook(book) {
    setSelectedBook(book);
  }

  function addToLibrary(book) {
    const saved = JSON.parse(
      localStorage.getItem("fictionalWorldLibrary") || "[]"
    );

    const alreadySaved = saved.some(
      (item) => String(item.id) === String(book.id)
    );

    if (alreadySaved) {
      showNotice("This book is already in your library.");
      return;
    }

    saved.push(book);
    localStorage.setItem("fictionalWorldLibrary", JSON.stringify(saved));
    showNotice("Book added to your library.");
  }

  const savedBooks = JSON.parse(
    localStorage.getItem("fictionalWorldLibrary") || "[]"
  );

  function renderBookGrid(bookList) {
    if (bookList.length === 0) {
      return (
        <div className="empty-state">
          <BookOpen size={35} />
          <h3>No books found</h3>
          <p>Try another genre or search for a different title.</p>
        </div>
      );
    }

    return (
      <div className="book-grid">
        {bookList.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={openBook}
          />
        ))}
      </div>
    );
  }

  function renderBookSection(title, bookList) {
    if (bookList.length === 0) return null;

    return (
      <section className="content-section">
        <div className="section-heading">
          <h2>{title}</h2>
          <button
            className="text-button"
            onClick={() => showNotice("More books will appear here as they are added.")}
          >
            Explore <ChevronRight size={16} />
          </button>
        </div>

        {renderBookGrid(bookList)}
      </section>
    );
  }

  function renderHome() {
    return (
      <>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT OBSESSION STARTS HERE</span>
            <h1>Enter a World Beyond Imagination.</h1>
            <p>
              Discover unforgettable stories, dangerous secrets, forbidden
              love, and characters you'll never forget.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("discover-books")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <BookOpen size={18} /> Discover Stories
            </button>
          </div>
        </section>

        <section className="content-section" id="discover-books">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR NEXT READ</span>
              <h2>Discover</h2>
            </div>
          </div>

          <div className="search-box">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search books, authors, genres..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={17} />
              </button>
            )}
          </div>

          <div className="genre-list">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-chip ${
                  selectedGenre === genre ? "selected" : ""
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        {loadingBooks && (
          <p className="loading-message">Loading stories...</p>
        )}

        {renderBookSection("Trending Stories", filteredBooks)}

        {renderBookSection("Ongoing Stories", ongoingBooks)}

        {renderBookSection("Completed Stories", completedBooks)}
      </>
    );
                }  function renderBookDetails() {
    if (!selectedBook) return null;

    return (
      <main className="page-content detail-page">
        <button
          className="back-button"
          onClick={() => setSelectedBook(null)}
        >
          <ChevronLeft size={19} /> Back to Discover
        </button>

        <div className="book-detail">
          <img
            className="detail-cover"
            src={selectedBook.cover}
            alt={selectedBook.title}
            onError={(event) => {
              event.currentTarget.src = "/logo.png";
            }}
          />

          <div className="detail-info">
            <span className="eyebrow">{selectedBook.genre}</span>
            <h1>{selectedBook.title}</h1>
            <p className="book-author">By {selectedBook.author}</p>

            <div className="detail-tags">
              <span>{selectedBook.status}</span>
              <span>{selectedBook.length} Story</span>
              <span>{selectedBook.chapters} Chapters</span>
            </div>

            <h3>Synopsis</h3>
            <p className="synopsis">{selectedBook.synopsis}</p>

            <button
              className="primary-button"
              onClick={() =>
                showNotice(
                  "Chapter reading will be available when chapters are connected."
                )
              }
            >
              <BookOpen size={18} /> Start Reading
            </button>

            <button
              className="secondary-button"
              onClick={() => addToLibrary(selectedBook)}
            >
              <Plus size={18} /> Add to Library
            </button>
          </div>
        </div>
      </main>
    );
  }

  function renderLibrary() {
    return (
      <main className="page-content">
        <div className="page-heading">
          <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
          <h1>My Library</h1>
          <p>Keep your favourite stories close.</p>
        </div>

        {renderBookGrid(savedBooks)}
      </main>
    );
  }

  function renderNotifications() {
    return (
      <main className="page-content">
        <div className="page-heading">
          <span className="eyebrow">STAY IN THE LOOP</span>
          <h1>Notifications</h1>
        </div>

        <div className="empty-state">
          <Bell size={35} />
          <h3>You're all caught up</h3>
          <p>New chapter alerts and updates will appear here.</p>
        </div>
      </main>
    );
  }

  function renderProfile() {
    return (
      <main className="page-content">
        <div className="page-heading">
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>My Profile</h1>
        </div>

        <div className="placeholder-card">
          <div className="profile-avatar">
            <User size={35} />
          </div>
          <h2>Welcome to Fictional World</h2>
          <p>
            Sign-in and account management will be connected in the next
            development stage.
          </p>
          <button
            className="primary-button"
            onClick={() =>
              showNotice("Account registration is not connected yet.")
            }
          >
            <LogIn size={18} /> Login / Sign Up
          </button>
        </div>
      </main>
    );
  }

  function renderUtilityPage(page) {
    const descriptions = {
      Wallet:
        "Your coin balance, top-ups, transactions, chapter unlocks, and subscriptions will appear here.",
      "Customer Service":
        "Need help? Contact fictionalworldlibary@gmail.com for assistance.",
      Settings:
        "Manage your preferences, appearance, account, and reading experience.",
      "About Us":
        "Fictional World Library brings readers and unforgettable stories together.",
      "Be our Author":
        "Ready to share your story? Prepare your manuscript and contact fictionalworldlibary@gmail.com to enquire about author submissions.",
      "Terms & Conditions":
        "Our terms will explain reader accounts, purchases, subscriptions, and content guidelines.",
    };

    return (
      <main className="page-content">
        <div className="page-heading">
          <span className="eyebrow">FICTIONAL WORLD LIBRARY</span>
          <h1>{page}</h1>
        </div>

        <div className="placeholder-card">
          {page === "Wallet" ? (
            <Wallet size={35} />
          ) : page === "Settings" ? (
            <Settings size={35} />
          ) : (
            <BookOpen size={35} />
          )}

          <p>{descriptions[page] || "This section is coming soon."}</p>

          {page === "Settings" && (
            <button
              className="secondary-button"
              onClick={() => setDarkMode((previous) => !previous)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              Switch to {darkMode ? "Light" : "Dark"} Mode
            </button>
          )}

          {page === "Wallet" && (
            <button
              className="primary-button"
              onClick={() =>
                showNotice("Payments will be connected after checkout setup.")
              }
            >
              <Plus size={18} /> Top Up Coins
            </button>
          )}

          {page === "Customer Service" && (
            <a
              className="primary-button"
              href="mailto:fictionalworldlibary@gmail.com"
            >
              <Headphones size={18} /> Contact Support
            </a>
          )}

          {page === "Be our Author" && (
            <a
              className="primary-button"
              href="mailto:fictionalworldlibary@gmail.com?subject=Author%20Application"
            >
              Contact Us About Publishing
            </a>
          )}
        </div>
      </main>
    );
  }  function renderCurrentPage() {
    if (selectedBook) return renderBookDetails();

    switch (activePage) {
      case "Home":
        return renderHome();

      case "Library":
        return renderLibrary();

      case "Notifications":
        return renderNotifications();

      case "Profile":
        return renderProfile();

      default:
        return renderUtilityPage(activePage);
    }
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="app-header">
        <button
          className="brand"
          onClick={() => openPage("Home")}
          aria-label="Fictional World Library homepage"
        >
          <img src="/logo.png" alt="Fictional World Library" />
          <span>
            Fictional World
            <small>LIBRARY</small>
          </span>
        </button>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setDarkMode((previous) => !previous)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            className="icon-button"
            onClick={() => openPage("Profile")}
            aria-label="Profile"
          >
            <User size={19} />
          </button>
        </div>
      </header>

      {renderCurrentPage()}

      <footer className="app-footer">
        <img src="/logo.png" alt="" />
        <p>Stories that take you beyond imagination.</p>
        <p>© {new Date().getFullYear()} Fictional World Library</p>
      </footer>

      <nav className="bottom-nav">
        <NavButton
          icon={Home}
          label="Home"
          active={activePage === "Home" && !selectedBook}
          onClick={() => openPage("Home")}
        />

        <NavButton
          icon={Library}
          label="Library"
          active={activePage === "Library"}
          onClick={() => openPage("Library")}
        />

        <button
          className={`nav-button more-button ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="More options"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
          <span>More</span>
        </button>

        <NavButton
          icon={Bell}
          label="Alerts"
          active={activePage === "Notifications"}
          onClick={() => openPage("Notifications")}
        />

        <NavButton
          icon={User}
          label="Profile"
          active={activePage === "Profile"}
          onClick={() => openPage("Profile")}
        />
      </nav>

      {menuOpen && (
        <div className="menu-popup">
          <button onClick={() => openPage("Wallet")}>
            <Wallet size={19} /> Wallet
          </button>

          <button onClick={() => openPage("Customer Service")}>
            <Headphones size={19} /> Customer Service
          </button>

          <button onClick={() => openPage("Be our Author")}>
            <BookOpen size={19} /> Be our Author
          </button>

          <button onClick={() => openPage("Settings")}>
            <Settings size={19} /> Settings
          </button>

          <button onClick={() => openPage("About Us")}>
            <Clock size={19} /> About Us
          </button>

          <button onClick={() => openPage("Terms & Conditions")}>
            <CheckCircle size={19} /> Terms & Conditions
          </button>
        </div>
      )}

      {notice && <div className="toast-message">{notice}</div>}
    </div>
  );
}
