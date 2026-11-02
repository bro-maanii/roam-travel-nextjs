"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Motion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const cleanups: (() => void)[] = [];
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-hero]", {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.13,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 92%", once: true },
            clearProps: "all",
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
          const target = Number(element.dataset.count);
          const value = { count: 0 };
          gsap.to(value, {
            count: target,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 95%", once: true },
            onUpdate: () => {
              element.textContent = Math.round(value.count).toLocaleString();
            },
          });
        });
      }, scope);
      return () => ctx.revert();
    });
    media.add(
      "(hover: hover) and (prefers-reduced-motion: no-preference)",
      () => {
        scope.current
          ?.querySelectorAll<HTMLElement>("[data-hover]")
          .forEach((element) => {
            const picture = element.querySelector("img");
            const enter = () => {
              gsap.to(element, { y: -5, duration: 0.3 });
              if (picture)
                gsap.to(picture, {
                  scale: 1.045,
                  duration: 0.6,
                  ease: "power2.out",
                });
            };
            const leave = () => {
              gsap.to(element, { y: 0, duration: 0.3 });
              if (picture) gsap.to(picture, { scale: 1, duration: 0.6 });
            };
            element.addEventListener("mouseenter", enter);
            element.addEventListener("mouseleave", leave);
            cleanups.push(() => {
              element.removeEventListener("mouseenter", enter);
              element.removeEventListener("mouseleave", leave);
              gsap.killTweensOf(element);
              if (picture) gsap.killTweensOf(picture);
            });
          });
        return () => {
          cleanups.forEach((cleanup) => cleanup());
          cleanups.length = 0;
        };
      },
    );
    return () => media.revert();
  }, []);
  return <div ref={scope}>{children}</div>;
}
