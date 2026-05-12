'use client' // Remove this line if not using Next.js App Router

import { motion, useReducedMotion } from 'framer-motion'

// ─── Path Definitions ────────────────────────────────────────────────────────
//
// The "O" in OROS is redrawn as an architectural letterform:
//   • Outer silhouette: the two ascending arcs converge at a sharp upward peak
//     instead of a smooth dome — representing a mountain (oros) / monolith.
//   • Inner counter: a standard ellipse, cut out via evenodd fill-rule.
//     The contrast between the peaked exterior and the rounded interior
//     reinforces the "engineered natural" tension of the brand.
//
const OUTER_O =
  'M 30 70 C 10 70 10 44 20 39 L 30 32 L 40 39 C 50 44 50 70 30 70 Z'

const INNER_O =
  'M 30 42 C 36.6 42 42 46.7 42 52.5 C 42 58.3 36.6 63 30 63 ' +
  'C 23.4 63 18 58.3 18 52.5 C 18 46.7 23.4 42 30 42 Z'

// evenodd clips the inner path out of the outer, creating the O counter
const PEAK_O = `${OUTER_O} ${INNER_O}`

// ─── Shared animation presets ────────────────────────────────────────────────
const BREATH = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
}

const INNER_BREATH = {
  animate: { fillOpacity: [0.03, 0.13, 0.03] },
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function OROSLogo({ className = '' }) {
  const reduced = useReducedMotion()

  return (
    <div
      className={`inline-flex items-center bg-[#1A1A1A] px-10 py-6 ${className}`}
    >
      {/*
       * SVG layout — viewBox: 240 × 84 px user units
       *
       *   x  0–60   : custom peak-O glyph  (center x=30, right edge x=50)
       *   x 62–230  : "ROS" in Cinzel 700, fontSize=52, letterSpacing=12
       *   y 32      : O peak / text cap-height
       *   y 70      : shared baseline
       */}
      <svg
        viewBox="0 0 240 84"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="OROS"
        role="img"
        className="h-14 w-auto"
      >
        <defs>
          {/* Cinzel: a classical Roman serif with tall, commanding capitals */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
          `}</style>

          {/*
           * Cobalt edge-glow filter
           *
           * stdDeviation=2.5 keeps the blur radius tight (~5 px spread).
           * feFlood fills that blurred shape with pure Electric Cobalt.
           * feComposite "in" clips the color to only where the blur exists,
           * producing a precise rim light rather than a diffuse neon cloud.
           *
           * The original SourceGraphic is NOT merged here — we render
           * the crisp base layer separately on top, ensuring sharp edges.
           */}
          <filter
            id="cobaltEdge"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#2E5BFF" floodOpacity="1" result="cobalt" />
            <feComposite in="cobalt" in2="blur" operator="in" result="glow" />
          </filter>
        </defs>

        {/* ── Layer 1: Pulsing cobalt halo (rendered first = deepest) ────── */}
        {/*
         * The entire logo shape is duplicated here, run through the glow filter,
         * and animated between 50 % and 100 % opacity — a slow 4-second breath
         * that reads as "the system is on and processing."
         */}
        <motion.g
          filter="url(#cobaltEdge)"
          animate={reduced ? undefined : BREATH.animate}
          transition={reduced ? undefined : BREATH.transition}
          style={{ opacity: 0.75 }}
          aria-hidden="true"
        >
          <path d={PEAK_O} fill="#F5F5F5" fillRule="evenodd" />
          <text
            x="62"
            y="70"
            fontFamily="Cinzel, 'Trajan Pro', Georgia, serif"
            fontWeight="700"
            fontSize="52"
            fill="#F5F5F5"
            letterSpacing="12"
          >
            ROS
          </text>
        </motion.g>

        {/* ── Layer 2: Inner O luminance — cobalt breath through the counter ─ */}
        {/*
         * A very faint cobalt fill inside the O's counter suggests a light
         * source trapped inside the monolith — subtle "powered from within" cue.
         */}
        <motion.path
          d={INNER_O}
          fill="#2E5BFF"
          fillOpacity={0.06}
          animate={reduced ? undefined : INNER_BREATH.animate}
          transition={reduced ? undefined : INNER_BREATH.transition}
          aria-hidden="true"
        />

        {/* ── Layer 3: Marble-white letterforms — crisp, on top ───────────── */}
        <g aria-hidden="true">
          <path d={PEAK_O} fill="#F5F5F5" fillRule="evenodd" />
          <text
            x="62"
            y="70"
            fontFamily="Cinzel, 'Trajan Pro', Georgia, serif"
            fontWeight="700"
            fontSize="52"
            fill="#F5F5F5"
            letterSpacing="12"
          >
            ROS
          </text>
        </g>

        {/* ── Layer 4: Cobalt hairline — 0.75 px stroke on the O silhouette ─ */}
        {/*
         * A sub-pixel cobalt stroke traces the outer O path and pulses in sync
         * with the halo. At this weight it reads as a precise "edge backlight"
         * rather than a visible outline — the technical seam of the monolith.
         */}
        <motion.path
          d={OUTER_O}
          fill="none"
          stroke="#2E5BFF"
          strokeWidth="0.75"
          animate={reduced ? undefined : { opacity: [0.2, 0.75, 0.2] }}
          transition={reduced ? undefined : BREATH.transition}
          style={{ opacity: 0.4 }}
          aria-hidden="true"
        />
      </svg>
    </div>
  )
}
