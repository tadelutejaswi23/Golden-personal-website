import { useEffect, useRef, useState } from "react";
import GoldenFairies from "./components/fairies/GoldenFairies";
import ContentManager from "./components/ContentManager";
import "./App.css";

const rooms = [
  { id: "home", number: "01", label: "Home", symbol: "✦" },

  { id: "about", number: "02", label: "About Me", symbol: "♡" },

  { id: "projects", number: "03", label: "Projects", symbol: "♢" },

  {
    id: "certifications",
    number: "04",
    label: "Certifications",
    symbol: "✧",
  },

  {
    id: "achievements",
    number: "05",
    label: "Achievements",
    symbol: "♛",
  },

  {
    id: "learning",
    number: "06",
    label: "Learning",
    symbol: "✎",
  },

  {
    id: "goals",
    number: "07",
    label: "Goals",
    symbol: "◇",
  },

  {
    id: "closet",
    number: "08",
    label: "Golden Closet",
    symbol: "✧",
  },
];

/* =========================================================
   GOLDEN CLOSET COLLECTIONS
========================================================= */

const closetSections = [
  {
    id: "dresses",
    title: "DRESSES",
    subtitle: "The dresses I love, dream about and want to own.",
    symbol: "♕",
  },
  {
    id: "beauty",
    title: "BEAUTY",
    subtitle: "Beauty, skincare, makeup and things that make me feel beautiful.",
    symbol: "✦",
  },
  {
    id: "luxury",
    title: "LUXURY",
    subtitle: "The beautiful things I dream of owning.",
    symbol: "◇",
  },
  {
    id: "dream-home",
    title: "DREAM HOME",
    subtitle: "Everything I imagine for my future home.",
    symbol: "⌂",
  },
  {
    id: "travel",
    title: "TRAVEL",
    subtitle: "Places I want to visit and experiences I want to collect.",
    symbol: "✈",
  },
  {
    id: "wishlist",
    title: "WISHLIST",
    subtitle: "Things I want, someday.",
    symbol: "♡",
  },
];

/* =========================================================
   ICONS
========================================================= */

function SparkleIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1L14.1 9.9L23 12L14.1 14.1L12 23L9.9 14.1L1 12L9.9 9.9L12 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon({ direction = "right" }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      {direction === "right" ? (
        <path
          d="M5 12H19M13 6L19 12L13 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M19 12H5M11 6L5 12L11 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/* =========================================================
   PARTICLES
========================================================= */

function ParticleField() {
  return (
    <div className="particle-field">
      {Array.from({ length: 45 }).map((_, index) => (
        <span
          className="particle"
          style={{ "--i": index }}
          key={index}
        />
      ))}
    </div>
  );
}

/* =========================================================
   BACKGROUND
========================================================= */

function GoldenBackground() {
  return (
    <div className="golden-background">
      <div className="golden-orb orb-one" />
      <div className="golden-orb orb-two" />
      <div className="golden-orb orb-three" />

      <ParticleField />

      <div className="magical-dust">
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className="dust-particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
              animationDelay: `${index * -0.45}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   TOP NAVIGATION
========================================================= */

function TopNavigation({ activeRoom, onMenu }) {
  const currentRoom =
    rooms.find((room) => room.id === activeRoom) || rooms[0];

  return (
    <header className="top-navigation">
      <button
        className="brand-mark"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        <SparkleIcon size={17} />

        <span>THE GOLDEN VAULT</span>
      </button>

      <div className="navigation-center">
        <span>{currentRoom.number}</span>

        <span className="nav-center-dot">✦</span>

        <span>{currentRoom.label.toUpperCase()}</span>
      </div>

      <div className="navigation-actions">
        <button
          className="menu-button"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   MENU
========================================================= */

function MenuOverlay({
  activeRoom,
  onClose,
  onNavigate,
}) {
  return (
    <div
      className="menu-overlay"
      onClick={onClose}
    >
      <aside
        className="golden-menu"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="menu-header">
          <div>
            <div className="menu-small-title">
              THE GOLDEN VAULT
            </div>

            <h2>Explore My World</h2>
          </div>

          <button
            className="close-menu"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="menu-list">
          {rooms.map((room) => (
            <button
              key={room.id}
              className={`menu-item ${
                activeRoom === room.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onNavigate(room.id)
              }
            >
              <span className="menu-number">
                {room.number}
              </span>

              <span className="menu-symbol">
                {room.symbol}
              </span>

              <span>{room.label}</span>

              <span className="menu-arrow">
                <ArrowIcon />
              </span>
            </button>
          ))}
        </div>

        <div className="menu-footer">
          <SparkleIcon size={15} />

          <span>
            Enter a different chamber
          </span>
        </div>
      </aside>
    </div>
  );
}

/* =========================================================
   ROOM HEADER
========================================================= */

function RoomHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="room-header">
      <div className="room-eyebrow">
        <SparkleIcon size={13} />

        <span>{eyebrow}</span>
      </div>

      <h1>{title}</h1>

      {description && (
        <p>{description}</p>
      )}

      <div className="gold-line" />
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function HomeRoom({ onNavigate }) {
  return (
    <section className="room-screen home-room-screen">
      <div className="home-light-orb" />

      <div className="home-content">
        <div className="hero-kicker">
          <span>✦</span>

          <span>
            A DIGITAL FANTASY WORLD
          </span>

          <span>✦</span>
        </div>

        <h1>GOLDEN</h1>

        <div className="hero-divider">
          <span />

          <SparkleIcon size={17} />

          <span />
        </div>

        <h2>
          MY DIGITAL FANTASY WORLD
        </h2>

        <p>
          Welcome to my golden universe â€”
          a place where cybersecurity,
          dreams, creativity and ambition
          live together.
        </p>

        <button
          className="golden-primary-button"
          onClick={() =>
            onNavigate("projects")
          }
        >
          <span>ENTER THE VAULT</span>

          <ArrowIcon />
        </button>
      </div>

      <div className="home-bottom">
        <span>CYBERSECURITY</span>

        <span>✦</span>

        <span>CREATIVITY</span>

        <span>✦</span>

        <span>AMBITION</span>
      </div>
    </section>
  );
}

/* =========================================================
   PROJECTS
   NOW EDITABLE
========================================================= */
/* =========================================================
   ABOUT ME
========================================================= */
function AboutRoom() {
  const photoInputRef = useRef(null);

  const [photo, setPhoto] = useState(() => {
    return localStorage.getItem("golden-about-photo") || "";
  });

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target.result;

      setPhoto(imageData);

      localStorage.setItem(
        "golden-about-photo",
        imageData
      );
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto("");

    localStorage.removeItem(
      "golden-about-photo"
    );

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  return (
    <section className="room-screen standard-screen about-room">

      <RoomHeader
        eyebrow="02 · THE PORTRAIT CHAMBER"
        title="About Me"
        description="A little glimpse into the person behind this golden world."
      />

      <div className="about-layout">

        {/* =========================================
            PHOTO AREA
        ========================================= */}

        <div className="about-photo-frame">

          {/* REAL WINDOWS FILE INPUT */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="about-photo-input"
          />

          {/* CLICKABLE PHOTO BOX */}
          <button
            type="button"
            className={`about-photo-placeholder ${
              photo ? "has-photo" : ""
            }`}
            onClick={() =>
              photoInputRef.current?.click()
            }
          >

            {photo ? (
              <img
                src={photo}
                alt="My portrait"
              />
            ) : (
              <>
                <SparkleIcon size={35} />

                <span>
                  CLICK TO ADD PHOTO
                </span>

                <small>
                  Choose a photograph from your computer
                </small>
              </>
            )}

          </button>

          {/* REMOVE PHOTO */}
          {photo && (
            <button
              type="button"
              className="about-remove-photo"
              onClick={removePhoto}
            >
              REMOVE PHOTO
            </button>
          )}

        </div>


        {/* =========================================
            ABOUT STORY
        ========================================= */}

        <div className="about-story">

          <div className="gold-label">
            ✦ MY STORY
          </div>

          <h2>
            Welcome to
            <br />
            my world.
          </h2>

          <p>
            This is where I can introduce myself,
            my journey, my interests, my dreams
            and the person I am becoming.
          </p>

          <p>
            My Golden Digital Fantasy World is
            a visual representation of my career,
            creativity, ambitions and everything
            that inspires me.
          </p>

        </div>

      </div>

    </section>
  );
}

function ProjectsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="02 Â· THE PROJECT CHAMBER"
        title="Projects"
        description="A collection of things I have built, explored and learned through hands-on work."
      />

      <ContentManager
        type="projects"
        title="My Projects"
      />
    </section>
  );
}

/* =========================================================
   CERTIFICATIONS
   NOW EDITABLE
========================================================= */

function CertificationsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="03 Â· THE CERTIFICATE CHAMBER"
        title="Certifications"
        description="Milestones that represent the skills and knowledge I have worked to build."
      />

      <ContentManager
        type="certificates"
        title="My Certifications"
      />
    </section>
  );
}

/* =========================================================
   ACHIEVEMENTS
   NOW EDITABLE
========================================================= */

function AchievementsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="04 Â· THE ACHIEVEMENT HALL"
        title="Achievements"
        description="The milestones that mark the evolution of my professional and personal journey."
      />

      <ContentManager
        type="achievements"
        title="My Achievements"
      />
    </section>
  );
}

/* =========================================================
   LEARNING
   NOW EDITABLE
========================================================= */

function LearningRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="05 Â· THE KNOWLEDGE LIBRARY"
        title="Learning"
        description="The technologies and subjects I am continuously building expertise in."
      />

      <ContentManager
        type="learning"
        title="My Learning Journey"
      />
    </section>
  );
}

/* =========================================================
   GOALS
   NOW EDITABLE
========================================================= */

function GoalsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="06 Â· THE VISION CHAMBER"
        title="Goals"
        description="Where I am going â€” and the work required to get there."
      />

      <ContentManager
        type="goals"
        title="My Golden Goals"
      />
    </section>
  );
}

