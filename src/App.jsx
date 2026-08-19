import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";
import GoldenFairies from "./components/fairies/GoldenFairies";
import ContentManagerComponent from "./components/ContentManager";
import "./App.css";

/* =========================================================
   SAFE COMPONENT RESOLUTION
   ========================================================= */

/*
   Your previous white-screen error strongly suggests that
   Gallery.jsx and/or ContentManager.jsx may not be using
   default exports.

   These two lines allow either:

   export default Gallery

   OR

   export function Gallery()

   without breaking the entire application.
*/

/* =========================================================
   MAIN ROOMS
========================================================= */

const rooms = [
  { id: "home", number: "01", label: "Home" },
  { id: "about", number: "02", label: "About Me" },
  { id: "projects", number: "03", label: "Projects" },
  { id: "certifications", number: "04", label: "Certifications" },
  { id: "achievements", number: "05", label: "Achievements" },
  { id: "learning", number: "06", label: "Learning" },
  { id: "goals", number: "07", label: "Goals" },
  { id: "closet", number: "08", label: "Golden Closet" },
  { id: "gallery", number: "09", label: "Gallery" },
];

/* =========================================================
   GOLDEN CLOSET CATEGORIES
========================================================= */

const closetCategories = [
  {
    id: "dresses",
    number: "01",
    title: "Dresses",
    description: "Your golden wardrobe",
    symbol: "DRESS",
  },
  {
    id: "bags",
    number: "02",
    title: "Bags",
    description: "Luxury bags & handbags",
    symbol: "BAG",
  },
  {
    id: "makeup",
    number: "03",
    title: "Makeup Vanity",
    description: "Your beauty collection",
    symbol: "BEAUTY",
  },
  {
    id: "accessories",
    number: "04",
    title: "Accessories",
    description: "Little things that sparkle",
    symbol: "JEWEL",
  },
  {
    id: "shoes",
    number: "05",
    title: "Shoes",
    description: "Your dream shoe collection",
    symbol: "SHOE",
  },
  {
    id: "skincare",
    number: "06",
    title: "Skincare",
    description: "Your beauty rituals",
    symbol: "CARE",
  },
  {
    id: "gold",
    number: "07",
    title: "Gold & Jewels",
    description: "Your treasures",
    symbol: "GOLD",
  },
];

/* =========================================================
   GALLERY CATEGORIES
========================================================= */

