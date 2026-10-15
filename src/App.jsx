import { useState, useEffect } from "react";
import {
  Search, Home, Library, Bell, User, Menu, Wallet,
  Settings, Headphones, BookOpen, ChevronRight,
  ArrowLeft, Moon, Sun, Heart, Clock, CheckCircle,
  Lock, Coins, LogIn, LogOut, UserPlus, Shield,
  BookMarked, History, CreditCard, Mail, Info,
  FileText, Plus, Edit, Trash2, Eye, Upload,
  Users, BarChart3, TrendingUp, Check, Crown,
  Languages, CircleHelp, X, Bookmark, Star,
  Send, RefreshCw, Calendar, SearchX, Sparkles
} from "lucide-react";
import { supabase } from "./supabase";
import "./index.css";

const SITE_NAME = "Fictional World Library";
const SUPPORT_EMAIL = "fictionalworldlibary@gmail.com";
const ADMIN_EMAIL = "fictionalworldlibary@gmail.com";
const UNLOCK_COST = 10;

const GENRES = [
  "All",
  "Werewolf",
  "Mafia",
  "Erotica",
  "LGBTQ",
  "Billionaire Drama",
  "Vampire",
  "Paranormal",
  "Christian Romance"
];

const SUBSCRIPTION_PLANS = [
  {
    name: "Readers Pass",
    monthly: 5.99,
    yearly: 49.99,
    coins: 50,
    discount: 5
  },
  {
    name: "VIP",
    monthly: 9.99,
    yearly: 89.99,
    coins: 150,
    discount: 9
  },
  {
    name: "Exclusive",
    monthly: 19.99,
    yearly: 179.99,
    coins: 300,
    discount: 15
  }
];

const COIN_PACKAGES = [
  { coins: 100, price: 2.99 },
  { coins: 300, price: 7.99 },
  { coins: 600, price: 14.99 },
  { coins: 1200, price: 27.99 }
];

const SAMPLE_BOOKS = [
  {
    id: "sample-1",
    title: "The Alpha's Forbidden Luna",
    author_name: "Divine",
    genre: "Werewolf",
    status: "ongoing",
    length: "long",
    cover_url: "/logo.png",
    synopsis:
      "An unexpected bond draws a young woman into the dangerous world of an alpha who must choose between duty and desire.",
    tags: "Alpha, Fated Mates, Romance"
  },
  {
    id: "sample-2",
    title: "Married to the Mafia King",
    author_name: "Heiress",
    genre: "Mafia",
    status: "ongoing",
    length: "long",
    cover_url: "/logo.png",
    synopsis:
      "A marriage neither of them wanted becomes a dangerous game of secrets, loyalty, and unexpected feelings.",
    tags: "Mafia, Arranged Marriage, Romance"
  },
  {
    id: "sample-3",
    title: "The Billionaire's Secret",
    author_name: "Anonymous",
    genre: "Billionaire Drama",
    status: "completed",
    length: "short",
    cover_url: "/logo.png",
    synopsis:
      "One secret threatens to change everything when an ordinary woman discovers the truth about the man she loves.",
    tags: "Billionaire, Secrets, Romance"
  },
  {
    id: "sample-4",
    title: "Bound by Midnight",
    author_name: "Anonymous",
    genre: "Vampire",
    status: "ongoing",
    length: "long",
    cover_url: "/logo.png",
    synopsis:
      "A chance encounter with an immortal stranger pulls a young woman into a world she never knew existed.",
    tags: "Vampire, Paranormal, Romance"
  }
];

const formatBook = (book) => ({
  ...book,
  author_name: book.author_name || book.author || "Unknown Author",
  cover_url: book.cover_url || "/logo.png",
  synopsis:
    book.synopsis ||
    "Discover this story at Fictional World Library.",
  status: book.status || "ongoing",
  length: book.length || "long",
  genre: book.genre || "Romance"
});

function Notice({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="notice" role="status">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close notice">
        <X size={18} />
      </button>
    </div>
  );
}