/* =========================================================
   CLOSET
   NOW EDITABLE
========================================================= */

/* =========================================================
   GOLDEN CLOSET
========================================================= */

const closetCategories = [
  {
    id: "dresses",
    icon: "ðŸ‘—",
    title: "Dresses",
    description: "Your golden wardrobe",
  },

  {
    id: "bags",
    icon: "ðŸ‘œ",
    title: "Bags",
    description: "Luxury bags & handbags",
  },

  {
    id: "makeup",
    icon: "ðŸ’„",
    title: "Makeup Vanity",
    description: "Your beauty collection",
  },

  {
    id: "accessories",
    icon: "ðŸ’Ž",
    title: "Accessories",
    description: "Little things that sparkle",
  },

  {
    id: "shoes",
    icon: "ðŸ‘ ",
    title: "Shoes",
    description: "Your dream shoe collection",
  },

  {
    id: "skincare",
    icon: "ðŸ§´",
    title: "Skincare",
    description: "Your beauty rituals",
  },

  {
    id: "gold",
    icon: "ðŸ‘‘",
    title: "Gold & Jewels",
    description: "Your treasures",
  },
];

function ClosetRoom() {
  return (
    <section className="room-screen standard-screen closet-room">

      <RoomHeader
        eyebrow="08 Â· THE ROYAL CLOSET"
        title="Golden Closet"
        description="A private digital vault for everything beautiful, luxurious and uniquely mine."
      />

      <div className="closet-introduction">

        <SparkleIcon size={24} />

        <span>
          MY PRIVATE COLLECTION
        </span>

        <SparkleIcon size={24} />

      </div>

      <div className="golden-closet-grid">

        {closetCategories.map((category) => (
          <div
            className="golden-closet-category"
            key={category.id}
          >

            <div className="closet-category-icon">
              {category.icon}
            </div>

            <div className="closet-category-number">
              {String(
                closetCategories.indexOf(category) + 1
              ).padStart(2, "0")}
            </div>

            <h2>
              {category.title}
            </h2>

            <p>
              {category.description}
            </p>

            <button className="closet-add-button">
              <span>+</span>

              CLICK TO ADD

            </button>

          </div>
        ))}

      </div>

    </section>
  );
}

/* =========================================================
   ROOM RENDERER
========================================================= */

function CurrentRoom({
  activeRoom,
  onNavigate,
}) {
  switch (activeRoom) {

    case "about":
      return <AboutRoom />;

    case "projects":
      return <ProjectsRoom />;

    case "certifications":
      return <CertificationsRoom />;

    case "achievements":
      return <AchievementsRoom />;

    case "learning":
      return <LearningRoom />;

    case "goals":
      return <GoalsRoom />;

    case "closet":
      return <ClosetRoom />;

    case "home":
    default:
      return (
        <HomeRoom
          onNavigate={onNavigate}
        />
      );
  }
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [activeRoom, setActiveRoom] =
    useState("home");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [transitioning, setTransitioning] =
    useState(false);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigateToRoom = (roomId) => {
    if (roomId === activeRoom) {
      setMenuOpen(false);
      return;
    }

    setTransitioning(true);

    setMenuOpen(false);

    setTimeout(() => {
      setActiveRoom(roomId);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      setTimeout(() => {
        setTransitioning(false);
      }, 80);
    }, 220);
  };

  /* =======================================================
     MENU BODY STATE
  ======================================================= */

  useEffect(() => {
    document.body.classList.toggle(
      "menu-is-open",
      menuOpen
    );

    return () => {
      document.body.classList.remove(
        "menu-is-open"
      );
    };
  }, [menuOpen]);

  /* =======================================================
     ESCAPE KEY CLOSES MENU
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        menuOpen
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [menuOpen]);

  /* =======================================================
     APP
  ======================================================= */

  return (
    <main className="golden-universe">

      {/* GOLDEN FAIRIES */}
      <GoldenFairies />

      {/* GOLDEN BACKGROUND */}
      <GoldenBackground />

      {/* TOP NAVIGATION */}
      <TopNavigation
        activeRoom={activeRoom}
        onMenu={() =>
          setMenuOpen(true)
        }
      />

      {/* CURRENT FULL-SCREEN ROOM */}
      <div
        className={`room-stage ${
          transitioning
            ? "room-changing"
            : ""
        }`}
      >
        <CurrentRoom
          activeRoom={activeRoom}
          onNavigate={navigateToRoom}
        />
      </div>

      {/* ROOM NUMBER */}
      <div className="room-indicator">
        <span>
          {
            rooms.find(
              (room) =>
                room.id === activeRoom
            )?.number
          }
        </span>

        <div className="indicator-line" />

        <span>07</span>
      </div>

      {/* MENU */}
      {menuOpen && (
        <MenuOverlay
          activeRoom={activeRoom}
          onClose={() =>
            setMenuOpen(false)
          }
          onNavigate={navigateToRoom}
        />
      )}

    </main>
  );
}

export default App;