const galleryCategories = [
  {
    id: "normal",
    number: "01",
    title: "Normal Photos",
    description: "Beautiful memories from everyday life.",
    symbol: "PHOTO",
    addText: "CLICK TO ADD PHOTOS",
  },
  {
    id: "travel",
    number: "02",
    title: "Travel Photos",
    description: "Places I have visited and memories I have collected.",
    symbol: "TRAVEL",
    addText: "CLICK TO ADD TRAVEL PHOTOS",
  },
  {
    id: "animals",
    number: "03",
    title: "Animals",
    description: "Moments of kindness, helping and loving animals.",
    symbol: "ANIMAL",
    addText: "CLICK TO ADD HELPING ANIMALS",
  },
  {
    id: "pets",
    number: "04",
    title: "Pets",
    description: "My precious little companions and their memories.",
    symbol: "PETS",
    addText: "CLICK TO ADD PETS",
  },
  {
    id: "extra",
    number: "05",
    title: "Extra Gallery",
    description: "A private space for anything else I want to remember.",
    symbol: "EXTRA",
    addText: "CLICK TO ADD PHOTOS",
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
      aria-hidden="true"
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
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
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
   BACKGROUND PARTICLES
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
  const mainRoom = rooms.find(
    (room) => room.id === activeRoom
  );

  const closetCategory = closetCategories.find(
    (category) =>
      activeRoom === `closet-${category.id}`
  );

  const galleryCategory = galleryCategories.find(
    (category) =>
      activeRoom === `gallery-${category.id}`
  );

  const currentNumber =
    mainRoom?.number ||
    (closetCategory
      ? `08.${closetCategory.number}`
      : galleryCategory
      ? `09.${galleryCategory.number}`
      : "01");

  const currentLabel =
    mainRoom?.label ||
    closetCategory?.title ||
    galleryCategory?.title ||
    "Golden Vault";

  return (
    <header className="top-navigation">
      <button
        type="button"
        className="brand-mark"
        onClick={() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
          });
        }}
      >
        <SparkleIcon size={17} />
        <span>THE GOLDEN VAULT</span>
      </button>

      <div className="navigation-center">
        <span>{currentNumber}</span>

        <span className="nav-center-dot">
          <SparkleIcon size={9} />
        </span>

        <span>{currentLabel.toUpperCase()}</span>
      </div>

      <div className="navigation-actions">
        <button
          type="button"
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
            type="button"
            className="close-menu"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="menu-list">
          {rooms.map((room) => {
            const isMainActive =
              activeRoom === room.id;

            return (
              <div key={room.id}>
                <button
                  type="button"
                  className={`menu-item ${
                    isMainActive ? "active" : ""
                  }`}
                  onClick={() =>
                    onNavigate(room.id)
                  }
                >
                  <span className="menu-number">
                    {room.number}
                  </span>

                  <span className="menu-symbol">
                    <SparkleIcon size={12} />
                  </span>

                  <span>{room.label}</span>

                  <span className="menu-arrow">
                    <ArrowIcon />
                  </span>
                </button>

                {room.id === "closet" && (
                  <div className="closet-menu-sublist">
                    {closetCategories.map(
                      (category) => {
                        const subId =
                          `closet-${category.id}`;

                        const isActive =
                          activeRoom === subId;

                        return (
                          <button
                            type="button"
                            key={category.id}
                            className={`closet-menu-subitem ${
                              isActive
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              onNavigate(subId)
                            }
                          >
                            <span>
                              {category.number}
                            </span>

                            <span>
                              {category.title}
                            </span>

                            <ArrowIcon />
                          </button>
                        );
                      }
                    )}
                  </div>
                )}

                {room.id === "gallery" && (
                  <div className="gallery-menu-sublist">
                    {galleryCategories.map(
                      (category) => {
                        const subId =
                          `gallery-${category.id}`;

                        const isActive =
                          activeRoom === subId;

                        return (
                          <button
                            type="button"
                            key={category.id}
                            className={`gallery-menu-subitem ${
                              isActive
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              onNavigate(subId)
                            }
                          >
                            <span>
                              {category.number}
                            </span>

                            <span>
                              {category.title}
                            </span>

                            <ArrowIcon />
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
          Welcome to my golden universe —
          a place where cybersecurity,
          dreams, creativity and ambition
          live together.
        </p>

        <button
          type="button"
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
   ABOUT ME
========================================================= */

function AboutRoom() {
  const photoInputRef = useRef(null);

  const [photo, setPhoto] =
    useState(() => {
      return (
        localStorage.getItem(
          "golden-about-photo"
        ) || ""
      );
    });

  const handlePhotoUpload =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      if (
        !file.type.startsWith("image/")
      ) {
        alert(
          "Please select an image file."
        );
        return;
      }

      const reader =
        new FileReader();

      reader.onload = (e) => {
        const imageData =
          e.target.result;

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
        <div className="about-photo-frame">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="about-photo-input"
          />

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

/* =========================================================
   PROJECTS
========================================================= */

function ProjectsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="03 · THE PROJECT CHAMBER"
        title="Projects"
        description="A collection of things I have built, explored and learned through hands-on work."
      />

      <ContentManagerComponent
        type="projects"
        title="My Projects"
      />
    </section>
  );
}

/* =========================================================
   CERTIFICATIONS
========================================================= */

function CertificationsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="04 · THE CERTIFICATE CHAMBER"
        title="Certifications"
        description="Milestones that represent the skills and knowledge I have worked to build."
      />

      <ContentManagerComponent
        type="certificates"
        title="My Certifications"
      />
    </section>
  );
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

function AchievementsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="05 · THE ACHIEVEMENT HALL"
        title="Achievements"
        description="The milestones that mark the evolution of my professional and personal journey."
      />

      <ContentManagerComponent
        type="achievements"
        title="My Achievements"
      />
    </section>
  );
}

/* =========================================================
   LEARNING
========================================================= */

function LearningRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="06 · THE KNOWLEDGE LIBRARY"
        title="Learning"
        description="The technologies and subjects I am continuously building expertise in."
      />

      <ContentManagerComponent
        type="learning"
        title="My Learning Journey"
      />
    </section>
  );
}

/* =========================================================
   GOALS
========================================================= */

function GoalsRoom() {
  return (
    <section className="room-screen standard-screen">
      <RoomHeader
        eyebrow="07 · THE VISION CHAMBER"
        title="Goals"
        description="Where I am going — and the work required to get there."
      />

      <ContentManagerComponent
        type="goals"
        title="My Golden Goals"
      />
    </section>
  );
}

/* =========================================================
   GOLDEN CLOSET MAIN PAGE
========================================================= */

function ClosetRoom({ onNavigate }) {
  return (
    <section className="room-screen standard-screen closet-room">
      <RoomHeader
        eyebrow="08 · THE ROYAL CLOSET"
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
        {closetCategories.map(
          (category) => (
            <button
              type="button"
              className="golden-closet-category"
              key={category.id}
              onClick={() =>
                onNavigate(
                  `closet-${category.id}`
                )
              }
            >
              <div className="closet-category-number">
                {category.number}
              </div>

              <div className="closet-category-symbol">
                <SparkleIcon size={25} />
              </div>

              <div className="closet-category-label">
                {category.symbol}
              </div>

              <h2>
                {category.title}
              </h2>

              <p>
                {category.description}
              </p>

              <span className="closet-enter-button">
                ENTER COLLECTION
                <ArrowIcon />
              </span>
            </button>
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   CLOSET COLLECTION PAGE
========================================================= */

function ClosetCollectionRoom({
  category,
  onNavigate,
}) {
  return (
    <section className="room-screen standard-screen closet-sub-room">
      <button
        type="button"
        className="closet-back-button"
        onClick={() =>
          onNavigate("closet")
        }
      >
        <ArrowIcon direction="left" />

        <span>
          BACK TO GOLDEN CLOSET
        </span>
      </button>

      <RoomHeader
        eyebrow={`08 · THE ROYAL CLOSET · ${category.number}`}
        title={category.title}
        description={category.description}
      />

      <ClosetCollection
        category={category}
      />
    </section>
  );
}

/* =========================================================
   CLOSET COLLECTION MANAGER
========================================================= */


      function ClosetCollection({ category }) {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const inputRef = useRef(null);

  /* =====================================================
     LOAD SAVED CLOSET ITEMS FROM SUPABASE
  ===================================================== */

  useEffect(() => {
    loadItems();
  }, [category.id]);

  const loadItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("golden_content")
      .select("*")
      .eq("type", `closet-${category.id}`)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error("Failed to load closet:", error);
      alert("Could not load your Golden Closet items.");
    } else {
      setItems(data || []);
    }

    setLoading(false);
  };

  /* =====================================================
     IMAGE SELECTION
  ===================================================== */

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setImage(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     SAVE ITEM + IMAGE TO SUPABASE
  ===================================================== */

  const saveItem = async () => {
    if (!imageFile) {
      alert("Please add a photo first.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter an item name.");
      return;
    }

    setSaving(true);

    try {
      const safeFileName = imageFile.name
        .replace(/[^a-zA-Z0-9.-]/g, "-")
        .toLowerCase();

      const filePath =
        `closet/${category.id}/${Date.now()}-${safeFileName}`;

      /* Upload image */

      const { error: uploadError } = await supabase.storage
        .from("golden-images1")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      /* Get permanent public image URL */

      const { data: publicUrlData } =
        supabase.storage
          .from("golden-images1")
          .getPublicUrl(filePath);

      const imageUrl =
        publicUrlData.publicUrl;

      /* Save item information */

      const { data: savedItem, error: databaseError } =
        await supabase
          .from("golden_content")
          .insert([
            {
              type: `closet-${category.id}`,
              title: name.trim(),
              description: description.trim(),
              image: imageUrl,
              link: link.trim(),
            },
          ])
          .select()
          .single();

      if (databaseError) {
        /* If database saving fails, remove uploaded image */

        await supabase.storage
          .from("golden-images1")
          .remove([filePath]);

        throw databaseError;
      }

      setItems((prev) => [
        ...prev,
        savedItem,
      ]);

      /* Clear form */

      setImage("");
      setImageFile(null);
      setName("");
      setDescription("");
      setLink("");
      setShowForm(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Failed to save closet item:",
        error
      );

      alert(
        "Could not save this item. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE ITEM + IMAGE
  ===================================================== */

  const deleteItem = async (item) => {
    const confirmed = window.confirm(
      "Remove this item permanently from your Golden Closet?"
    );

    if (!confirmed) return;

    try {
      /* Delete database record */

      const { error: databaseError } =
        await supabase
          .from("golden_content")
          .delete()
          .eq("id", item.id);

      if (databaseError) {
        throw databaseError;
      }

      /* Try to delete image from storage */

      if (item.image) {
        const marker =
          "/golden-images1/";

        const imageIndex =
          item.image.indexOf(marker);

        if (imageIndex !== -1) {
          const filePath =
            decodeURIComponent(
              item.image.substring(
                imageIndex + marker.length
              )
            );

          await supabase.storage
            .from("golden-images1")
            .remove([filePath]);
        }
      }

      setItems((prev) =>
        prev.filter(
          (savedItem) =>
            savedItem.id !== item.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete closet item:",
        error
      );

      alert(
        "Could not remove this item."
      );
    }
  };

  /* =====================================================
     CANCEL FORM
  ===================================================== */

  const cancelForm = () => {
    setShowForm(false);
    setImage("");
    setImageFile(null);
    setName("");
    setDescription("");
    setLink("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="closet-empty-state">
        <SparkleIcon size={30} />

        <h2>OPENING YOUR GOLDEN CLOSET</h2>

        <p>
          Your collection is being retrieved...
        </p>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="closet-collection">

      <div className="closet-builder">

        <div className="closet-builder-heading">
          <div className="closet-builder-line" />

          <span>
            BUILD YOUR COLLECTION
          </span>

          <div className="closet-builder-line" />
        </div>

        <button
          type="button"
          className="closet-add-button-large"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          <span className="add-button-star">
            <SparkleIcon size={16} />
          </span>

          <span>
            {showForm
              ? "CLOSE ADD ITEM"
              : "CLICK TO ADD NEW ITEM"}
          </span>

          <span className="add-button-plus">
            {showForm ? "×" : "+"}
          </span>
        </button>

        {showForm && (
          <div className="closet-item-form">

            <div className="closet-form-title">
              <SparkleIcon size={15} />

              <span>
                ADD TO{" "}
                {category.title.toUpperCase()}
              </span>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="closet-hidden-input"
            />

            <button
              type="button"
              className={`closet-upload-box ${
                image ? "has-image" : ""
              }`}
              onClick={() =>
                inputRef.current?.click()
              }
            >
              {image ? (
                <img
                  src={image}
                  alt={
                    name ||
                    "Golden Closet item"
                  }
                />
              ) : (
                <>
                  <SparkleIcon size={42} />

                  <strong>
                    CLICK TO ADD PHOTO
                  </strong>

                  <small>
                    Choose an image from your computer
                  </small>
                </>
              )}
            </button>

            <div className="closet-form-fields">

              <label>ITEM NAME</label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Golden Evening Dress"
              />

              <label>DESCRIPTION</label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Why do you love this item?"
              />

              <label>
                ONLINE SHOPPING LINK
              </label>

              <input
                type="url"
                value={link}
                onChange={(event) =>
                  setLink(event.target.value)
                }
                placeholder="https://example.com/product"
              />

              <div className="closet-form-actions">

                <button
                  type="button"
                  className="closet-cancel-button"
                  onClick={cancelForm}
                  disabled={saving}
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  className="save-closet-item"
                  onClick={saveItem}
                  disabled={saving}
                >
                  {saving
                    ? "SAVING TO THE GOLDEN VAULT..."
                    : "SAVE TO MY GOLDEN CLOSET"}
                </button>

              </div>

            </div>
          </div>
        )}
      </div>

      {items.length > 0 ? (

        <div className="closet-items-grid">

          {items.map((item) => (

            <article
              key={item.id}
              className="saved-closet-card"
            >

              <div className="saved-closet-image">
                <img
                  src={item.image}
                  alt={item.title}
                />
              </div>

              <div className="saved-closet-info">

                <div className="saved-item-category">
                  {category.title}
                </div>

                <h3>
                  {item.title}
                </h3>

                {item.description && (
                  <p>
                    {item.description}
                  </p>
                )}

                <div className="saved-closet-actions">

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="buy-closet-item"
                    >
                      VIEW ONLINE
                      <ArrowIcon />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      deleteItem(item)
                    }
                    className="delete-closet-item"
                  >
                    REMOVE
                  </button>

                </div>
              </div>
            </article>
          ))}
        </div>

      ) : (

        <div className="closet-empty-state">

          <SparkleIcon size={30} />

          <h2>
            YOUR COLLECTION AWAITS
          </h2>

          <p>
            Nothing has been placed in this
            golden chamber yet.
          </p>

          <p>
            Click "CLICK TO ADD NEW ITEM"
            to begin.
          </p>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   GALLERY MAIN ROOM
========================================================= */

function GalleryRoom({ onNavigate }) {
  return (
    <section className="room-screen standard-screen gallery-room">
      <RoomHeader
        eyebrow="09 · THE MEMORY GALLERY"
        title="Gallery"
        description="A golden chamber for the photographs, memories and little moments I never want to forget."
      />

    

      <div className="gallery-chamber-grid">
        {galleryCategories.map(
          (category) => (
            <button
              type="button"
              className="gallery-chamber-card"
              key={category.id}
              onClick={() =>
                onNavigate(
                  `gallery-${category.id}`
                )
              }
            >
              <div className="gallery-card-number">
                {category.number}
              </div>

              <div className="gallery-card-symbol">
                <SparkleIcon size={26} />
              </div>

              <div className="gallery-card-label">
                {category.symbol}
              </div>

              <h2>
                {category.title}
              </h2>

              <p>
                {category.description}
              </p>

              <span className="gallery-card-enter">
                ENTER GALLERY
                <ArrowIcon />
              </span>
            </button>
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   GALLERY MEMORY PAGE
========================================================= */

function GalleryMemoryRoom({
  category,
  onNavigate,
}) {
  return (
    <section className="room-screen standard-screen gallery-memory-room">
      <button
        type="button"
        className="closet-back-button"
        onClick={() =>
          onNavigate("gallery")
        }
      >
        <ArrowIcon direction="left" />

        <span>
          BACK TO GALLERY
        </span>
      </button>

      <RoomHeader
        eyebrow={`09 · THE MEMORY GALLERY · ${category.number}`}
        title={category.title}
        description={category.description}
      />

      <PhotoMemoryCollection
        category={category}
      />
    </section>
  );
}
function PhotoMemoryCollection({ category }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const loadPhotos = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("golden_gallery")
      .select("*")
      .eq("category", category.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Gallery load error:", error);
      alert("Could not load your memories.");
    } else {
      setPhotos(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, [category.id]);

  const handlePhotosUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10 MB and was skipped.`);
        continue;
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath =
        `gallery/${category.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("golden-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        alert(`Could not upload ${file.name}.`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("golden-images")
        .getPublicUrl(filePath);

      const { data: savedPhoto, error: databaseError } =
        await supabase
          .from("golden_gallery")
          .insert({
            category: category.id,
            image: urlData.publicUrl,
            name: file.name,
          })
          .select()
          .single();

      if (databaseError) {
        console.error(databaseError);

        await supabase.storage
          .from("golden-images")
          .remove([filePath]);

        continue;
      }

      setPhotos((prev) => [...prev, savedPhoto]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const deletePhoto = async (photo) => {
    const confirmed = window.confirm(
      "Remove this memory permanently?"
    );

    if (!confirmed) return;

    const marker =
      "/storage/v1/object/public/golden-images/";

    const markerIndex = photo.image.indexOf(marker);

    if (markerIndex !== -1) {
      const filePath = decodeURIComponent(
        photo.image.substring(markerIndex + marker.length)
      );

      await supabase.storage
        .from("golden-images")
        .remove([filePath]);
    }

    const { error } = await supabase
      .from("golden_gallery")
      .delete()
      .eq("id", photo.id);

    if (error) {
      console.error(error);
      alert("Could not delete this memory.");
      return;
    }

    setPhotos((prev) =>
      prev.filter((item) => item.id !== photo.id)
    );
  };

  if (loading) {
    return (
      <div className="gallery-empty-state">
        <SparkleIcon size={35} />
        <h2>OPENING MEMORY VAULT...</h2>
        <p>Retrieving your permanently saved memories.</p>
      </div>
    );
  }

  return (
    <div className="gallery-memory-collection">

      <div className="gallery-builder">

        <div className="closet-builder-heading">
          <div className="closet-builder-line" />

          <span>PRESERVE YOUR MEMORIES</span>

          <div className="closet-builder-line" />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosUpload}
          className="closet-hidden-input"
        />

        <button
          type="button"
          className="gallery-add-photos-button"
          onClick={() => inputRef.current?.click()}
        >
          <span className="add-button-star">
            <SparkleIcon size={18} />
          </span>

          <span>{category.addText}</span>

          <span className="add-button-plus">+</span>
        </button>
      </div>

      {photos.length > 0 ? (
        <div className="gallery-photo-grid">

          {photos.map((photo) => (
            <article
              key={photo.id}
              className="gallery-photo-card"
            >
              <div className="gallery-photo-image">
                <img
                  src={photo.image}
                  alt={photo.name || category.title}
                />
              </div>

              <div className="gallery-photo-footer">
                <span>{photo.name}</span>

                <button
                  type="button"
                  onClick={() => deletePhoto(photo)}
                >
                  REMOVE
                </button>
              </div>
            </article>
          ))}

        </div>
      ) : (
        <div className="gallery-empty-state">

          <SparkleIcon size={35} />

          <h2>YOUR MEMORY WALL IS EMPTY</h2>

          <p>
            Add your first memory to this golden chamber.
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            {category.addText}
          </button>

        </div>
      )}
    </div>
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
      return (
        <ClosetRoom
          onNavigate={onNavigate}
        />
      );

    case "gallery":
      return (
        <GalleryRoom
          onNavigate={onNavigate}
        />
      );

    case "home":
    default:
      break;
  }

  /* =======================================================
     CLOSET SUB-PAGES
  ======================================================= */

  if (
    activeRoom.startsWith(
      "closet-"
    )
  ) {
    const categoryId =
      activeRoom.replace(
        "closet-",
        ""
      );

    const category =
      closetCategories.find(
        (item) =>
          item.id === categoryId
      );

    if (category) {
      return (
        <ClosetCollectionRoom
          category={category}
          onNavigate={onNavigate}
        />
      );
    }
  }

  /* =======================================================
     GALLERY SUB-PAGES
  ======================================================= */

  if (
    activeRoom.startsWith(
      "gallery-"
    )
  ) {
    const categoryId =
      activeRoom.replace(
        "gallery-",
        ""
      );

    const category =
      galleryCategories.find(
        (item) =>
          item.id === categoryId
      );

    if (category) {
      return (
        <GalleryMemoryRoom
          category={category}
          onNavigate={onNavigate}
        />
      );
    }
  }

  return (
    <HomeRoom
      onNavigate={onNavigate}
    />
  );
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

  const navigateToRoom =
    (roomId) => {
      if (
        roomId === activeRoom
      ) {
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
     BODY MENU STATE
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
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
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

      {/* =================================================
          GOLDEN BACKGROUND
      ================================================= */}

      <GoldenBackground />

      {/* =================================================
          GOLDEN FAIRY MAGIC LAYER

          IMPORTANT:
          Background comes FIRST.
          Fairies come SECOND.
          Therefore the fairies are not hidden
          underneath the background.
      ================================================= */}

      <GoldenFairies />

      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <TopNavigation
        activeRoom={activeRoom}
        onMenu={() =>
          setMenuOpen(true)
        }
      />

      {/* =================================================
          CURRENT ROOM
      ================================================= */}

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

      {/* =================================================
          ROOM INDICATOR
      ================================================= */}

      <div className="room-indicator">
        <span>
          {(() => {
            const mainRoom =
              rooms.find(
                (room) =>
                  room.id === activeRoom
              );

            if (mainRoom) {
              return mainRoom.number;
            }

            const closetCategory =
              closetCategories.find(
                (item) =>
                  activeRoom ===
                  `closet-${item.id}`
              );

            if (closetCategory) {
              return `08.${closetCategory.number}`;
            }

            const galleryCategory =
              galleryCategories.find(
                (item) =>
                  activeRoom ===
                  `gallery-${item.id}`
              );

            if (galleryCategory) {
              return `09.${galleryCategory.number}`;
            }

            return "01";
          })()}
        </span>

        <div className="indicator-line" />

        <span>
          09
        </span>
      </div>

      {/* =================================================
          MENU
      ================================================= */}

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