import React, { useMemo } from 'react'
import { HERO_SECTION_IMAGES, HERO_SECTION_DURATION } from '../../lib/constant';

function HeroSection({ duration = HERO_SECTION_DURATION }) {
  const images = useMemo(() => HERO_SECTION_IMAGES, []);

  const style = {
    ['--hero-scroll-duration']: `${duration}s`,
  };

  return (
    <section className="hero-section mt-10" style={style}>
      <div className="hero-viewport">
        <div className="hero-track" aria-hidden="false">
          {images.concat(images).map((src, idx) => (
            <div className="hero-slide" key={`${src}-${idx}`}>
              <img src={src} alt={`hero-${idx}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
