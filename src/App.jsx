import { useEffect, useRef, useState } from "react";
import "./style.css";

export default function App() {
  const noBtnRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const pos = useRef({
    x: window.innerWidth * 0.6,
    y: window.innerHeight * 0.6,
  });

  const canvasRef = useRef(null);
  const [accepted, setAccepted] = useState(false);

  /* ================= FLOATING HEARTS + SNOW ================= */
  useEffect(() => {
    if (accepted) return;

    const createFloatingElement = () => {
      const el = document.createElement("div");
      const isHeart = Math.random() > 0.5;

      el.className = isHeart ? "floating heart" : "floating snow";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = 12 + Math.random() * 6 + "s";
      el.style.opacity = Math.random() * 0.6 + 0.3;
      el.style.transform = `scale(${Math.random() * 0.6 + 0.4})`;

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 20000);
    };

    const interval = setInterval(createFloatingElement, 550);
    return () => clearInterval(interval);
  }, [accepted]);

  /* ================= NO BUTTON PHYSICS ================= */
  useEffect(() => {
    if (accepted) return;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const btn = noBtnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();

      const cx = pos.current.x + rect.width / 2;
      const cy = pos.current.y + rect.height / 2;

      const dx = cx - mouse.current.x;
      const dy = cy - mouse.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 170) {
        let fx = (dx / (distance || 1)) * 7;
        let fy = (dy / (distance || 1)) * 7;

        if (distance < 40) {
          fx += (Math.random() - 0.5) * 8;
          fy += (Math.random() - 0.5) * 8;
        }

        pos.current.x += fx;
        pos.current.y += fy;
      }

      const padding = 16;
      pos.current.x = Math.max(
        padding,
        Math.min(pos.current.x, window.innerWidth - rect.width - padding)
      );
      pos.current.y = Math.max(
        padding,
        Math.min(pos.current.y, window.innerHeight - rect.height - padding)
      );

      btn.style.left = `${pos.current.x}px`;
      btn.style.top = `${pos.current.y}px`;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [accepted]);

  /* ================= CONFETTI ================= */
  useEffect(() => {
    if (!accepted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = Array.from({ length: 250 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 0.5 + 0.5,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
    }));

    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.y += p.d * 4;
        if (p.y > canvas.height) {
          p.y = -10;
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrame);
  }, [accepted]);

  return (
    <div className="page">
      {accepted && <canvas ref={canvasRef} className="confetti-canvas" />}

      <div className="card">
        {!accepted ? (
          <>
            <h1>
              Divya,
              <br />
              will you be my Valentine?
            </h1>

            <button className="yes-btn" onClick={() => setAccepted(true)}>
              Yes 💜
            </button>
          </>
        ) : (
          <>
            <h1>Yay! See you on 14th Feb, my love 💜</h1>
            <img
              src="src/assets/bubu-dudu.gif"
              alt="Cute sticker"
              className="sticker"
            />
          </>
        )}
      </div>

      {!accepted && (
        <button ref={noBtnRef} className="no-btn">
          No 😏
        </button>
      )}
    </div>
  );
}
