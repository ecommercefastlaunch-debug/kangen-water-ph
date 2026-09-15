import { ProductImageFallback } from "./ProductImageFallback";

/**
 * The one K8. Two layers share the same anchor and receive the same
 * transform from the scroll controller:
 *
 *   the light — a soft white pool, so the machine is always lit white and
 *               never takes on the stage colour around it;
 *   the product — blended with `multiply`, so the photograph's white ground
 *               disappears into the pool and no rectangle ever shows.
 *
 * Nothing else on the page renders the machine.
 */
export function PersistentProductStage() {
  return (
    <div className="scene-stage">
      <div data-scene-light className="scene-anchor" aria-hidden="true">
        <div className="scene-light" />
      </div>
      <div data-scene-product className="scene-anchor scene-product">
        <ProductImageFallback />
      </div>
    </div>
  );
}
