import React, { useState, useEffect, useRef } from "react";

function AnimatedNumber({
  value,
  duration = 2000,
  formatNumber = true,
  suffix = "",
  prefix = "",
  decimals = 0,
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const wasInViewRef = useRef(false);

  const formatNumberWithCommas = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return Math.floor(num).toLocaleString("en-US");
  };

  const getDisplayValue = () => {
    const displayCount = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
    const formatted = formatNumber ? formatNumberWithCommas(count) : displayCount;
    return `${prefix}${formatted}${suffix}`;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const stopAnimation = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isAnimatingRef.current = false;
    };

    const animateNumber = (startValue, endValue) => {
      stopAnimation();
      isAnimatingRef.current = true;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = startValue + (endValue - startValue) * easeOut;
        setCount(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(endValue); 
          isAnimatingRef.current = false;
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!wasInViewRef.current) {
              wasInViewRef.current = true;
              const endValue = typeof value === "string" ? parseFloat(value) || 0 : value;
              setCount(0);
              requestAnimationFrame(() => {
                animateNumber(0, endValue);
              });
            }
          } else {
            if (wasInViewRef.current) {
              wasInViewRef.current = false;
              stopAnimation();
              setCount(0);
            }
          }
        });
      },
      {
        threshold: 0.3, 
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      stopAnimation();
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className="inline-block">
      {getDisplayValue()}
    </span>
  );
}

export default AnimatedNumber;

