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

function Lotus({ size = 52 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 90 68">
      {[[-30, 2], [30, 2], [-16, -10], [16, -10], [0, -18]].map(([dx, dy], i) => (
        <ellipse key={i}
          cx={45 + dx} cy={46 + dy} rx="11" ry="18"
          fill={["#e8607a", "#e8607a", "#f4a0b0", "#f4a0b0", "#fff8f8"][i]}
          stroke="#c03060" strokeWidth="0.9"
          transform={`rotate(${[-28, 28, -14, 14, 0][i]} ${45 + dx} ${46 + dy})`}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}

function GaneshIcon({ size = 56 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 56 62">
      <ellipse cx="28" cy="38" rx="16" ry="20" fill="#f5a623" />
      <circle cx="28" cy="16" r="12" fill="#f5a623" />
      <ellipse cx="13" cy="21" rx="5.5" ry="11" fill="#f5a623" transform="rotate(-22 13 21)" />
      <ellipse cx="43" cy="21" rx="5.5" ry="11" fill="#f5a623" transform="rotate(22 43 21)" />
      <circle cx="22" cy="15" r="2.5" fill="#4a2800" />
      <circle cx="34" cy="15" r="2.5" fill="#4a2800" />
      <path d="M25 23 Q28 30 35 25" fill="none" stroke="#4a2800" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="28" cy="10" r="4" fill="#e8607a" />
      <circle cx="28" cy="10" r="2" fill="#fff" opacity="0.6" />
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

// ── Main Component ───────────────────────────────────────────────
export default function WeddingInvite() {
  const countdown = useCountdown(WEDDING_DATE);
  const [heroRef, heroIn] = useInView(0.1);
  const [inviteRef, inviteIn] = useInView(0.1);
  const [carRef, carIn] = useInView(0.1);
  const [coupleRef, coupleIn] = useInView(0.1);
  const [countdownRef, countdownIn] = useInView(0.1);
  const [tajRef, tajIn] = useInView(0.05);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#0d1a2a", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Cinzel+Decorative:wght@400;700&family=Pinyon+Script&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

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
        @keyframes carDrive {
          from { transform: translateX(-80px); opacity: 0; }
          to   { transform: translateX(0px);  opacity: 1; }
        }
        @keyframes rotateMandala {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }

        /* CHANGED: corner gif pulse animation (replaces old wheel rotate) */
        @keyframes cornerPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.92; }
          50%       { transform: scale(1.08) rotate(6deg); opacity: 1; }
        }
        @keyframes cornerPulseR {
          0%, 100% { transform: scaleX(-1) scale(1) rotate(0deg); opacity: 0.92; }
          50%       { transform: scaleX(-1) scale(1.08) rotate(-6deg); opacity: 1; }
        }

        /* NEW: CSS 3D wheel carousel for Section 3 */
        @keyframes carouselSpin {
          from { transform: perspective(900px) rotateY(0deg); }
          to   { transform: perspective(900px) rotateY(360deg); }
        }

        .fade-up  { opacity: 0; }
        .fade-up.visible  { animation: fadeUp 0.9s ease forwards; }
        .fade-in  { opacity: 0; }
        .fade-in.visible  { animation: fadeIn 1s ease forwards; }
        .scale-in { opacity: 0; }
        .scale-in.visible { animation: scaleIn 0.8s ease forwards; }

        .couple-photo {
          border-radius: 12px;
          overflow: hidden;
          border: 3px solid #c9a84c;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .couple-photo:hover {
          transform: translateY(-8px) scale(1.04);
          box-shadow: 0 12px 36px rgba(201,168,76,0.45);
        }

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
        html { scroll-behavior: smooth; }

        /* ══════════════════════════════════════════════════════
           CHANGED: Section 1 — corner-left.gif replaces wheel
           Left corner: cornerPulse; right: cornerPulseR (mirrored)
           ══════════════════════════════════════════════════════ */
        .corner-gif {
          position: absolute;
          top: 12px;
          width: 100px;
          height: 100px;
          z-index: 10;
          pointer-events: none;
        }
        .corner-gif img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .corner-gif-left {
          left: 8px;
          animation: cornerPulse 3.5s ease-in-out infinite;
        }
        /* CHANGED: right corner is scaleX(-1) mirrored */
        .corner-gif-right {
          right: 8px;
          animation: cornerPulseR 3.5s ease-in-out 0.6s infinite;
        }

        /* CHANGED: temple sides hidden on mobile */
        @media (max-width: 768px) {
          .temple-side { display: none !important; }
          .hero-main-temple {
            width: 96% !important;
            max-width: 100% !important;
          }
        }

        /* ══════════════════════════════════════════════════════
           NEW: Section 2 — elephant-overlay, queen, king images
           ══════════════════════════════════════════════════════ */
        .invite-figures-row {
          position: relative;
          width: 100%;
          max-width: 560px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-top: 28px;
          gap: 0;
        }
        /* Queen — left side */
        .figure-queen {
          position: relative;
          z-index: 3;
          flex: 0 0 auto;
          width: clamp(90px, 18vw, 140px);
          margin-right: -20px;
          margin-bottom: 0;
          filter: drop-shadow(4px 0 12px rgba(90,40,0,0.25));
          transition: transform 0.3s ease;
        }
        .figure-queen:hover { transform: scale(1.04) translateY(-4px); }
        /* King — right side */
        .figure-king {
          position: relative;
          z-index: 3;
          flex: 0 0 auto;
          width: clamp(90px, 18vw, 140px);
          margin-left: -20px;
          margin-bottom: 0;
          filter: drop-shadow(-4px 0 12px rgba(90,40,0,0.25));
          transition: transform 0.3s ease;
        }
        .figure-king:hover { transform: scale(1.04) translateY(-4px); }
        /* Elephant — centered, overlaid between king & queen */
        .figure-elephant {
          position: relative;
          z-index: 2;
          flex: 0 0 auto;
          width: clamp(160px, 36vw, 260px);
          opacity: 0.78;
          filter: drop-shadow(0 8px 20px rgba(90,40,0,0.22));
          transition: opacity 0.4s ease;
        }
        .figure-elephant:hover { opacity: 0.95; }
        .figure-queen img,
        .figure-king img,
        .figure-elephant img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* ══════════════════════════════════════════════════════
           NEW: Section 3 — CSS 3D rotating wheel carousel
           ══════════════════════════════════════════════════════ */
        .carousel-scene {
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          /* tall enough to show 3D depth */
          height: 320px;
          margin-top: 36px;
          perspective: 900px;
        }
        .carousel-ring {
          position: relative;
          width: 220px;
          height: 220px;
          transform-style: preserve-3d;
          animation: carouselSpin 18s linear infinite;
        }
        /* Pause on hover anywhere inside the section */
        .carousel-scene:hover .carousel-ring {
          animation-play-state: paused;
        }
        /* Each card is positioned around a circle via --i CSS var set inline */
        .carousel-card {
          position: absolute;
          top: 0; left: 0;
          width: 220px;
          height: 220px;
          border-radius: 14px;
          overflow: hidden;
          border: 3px solid #c9a84c;
          box-shadow: 0 6px 24px rgba(0,0,0,0.5);
          /* rotateY places each card; translateZ pushes it out to the ring radius */
          backface-visibility: hidden;
        }
        .carousel-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 768px) {
          .carousel-scene { height: 220px; perspective: 600px; }
          .carousel-ring  { width: 160px; height: 160px; }
          .carousel-card  { width: 160px; height: 160px; }
        }
      `}</style>

      {/* ── SECTION 1: HERO / TEMPLE ─────────────────────── */}
      <section ref={heroRef} style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <div className="corner-gif corner-gif-left">
  <img src="/images/corner-left.gif" alt="" />
</div>

<div className="corner-gif corner-gif-right">
  <img src="/images/corner-left.gif" alt="" />
</div>

        {/* Background Image */}
        <Image
          src="/images/bg-texture.jpg"
          alt="Temple Background"
          fill
          style={{ objectFit: "cover", zIndex: 0, transform: `translateY(${scrollY * 0.3}px)` }}
          priority
        />

        {/* Dark Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `rgba(0,0,0,${0.5 - scrollY * 0.0005})`,
          zIndex: 1
        }} />

        <FloatingPetals />

        {/* Gold border top */}
        <div style={{
          width: "100%", height: 6,
          background: "linear-gradient(to right, #5a3000, #c9a84c, #f5d07a, #c9a84c, #5a3000)",
          zIndex: 3
        }} />


        {/* LEFT TEMPLE — hidden on mobile via .temple-side */}
        <div className="temple-side" style={{
          position: "absolute", left: "0%", bottom: "150px", zIndex: 2,
        }}>
          <Image src="/images/temple side left.png" alt="Temple Left"
            width={420} height={480}
            style={{ width: "300px", height: "auto", objectFit: "contain" }}
          />
        </div>

        {/* RIGHT TEMPLE — hidden on mobile via .temple-side */}
        <div className="temple-side" style={{
          position: "absolute", right: "0%", bottom: "150px", zIndex: 2,
        }}>
          <Image src="/images/temple side right.png" alt="Temple Right"
            width={420} height={480}
            style={{ width: "300px", height: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Mandala decorations — unchanged */}
        <div style={{ position: "absolute", top: 60, left: -30, animation: "rotateMandala 30s linear infinite", zIndex: 2 }}>
          <Mandala size={160} color="#c9a84c" opacity={0.3} />
        </div>
        <div style={{ position: "absolute", top: 60, right: -30, animation: "rotateMandala 30s linear infinite reverse", zIndex: 2 }}>
          <Mandala size={160} color="#c9a84c" opacity={0.3} />
        </div>

        {/* Title */}
        <div className={`fade-up${heroIn ? " visible" : ""}`} style={{ marginTop: 48, textAlign: "center", zIndex: 3 }}>
          {/* CHANGED: replaced SVG GaneshIcon with ganesha.gif as central element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ganesha.gif"
            alt="Ganesha"
            style={{
              width: "clamp(80px, 18vw, 120px)",
              height: "auto",
              display: "block",
              margin: "0 auto 8px",
              filter: "drop-shadow(0 4px 16px rgba(245,208,122,0.5))",
            }}
          />
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(18px, 4vw, 28px)",
            color: "#f5d07a",
            letterSpacing: "0.25em",
            textShadow: "0 0 30px rgba(201,168,76,0.8)",
            marginTop: 12,
            lineHeight: 1.7,
          }}>
            GROOM<br />
            <span style={{ fontSize: "0.65em", color: "#e8d5a3", letterSpacing: "0.4em" }}>WEDS</span><br />
            BRIDE
          </h1>
        </div>

        {/* MAIN TEMPLE */}
<div className={`scale-in hero-main-temple${heroIn ? " visible" : ""}`} style={{
  position: "relative",
  zIndex: 3,
  marginTop: 24,
  width: "90%",
  maxWidth: 550
}}>
  <Image
    src="/images/temple.png"
    alt="Temple Gopuram"
    width={550}
    height={650}
    style={{
      width: "min(550px, 80vw)",
      height: "auto",
      objectFit: "contain",
      transform: `scale(${1.05 + scrollY * 0.0003})`,
      transition: "transform 0.1s linear",
      filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.7))"
    }}
    priority
  />
</div>

{/* ✅ BORDER BELOW TEMPLE */}
<div style={{
  width: "100%",
  height: "100px",
  backgroundImage: "url('/images/temple-border.png')",
  backgroundRepeat: "repeat-x",
  backgroundSize: "auto 100%",
  backgroundPosition: "bottom",
  marginTop: "-60px", // 🔥 tight to temple
  zIndex: 2,
  position: "relative",
  boxShadow: "0 -10px 40px rgba(201,168,76,0.6)"
}} />
        

      </section> 

      {/* ── SECTION 2: INVITATION CARD ───────────────────── */}
      <section ref={inviteRef} style={{
        background: "linear-gradient(180deg, #f5e6c8 0%, #fdf3dc 50%, #f0d9a0 100%)",
        padding: "0 24px 0",
        display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
  width: "100%",
  height: "140px",
  backgroundImage: "url('/images/temple-below.png')",
  backgroundRepeat: "repeat-x",
  backgroundSize: "auto 140%",
  backgroundPosition: "top",
  marginTop: "-60px", // 🔥 overlap nicely
  position: "absolute",
  zIndex: 2
}} />

         <img
            src="/images/ganesha.gif"
            alt="Ganesha"
            style={{
              width: "clamp(80px, 18vw, 120px)",
              height: "auto",
              display: "block",
              margin: "60px auto 8px",
              filter: "drop-shadow(0 4px 16px rgba(245,208,122,0.5))",
            }}
          />

        <div className={`fade-up${inviteIn ? " visible" : ""}`} style={{ textAlign: "center", animationDelay: "0.25s" }}>
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

        <DiamondDivider color="#c9a84c" />

        {/* Names */}
        <div className={`scale-in${inviteIn ? " visible" : ""}`} style={{ textAlign: "center", animationDelay: "0.4s" }}>
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

        <DiamondDivider color="#c9a84c" />

        {/* Date */}
        <div className={`fade-up${inviteIn ? " visible" : ""}`} style={{ textAlign: "center", animationDelay: "0.55s" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#7a4a10", letterSpacing: 2 }}>on</p>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(20px, 4vw, 30px)",
            color: "#3d1c00", marginTop: 4, letterSpacing: "0.1em",
          }}>26 / 06 / 26</p>
        </div>

        {/* Venue */}
        <div className={`fade-up${inviteIn ? " visible" : ""}`} style={{ textAlign: "center", marginTop: 24, animationDelay: "0.65s" }}>
          <p style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(16px, 3.5vw, 26px)",
            color: "#2d1200", letterSpacing: "0.08em",
            borderBottom: "2px solid #c9a84c", paddingBottom: 8,
          }}>venue address</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="route-btn"
            style={{ marginTop: 18, display: "inline-block" }}
          >
            ✦ See the route ✦
          </a>
        </div>

        {/* NEW: queen / elephant-overlay / king row — below wedding text block */}
        <div className={`invite-figures-row fade-in${inviteIn ? " visible" : ""}`}
          style={{ animationDelay: "0.75s" }}>

          {/* Queen — left */}
          <div className="figure-queen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/queen.png" alt="Queen" />
          </div>

          {/* Elephant — center overlay */}
          <div className="figure-elephant">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/elephant overlay.png" alt="Elephant" />
          </div>

          {/* King — right */}
          <div className="figure-king">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/king.jpg" alt="King" />
          </div>
        </div>

        {/* Vintage Car */}
        <div ref={carRef} style={{
          marginTop: 32, width: "80%", maxWidth: 340,
          animation: carIn ? "carDrive 1s ease forwards" : "none",
          opacity: carIn ? 1 : 0,
        }}>
          <Image
            src="/car.png"
            alt="Wedding Car"
            width={340} height={200}
            style={{ width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.25))" }}
          />
        </div>

        {/* Wave into green section */}
        <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, marginTop: 16 }}>
          <svg viewBox="0 0 500 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 60 }}>
            <path d="M0,0 C125,60 375,60 500,0 L500,60 L0,60 Z" fill="#2d5a3d" />
          </svg>
        </div>
      </section>

      {/* ── SECTION 3: MEET THE COUPLE ───────────────────── */}
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

        {/* Bio text */}
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

        {/* NEW: CSS 3D rotating wheel carousel — 6 photos arranged in a circle */}
        {/* Hover anywhere on carousel-scene pauses rotation (pure CSS) */}
        <div className={`carousel-scene fade-up${coupleIn ? " visible" : ""}`}
          style={{ animationDelay: "0.4s" }}>

          {(() => {
            // 6 cards evenly spaced around 360° circle
            // radius: desktop ~380px, mobile ~220px
            // Each card rotateY(angle) translateZ(radius)
            const photos = [
              { src: "/couple1.jpg", filter: "" },
              { src: "/couple2.jpg", filter: "" },
              { src: "/couple1.jpg", filter: "sepia(0.35)" },
              { src: "/couple2.jpg", filter: "hue-rotate(12deg)" },
              { src: "/couple1.jpg", filter: "brightness(1.1) contrast(1.05)" },
              { src: "/couple2.jpg", filter: "saturate(1.2)" },
            ];
            const count = photos.length;
            // translateZ radius = (cardWidth/2) / tan(π/n)
            // cardWidth desktop=220, n=6 → radius ≈ 220/(2*tan(30°)) ≈ 190px
            // We'll set it via inline style on the ring
            const radiusDesktop = 200;
            return (
              <div
                className="carousel-ring"
                style={{
                  // The ring itself doesn't have a fixed size — cards are positioned via 3D
                  width: "220px", height: "220px",
                }}
              >
                {photos.map((p, i) => {
                  const angle = (360 / count) * i;
                  return (
                    <div
                      key={i}
                      className="carousel-card"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${radiusDesktop}px)`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.src}
                        alt={`Photo ${i + 1}`}
                        style={{ filter: p.filter || undefined }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* NEW: hint label */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 12, letterSpacing: "0.3em",
          color: "#6aaa82", marginTop: 16, fontStyle: "italic",
          textTransform: "uppercase",
        }}>Hover to pause · Moments</p>

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
            top: `${(i * 13.7) % 60}%`,
            left: `${(i * 17.3 + 5) % 95}%`,
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
            src="/taj.png" alt="Taj Mahal" width={500} height={340}
            style={{ width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 -8px 40px rgba(201,168,76,0.3))" }}
          />
        </div>

        <div style={{ width: "100%", height: 6, background: "linear-gradient(to right, #5a3000, #c9a84c, #f5d07a, #c9a84c, #5a3000)" }} />
      </section>
    </main>
  );
}