import type { CSSProperties } from "react";
import { totalUnits } from "@/lib/experience-chapters";
import { STORY_STATIC_CSS } from "@/lib/story-static-css";
import { ExperienceBackground } from "./ExperienceBackground";
import { PersistentProductStage } from "./PersistentProductStage";
import { StoryContent } from "./StoryContent";
import { StoryController } from "./StoryController";

/**
 * The main product story: one pinned stage holding one K8, with the
 * chapters' copy changing around it as the page scrolls.
 *
 *   story-track   tall scroll track; its height is the story's length
 *   story-pin     the one pinned element (CSS sticky — the only pinning)
 *     scene-bg    stage colour
 *     scene-stage the persistent product (light + photograph)
 *     chapters    the copy, cross-faded
 *
 * When the track ends the pin is released and the stage scrolls away with
 * it, handing over to the booking section. Reduced motion and no-JS get the
 * same content as a normal, static page.
 */
export function K8Experience() {
  return (
    <section
      id="top"
      data-story
      aria-label="The LeveLuk K8"
      className="story"
      style={{ "--units": totalUnits(true), "--units-compact": totalUnits(false) } as CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `@media (prefers-reduced-motion: reduce){${STORY_STATIC_CSS}}` }} />
      <noscript dangerouslySetInnerHTML={{ __html: `<style>${STORY_STATIC_CSS}</style>` }} />
      <div className="story-track">
        <div className="story-pin" data-story-pin>
          <ExperienceBackground />
          <PersistentProductStage />
          <StoryContent />
          <span data-vh-probe className="vh-probe" aria-hidden="true" />
        </div>
      </div>
      <StoryController />
    </section>
  );
}
