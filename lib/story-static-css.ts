/**
 * The story without the pinned scene: one product picture at the top, then
 * every chapter in normal reading order. Used for visitors who prefer
 * reduced motion (inside a media query) and when JavaScript is off (inside
 * <noscript>). One source, so the two can't drift apart.
 */
export const STORY_STATIC_CSS = `
.story-track{height:auto}
.story-pin{position:relative;height:auto;overflow:visible}
.scene-stage{position:relative;inset:auto;height:min(72svh,640px)}
.scene-anchor{left:50%;top:52%;transform:none}
.chapters{position:relative;inset:auto;height:auto;pointer-events:auto}
.chapters-scrim,.ph-layer{display:none}
.chapter{position:relative;inset:auto;opacity:1;transform:none;padding:3rem 0 3.5rem;justify-content:flex-start}
.chapter + .chapter{border-top:1px solid rgb(21 24 28 / 0.08)}
`;
