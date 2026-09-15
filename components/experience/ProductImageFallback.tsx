import Image from "next/image";
import angle from "@/public/images/k8-angle-alpha.png";
import front from "@/public/images/k8-stage-alpha.png";

const SIZES = "(min-width: 1024px) 900px, 640px";

/**
 * The K8's two photographs, stacked in the one product box: the approved
 * front view, and an angled view above it that the scroll story crossfades
 * to. Both are on transparent grounds and framed so the machine has the
 * same height, ground line and centre in each (scripts/product-images).
 *
 * The front view is shown at once and is the fallback whenever the WebGL
 * scene isn't running; the angled one is decorative (one machine, one
 * description) and loads right after it, before its first use. They are
 * photographs, not a 3D model: the stage only moves, scales and crossfades
 * them.
 *
 * Served at up to full size so the display close-up stays sharp.
 */
export function ProductImageFallback() {
  return (
    <>
      <Image
        data-view="front"
        src={front}
        alt="The Enagic LeveLuk K8: a white countertop water ionizer with a tall touch display on its front and a flexible outlet pipe on top."
        priority
        sizes={SIZES}
        className="scene-view"
      />
      <Image
        data-view="angle"
        src={angle}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="low"
        sizes={SIZES}
        className="scene-view"
      />
    </>
  );
}
