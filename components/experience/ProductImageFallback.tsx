import Image from "next/image";
import k8 from "@/public/images/k8-stage-alpha.png";

/**
 * The approved K8 product photograph, on a transparent ground. Shown at
 * once, and kept as the fallback whenever the WebGL scene isn't running
 * (reduced motion, no WebGL, loading, or an error). It is a photograph,
 * not a 3D model: the stage only moves and scales it.
 *
 * Served at up to its full 1254px so the display close-up stays sharp.
 */
export function ProductImageFallback() {
  return (
    <Image
      src={k8}
      alt="The Enagic LeveLuk K8: a white countertop water ionizer with a tall touch display on its front and a flexible outlet pipe on top."
      priority
      sizes="(min-width: 1024px) 900px, 640px"
      className="h-full w-full object-contain"
    />
  );
}
