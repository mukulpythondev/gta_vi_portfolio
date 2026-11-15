import { getImageProps } from "next/image";

/**
 * The painted title-screen art behind the home hero. Phones get the portrait
 * crop, wider screens the landscape key art. The layer sits inside the
 * existing parallax system, so it drifts with the pointer and scroll.
 */
export function HeroArt({ desktop, mobile }: { desktop: string; mobile: string | null }) {
  const common = { alt: "", sizes: "100vw" };
  const { props: wide } = getImageProps({ ...common, quality: 85, src: desktop, width: 2400, height: 1500 });
  // Phones get q75: on a 400px-wide screen the difference is invisible and it
  // trims ~30 KB off the LCP image.
  const tall = mobile
    ? getImageProps({ ...common, quality: 75, src: mobile, width: 1080, height: 1080 }).props
    : null;
  return (
    <div className="sunset-scene hero-art" aria-hidden="true">
      <picture className="scene-layer layer-art">
        {tall && <source media="(max-width: 700px)" srcSet={tall.srcSet} sizes={tall.sizes} />}
        <img {...wide} alt="" loading="eager" fetchPriority="high" decoding="async" />
      </picture>
    </div>
  );
}
