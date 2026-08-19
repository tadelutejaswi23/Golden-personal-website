import React from "react";

export default function Gallery() {
  return (
    <section className="content-manager">
      <div className="manager-heading">
        <div>
          <div className="manager-eyebrow">
            GOLDEN ARCHIVE
          </div>

          <h2>Gallery</h2>
        </div>
      </div>

      <div className="empty-manager">
        <div className="empty-symbol">✦</div>

        <h3>Your gallery is ready</h3>

        <p>
          Gallery storage will be connected next.
        </p>
      </div>
    </section>
  );
}