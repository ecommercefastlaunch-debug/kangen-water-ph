import { ProductImageFallback } from "./ProductImageFallback";
import { SceneMount } from "./SceneMount";

/**
 * The one K8. Layers, back to front, all sharing the same anchor box:
 *
 *   frame   — an invisible, never-transformed copy of the box, which the
 *             WebGL scene measures so it frames the machine identically;
 *   light   — a soft white pool, so the machine never takes on the stage
 *             colour around it;
 *   product — the page image of the machine: shown immediately, and the
 *             fallback whenever the 3D scene isn't running;
 *   canvas  — the WebGL scene (machine + water). Once it has drawn, the
 *             page image is hidden, so only one machine is ever visible.
 *
 * The scroll controller gives the light and the page image the same
 * transform, and publishes the same pose to the scene.
 */
export function PersistentProductStage() {
  return (
    <div className="scene-stage">
      <div data-scene-frame className="scene-anchor scene-frame" aria-hidden="true" />
      <div data-scene-light className="scene-anchor" aria-hidden="true">
        <div className="scene-light" />
      </div>
      <div data-scene-product className="scene-anchor scene-product">
        <ProductImageFallback />
      </div>
      <SceneMount />
    </div>
  );
}