function PageHeading({ title, subtitle, onBack }) {
  return (
    <div className="page-heading">
      {onBack && (
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function BookCard({ book, onOpen, saved, onSave }) {
  return (
    <article className="book-card">
      <button
        className="book-cover-button"
        onClick={() => onOpen(book)}
        aria-label={`Open ${book.title}`}
      >
        <img
          className="book-cover"
          src={book.cover_url}
          alt={book.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/logo.png";
          }}
        />
        <span className="book-status">
          {book.status === "completed" ? "Completed" : "Ongoing"}
        </span>
      </button>

      <div className="book-card-info">
        <button
          className="book-title"
          onClick={() => onOpen(book)}
        >
          {book.title}
        </button>

        <p className="book-author">{book.author_name}</p>
        <p className="book-genre">{book.genre}</p>

        <div className="book-card-actions">
          <button onClick={() => onOpen(book)}>
            Read more <ChevronRight size={15} />
          </button>

          <button
            onClick={() => onSave(book)}
            aria-label={saved ? "Remove from library" : "Save to library"}
          >
            <Heart
              size={18}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ title, message, icon: Icon = BookOpen }) {
  return (
    <div className="empty-state">
      <Icon size={36} />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

function BookGrid({ books, onOpen, savedBooks, onSave }) {
  if (!books.length) {
    return (
      <EmptyState
        title="No stories found"
        message="Try another search or choose a different category."
        icon={SearchX}
      />
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onOpen={onOpen}
          saved={savedBooks.some(
            (item) => String(item.id) === String(book.id)
          )}
          onSave={onSave}
        />
      ))}
    </div>
  );
}function AboutPage({ onBack }) {
  return (
    <section className="content-page">
      <PageHeading
        title="About Us"
        subtitle="A little about our reading world"
        onBack={onBack}
      />

      <div className="about-hero">
        <span className="eyebrow">WELCOME TO OUR WORLD</span>
        <h2>A good story can take you anywhere.</h2>
        <p>
          Fictional World Library is an online reading platform
          for people who enjoy fiction in all its forms. Whether
          you love romance, werewolf stories, mafia drama,
          billionaire fiction, paranormal, LGBTQ stories, or
          Christian romance, you'll find different kinds of
          stories to explore.
        </p>
        <p>
          We want reading to be simple. You should be able to
          discover a new book, keep track of what you're reading,
          return to your favourite stories, and find something
          else when you're ready for a change.
        </p>
      </div>

      <div className="about-section">
        <h2>What you'll find here</h2>
        <div className="about-feature-grid">
          <article>
            <BookOpen size={23} />
            <h3>Stories for different tastes</h3>
            <p>
              Explore different genres and find stories that
              suit your mood.
            </p>
          </article>
          <article>
            <Bookmark size={23} />
            <h3>Books to follow</h3>
            <p>
              Keep your reading organised and return to stories
              you want to continue.
            </p>
          </article>
          <article>
            <Heart size={23} />
            <h3>Readers and writers</h3>
            <p>
              Discover stories and learn how writers can submit
              their work for consideration.
            </p>
          </article>
        </div>
      </div>

      <div className="about-section">
        <h2>For our readers</h2>
        <p>
          Your library should feel like your own space. Find
          books that interest you, save stories you want to
          revisit, and keep your reading organised in one place.
        </p>
      </div>

      <div className="about-section">
        <h2>For our authors</h2>
        <p>
          Every story starts with someone willing to write it.
          We're interested in bringing readers and writers
          together and giving authors a place to introduce their
          work. If you'd like to publish with us, visit our
          Be Our Author section to learn more.
        </p>
      </div>

      <div className="about-tagline">
        <h2>Find a story that fits your taste. 😉</h2>
      </div>
    </section>
  );
}

function TermsPage({ onBack }) {
  return (
    <section className="content-page">
      <PageHeading
        title="Terms & Conditions"
        subtitle="Please read before using the platform"
        onBack={onBack}
      />

      <div className="text-panel">
        <h2>Using Fictional World Library</h2>
        <p>
          By using this platform, you agree to use it lawfully
          and respect the rights of readers, writers, and the
          platform.
        </p>

        <h3>Accounts</h3>
        <p>
          Keep your login information secure. You are responsible
          for activity carried out through your account.
        </p>

        <h3>Books and content</h3>
        <p>
          Stories and other content are provided for personal
          reading. Do not copy, redistribute, or republish
          content without permission from the relevant rights
          holder.
        </p>

        <h3>Coins and subscriptions</h3>
        <p>
          Digital purchases and subscription benefits are subject
          to the terms shown at checkout. A payment must be
          verified before purchased coins or benefits are added
          to an account.
        </p>

        <h3>Age restrictions</h3>
        <p>
          Users must be at least 16 years old to use the platform.
          Mature content, where available, is restricted to
          adults aged 18 or older.
        </p>

        <h3>Account restrictions</h3>
        <p>
          Accounts involved in fraud, abuse, unlawful activity,
          or violations of these terms may be restricted or
          suspended.
        </p>

        <h3>Contact</h3>
        <p>
          Questions about these terms can be sent to
          {" "}{SUPPORT_EMAIL}.
        </p>
      </div>
    </section>
  );
}

function SupportPage({ onBack }) {
  return (
    <section className="content-page">
      <PageHeading
        title="Customer Service"
        subtitle="We're here to help"
        onBack={onBack}
      />

      <div className="text-panel support-panel">
        <Headphones size={34} />
        <h2>Need assistance?</h2>
        <p>
          For help with your account, reading access, coins,
          subscriptions, or other questions, contact our support
          email.
        </p>
        <a href={`mailto:${SUPPORT_EMAIL}`}>
          <Mail size={18} /> {SUPPORT_EMAIL}
        </a>
      </div>

      <div className="text-panel">
        <h2>Be Our Author</h2>
        <p>
          Interested in submitting your story? Contact us by
          email with your story title, genre, synopsis, and
          sample chapters. Our team will review your submission.
        </p>
        <a href={`mailto:${SUPPORT_EMAIL}?subject=Author%20Submission`}>
          <Send size={18} /> Submit a story
        </a>
      </div>
    </section>
  );
}

function AuthPage({
  mode,
  setMode,
  onBack,
  onNotice,
  onAuthenticated
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      onNotice("Enter your email and password.");
      return;
    }

    if (password.length < 6) {
      onNotice("Your password must contain at least 6 characters.");
      return;
    }

    setBusy(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { name: name.trim() }
          }
        });

        if (error) throw error;

        if (data.session) {
          onAuthenticated(data.session.user);
        } else {
          onNotice(
            "Account created. Check your email if confirmation is required."
          );
          setMode("login");
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
          });

        if (error) throw error;

        onAuthenticated(data.user);
        onNotice("Welcome back!");
      }
    } catch (error) {
      onNotice(error.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="content-page auth-page">
      <PageHeading
        title={mode === "signup" ? "Create your account" : "Welcome back"}
        subtitle={
          mode === "signup"
            ? "Join Fictional World Library"
            : "Log in to continue reading"
        }
        onBack={onBack}
      />

      <form className="form-panel" onSubmit={submit}>
        {mode === "signup" && (
          <label>
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>
        )}

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            minLength={6}
            required
          />
        </label>

        <button className="primary-button" disabled={busy}>
          {busy
            ? "Please wait..."
            : mode === "signup"
              ? "Create account"
              : "Log in"}
        </button>

        <p className="form-switch">
          {mode === "signup"
            ? "Already have an account?"
            : "New to Fictional World Library?"}
          {" "}
          <button
            type="button"
            onClick={() =>
              setMode(mode === "signup" ? "login" : "signup")
            }
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </section>
  );
}function ProfilePage({
  user,
  profile,
  onBack,
  onSignOut,
  onNavigate,
  onNotice
}) {
  const [name, setName] = useState(
    profile?.name || user?.user_metadata?.name || ""
  );
  const [gender, setGender] = useState(profile?.gender || "");
  const [saving, setSaving] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();

    if (!user) {
      onNotice("Log in to update your profile.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("users")
        .upsert(
          {
            id: user.id,
            name: name.trim(),
            email: user.email,
            gender
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      onNotice("Profile saved.");
    } catch (error) {
      onNotice(
        "Could not save profile. Check your Supabase users table and its RLS policies."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="content-page">
      <PageHeading
        title="My Profile"
        subtitle="Your account and reading details"
        onBack={onBack}
      />

      {!user ? (
        <div className="text-panel">
          <User size={32} />
          <h2>Sign in to view your profile</h2>
          <p>Your profile, saved stories, and reading activity will appear here.</p>
          <button
            className="primary-button"
            onClick={() => onNavigate("login")}
          >
            Log in or sign up
          </button>
        </div>
      ) : (
        <>
          <div className="profile-summary">
            <div className="profile-avatar">
              {(name || user.email || "R").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{name || "Reader"}</h2>
              <p>{user.email}</p>
              <small>Account ID: {user.id}</small>
            </div>
          </div>

          <form className="form-panel" onSubmit={saveProfile}>
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Email
              <input value={user.email || ""} disabled />
            </label>

            <label>
              Gender
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <button className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>

          <button className="secondary-button" onClick={onSignOut}>
            <LogOut size={17} /> Log out
          </button>
        </>
      )}
    </section>
  );
}

function WalletPage({ user, profile, onBack, onNavigate, onNotice }) {
  return (
    <section className="content-page">
      <PageHeading
        title="My Wallet"
        subtitle="Manage coins and subscriptions"
        onBack={onBack}
      />

      <div className="wallet-balance">
        <Coins size={30} />
        <span>Available coins</span>
        <strong>{Number(profile?.coin_balance || 0).toLocaleString()}</strong>
      </div>

      {!user && (
        <div className="inline-message">
          Log in to use your wallet and save purchases to your account.
        </div>
      )}

      <div className="section-heading">
        <h2>Top up coins</h2>
        <p>Use coins to unlock chapters.</p>
      </div>

      <div className="pricing-grid">
        {COIN_PACKAGES.map((pack) => (
          <article className="pricing-card" key={pack.coins}>
            <Coins size={24} />
            <h3>{pack.coins.toLocaleString()} coins</h3>
            <strong>${pack.price.toFixed(2)}</strong>
            <button
              className="primary-button"
              onClick={() =>
                onNotice(
                  "Secure checkout must be connected and verified before purchases can be completed."
                )
              }
            >
              Top up
            </button>
          </article>
        ))}
      </div>

      <div className="section-heading">
        <h2>Subscriptions</h2>
        <p>Choose the reading plan that suits you.</p>
      </div>

      <div className="pricing-grid">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <article className="pricing-card" key={plan.name}>
            <Crown size={24} />
            <h3>{plan.name}</h3>
            <strong>${plan.monthly.toFixed(2)}/month</strong>
            <p>{plan.coins} coins per month</p>
            <p>{plan.discount}% chapter discount</p>
            <button
              className="primary-button"
              onClick={() =>
                onNotice(
                  "Subscription checkout is not active until the secure payment backend is configured."
                )
              }
            >
              Choose plan
            </button>
          </article>
        ))}
      </div>

      <div className="text-panel">
        <h2>Wallet activity</h2>
        <p>
          Your verified top-ups, chapter unlocks, and subscription
          transactions will be listed here once transaction history
          is connected.
        </p>
        <button
          className="secondary-button"
          onClick={() => onNavigate("transactions")}
        >
          <History size={17} /> Transaction history
        </button>
      </div>
    </section>
  );
}

function TransactionsPage({ user, onBack }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      if (!user) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setErrorMessage(
          "Transaction history is not available yet."
        );
      } else {
        setTransactions(data || []);
      }

      setLoading(false);
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <section className="content-page">
      <PageHeading
        title="Transaction History"
        subtitle="Your wallet activity"
        onBack={onBack}
      />

      {!user ? (
        <EmptyState
          title="Log in first"
          message="Your transactions are connected to your reader account."
          icon={CreditCard}
        />
      ) : loading ? (
        <p className="loading-message">Loading transactions...</p>
      ) : errorMessage ? (
        <div className="inline-message">{errorMessage}</div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          message="Verified wallet transactions will appear here."
          icon={History}
        />
      ) : (
        <div className="transaction-list">
          {transactions.map((item) => (
            <article key={item.id} className="transaction-item">
              <div>
                <strong>{item.coins_added || 0} coins</strong>
                <p>
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <span>
                ₦{Number(item.amount_ngn || 0).toLocaleString()}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function LibraryPage({ savedBooks, onOpen, onSave, onBack }) {
  return (
    <section className="content-page">
      <PageHeading
        title="My Library"
        subtitle="Stories you've saved"
        onBack={onBack}
      />

      <BookGrid
        books={savedBooks}
        onOpen={onOpen}
        savedBooks={savedBooks}
        onSave={onSave}
      />
    </section>
  );
}

function NotificationsPage({ user, onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user) return;

      setLoading(true);

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      setItems(data || []);
      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <section className="content-page">
      <PageHeading
        title="Notifications"
        subtitle="Updates about your reading account"
        onBack={onBack}
      />

      {!user ? (
        <EmptyState
          title="Log in to view notifications"
          message="Account updates will appear here."
          icon={Bell}
        />
      ) : loading ? (
        <p className="loading-message">Loading notifications...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          message="New account and platform updates will appear here."
          icon={Bell}
        />
      ) : (
        <div className="notification-list">
          {items.map((item) => (
            <article className="notification-item" key={item.id}>
              <Bell size={19} />
              <div>
                <p>{item.message}</p>
                <small>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : ""}
                </small>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}function ReaderPage({
  book,
  onBack,
  onNotice,
  user,
  profile,
  refreshProfile
}) {
  const [chapters, setChapters] = useState([]);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [unlockedIds, setUnlockedIds] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadChapters() {
      setLoading(true);

      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("book_id", String(book.id))
        .eq("pub_status", "published")
        .order("chapter_number", { ascending: true });

      if (!active) return;

      if (error) {
        setChapters([]);
        setChapterContent("");
        setLoading(false);
        return;
      }

      setChapters(data || []);
      setChapterIndex(0);

      if (user && data?.length) {
        const { data: unlocks } = await supabase
          .from("unlocks")
          .select("chapter_id")
          .eq("user_id", user.id);

        if (active) {
          setUnlockedIds(
            (unlocks || []).map((item) => String(item.chapter_id))
          );
        }
      }

      setLoading(false);
    }

    loadChapters();

    return () => {
      active = false;
    };
  }, [book.id, user]);

  const chapter = chapters[chapterIndex];

  useEffect(() => {
    let active = true;

    async function loadContent() {
      setChapterContent("");

      if (!chapter) return;

      const isLocked =
        chapter.locked &&
        !unlockedIds.includes(String(chapter.id));

      if (isLocked) return;

      /*
       * IMPORTANT:
       * Production chapter access must be enforced by Supabase
       * RLS or a secure server function. Hiding locked content
       * in the browser alone is not a security boundary.
       */
      const { data, error } = await supabase
        .from("chapters")
        .select("content")
        .eq("id", chapter.id)
        .single();

      if (!active) return;

      if (error) {
        setChapterContent("");
      } else {
        setChapterContent(data?.content || "");
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, [chapter, unlockedIds]);

  async function unlockChapter() {
    if (!user) {
      onNotice("Please log in before unlocking chapters.");
      return;
    }

    if (!chapter) return;

    onNotice(
      "Chapter unlocking must be completed through a secure server-side function before coins can be deducted."
    );
  }

  const locked =
    chapter?.locked &&
    !unlockedIds.includes(String(chapter.id));

  return (
    <section className="content-page reader-page">
      <PageHeading
        title={book.title}
        subtitle={`By ${book.author_name}`}
        onBack={onBack}
      />

      {loading ? (
        <p className="loading-message">Loading chapters...</p>
      ) : chapters.length === 0 ? (
        <EmptyState
          title="No published chapters yet"
          message="Published chapters for this story will appear here."
          icon={BookOpen}
        />
      ) : (
        <>
          <div className="chapter-selector">
            <label htmlFor="chapter-select">Choose a chapter</label>
            <select
              id="chapter-select"
              value={chapterIndex}
              onChange={(event) =>
                setChapterIndex(Number(event.target.value))
              }
            >
              {chapters.map((item, index) => (
                <option value={index} key={item.id}>
                  Chapter {item.chapter_number}: {item.title}
                </option>
              ))}
            </select>
          </div>

          {locked ? (
            <div className="locked-chapter">
              <Lock size={35} />
              <h2>This chapter is locked</h2>
              <p>
                Unlock this chapter for {UNLOCK_COST} coins.
              </p>
              <p>
                Your balance: {Number(profile?.coin_balance || 0)} coins
              </p>
              <button
                className="primary-button"
                onClick={unlockChapter}
              >
                <Coins size={17} /> Unlock chapter
              </button>
            </div>
          ) : (
            <article className="chapter-reading">
              <h2>
                Chapter {chapter.chapter_number}: {chapter.title}
              </h2>
              <div className="chapter-content">
                {chapterContent || "This chapter has no content yet."}
              </div>
            </article>
          )}

          <div className="chapter-navigation">
            <button
              className="secondary-button"
              disabled={chapterIndex === 0}
              onClick={() => setChapterIndex((index) => index - 1)}
            >
              Previous chapter
            </button>
            <button
              className="primary-button"
              disabled={chapterIndex >= chapters.length - 1}
              onClick={() => setChapterIndex((index) => index + 1)}
            >
              Next chapter
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function AdminPage({ user, onBack, onNotice }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Werewolf");
  const [synopsis, setSynopsis] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [length, setLength] = useState("long");
  const [status, setStatus] = useState("ongoing");

  const isAdmin =
    Boolean(user?.email) &&
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      if (!isAdmin) return;

      setLoading(true);

      const { data } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (active) {
        setBooks(data || []);
        setLoading(false);
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  async function addBook(event) {
    event.preventDefault();

    if (!isAdmin) {
      onNotice("Admin access required.");
      return;
    }

    const { error } = await supabase.from("books").insert({
      title: title.trim(),
      author_name: author.trim(),
      genre,
      synopsis: synopsis.trim(),
      cover_url: coverUrl.trim() || "/logo.png",
      length,
      status,
      tags: ""
    });

    if (error) {
      onNotice(
        "Could not add book. Check your books table columns and admin RLS policy."
      );
      return;
    }

    onNotice("Book added.");
    setTitle("");
    setAuthor("");
    setSynopsis("");
    setCoverUrl("");

    const { data } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    setBooks(data || []);
  }

  if (!user) {
    return (
      <section className="content-page">
        <PageHeading title="Admin Dashboard" onBack={onBack} />
        <EmptyState
          title="Log in required"
          message="Sign in with your authorized admin account."
          icon={Shield}
        />
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="content-page">
        <PageHeading title="Admin Dashboard" onBack={onBack} />
        <div className="text-panel">
          <Shield size={35} />
          <h2>Access restricted</h2>
          <p>This account is not authorised to access the dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="content-page">
      <PageHeading
        title="Admin Dashboard"
        subtitle="Manage your library"
        onBack={onBack}
      />

      <div className="admin-stats">
        <article>
          <BookOpen size={22} />
          <span>Total books</span>
          <strong>{books.length}</strong>
        </article>
        <article>
          <Shield size={22} />
          <span>Access</span>
          <strong>Admin</strong>
        </article>
      </div>

      <form className="form-panel" onSubmit={addBook}>
        <h2>Add a book</h2>

        <label>
          Book title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        <label>
          Author name
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
          />
        </label>

        <label>
          Genre
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            {GENRES.filter((item) => item !== "All").map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Story length
          <select
            value={length}
            onChange={(event) => setLength(event.target.value)}
          >
            <option value="short">Short</option>
            <option value="long">Long</option>
          </select>
        </label>

        <label>
          Story status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Cover image URL
          <input
            value={coverUrl}
            onChange={(event) => setCoverUrl(event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          Synopsis
          <textarea
            value={synopsis}
            onChange={(event) => setSynopsis(event.target.value)}
            rows={4}
            required
          />
        </label>

        <button className="primary-button">
          <Plus size={17} /> Add book
        </button>
      </form>

      <div className="section-heading">
        <h2>Your books</h2>
      </div>

      {loading ? (
        <p className="loading-message">Loading books...</p>
      ) : (
        <div className="admin-book-list">
          {books.map((book) => (
            <article key={book.id} className="admin-book-item">
              <div>
                <strong>{book.title}</strong>
                <p>{book.author_name} · {book.genre}</p>
              </div>
              <span>{book.status}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
        }function App() {
  const [books, setBooks] = useState(SAMPLE_BOOKS.map(formatBook));
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [page, setPage] = useState("home");
  const [previousPage, setPreviousPage] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [filter, setFilter] = useState("all");
  const [savedBooks, setSavedBooks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fwl-library") || "[]");
    } catch {
      return [];
    }
  });
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("fwl-theme") !== "light"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    localStorage.setItem("fwl-library", JSON.stringify(savedBooks));
  }, [savedBooks]);

  useEffect(() => {
    localStorage.setItem("fwl-theme", darkMode ? "dark" : "light");
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (!error && data?.length) {
        setBooks(data.map(formatBook));
      }

      setLoadingBooks(false);
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile(currentUser) {
      if (!currentUser) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!active) return;

      setProfile(
        data || {
          id: currentUser.id,
          name: currentUser.user_metadata?.name || "",
          email: currentUser.email,
          coin_balance: 0
        }
      );
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      loadProfile(currentUser);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const currentUser = session?.user || null;
      setUser(currentUser);
      loadProfile(currentUser);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(window.fwlNoticeTimer);
    window.fwlNoticeTimer = window.setTimeout(() => {
      setNotice("");
    }, 4500);
  }

  async function refreshProfile() {
    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) setProfile(data);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showNotice("Could not log out. Please try again.");
      return;
    }

    setUser(null);
    setProfile(null);
    setPage("home");
    showNotice("You've been logged out.");
  }

  function navigate(nextPage) {
    setMenuOpen(false);

    if (nextPage === "signup") {
      setAuthMode("signup");
      setPreviousPage(page);
      setPage("auth");
      return;
    }

    if (nextPage === "login") {
      setAuthMode("login");
      setPreviousPage(page);
      setPage("auth");
      return;
    }

    setPreviousPage(page);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openBook(book) {
    setSelectedBook(book);
    setPreviousPage(page);
    setPage("book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveBook(book) {
    const exists = savedBooks.some(
      (item) => String(item.id) === String(book.id)
    );

    if (exists) {
      setSavedBooks((current) =>
        current.filter(
          (item) => String(item.id) !== String(book.id)
        )
      );
      showNotice("Removed from your library.");
    } else {
      setSavedBooks((current) => [...current, book]);
      showNotice("Added to your library.");
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      `${book.title} ${book.author_name} ${book.genre}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesGenre = genre === "All" || book.genre === genre;

    const matchesFilter =
      filter === "all" ||
      book.status === filter ||
      book.length === filter;

    return matchesSearch && matchesGenre && matchesFilter;
  });

  const ongoingBooks = books.filter((book) => book.status === "ongoing");
  const completedBooks = books.filter((book) => book.status === "completed");

  function back() {
    if (page === "book" && selectedBook) {
      setPage(previousPage === "book" ? "home" : previousPage);
    } else if (page === "auth") {
      setPage(previousPage === "auth" ? "home" : previousPage);
    } else {
      setPage("home");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderHome() {
    return (
      <>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">
              YOUR NEXT FAVOURITE READ STARTS HERE
            </span>
            <h1>Stories worth staying up for.</h1>
            <p>
              From forbidden romance to dangerous secrets,
              discover stories that fit your taste.
            </p>
            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore stories <ChevronRight size={18} />
            </button>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <BookOpen size={78} />
            <Sparkles size={28} />
          </div>
        </section>

        <section className="genre-section">
          <div className="section-heading">
            <h2>Explore genres</h2>
            <p>Pick the kind of story you're in the mood for.</p>
          </div>

          <div className="genre-list">
            {GENRES.map((item) => (
              <button
                key={item}
                className={genre === item ? "genre-chip active" : "genre-chip"}
                onClick={() => {
                  setGenre(item);
                  document
                    .getElementById("discover")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="books-section" id="discover">
          <div className="section-heading">
            <h2>Discover stories</h2>
            <p>Find something new to read.</p>
          </div>

          <div className="search-bar">
            <Search size={19} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search titles, authors, or genres..."
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="filter-list">
            {[
              ["all", "All stories"],
              ["ongoing", "Ongoing"],
              ["completed", "Completed"],
              ["short", "Short stories"],
              ["long", "Long stories"]
            ].map(([value, label]) => (
              <button
                key={value}
                className={filter === value ? "filter-chip active" : "filter-chip"}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {loadingBooks ? (
            <p className="loading-message">Finding stories...</p>
          ) : (
            <BookGrid
              books={filteredBooks}
              onOpen={openBook}
              savedBooks={savedBooks}
              onSave={saveBook}
            />
          )}
        </section>

        <section className="books-section">
          <div className="section-heading">
            <h2>Ongoing stories</h2>
            <button
              className="text-button"
              onClick={() => {
                setFilter("ongoing");
                setGenre("All");
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>
          <BookGrid
            books={ongoingBooks.slice(0, 4)}
            onOpen={openBook}
            savedBooks={savedBooks}
            onSave={saveBook}
          />
        </section>

        <section className="books-section">
          <div className="section-heading">
            <h2>Completed stories</h2>
            <button
              className="text-button"
              onClick={() => {
                setFilter("completed");
                setGenre("All");
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View all <ChevronRight size={16} />
            </button>
          </div>
          <BookGrid
            books={completedBooks.slice(0, 4)}
            onOpen={openBook}
            savedBooks={savedBooks}
            onSave={saveBook}
          />
        </section>

        <section className="author-banner">
          <div>
            <span className="eyebrow">FOR WRITERS</span>
            <h2>Have a story to share?</h2>
            <p>
              Learn how to submit your work to Fictional World Library.
            </p>
          </div>
          <button
            className="secondary-button"
            onClick={() => navigate("support")}
          >
            Be our author <ChevronRight size={17} />
          </button>
        </section>
      </>
    );
  }

  function renderBookDetails() {
    if (!selectedBook) return renderHome();

    const saved = savedBooks.some(
      (item) => String(item.id) === String(selectedBook.id)
    );

    return (
      <section className="content-page book-detail-page">
        <PageHeading title="Book details" onBack={back} />

        <div className="book-detail">
          <img
            src={selectedBook.cover_url}
            alt={selectedBook.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/logo.png";
            }}
          />

          <div className="book-detail-info">
            <span className="eyebrow">{selectedBook.genre}</span>
            <h1>{selectedBook.title}</h1>
            <p>By {selectedBook.author_name}</p>

            <div className="detail-badges">
              <span>{selectedBook.status}</span>
              <span>{selectedBook.length} story</span>
            </div>

            <p className="book-synopsis">{selectedBook.synopsis}</p>

            <div className="book-detail-actions">
              <button
                className="primary-button"
                onClick={() => navigate("reader")}
              >
                <BookOpen size={18} /> Start reading
              </button>
              <button
                className="secondary-button"
                onClick={() => saveBook(selectedBook)}
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Add to library"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderPage() {
    switch (page) {
      case "home":
        return renderHome();

      case "book":
        return renderBookDetails();

      case "reader":
        return selectedBook ? (
          <ReaderPage
            book={selectedBook}
            onBack={back}
            onNotice={showNotice}
            user={user}
            profile={profile}
            refreshProfile={refreshProfile}
          />
        ) : renderHome();

      case "library":
        return (
          <LibraryPage
            savedBooks={savedBooks}
            onOpen={openBook}
            onSave={saveBook}
            onBack={back}
          />
        );

      case "notifications":
        return <NotificationsPage user={user} onBack={back} />;

      case "profile":
        return (
          <ProfilePage
            user={user}
            profile={profile}
            onBack={back}
            onSignOut={signOut}
            onNavigate={navigate}
            onNotice={showNotice}
          />
        );

      case "wallet":
        return (
          <WalletPage
            user={user}
            profile={profile}
            onBack={back}
            onNavigate={navigate}
            onNotice={showNotice}
          />
        );

      case "transactions":
        return <TransactionsPage user={user} onBack={back} />;

      case "about":
        return <AboutPage onBack={back} />;

      case "terms":
        return <TermsPage onBack={back} />;

      case "support":
        return <SupportPage onBack={back} />;

      case "admin":
        return (
          <AdminPage
            user={user}
            onBack={back}
            onNotice={showNotice}
          />
        );

      case "auth":
        return (
          <AuthPage
            mode={authMode}
            setMode={setAuthMode}
            onBack={back}
            onNotice={showNotice}
            onAuthenticated={(currentUser) => {
              setUser(currentUser);
              setPage("profile");
            }}
          />
        );

      default:
        return renderHome();
    }
  }

  return (
    <div className={`app-shell ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="site-header">
        <button
          className="brand-button"
          onClick={() => {
            setPage("home");
            setSelectedBook(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Go to homepage"
        >
          <img src="/logo.png" alt="" className="site-logo" />
          <span>{SITE_NAME}</span>
        </button>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="icon-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-backdrop" onClick={() => setMenuOpen(false)}>
          <nav
            className="menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="menu-heading">
              <h2>More</h2>
              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            <button onClick={() => navigate("wallet")}>
              <Wallet size={19} /> Wallet
            </button>
            <button onClick={() => navigate("transactions")}>
              <History size={19} /> Transaction history
            </button>
            <button onClick={() => navigate("support")}>
              <Headphones size={19} /> Customer service
            </button>
            <button onClick={() => navigate("about")}>
              <Info size={19} /> About us
            </button>
            <button onClick={() => navigate("terms")}>
              <FileText size={19} /> Terms & conditions
            </button>
            <button onClick={() => navigate("profile")}>
              <Settings size={19} /> Settings & profile
            </button>

            {user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
              <button onClick={() => navigate("admin")}>
                <Shield size={19} /> Admin dashboard
              </button>
            )}

            {!user ? (
              <>
                <button onClick={() => navigate("login")}>
                  <LogIn size={19} /> Log in
                </button>
                <button onClick={() => navigate("signup")}>
                  <UserPlus size={19} /> Create account
                </button>
              </>
            ) : (
              <button onClick={signOut}>
                <LogOut size={19} /> Log out
              </button>
            )}
          </nav>
        </div>
      )}

      <main className="main-content">{renderPage()}</main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/logo.png" alt="" />
          <strong>{SITE_NAME}</strong>
        </div>
        <p>Find a story that fits your taste. 😉</p>
        <div className="footer-links">
          <button onClick={() => navigate("about")}>About us</button>
          <button onClick={() => navigate("terms")}>Terms</button>
          <button onClick={() => navigate("support")}>Contact</button>
        </div>
        <small>
          © {new Date().getFullYear()} Fictional World Library
        </small>
      </footer>

      <nav className="bottom-navigation" aria-label="Main navigation">
        <button
          className={page === "home" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("home")}
        >
          <Home size={21} />
          <span>Home</span>
        </button>

        <button
          className={page === "library" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("library")}
        >
          <Library size={21} />
          <span>Library</span>
        </button>

        <button
          className="nav-item more-nav-item"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <Menu size={21} />
          <span>More</span>
        </button>

        <button
          className={
            page === "notifications" ? "nav-item active" : "nav-item"
          }
          onClick={() => navigate("notifications")}
        >
          <Bell size={21} />
          <span>Alerts</span>
        </button>

        <button
          className={page === "profile" ? "nav-item active" : "nav-item"}
          onClick={() => navigate("profile")}
        >
          <User size={21} />
          <span>Profile</span>
        </button>
      </nav>

      <Notice
        message={notice}
        onClose={() => setNotice("")}
      />
    </div>
  );
}

export default App;
