import { useEffect, useRef } from "react";

type Props = { onFinish: () => void };

export default function HeartAnimation({ onFinish }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };
    resize();
    window.addEventListener("resize", resize);

    // draw text to bitmap to get target pixels
    const text = "Mercy ❤ Rahl";
    const fontSize = Math.min(canvas.width, canvas.height) / 8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, Segoe UI, Arial`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // build particle targets (sample every N pixels)
    const step = Math.max(8 * dpr, 6); // spacing between hearts
    type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number };
    const particles: P[] = [];
    for (let y = 0; y < img.height; y += step) {
      for (let x = 0; x < img.width; x += step) {
        const a = img.data[(y * img.width + x) * 4 + 3];
        if (a > 140) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    }

    let t = 0;
    let formed = false;
    let raf = 0;

    const drawHeart = (x: number, y: number, size = 14 * dpr) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.font = `${size}px Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif`;
      ctx.fillText("❤️", 0, 0);
      ctx.restore();
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // soft floating background hearts
      for (let i = 0; i < 25; i++) {
        const bx = ((t * 0.2 + i * 90) % canvas.width);
        const by = ((t * 0.15 + i * 120) % canvas.height);
        ctx.globalAlpha = 0.15;
        drawHeart(bx, by, 10 * dpr);
        ctx.globalAlpha = 1;
      }

      // move particles toward targets
      let allClose = true;
      for (const p of particles) {
        const ax = (p.tx - p.x) * 0.07;
        const ay = (p.ty - p.y) * 0.07;
        p.vx = p.vx * 0.85 + ax;
        p.vy = p.vy * 0.85 + ay;
        p.x += p.vx;
        p.y += p.vy;
        if (Math.hypot(p.tx - p.x, p.ty - p.y) > 1.8) allClose = false;
        drawHeart(p.x, p.y, 12 * dpr);
      }

      // gentle glow once formed, then explode + finish
      if (allClose && !formed) {
        formed = true;

        // glow for a moment
        let glowFrames = 0;
        const glow = () => {
          glowFrames++;
          ctx.save();
          ctx.globalAlpha = 0.08;
          ctx.filter = "blur(6px)";
          for (const p of particles) drawHeart(p.x, p.y, 14 * dpr);
          ctx.restore();

          if (glowFrames < 45) requestAnimationFrame(glow);
          else {
            // cute outward burst
            for (const p of particles) {
              p.vx = (Math.random() - 0.5) * 20 * dpr;
              p.vy = (Math.random() - 0.5) * 20 * dpr;
            }
            let burstFrames = 0;
            const burst = () => {
              burstFrames++;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                drawHeart(p.x, p.y, 12 * dpr);
              }
              if (burstFrames < 45) requestAnimationFrame(burst);
              else {
                cancelAnimationFrame(raf);
                window.removeEventListener("resize", resize);
                onFinish();
              }
            };
            burst();
          }
        };
        glow();
      }

      t += 1.0 * dpr;
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [onFinish]);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black" />;
}
