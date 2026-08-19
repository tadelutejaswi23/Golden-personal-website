import { useRef, useState } from "react";
import {
  Camera,
  Plane,
  PawPrint,
  Heart,
  Sparkles,
  Plus,
  ArrowLeft,
  Image as ImageIcon,
  X,
} from "lucide-react";

import "./Gallery.css";

const galleryCategories = [
  {
    id: "normal",
    title: "Normal Photos",
    subtitle: "Little moments worth keeping forever.",
    description: "Your everyday memories, beautiful moments and special days.",
    icon: Camera,
    number: "01",
  },
  {
    id: "travel",
    title: "Travel Photos",
    subtitle: "Places you have wandered.",
    description: "Journeys, adventures, sunsets and places that became memories.",
    icon: Plane,
    number: "02",
  },
  {
    id: "animals",
    title: "Animals",
    subtitle: "For the beautiful creatures you helped.",
    description: "Memories of animals, rescue moments and helping little lives.",
    icon: PawPrint,
    number: "03",
  },
  {
    id: "pets",
    title: "Pets",
    subtitle: "Your little family.",
    description: "A special place for your pets and every memory with them.",
    icon: Heart,
    number: "04",
  },
  {
    id: "extra",
    title: "Extra Memories",
    subtitle: "A room for everything else.",
    description: "Anything meaningful that deserves its own little corner.",
    icon: Sparkles,
    number: "05",
  },
];

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [photos, setPhotos] = useState({
    normal: [],
    travel: [],
    animals: [],
    pets: [],
    extra: [],
  });

  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fileInputRef = useRef(null);

  const currentCategory = galleryCategories.find(
    (category) => category.id === selectedCategory
  );

  const handleOpenCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length || !selectedCategory) {
      return;
    }

    const newPhotos = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPhotos((previous) => ({
      ...previous,
      [selectedCategory]: [
        ...previous[selectedCategory],
        ...newPhotos,
      ],
    }));

    event.target.value = "";
  };

  const handleDeletePhoto = (photoId) => {
    setPhotos((previous) => ({
      ...previous,
      [selectedCategory]: previous[selectedCategory].filter(
        (photo) => photo.id !== photoId
      ),
    }));

    if (previewPhoto?.id === photoId) {
      setPreviewPhoto(null);
    }
  };

  /* =====================================================
     CATEGORY PAGE
  ===================================================== */

  if (selectedCategory && currentCategory) {
    const Icon = currentCategory.icon;
    const currentPhotos = photos[selectedCategory];

    return (
      <section className="gallery-sub-room">

        <div className="gallery-sub-header">

          <button
            className="gallery-back-button"
            onClick={handleBack}
          >
            <ArrowLeft size={15} />
            BACK TO GALLERY
          </button>

          <div className="gallery-eyebrow">
            <Icon size={14} />
            MEMORY CHAMBER
          </div>

          <h1>{currentCategory.title}</h1>

          <p>
            {currentCategory.description}
          </p>

          <div className="gallery-gold-line" />

        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="gallery-hidden-input"
        />

        <div className="gallery-upload-area">

          <button
            className="gallery-add-button"
            onClick={handleAddPhotos}
          >
            <span className="gallery-add-icon">
              <Plus size={24} />
            </span>

            <span className="gallery-add-text">
              CLICK TO ADD{" "}
              {currentCategory.title.toUpperCase()}
            </span>

            <span className="gallery-add-hint">
              Select one or multiple photos
            </span>
          </button>

        </div>

        {currentPhotos.length > 0 ? (
          <div className="gallery-photo-grid">

            {currentPhotos.map((photo) => (
              <div
                className="gallery-photo-card"
                key={photo.id}
              >

                <button
                  className="gallery-photo-view"
                  onClick={() => setPreviewPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                  />

                  <span className="gallery-photo-overlay">
                    <ImageIcon size={22} />
                    VIEW
                  </span>
                </button>

                <button
                  className="gallery-photo-delete"
                  onClick={() =>
                    handleDeletePhoto(photo.id)
                  }
                  title="Remove photo"
                >
                  <X size={13} />
                </button>

              </div>
            ))}

          </div>
        ) : (
          <div className="gallery-empty-state">

            <Sparkles size={30} />

            <h2>Your Memory Chamber Is Empty</h2>

            <p>
              Add your first memory and let this room begin
              to glow.
            </p>

          </div>
        )}

        {previewPhoto && (
          <div
            className="gallery-lightbox"
            onClick={() => setPreviewPhoto(null)}
          >

            <button
              className="gallery-lightbox-close"
              onClick={() => setPreviewPhoto(null)}
            >
              <X size={20} />
            </button>

            <img
              src={previewPhoto.url}
              alt={previewPhoto.name}
              onClick={(event) =>
                event.stopPropagation()
              }
            />

          </div>
        )}

      </section>
    );
  }

  /* =====================================================
     MAIN GALLERY
  ===================================================== */

  return (
    <section className="gallery-main-room">

      <div className="gallery-main-header">

        <div className="gallery-eyebrow">
          <Sparkles size={14} />
          THE MEMORY VAULT
        </div>

        <h1>Gallery</h1>

        <p>
          A golden collection of moments, journeys,
          creatures and memories worth keeping forever.
        </p>

        <div className="gallery-gold-line" />

      </div>

      <div className="gallery-category-grid">

        {galleryCategories.map((category) => {

          const Icon = category.icon;

          const photoCount =
            photos[category.id].length;

          return (
            <button
              key={category.id}
              className="gallery-category-card"
              onClick={() =>
                handleOpenCategory(category.id)
              }
            >

              <span className="gallery-category-number">
                {category.number}
              </span>

              <span className="gallery-category-icon">
                <Icon size={27} />
              </span>

              <span className="gallery-category-label">
                MEMORY CHAMBER
              </span>

              <span className="gallery-category-title">
                {category.title}
              </span>

              <span className="gallery-category-description">
                {category.subtitle}
              </span>

              <span className="gallery-category-bottom">

                <span>
                  {photoCount}{" "}
                  {photoCount === 1
                    ? "MEMORY"
                    : "MEMORIES"}
                </span>

                <span className="gallery-open">
                  OPEN →
                </span>

              </span>

            </button>
          );
        })}

      </div>

    </section>
  );
}

export default Gallery;