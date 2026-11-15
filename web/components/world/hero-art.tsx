import { getImageProps } from "next/image";
import { DepthHero } from "./depth-hero";

/**
 * The painted title-screen art behind the home hero. Phones get the portrait
 * crop, wider screens the landscape key art. The layer sits inside the
 * existing parallax system, so it drifts with the pointer and scroll; with a
 * depth map, a WebGL canvas on top adds 2.5D depth.
 */
export function HeroArt({
  desktop,
  mobile,
  depth,
  depthMobile,
}: {
  desktop: string;
  mobile: string | null;
  depth?: string | null;
  depthMobile?: string | null;
}) {
  const common = { alt: "", sizes: "100vw" };
  const { props: wide } = getImageProps({ ...common, quality: 85, src: desktop, width: 2400, height: 1500 });
  // Phones get q75: on a 400px-wide screen the difference is invisible and it
  // trims ~30 KB off the LCP image.
  const tall = mobile
    ? getImageProps({ ...common, quality: 75, src: mobile, width: 1080, height: 1080 }).props
    : null;
  return (
    <div className="sunset-scene hero-art" aria-hidden="true">
      <div className="scene-layer layer-art">
        <picture>
          {tall && <source media="(max-width: 700px)" srcSet={tall.srcSet} sizes={tall.sizes} />}
          <img {...wide} alt="" loading="eager" fetchPriority="high" decoding="async" />
        </picture>
        {depth && <DepthHero depth={depth} depthMobile={depthMobile ?? null} />}
      </div>
    </div>
  );
}
