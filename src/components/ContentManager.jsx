import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./ContentManager.css";

/* =========================================================
   CONTENT MANAGER — SUPABASE VERSION
   ========================================================= */

export default function ContentManager({ type, title }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =======================================================
     LOAD CONTENT FROM SUPABASE
     ======================================================= */

  useEffect(() => {
    loadItems();
  }, [type]);

  const loadItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("golden_content")
      .select("*")
      .eq("type", type)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error loading content:",
        error
      );

      alert(
        "Could not load your Golden Vault content. Please check your Supabase connection."
      );

      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  };

  /* =======================================================
     ADD NEW ITEM
     ======================================================= */

  const addItem = async () => {
    setSaving(true);

    const newItem = {
      type,
      title: "",
      description: "",
      image: "",
      link: "",
      issuer: "",
      date: "",
    };

    const { data, error } = await supabase
      .from("golden_content")
      .insert(newItem)
      .select()
      .single();

    if (error) {
      console.error(
        "Error creating item:",
        error
      );

      alert(
        "Could not create the item. Please try again."
      );

      setSaving(false);
      return;
    }

    setItems((prev) => [
      ...prev,
      data,
    ]);

    setEditing(data.id);
    setSaving(false);
  };

  /* =======================================================
     UPDATE ITEM
     ======================================================= */

  const updateItem = async (
    id,
    field,
    value
  ) => {
    /* Update screen immediately */
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

    /* Save permanently to Supabase */
    const { error } = await supabase
      .from("golden_content")
      .update({
        [field]: value,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Error updating item:",
        error
      );

      alert(
        "Your change could not be saved. Please try again."
      );

      /* Reload the real saved version */
      loadItems();
    }
  };

  /* =======================================================
     DELETE ITEM
     ======================================================= */

  const deleteItem = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this item?"
      );

    if (!confirmed) return;

    setSaving(true);

    const item = items.find(
      (currentItem) =>
        currentItem.id === id
    );

    /* -----------------------------------------
       Delete image from Supabase Storage too
       ----------------------------------------- */

    if (item?.image) {
      try {
        const imageUrl =
          item.image;

        const marker =
          "/storage/v1/object/public/golden-images/";

        const markerIndex =
          imageUrl.indexOf(marker);

        if (markerIndex !== -1) {
          const filePath =
            decodeURIComponent(
              imageUrl.substring(
                markerIndex +
                  marker.length
              )
            );

          await supabase.storage
            .from("golden-images")
            .remove([filePath]);
        }
      } catch (storageError) {
        console.error(
          "Image deletion warning:",
          storageError
        );
      }
    }

    /* -----------------------------------------
       Delete database record
       ----------------------------------------- */

    const { error } =
      await supabase
        .from("golden_content")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Error deleting item:",
        error
      );

      alert(
        "The item could not be deleted."
      );

      setSaving(false);
      return;
    }

    setItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );

    if (editing === id) {
      setEditing(null);
    }

    setSaving(false);
  };

  /* =======================================================
     IMAGE UPLOAD
     ======================================================= */

  const handleImage = async (
    id,
    file
  ) => {
    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Please choose an image smaller than 10 MB."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       Create a unique filename so
       different uploads never overwrite
       each other.
      */

      const fileExtension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const fileName =
        `${type}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}.${fileExtension}`;

      /* -----------------------------------------
         Upload image to Supabase Storage
         ----------------------------------------- */

      const {
        error: uploadError,
      } = await supabase.storage
        .from("golden-images")
        .upload(
          fileName,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "Image upload error:",
          uploadError
        );

        alert(
          `Image upload failed: ${uploadError.message}`
        );

        setSaving(false);
        return;
      }

      /* -----------------------------------------
         Get permanent public image URL
         ----------------------------------------- */

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("golden-images")
        .getPublicUrl(
          fileName
        );

      const imageUrl =
        publicUrlData.publicUrl;

      /* -----------------------------------------
         Save image URL in database
         ----------------------------------------- */

      const {
        error: databaseError,
      } = await supabase
        .from("golden_content")
        .update({
          image: imageUrl,
        })
        .eq("id", id);

      if (databaseError) {
        console.error(
          "Database image update error:",
          databaseError
        );

        /*
         If database saving fails,
         remove the uploaded file so
         we don't leave an orphan.
        */

        await supabase.storage
          .from("golden-images")
          .remove([
            fileName,
          ]);

        alert(
          "The image uploaded, but could not be attached to your item."
        );

        setSaving(false);
        return;
      }

      /* -----------------------------------------
         Update screen
         ----------------------------------------- */

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                image: imageUrl,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Unexpected upload error:",
        error
      );

      alert(
        "Something went wrong while uploading the image."
      );
    }

    setSaving(false);
  };

  /* =======================================================
     LOADING SCREEN
     ======================================================= */

  if (loading) {
    return (
      <section className="content-manager">
        <div className="empty-manager">
          <div className="empty-symbol">
            ✦
          </div>

          <h3>
            Opening the Golden Archive...
          </h3>

          <p>
            Retrieving your permanently saved
            collection.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN UI
     ======================================================= */

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
          disabled={saving}
        >
          ✦ ADD{" "}
          {type
            .toUpperCase()
            .slice(0, -1)}
        </button>

      </div>

      {items.length === 0 && (
        <div className="empty-manager">

          <div className="empty-symbol">
            ✦
          </div>

          <h3>
            Your {type} collection is empty
          </h3>

          <p>
            Click the golden button above
            to add your first item.
          </p>

        </div>
      )}

      <div className="manager-grid">

        {items.map((item) => (

          <article
            className="editable-card"
            key={item.id}
          >

            {/* =================================================
                IMAGE
            ================================================= */}

            {item.image ? (

              <img
                className="uploaded-image"
                src={item.image}
                alt={
                  item.title ||
                  "Golden World"
                }
              />

            ) : (

              <label className="image-upload-box">

                <span>✦</span>

                <strong>
                  CLICK TO ADD PHOTO
                </strong>

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

            {/* =================================================
                EDIT MODE
            ================================================= */}

            {editing === item.id ? (

              <div className="editor-fields">

                <input
                  value={
                    item.title || ""
                  }
                  placeholder="Title"
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "title",
                      e.target.value
                    )
                  }
                />

                {type ===
                  "certificates" && (
                  <>
                    <input
                      value={
                        item.issuer ||
                        ""
                      }
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
                      value={
                        item.date ||
                        ""
                      }
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
                  value={
                    item.description ||
                    ""
                  }
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
                  value={
                    item.link || ""
                  }
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
                  onClick={() =>
                    setEditing(null)
                  }
                  disabled={saving}
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE ✦"}
                </button>

              </div>

            ) : (

              /* =================================================
                 DISPLAY MODE
              ================================================= */

              <div className="display-content">

                <div className="gold-label">
                  {type}
                </div>

                <h3>
                  {item.title ||
                    "Untitled"}
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
                    onClick={() =>
                      setEditing(
                        item.id
                      )
                    }
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
                      deleteItem(
                        item.id
                      )
                    }
                    disabled={saving}
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