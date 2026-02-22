"use client";

import React, { useRef, useEffect, useState, createElement, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register ONLY real GSAP plugins (NOT useGSAP)
gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: keyof React.JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

// Extend HTMLElement to hold our custom split instance
interface SplitHTMLElement extends HTMLElement {
  _splitInstance?: GSAPSplitText | null;
}

const SplitText = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<SplitHTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Update callback
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  // Wait for fonts
  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;

      // Cleanup previous split instance
      if (el._splitInstance) {
        try {
          el._splitInstance.revert();
        } catch (_) {}
        el._splitInstance = null;
      }

      const startPct = (1 - threshold) * 100;

      // Process margin
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";

      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;

      const start = `top ${startPct}%${sign}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let targets: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const assignTargets = (self: any) => {
        if (splitType.includes("chars") && self.chars.length)
          targets = self.chars;
        if (!targets && splitType.includes("words") && self.words.length)
          targets = self.words;
        if (!targets && splitType.includes("lines") && self.lines.length)
          targets = self.lines;

        if (!targets) targets = self.chars || self.words || self.lines;
      };

      const split = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          assignTargets(self);

          const tween = gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
            },
          );

          return tween;
        },
      });

      el._splitInstance = split;

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        try {
          split.revert();
        } catch (_) {}
        el._splitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
      ],
      scope: ref,
    },
  );

  return createElement(
    tag as string,
    {
      ref,
      className: `split-parent ${className}`,
      style: {
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      } as CSSProperties,
    },
    text,
  );
};

export default SplitText;
