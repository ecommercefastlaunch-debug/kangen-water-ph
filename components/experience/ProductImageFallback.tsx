import Image from "next/image";
import k8 from "@/public/images/k8-stage.png";

/**
 * The current product renderer: one photograph of the K8 on a white ground.
 * It is an image, not a 3D model — the stage only moves and scales it, and
 * never rotates it. Swap in a 3D renderer here when an accurate model exists
 * (docs/3d-model-upgrade.md).
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
