"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const WEDDING_DATE = new Date("2026-06-26T10:00:00");

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function pad(n) { return String(n).padStart(2, "0"); }

// ── Decorative SVGs ──────────────────────────────────────────────
function Mandala({ size = 140, color = "#c9a84c", opacity = 0.4 }) {
  const angles = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ opacity }}>
      {angles.map((a) => (
        <g key={a} transform={`rotate(${a} 60 60)`}>
          <ellipse cx="60" cy="18" rx="5" ry="11" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="60" cy="8" r="3" fill={color} />
        </g>
      ))}
      <circle cx="60" cy="60" r="30" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="60" r="21" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="60" cy="60" r="7" fill={color} />
    </svg>
  );
}

function DiamondDivider({ color = "#c9a84c" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "16px 0" }}>
      <div style={{ height: 1, width: 60, background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 1 L15 8 L8 15 L1 8 Z" fill={color} />
      </svg>
      <div style={{ height: 1, width: 60, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

function FloatingPetals() {
  const petals = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i * 7.3 + 3) % 100}%`,
    delay: `${(i * 0.7) % 5}s`,
    duration: `${6 + (i % 4)}s`,
    size: 10 + (i % 8),
    color: i % 2 === 0 ? "#f4a0b0" : "#e8607a",
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {petals.map((p) => (
        <div key={p.id} style={{
          position: "absolute", top: "-20px", left: p.left,
          width: p.size, height: p.size,
          borderRadius: "50% 10% 50% 10%",
          background: p.color, opacity: 0.7,
          animation: `petalFall ${p.duration} ${p.delay} linear infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Infinite Horizontal Scroll Gallery ─────────────────────────
function InfiniteGallery({ photos }) {
  // Duplicate for seamless loop — first half scrolls out, second half seamlessly continues
  const strip = [...photos, ...photos];
  return (
    <div className="gallery-viewport">
      <div className="gallery-strip">
        {strip.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Moment ${(i % photos.length) + 1}`}
            className="gallery-img"
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function WeddingInvite() {
  const countdown = useCountdown(WEDDING_DATE);
  const [heroRef, heroIn] = useInView(0.1);
  const [inviteRef, inviteIn] = useInView(0.1);
  const [carRef, carIn] = useInView(0.15);
  const [coupleRef, coupleIn] = useInView(0.1);
  const [countdownRef, countdownIn] = useInView(0.1);
  const [tajRef, tajIn] = useInView(0.05);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Place photos at /public/images/gallery/photo1.jpg … photo6.jpg
  const galleryPhotos = [
    "/images/gallery/photo1.jpg",
    "/images/gallery/photo2.jpg",
    "/images/gallery/photo3.jpg",
    "/images/gallery/photo4.jpg",
    "/images/gallery/photo5.jpg",
    "/images/gallery/photo6.jpg",
  ];

  return (
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#0d1a2a", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@400;700&family=Pinyon+Script&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── Keyframes ─── */
        @keyframes petalFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes rotateMandala {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        /* Corner GIF pulse animations */
        @keyframes cornerPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.92; }
          50%       { transform: scale(1.08) rotate(6deg); opacity: 1; }
        }
        @keyframes cornerPulseR {
          0%, 100% { transform: scaleX(-1) scale(1) rotate(0deg); opacity: 0.92; }
          50%       { transform: scaleX(-1) scale(1.08) rotate(-6deg); opacity: 1; }
        }
        /* Car: drives in from left, then floats gently */
        @keyframes carDriveIn {
          from { transform: translateX(-120px); opacity: 0; }
          to   { transform: translateX(0px); opacity: 1; }
        }
        @keyframes carFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        /* Infinite gallery scroll — moves strip exactly 50% (one copy) leftward */
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ─── Scroll-reveal helpers ─── */
        .fade-up  { opacity: 0; }
        .fade-up.visible  { animation: fadeUp 0.9s ease forwards; }
        .fade-in  { opacity: 0; }
        .fade-in.visible  { animation: fadeIn 1s ease forwards; }
        .scale-in { opacity: 0; }
        .scale-in.visible { animation: scaleIn 0.8s ease forwards; }

        /* ─── Corner GIF — FIXED, does not scroll with page ─── */
.corner-gif {
  position: fixed !important;
  top: 0;
  width: clamp(180px, 22vw, 400px) !important;
  height: auto;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.9;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
}

.corner-gif-left {
  left: -40px;
  top: -20px;
  transform-origin: top left;
}

.corner-gif-right {
  right: -40px;
  top: -20px;
  transform-origin: top right;
}

        /* ─── Temple sides — hidden on mobile ─── */
        @media (max-width: 768px) {
          .temple-side { display: none !important; }
          .hero-main-temple {
            width: 96% !important;
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: flex !important;
            justify-content: center !important;
          }
          .corner-gif {
            width: clamp(110px, 28vw, 170px) !important;
          }
        }

        /* ─── Elephant overlay: bg watermark, below all text ─── */
        /* z-index: 1 keeps it above bg but below text (z-index: 3) */
        .elephant-overlay {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: clamp(200px, 60vw, 440px);
          z-index: 1;
          opacity: 0.12;
          pointer-events: none;
          filter: sepia(0.4) drop-shadow(0 0 28px rgba(180,100,0,0.25));
        }
        .elephant-overlay img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ─── King & Queen: pinned to left/right edges of Section 2 ─── */
        .queen-side, .king-side {
          position: absolute;
          bottom: 0;
          z-index: 2;
          pointer-events: none;
        }
        .queen-side {
          left: 0;
          width: clamp(200px, 30vw, 420px);
          filter: drop-shadow(6px 0 18px rgba(90,40,0,0.3));
        }
        .king-side {
          right: 0;
          width: clamp(200px, 30vw, 420px);
          filter: drop-shadow(-6px 0 18px rgba(90,40,0,0.3));
        }
        .queen-side img, .king-side img {
          width: 100%;
          height: auto;
          display: block;
        }
        @media (max-width: 768px) {
          .queen-side, .king-side { display: none !important; }
        }

        /* ─── Route button ─── */
        .route-btn {
          display: inline-block;
          padding: 10px 32px;
          border: 2px solid #8b4513;
          color: #5a2d0c;
          font-family: 'Cinzel Decorative', serif;
          font-size: 13px;
          letter-spacing: 2px;
          text-decoration: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }
        .route-btn:hover {
          background: #8b4513;
          color: #fff8e7;
          letter-spacing: 3px;
        }

        /* ─── Countdown ─── */
        .countdown-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 72px;
        }
        .countdown-num {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 700;
          color: #c9a84c;
          line-height: 1;
          animation: pulse 2s ease-in-out infinite;
        }
        .countdown-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #e8d5a3;
          margin-top: 6px;
        }
        .countdown-sep {
          font-size: 36px;
          color: #c9a84c;
          font-weight: 300;
          padding-bottom: 20px;
        }

        /* ─── Car separator ─── */
        /* Positioned at the color-transition boundary between Section 2 & 3 */
        .car-separator {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 0 20px;
          overflow: hidden;
          background: linear-gradient(180deg, #f0d9a0 0%, #2d5a3d 100%);
        }
        .car-image-wrap {
          position: relative;
          width: clamp(200px, 48vw, 360px);
          z-index: 4;
          opacity: 0;
        }
        .car-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          filter:
            drop-shadow(0 -6px 6px rgba(0,0,0,0.18))
            drop-shadow(0 18px 32px rgba(0,0,0,0.55))
            drop-shadow(0 4px 8px rgba(0,0,0,0.4));
          transform: perspective(600px) rotateX(6deg) translateY(-4px);
          transform-origin: bottom center;
          transition: transform 0.3s ease;
        }
        .car-image-wrap:hover img {
          transform: perspective(600px) rotateX(3deg) translateY(-10px) scale(1.03);
        }
        /* Phase 1: drive in. Phase 2: float. car-drive class is added when in view. */
        .car-drive {
          animation:
            carDriveIn 1s cubic-bezier(0.22,1,0.36,1) forwards,
            carFloat 3.5s ease-in-out 1s infinite;
        }
        /* Route: slides up behind car (z-index 3 < car z-index 4) */
        .route-reveal {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(100%);
          z-index: 3;
          width: clamp(180px, 55vw, 420px);
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease;
          opacity: 0;
          pointer-events: none;
        }
        .route-reveal.visible {
          transform: translateX(-50%) translateY(30%);
          opacity: 0.7;
        }
        .route-road {
          width: 100%;
          height: 28px;
          background: repeating-linear-gradient(90deg,#4a3a1a 0px,#4a3a1a 32px,#c9a84c 32px,#c9a84c 64px);
          border-radius: 4px;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3);
          position: relative;
        }
        .route-road::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 3px;
          background: repeating-linear-gradient(90deg,transparent 0,transparent 14px,#f5d07a 14px,#f5d07a 28px);
          transform: translateY(-50%);
          opacity: 0.5;
        }

        /* ─── Infinite horizontal gallery ─── */
        .gallery-viewport {
          width: 100%;
          overflow: hidden;
          margin-top: 36px;
        }
        /* The strip is 2x wide; scrollLeft moves it -50% = one full copy */
        .gallery-strip {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: scrollLeft 30s linear infinite;
          padding: 8px 0;
        }
        /* Hover pauses on desktop */
        .gallery-viewport:hover .gallery-strip {
          animation-play-state: paused;
        }
        .gallery-img {
          width: clamp(150px, 26vw, 250px);
          height: clamp(150px, 26vw, 250px);
          object-fit: cover;
          border-radius: 14px;
          border: 3px solid #c9a84c;
          box-shadow: 0 6px 24px rgba(0,0,0,0.45);
          flex-shrink: 0;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          display: block;
        }
        .gallery-img:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 16px 40px rgba(201,168,76,0.5);
        }
        @media (max-width: 768px) {
          .gallery-img {
            width: clamp(120px, 38vw, 190px);
            height: clamp(120px, 38vw, 190px);
          }
          .gallery-strip {
            animation-duration: 22s;
            gap: 12px;
          }
        }

        html { scroll-behavior: smooth; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          FIXED CORNER GIFs
          → Always stay in top corners regardless of scroll position
          → Place image at: /public/images/corner-left.gif
          ══════════════════════════════════════════════════════════════ */}
      <div className="corner-gif corner-gif-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/corner-left.gif" alt="" />
      </div>
      <div className="corner-gif corner-gif-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/corner-left.gif" alt="" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: HERO / TEMPLE
          Images:
            /public/images/bg-texture.jpg
            /public/images/temple.png
            /public/images/temple side left.png   (desktop only)
            /public/images/temple side right.png  (desktop only)
            /public/images/temple-border.png
            /public/images/ganesha.gif
          ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}>
        {/* Parallax background */}
        <Image
          src="/images/bg-texture.jpg"
          alt="Temple Background"
          fill
          style={{ objectFit: "cover", zIndex: 0, transform: `translateY(${scrollY * 0.3}px)` }}
          priority
        />

        {/* Dark overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `rgba(0,0,0,${0.5 - scrollY * 0.0005})`,
          zIndex: 1,
        }} />

        <FloatingPetals />

        {/* Gold top border */}
        <div style={{
          width: "100%", height: 6,
          background: "linear-gradient(to right, #5a3000, #c9a84c, #f5d07a, #c9a84c, #5a3000)",
          zIndex: 3,
        }} />

        {/* Left temple pillar — desktop only */}
        <div className="temple-side" style={{ position: "absolute", left: "0%", bottom: "150px", zIndex: 2 }}>
          <Image src="/images/temple side left.png" alt="Temple Left" width={420} height={480}
            style={{ width: "300px", height: "auto", objectFit: "contain" }} />
        </div>

        {/* Right temple pillar — desktop only */}
        <div className="temple-side" style={{ position: "absolute", right: "0%", bottom: "150px", zIndex: 2 }}>
          <Image src="/images/temple side right.png" alt="Temple Right" width={420} height={480}
            style={{ width: "300px", height: "auto", objectFit: "contain" }} />
        </div>

        {/* Rotating mandalas */}
        <div style={{ position: "absolute", top: 60, left: -30, animation: "rotateMandala 30s linear infinite", zIndex: 2 }}>
          <Mandala size={160} color="#c9a84c" opacity={0.3} />
        </div>
        <div style={{ position: "absolute", top: 60, right: -30, animation: "rotateMandala 30s linear infinite reverse", zIndex: 2 }}>
          <Mandala size={160} color="#c9a84c" opacity={0.3} />
        </div>

        {/* Ganesha + Title */}
        <div className={`fade-up${heroIn ? " visible" : ""}`} style={{ marginTop: 48, textAlign: "center", zIndex: 3 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ganesha.gif"
            alt="Ganesha"
            style={{
              width: "clamp(80px, 18vw, 120px)", height: "auto",
              display: "block", margin: "0 auto 8px",
              filter: "drop-shadow(0 4px 16px rgba(245,208,122,0.5))",
            }}
          />
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(18px, 4vw, 28px)",
            color: "#f5d07a", letterSpacing: "0.25em",
            textShadow: "0 0 30px rgba(201,168,76,0.8)",
            marginTop: 12, lineHeight: 1.7,
          }}>
            GROOM<br />
            <span style={{ fontSize: "0.65em", color: "#e8d5a3", letterSpacing: "0.4em" }}>WEDS</span><br />
            BRIDE
          </h1>
        </div>

        {/* Main temple */}
        <div className={`scale-in hero-main-temple${heroIn ? " visible" : ""}`} style={{
          position: "relative", zIndex: 3, marginTop: 24, width: "90%", maxWidth: 550,
          marginLeft: "auto", marginRight: "auto",
        }}>
          <Image
            src="/images/temple.png"
            alt="Temple Gopuram"
            width={550} height={650}
            style={{
              width: "min(550px, 80vw)", height: "auto", objectFit: "contain",
              transform: `scale(${1.05 + scrollY * 0.0003})`,
              transition: "transform 0.1s linear",
              filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.7))",
            }}
            priority
          />
        </div>

        {/* Temple bottom border strip */}
        <div style={{
          width: "100%", height: "100px",
          backgroundImage: "url('/images/temple-border.png')",
          backgroundRepeat: "repeat-x", backgroundSize: "auto 100%", backgroundPosition: "bottom",
          marginTop: "-60px", zIndex: 2, position: "relative",
          boxShadow: "0 -10px 40px rgba(201,168,76,0.6)",
        }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: INVITATION CARD
          Images:
            /public/images/temple-below.png
            /public/images/ganesha.gif
            /public/images/elephant overlay.png  ← watermark (centered bg)
            /public/images/queen.png             ← pinned left edge
            /public/images/king.jpg              ← pinned right edge
          ══════════════════════════════════════════════════════════════ */}
      <section ref={inviteRef} style={{
        background: "linear-gradient(180deg, #f5e6c8 0%, #fdf3dc 50%, #f0d9a0 100%)",
        padding: "0 24px 0",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top decorative band */}
        <div style={{
          width: "100%", height: "140px",
          backgroundImage: "url('/images/temple-below.png')",
          backgroundRepeat: "repeat-x", backgroundSize: "auto 140%", backgroundPosition: "top",
          marginTop: "-60px",
          position: "absolute", top: 0, zIndex: 2, pointerEvents: "none",
        }} />

        {/* ── ELEPHANT OVERLAY ──
             Centered watermark. z-index: 1 keeps it ABOVE the bg gradient
             but BELOW all text content which uses z-index: 3.
             Image: /public/images/elephant overlay.png */}
        <div className="elephant-overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/elephant overlay.png" alt="" />
        </div>

        {/* ── QUEEN — left edge ──
             /public/images/queen.png */}
        <div className="queen-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/queen.png" alt="Queen" />
        </div>

        {/* ── KING — right edge ──
             /public/images/king.jpg */}
        <div className="king-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/king.jpg" alt="King" />
        </div>

        {/* Ganesha */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ganesha.gif" alt="Ganesha"
          style={{
            width: "clamp(80px, 18vw, 120px)", height: "auto",
            display: "block", margin: "150px auto 8px",
            filter: "drop-shadow(0 4px 16px rgba(245,208,122,0.5))",
            position: "relative", zIndex: 3,
          }}
        />

        {/* Invite text */}
        <div className={`fade-up${inviteIn ? " visible" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.25s", position: "relative", zIndex: 3 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(15px, 2.5vw, 18px)",
            color: "#5a3800", lineHeight: 1.8, maxWidth: 420, fontStyle: "italic",
          }}>
            With love and joy in our hearts,<br />
            we invite you to celebrate the beautiful<br />
            wedding of
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 3 }}>
          <DiamondDivider color="#c9a84c" />
        </div>

        {/* Names */}
        <div className={`scale-in${inviteIn ? " visible" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.4s", position: "relative", zIndex: 3 }}>
          <h2 style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: "clamp(52px, 10vw, 80px)",
            color: "#3d1c00", lineHeight: 1.1,
            textShadow: "2px 2px 8px rgba(180,100,0,0.2)",
          }}>Vishu</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#c9a84c", margin: "4px 0" }}>&amp;</p>
          <h2 style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: "clamp(52px, 10vw, 80px)",
            color: "#3d1c00", lineHeight: 1.1,
            textShadow: "2px 2px 8px rgba(180,100,0,0.2)",
          }}>Kavya</h2>
        </div>

        <div style={{ position: "relative", zIndex: 3 }}>
          <DiamondDivider color="#c9a84c" />
        </div>

        {/* Date */}
        <div className={`fade-up${inviteIn ? " visible" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.55s", position: "relative", zIndex: 3 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#7a4a10", letterSpacing: 2 }}>on</p>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(20px, 4vw, 30px)",
            color: "#3d1c00", marginTop: 4, letterSpacing: "0.1em",
          }}>26 / 06 / 26</p>
        </div>

        {/* Venue */}
        <div className={`fade-up${inviteIn ? " visible" : ""}`}
          style={{ textAlign: "center", marginTop: 24, animationDelay: "0.65s", position: "relative", zIndex: 3 }}>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(16px, 3.5vw, 26px)",
            color: "#2d1200", letterSpacing: "0.08em",
            borderBottom: "2px solid #c9a84c", paddingBottom: 8,
          }}>venue address</p>
          <a
            href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
            className="route-btn" style={{ marginTop: 18, display: "inline-block" }}
          >
            ✦ See the route ✦
          </a>
        </div>

        {/* Spacer so king/queen figures don't overlap content */}
        <div style={{ height: "clamp(120px, 18vw, 220px)" }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CAR SEPARATOR
          → Sits EXACTLY between Section 2 (warm gold) and Section 3 (forest green)
          → Gradient bg bridges both colors seamlessly
          → Car drives in from left, then gently floats
          Image: /public/images/car.png
          ══════════════════════════════════════════════════════════════ */}
      <div className="car-separator">
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(to right, transparent, #c9a84c, transparent)",
        }} />

        {/* Route road — z-index 3, slides up behind car */}
        <div className={`route-reveal${carIn ? " visible" : ""}`}>
          <div className="route-road" />
        </div>

        <div
          ref={carRef}
          className={`car-image-wrap${carIn ? " car-drive" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/car.png" alt="Wedding Car" />
        </div>

        {/* Bottom accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(to right, transparent, #6aaa82, transparent)",
        }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: MEET THE COUPLE + INFINITE GALLERY
          Photos: /public/images/gallery/photo1.jpg … photo6.jpg
          ══════════════════════════════════════════════════════════════ */}
      <section ref={coupleRef} style={{
        background: "linear-gradient(180deg, #2d5a3d 0%, #1e4530 60%, #163825 100%)",
        padding: "48px 0 56px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Heading */}
        <div className={`fade-up${coupleIn ? " visible" : ""}`}
          style={{ textAlign: "center", animationDelay: "0.1s", padding: "0 24px" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13, letterSpacing: "0.4em",
            textTransform: "uppercase", color: "#a8d5b5", marginBottom: 4,
          }}>Meet The</p>
          <h2 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(20px, 4vw, 32px)",
            color: "#f5d07a", letterSpacing: "0.15em",
            textShadow: "0 0 20px rgba(245,208,122,0.5)",
          }}>BRIDE AND GROOM</h2>
          <DiamondDivider color="#c9a84c" />
        </div>

        {/* Bio */}
        <div className={`fade-up${coupleIn ? " visible" : ""}`}
          style={{ maxWidth: 560, textAlign: "center", animationDelay: "0.25s", padding: "0 24px" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(14px, 2.2vw, 17px)",
            color: "#c8e6d0", lineHeight: 1.85, fontStyle: "italic",
          }}>
            We are both so delighted that you are able to join us in celebrating what we hope
            will be one of the happiest days of our lives. The affection shown to us by so many
            people since our Nichayathartham has been incredibly moving, and has touched us
            both deeply. We would like to take this opportunity to thank everyone most sincerely
            for their kindness. We are looking forward to seeing you at the wedding.
          </p>
        </div>

        {/* ── INFINITE SCROLLING GALLERY ──
             Images scroll right-to-left continuously.
             Hovering on desktop pauses the animation (CSS only, no JS).
             Strip is doubled so the loop is seamless — no visible break.
             Add your photos at: /public/images/gallery/photo1–6.jpg */}
        <div className={`fade-up${coupleIn ? " visible" : ""}`}
          style={{ width: "100%", animationDelay: "0.4s" }}>
          <InfiniteGallery photos={galleryPhotos} />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 12, letterSpacing: "0.3em",
          color: "#6aaa82", marginTop: 16, fontStyle: "italic",
          textTransform: "uppercase",
        }}>Hover to pause · Our Moments</p>
      </section>

      {/* ── SECTION 4: COUNTDOWN ─────────────────────────── */}
      <section ref={countdownRef} style={{
        background: "linear-gradient(180deg, #163825 0%, #0f2d1e 100%)",
        padding: "56px 24px 48px",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", animation: "rotateMandala 20s linear infinite" }}>
          <Mandala size={100} color="#c9a84c" opacity={0.15} />
        </div>

        <div className={`fade-up${countdownIn ? " visible" : ""}`} style={{ textAlign: "center", zIndex: 2, animationDelay: "0.1s" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14, letterSpacing: "0.4em",
            textTransform: "uppercase", color: "#a8d5b5", fontStyle: "italic",
          }}>The countdown begins</p>
          <DiamondDivider color="#c9a84c" />
        </div>

        <div className={`scale-in${countdownIn ? " visible" : ""}`} style={{
          display: "flex", alignItems: "flex-start", gap: "clamp(8px,3vw,28px)",
          marginTop: 16, animationDelay: "0.3s", zIndex: 2,
        }}>
          {[
            { val: countdown.days, label: "Days" },
            { val: countdown.hours, label: "Hours" },
            { val: countdown.minutes, label: "Mins" },
            { val: countdown.seconds, label: "Secs" },
          ].map((item, i) => (
            <>
              <div key={item.label} className="countdown-box">
                <span className="countdown-num" style={{ animationDelay: `${i * 0.1}s` }}>{pad(item.val)}</span>
                <span className="countdown-label">{item.label}</span>
              </div>
              {i < 3 && <span key={`sep-${i}`} className="countdown-sep">:</span>}
            </>
          ))}
        </div>

        <div className={`fade-up${countdownIn ? " visible" : ""}`} style={{ textAlign: "center", marginTop: 28, maxWidth: 520, animationDelay: "0.5s" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "#9dc8aa", lineHeight: 1.8, fontStyle: "italic",
          }}>
            Our families are excited that you are able to join us in celebrating
            what we hope will be one of the happiest days of our lives.
          </p>
        </div>
      </section>

      {/* ── SECTION 5: TAJ / FOOTER ──────────────────────── */}
      <section ref={tajRef} style={{
        background: "linear-gradient(180deg, #0f2d1e 0%, #0a1e14 60%, #060e0a 100%)",
        padding: "0 0 0",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            top: `${(i * 13.7) % 60}%`, left: `${(i * 17.3 + 5) % 95}%`,
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%", background: "#fff",
            opacity: 0.4 + (i % 5) * 0.1,
            animation: `shimmer ${2 + (i % 3)}s ease-in-out ${(i * 0.3) % 2}s infinite`,
          }} />
        ))}

        <div className={`fade-up${tajIn ? " visible" : ""}`} style={{ textAlign: "center", padding: "40px 24px 16px", animationDelay: "0.1s" }}>
          <p style={{
            fontFamily: "'Pinyon Script', cursive",
            fontSize: "clamp(32px, 6vw, 52px)",
            color: "#f5d07a",
            textShadow: "0 0 30px rgba(245,208,122,0.7)",
          }}>Vishu &amp; Kavya</p>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 11, letterSpacing: "0.4em",
            color: "#a8d5b5", marginTop: 4,
          }}>26 · 06 · 2026</p>
        </div>

        <div className={`scale-in${tajIn ? " visible" : ""}`} style={{ width: "100%", maxWidth: 500, animationDelay: "0.3s" }}>
          <Image
            src="/images/taj.png" alt="Taj Mahal" width={500} height={340}
            style={{ width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 -8px 40px rgba(201,168,76,0.3))" }}
          />
        </div>

        <div style={{ width: "100%", height: 6, background: "linear-gradient(to right, #5a3000, #c9a84c, #f5d07a, #c9a84c, #5a3000)" }} />
      </section>
    </main>
  );
}