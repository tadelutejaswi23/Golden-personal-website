import React, { useEffect, useState } from "react";
import "./ContentManager.css";

const STORAGE_KEY = "golden-world-content";

const emptyData = {
  projects: [],
  certificates: [],
  achievements: [],
  gallery: [],
  learning: [],
  goals: [],
  closet: [],
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyData, ...JSON.parse(saved) } : emptyData;
  } catch {
    return emptyData;
  }
}

export default function ContentManager({ type, title }) {
  const [items, setItems] = useState(() => loadData()[type] || []);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const all = loadData();
    all[type] = items;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }, [items, type]);

  const addItem = () => {
    const item = {
      id: Date.now(),
      title: "",
      description: "",
      image: "",
      link: "",
      issuer: "",
      date: "",
    };

    setItems((prev) => [...prev, item]);
    setEditing(item.id);
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (editing === id) {
      setEditing(null);
    }
  };

  const handleImage = (id, file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateItem(id, "image", reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="content-manager">

      <div className="manager-heading">

        <div>
          <div className="manager-eyebrow">
            GOLDEN ARCHIVE
          </div>

          <h2>{title}</h2>
        </div>

        <button
          className="gold-add-button"
          onClick={addItem}
        >
          ✦ ADD {type.toUpperCase().slice(0, -1)}
        </button>

      </div>

      {items.length === 0 && (
        <div className="empty-manager">
          <div className="empty-symbol">✦</div>

          <h3>Your {type} collection is empty</h3>

          <p>
            Click the golden button above to add your first item.
          </p>
        </div>
      )}

      <div className="manager-grid">

        {items.map((item) => (

          <article
            className="editable-card"
            key={item.id}
          >

            {item.image ? (
              <img
                className="uploaded-image"
                src={item.image}
                alt={item.title || "Golden World"}
              />
            ) : (
              <label className="image-upload-box">
                <span>✦</span>
                <strong>CLICK TO ADD PHOTO</strong>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImage(item.id, e.target.files[0])
                  }
                />
              </label>
            )}

            {editing === item.id ? (

              <div className="editor-fields">

                <input
                  value={item.title}
                  placeholder="Title"
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "title",
                      e.target.value
                    )
                  }
                />

                {type === "certificates" && (
                  <>
                    <input
                      value={item.issuer}
                      placeholder="Issued by / Organization"
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "issuer",
                          e.target.value
                        )
                      }
                    />

                    <input
                      value={item.date}
                      placeholder="Date"
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </>
                )}

                <textarea
                  value={item.description}
                  placeholder="Write your content..."
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                <input
                  value={item.link}
                  placeholder="Link (optional)"
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "link",
                      e.target.value
                    )
                  }
                />

                {!item.image && (
                  <label className="choose-image">
                    ✦ CHOOSE IMAGE

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImage(
                          item.id,
                          e.target.files[0]
                        )
                      }
                    />
                  </label>
                )}

                <button
                  className="save-button"
                  onClick={() => setEditing(null)}
                >
                  SAVE ✦
                </button>

              </div>

            ) : (

              <div className="display-content">

                <div className="gold-label">
                  {type}
                </div>

                <h3>
                  {item.title || "Untitled"}
                </h3>

                {item.issuer && (
                  <small>
                    {item.issuer}
                  </small>
                )}

                {item.date && (
                  <small>
                    {item.date}
                  </small>
                )}

                <p>
                  {item.description ||
                    "Click edit to add your content."}
                </p>

                <div className="card-actions">

                  <button
                    onClick={() => setEditing(item.id)}
                  >
                    EDIT
                  </button>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      OPEN
                    </a>
                  )}

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteItem(item.id)
                    }
                  >
                    DELETE
                  </button>

                </div>

              </div>

            )}

          </article>

        ))}

      </div>

    </section>
  );
}