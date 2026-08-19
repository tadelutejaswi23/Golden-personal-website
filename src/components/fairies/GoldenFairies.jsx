import React, { useMemo } from "react";
import "./GoldenFairies.css";

/* =========================================================
   GOLDEN FAIRY DATA
========================================================= */

const fairyData = [
  {
    type: "girl",
    side: "left",
    delay: "0s",
    duration: "14s",
    size: 1,
  },
  {
    type: "girl",
    side: "right",
    delay: "-4s",
    duration: "16s",
    size: 0.85,
  },
  {
    type: "boy",
    side: "left",
    delay: "-8s",
    duration: "18s",
    size: 0.9,
  },
  {
    type: "girl",
    side: "right",
    delay: "-11s",
    duration: "15s",
    size: 1.1,
  },
  {
    type: "boy",
    side: "right",
    delay: "-6s",
    duration: "17s",
    size: 0.8,
  },
];

/* =========================================================
   INDIVIDUAL FAIRY
========================================================= */

function GoldenFairy({
  type,
  side,
  delay,
  duration,
  size,
}) {
  const dust = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        x: `${(index * 47) % 100}%`,
        y: `${(index * 31) % 100}%`,
        delay: `${(index % 7) * 0.25}s`,
      })),
    []
  );

  return (
    <div
      className={`golden-fairy fairy-${type} fairy-${side}`}
      style={{
        "--fairy-delay": delay,
        "--fairy-duration": duration,
        "--fairy-size": size,
      }}
    >
      {/* =====================================================
          FAIRY AURA
      ===================================================== */}

      <div className="fairy-aura" />

      {/* =====================================================
          FLOATING GOLDEN DUST
      ===================================================== */}

      <div className="fairy-dust">
        {dust.map((particle) => (
          <span
            key={particle.id}
            className="fairy-dust-particle"
            style={{
              left: particle.x,
              top: particle.y,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          FAIRY CHARACTER
      ===================================================== */}

      <div className="fairy-character">

        {/* WINGS */}

        <div className="fairy-wing fairy-wing-left" />

        <div className="fairy-wing fairy-wing-right" />

        {/* HEAD */}

        <div className="fairy-head">
          <span className="fairy-hair" />
        </div>

        {/* BODY / GOLDEN DRESS */}

        <div className="fairy-body">
          <div className="fairy-dress" />
        </div>

        {/* ARMS */}

        <div className="fairy-arm fairy-arm-left" />

        <div className="fairy-arm fairy-arm-right" />

        {/* GOLDEN WAND */}

        <div className="fairy-wand">
          <span>✦</span>
        </div>
      </div>

      {/* =====================================================
          TRAILING GOLDEN MAGIC
      ===================================================== */}

      <div className="fairy-trail">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN GOLDEN FAIRIES COMPONENT
========================================================= */

export default function GoldenFairies() {
  return (
    <div
      className="golden-fairy-layer"
      aria-hidden="true"
    >
      {fairyData.map((fairy, index) => (
        <GoldenFairy
          key={`${fairy.type}-${fairy.side}-${index}`}
          {...fairy}
        />
      ))}
    </div>
  );
}