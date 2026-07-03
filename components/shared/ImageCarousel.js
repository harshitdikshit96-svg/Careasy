"use client";

import { useEffect, useState } from "react";

export default function ImageCarousel({
  images = [],
  alt = "",
  className = "",
  playing = false, // auto-advances only when true (i.e. card is hovered)
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [images]);

  useEffect(() => {
    if (!playing || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, images.length]);

  if (!images.length) {
    return (
      <div className={`flex h-full items-center justify-center bg-slate-200 ${className}`}>
        No Image
      </div>
    );
  }

  const previous = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={alt}
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={previous}
            className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base font-bold shadow backdrop-blur transition hover:scale-105 group-hover:flex"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base font-bold shadow backdrop-blur transition hover:scale-105 group-hover:flex"
          >
            ›
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                current === i ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
