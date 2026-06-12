import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { InstagramPostComposition } from "./InstagramPostComposition";
import { ThumbnailComposition } from "./ThumbnailComposition";
import { ShortsComposition } from "./ShortsComposition";
import { TeaserReelComposition } from "./TeaserReelComposition";
import config from "../config.json";
import configReels from "../config-reels.json";

export const RemotionRoot: React.FC = () => {
  const fps = config.video.fps || 30;
  
  // Calculate dynamic duration for MainVideo using absolute timeline bounds
  const totalDurationInFrames = Math.round(
    config.endPage.show
      ? ((config.endPage.startTime || 186.0) + (config.endPage.durationInSeconds || 8.832)) * fps
      : 150
  );

  const reelsFps = configReels.video?.fps || 30;
  const reelsDurationInFrames = Math.round(
    configReels.endPage?.show
      ? ((configReels.endPage.startTime || 116.356) + (configReels.endPage.durationInSeconds || 15.644)) * reelsFps
      : 132 * reelsFps
  );

  return (
    <>
      {/* 1. Dynamic Customizable Presentation Video */}
      <Composition
        id="MainVideo"
        component={Video as any}
        durationInFrames={totalDurationInFrames > 0 ? totalDurationInFrames : 150}
        fps={fps}
        width={config.video.width || 1920}
        height={config.video.height || 1080}
        defaultProps={config}
      />

      {/* 1b. Portrait Reels Video (1080x1920) */}
      <Composition
        id="Reels"
        component={Video as any}
        durationInFrames={reelsDurationInFrames > 0 ? reelsDurationInFrames : 150}
        fps={reelsFps}
        width={configReels.video.width || 1080}
        height={configReels.video.height || 1920}
        defaultProps={configReels as any}
      />


      {/* 2. Instagram Post (1080x1080) */}
      <Composition
        id="InstagramPost"
        component={InstagramPostComposition as any}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          id: "insta-post",
          title: config.titlePage.title || "Biology Fact",
          heading: config.titlePage.subtitle || "Did You Know?",
          content: config.slides[0]?.content || "Sample content goes here.",
          type: "content",
          footerText: config.branding.authorName || config.branding.logoText || "TITAS SIR BIOLOGY"
        } as any}
      />

      {/* 3. Landscape Thumbnail (1920x1080) */}
      <Composition
        id="Thumbnail"
        component={ThumbnailComposition as any}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          id: "thumb",
          title: config.titlePage.title || "Official School Anthem",
          subtitle: config.branding.authorName || config.titlePage.subtitle || "Pearls Of God School",
          className: config.branding.logoText || "School Anthem",
          authorName: config.branding.authorName || "Pearls Of God",
          badgeText: config.branding.badgeText || "ANTHEM",
          iconName: config.video.iconName || "Music",
          themeName: config.video.themeName || "neon-emerald"
        }}
      />

      {/* 3b. Portrait Reels Thumbnail (1080x1920) */}
      <Composition
        id="ReelsThumbnail"
        component={ThumbnailComposition as any}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          id: "reels-thumb",
          title: configReels.titlePage?.title || "Official School Anthem",
          subtitle: configReels.branding?.authorName || configReels.titlePage?.subtitle || "Pearls Of God School",
          className: configReels.branding?.logoText || "School Anthem",
          authorName: configReels.branding?.authorName || "Pearls Of God",
          badgeText: configReels.branding?.badgeText || "ANTHEM",
          iconName: configReels.video?.iconName || "Music",
          themeName: configReels.video?.themeName || "radiant-gold"
        }}
      />

      {/* 4. Shorts (1080x1920) */}
      <Composition
        id="Shorts"
        component={ShortsComposition as any}
        calculateMetadata={({ props }) => {
          const sections = (props.sections as any[]) || [];
          const totalDuration = sections.reduce((acc, s) => acc + (s.durationInFrames || 300), 0) + 150;
          return { durationInFrames: totalDuration };
        }}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          id: "shorts-default",
          title: config.titlePage.title || "Question Topic",
          sections: [
            { heading: "Did You Know?", content: "Sample hook.", durationInFrames: 300 },
            { heading: "The Science", content: "Sample explanation.", durationInFrames: 300 },
            { heading: "Quick Tip", content: "Sample outro.", durationInFrames: 300 }
          ],
          authorName: config.branding.logoText || "Titas Sir",
          phoneNumber: config.endPage.contact || "9123774239",
          extraText: config.endPage.subtitle || "BIOLOGY 2026-27",
          musicPath: config.audio.musicPath || "assets/music/background.mp3"
        } as any}
      />

      {/* 5. Teaser Reels (1080x1920) */}
      <Composition
        id="Teaser"
        component={TeaserReelComposition as any}
        calculateMetadata={({ props }) => {
          const sections = (props.sections as any[]) || [];
          const teaserSections = sections.slice(0, 2);
          const localFps = 30;
          const sectionDuration = localFps * 6;
          const ctaDuration = localFps * 6;
          return {
            durationInFrames: (teaserSections.length * sectionDuration) + ctaDuration,
          };
        }}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: config.titlePage.title || "Biology Quick Lesson",
          sections: [
            {
              heading: "Prophase",
              content: "Chromosomes condense and become visible.",
            },
          ],
          websiteUrl: config.endPage.website || "bionotes-liard.vercel.app",
          musicPath: config.audio.musicPath || "assets/music/background.mp3"
        } as any}
      />
    </>
  );
};
