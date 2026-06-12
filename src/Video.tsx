import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Series,
  spring,
  Audio,
  staticFile,
  Img,
  Video as RemotionVideo,
  Sequence,
} from "remotion";
import ReactMarkdown from "react-markdown";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";

const outfitFont = loadOutfit();

export const FONTS: Record<string, string> = {
  outfit: outfitFont.fontFamily,
  montserrat: outfitFont.fontFamily,
  playfair: outfitFont.fontFamily,
  inter: outfitFont.fontFamily,
  courier: outfitFont.fontFamily,
};

const fontFamily = outfitFont.fontFamily;

// Premium Theme definitions
export interface Theme {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  cardBg: string;
  border: string;
  fontFamily?: string;
}

export const THEMES: Record<string, Theme> = {
  "radiant-gold": { 
    background: "#1A150E", 
    cardBg: "rgba(35, 30, 25, 0.85)", 
    primary: "#FDE047", 
    secondary: "#FB923C", 
    accent: "#6EE7B7", 
    text: "#FFFAF0", 
    border: "rgba(253, 224, 71, 0.25)" 
  },
  "neon-emerald": { 
    background: "#062016", 
    cardBg: "rgba(10, 40, 30, 0.85)", 
    primary: "#34D399", 
    secondary: "#A7F3D0", 
    accent: "#FDE047", 
    text: "#ECFDF5", 
    border: "rgba(52, 211, 153, 0.25)" 
  },
  "electric-amethyst": { 
    background: "#1E0E30", 
    cardBg: "rgba(40, 20, 60, 0.85)", 
    primary: "#A78BFA", 
    secondary: "#DDD6FE", 
    accent: "#FB923C", 
    text: "#F5F3FF", 
    border: "rgba(167, 139, 250, 0.25)" 
  },
  "crimson-pulse": { 
    background: "#2D0A0A", 
    cardBg: "rgba(60, 20, 20, 0.85)", 
    primary: "#F87171", 
    secondary: "#FCA5A5", 
    accent: "#6EE7B7", 
    text: "#FEF2F2", 
    border: "rgba(248, 113, 113, 0.25)" 
  },
  "cyber-cyan": { 
    background: "#081E26", 
    cardBg: "rgba(10, 45, 55, 0.85)", 
    primary: "#22D3EE", 
    secondary: "#7DD3FC", 
    accent: "#F472B6", 
    text: "#ECFEFF", 
    border: "rgba(34, 211, 238, 0.25)" 
  },
  "midnight-magenta": { 
    background: "#2E0821", 
    cardBg: "rgba(60, 15, 45, 0.85)", 
    primary: "#E879F9", 
    secondary: "#F5D0FE", 
    accent: "#FDE047", 
    text: "#FDF4FF", 
    border: "rgba(232, 121, 249, 0.25)" 
  },
  "arctic-blue": { 
    background: "#0E1B2D", 
    cardBg: "rgba(25, 45, 75, 0.85)", 
    primary: "#60A5FA", 
    secondary: "#93C5FD", 
    accent: "#FB923C", 
    text: "#EFF6FF", 
    border: "rgba(96, 165, 250, 0.25)" 
  },
  "volcanic-orange": { 
    background: "#2D1509", 
    cardBg: "rgba(65, 30, 15, 0.85)", 
    primary: "#FB923C", 
    secondary: "#FDBA74", 
    accent: "#22D3EE", 
    text: "#FFF7ED", 
    border: "rgba(251, 146, 60, 0.25)" 
  },
  "slate-silver": { 
    background: "#1E293B", 
    cardBg: "rgba(51, 65, 85, 0.85)", 
    primary: "#CBD5E1", 
    secondary: "#94A3B8", 
    accent: "#FDE047", 
    text: "#F8FAFC", 
    border: "rgba(203, 213, 225, 0.25)" 
  },
  "royal-indigo": { 
    background: "#1E1B4B", 
    cardBg: "rgba(49, 46, 129, 0.85)", 
    primary: "#818CF8", 
    secondary: "#A5B4FC", 
    accent: "#F472B6", 
    text: "#EEF2FF", 
    border: "rgba(129, 140, 248, 0.25)" 
  }
};

export interface SlideData {
  id: string;
  folder: string;
  media: string | null;
  mediaType: 'image' | 'video' | null;
  heading: string;
  subheading?: string;
  content: string;
  startTime?: number;
  endTime?: number;
  durationInSeconds: number;
  mediaStartFromInSeconds?: number;
  layout: 'split-media-right' | 'split-media-left' | 'full-background-media' | 'text-only' | 'media-only';
  transition: string;
  lines?: Array<Array<{ text: string; relStart: number; relEnd: number }>>;
}

export interface VideoProps {
  video: {
    width: number;
    height: number;
    fps: number;
    themeName?: string;
    theme?: Partial<Theme>;
    fontFamily?: string;
    fontWeight?: string;
    disableAnimations?: boolean;
    iconName?: string;
    progressBar?: {
      show: boolean;
      position: 'top' | 'bottom';
      color?: string;
      height?: number;
    };
  };
  audio: {
    musicPath: string;
    volume: number;
    loop: boolean;
    fadeInInSeconds?: number;
    fadeOutInSeconds?: number;
  };
  branding: {
    showLogo: boolean;
    logoPath: string;
    logoText: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: number;
    opacity: number;
    persistent: boolean;
    authorName?: string;
    badgeText?: string;
  };
  titlePage: {
    show: boolean;
    style?: 'standard' | 'minimalist' | 'thumbnail' | 'glassmorphic' | 'glassmorphic-media' | 'bold-brutalism' | 'cyberpunk-neon' | 'editorial-serif' | 'split-reveal';
    title: string;
    subtitle: string;
    media?: string;
    mediaType?: 'image' | 'video';
    durationInSeconds: number;
    theme: {
      background: string;
      textColor: string;
      subtitleColor: string;
    };
  };
  slides: SlideData[];
  endPage: {
    show: boolean;
    style?: 'standard' | 'minimalist' | 'thumbnail' | 'glassmorphic' | 'bold-brutalism' | 'cyberpunk-neon' | 'editorial-serif' | 'split-reveal';
    title: string;
    subtitle: string;
    contact: string;
    website: string;
    startTime?: number;
    durationInSeconds: number;
    theme: {
      background: string;
      textColor: string;
      subtitleColor: string;
    };
  };
}

// Background Blob component for smooth floating lights (Optimized out for performance)
const Blob: React.FC<{ color: string; size: number; x: number; y: number; delay: number }> = ({ color, size, x, y, delay }) => {
  return null;
};

// Premium dynamic background (Optimized to use native hardware CSS radial-gradients)
const BackgroundEffects: React.FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <AbsoluteFill style={{ 
      background: `radial-gradient(circle at 10% 20%, ${theme.primary}12 0%, transparent 50%), radial-gradient(circle at 90% 80%, ${theme.secondary}12 0%, transparent 50%), radial-gradient(circle at 50% 10%, ${theme.accent}08 0%, transparent 40%), ${theme.background}`,
      overflow: "hidden" 
    }}>
      {/* Subtle scientific grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        backgroundImage: `linear-gradient(${theme.primary} 1px, transparent 1px), linear-gradient(90deg, ${theme.primary} 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
      }} />

      {/* Decorative corners for design aesthetics */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
        const isTop = pos.includes('top');
        const isLeft = pos.includes('left');
        return (
          <div key={pos} style={{ 
            position: 'absolute', 
            top: isTop ? 40 : 'auto', 
            bottom: isTop ? 'auto' : 40, 
            left: isLeft ? 40 : 'auto', 
            right: isLeft ? 'auto' : 40, 
            width: 80, 
            height: 80, 
            borderLeft: isLeft ? `5px solid ${theme.primary}` : 'none',
            borderRight: isLeft ? 'none' : `5px solid ${theme.primary}`,
            borderTop: isTop ? `5px solid ${theme.primary}` : 'none',
            borderBottom: isTop ? 'none' : `5px solid ${theme.primary}`,
            zIndex: 100,
            opacity: 0.35
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Global Branding Overlay
const BrandingOverlay: React.FC<{ branding: VideoProps['branding']; theme: Theme; currentFrame: number; totalDuration: number; fps: number; titleShow: boolean; titleSecs: number; endShow: boolean; endSecs: number }> = ({ branding, theme, currentFrame, totalDuration, fps, titleShow, titleSecs, endShow, endSecs }) => {
  if (!branding.showLogo) return null;

  const titleDuration = titleShow ? titleSecs * fps : 0;
  const endDuration = endShow ? endSecs * fps : 0;
  
  const isTitleActive = titleShow && currentFrame < titleDuration;
  const isEndActive = endShow && currentFrame >= totalDuration - endDuration;

  if (!branding.persistent && (isTitleActive || isEndActive)) return null;

  // Position settings
  const positionStyles: React.CSSProperties = {};
  if (branding.position.includes('top')) positionStyles.top = 45;
  else positionStyles.bottom = 45;

  if (branding.position.includes('left')) positionStyles.left = 50;
  else positionStyles.right = 50;

  return (
    <div style={{
      position: 'absolute',
      ...positionStyles,
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 15,
      background: theme.cardBg,
      backdropFilter: 'blur(20px)',
      padding: '12px 24px',
      borderRadius: 40,
      border: `2px solid ${theme.primary}`,
      opacity: branding.opacity,
      transition: 'opacity 0.5s ease',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    }}>
      {branding.logoPath ? (
        <Img
          src={staticFile(branding.logoPath)}
          style={{
            height: branding.size,
            width: branding.size,
            objectFit: 'contain'
          }}
        />
      ) : (
        <div style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: theme.accent,
          boxShadow: `0 0 10px ${theme.accent}`
        }} />
      )}
      {branding.logoText && (
        <span style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 900,
          color: theme.text,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
          {branding.logoText}
        </span>
      )}
    </div>
  );
};

// Dynamic progress bar component
const ProgressBar: React.FC<{
  show: boolean;
  position: 'top' | 'bottom';
  color?: string;
  height?: number;
  theme: Theme;
  currentFrame: number;
  totalDuration: number;
}> = ({ show, position, color, height = 8, theme, currentFrame, totalDuration }) => {
  if (!show) return null;
  const progress = currentFrame / totalDuration;
  const barColor = color || theme.primary;

  const styles: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    height,
    background: barColor,
    boxShadow: `0 0 12px ${barColor}`,
    transform: `scaleX(${progress})`,
    transformOrigin: 'left',
    zIndex: 600,
  };

  if (position === 'top') {
    styles.top = 0;
  } else {
    styles.bottom = 0;
  }

  return <div style={styles} />;
};

const hasMarkdown = (text: string) => /~~|\*|_|`/.test(text);

const MarkdownText: React.FC<{
  text: string;
  theme: Theme;
  primaryColor?: string;
}> = ({ text, theme, primaryColor }) => {
  return (
    <ReactMarkdown
      components={{
        strong: ({node, ...props}) => <span style={{color: primaryColor || theme.primary, fontWeight: 900}} {...props} />,
        em: ({node, ...props}) => <span style={{color: theme.accent, fontWeight: 900, fontStyle: 'normal'}} {...props} />,
        del: ({node, ...props}) => (
          <span 
            style={{
              textDecoration: 'none', 
              background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, 
              borderBottom: `3px solid ${theme.accent}`, 
              padding: '2px 6px', 
              borderRadius: '4px', 
              fontWeight: 900,
              WebkitTextFillColor: theme.text,
            }} 
            {...props} 
          />
        ),
        a: ({node, href, ...props}) => {
          if (href === 'highlight') {
            return (
              <span 
                style={{
                  textDecoration: 'none', 
                  background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, 
                  borderBottom: `3px solid ${theme.accent}`, 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontWeight: 900,
                  WebkitTextFillColor: theme.text,
                }} 
                {...props} 
              />
            );
          }
          return <a href={href} style={{ color: theme.primary }} {...props} />;
        },
        code: ({node, ...props}) => <span style={{fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${theme.border}`, padding: '2px 6px', borderRadius: '6px', color: theme.primary, fontSize: '0.9em', fontWeight: 700}} {...props} />,
        p: ({node, ...props}) => <span {...props} />,
      }}
    >
      {text.replace(/~~(.*?)~~/g, "[$1](highlight)")}
    </ReactMarkdown>
  );
};

// Title Page Component with Style Variations
const TitleSlide: React.FC<{ titlePage: VideoProps['titlePage']; theme: Theme; fontFamily: string; disableAnimations?: boolean }> = ({ titlePage, theme, fontFamily, disableAnimations }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const style = titlePage.style || 'standard';
  const isPortrait = width < height;
  
  const entrance = disableAnimations
    ? 1
    : spring({ frame, fps, config: { damping: 11, stiffness: 120 } });
  
  const exitStart = durationInFrames - 12;
  const opacity = disableAnimations
    ? 1
    : frame >= exitStart 
      ? interpolate(frame, [exitStart, durationInFrames - 1], [1, 0], { extrapolateLeft: 'clamp' })
      : 1;

  const bgStyle: React.CSSProperties = titlePage.theme.background.includes('gradient')
    ? { backgroundImage: titlePage.theme.background }
    : { backgroundColor: titlePage.theme.background };

  // 1. MINIMALIST STYLE
  if (style === 'minimalist') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", paddingLeft: isPortrait ? 60 : 120, opacity }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          maxWidth: "80%",
          textAlign: 'left',
          fontFamily,
          borderLeft: `8px solid ${theme.primary}`,
          paddingLeft: isPortrait ? 25 : 40,
          transform: `translateX(${interpolate(entrance, [0, 1], [-50, 0])}px)`,
          opacity: entrance,
        }}>
          <h1 style={{ 
            fontSize: isPortrait ? 55 : 85, 
            fontWeight: 300, 
            margin: 0, 
            lineHeight: 1.1, 
            color: titlePage.theme.textColor || theme.text,
            letterSpacing: -1,
          }}>
            {hasMarkdown(titlePage.title) ? (
              <MarkdownText text={titlePage.title} theme={theme} />
            ) : (
              titlePage.title.split(' ').map((word, i) => i === 0 ? <strong key={i} style={{ fontWeight: 900, color: theme.primary }}>{word} </strong> : word + ' ')
            )}
          </h1>
          {titlePage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 20 : 24,
              fontWeight: 400,
              color: titlePage.theme.subtitleColor || theme.secondary,
              marginTop: 20,
              letterSpacing: 1,
            }}>
              <MarkdownText text={titlePage.subtitle} theme={theme} />
            </p>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 2. THUMBNAIL STYLE
  if (style === 'thumbnail') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center", opacity }}>
        <BackgroundEffects theme={theme} />
        
        {/* Border Corners */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
          const isTop = pos.includes('top');
          const isLeft = pos.includes('left');
          return (
            <div key={pos} style={{ 
              position: 'absolute', 
              top: isTop ? 40 : 'auto', 
              bottom: isTop ? 'auto' : 40, 
              left: isLeft ? 40 : 'auto', 
              right: isLeft ? 'auto' : 40, 
              width: isPortrait ? 60 : 120, 
              height: isPortrait ? 60 : 120, 
              borderLeft: isLeft ? `8px solid ${theme.primary}` : 'none',
              borderRight: isLeft ? 'none' : `8px solid ${theme.primary}`,
              borderTop: isTop ? `8px solid ${theme.primary}` : 'none',
              borderBottom: isTop ? 'none' : `8px solid ${theme.primary}`,
            }} />
          );
        })}

        <div style={{
          transform: `scale(${interpolate(entrance, [0, 1], [0.85, 1])})`,
          opacity: entrance,
          textAlign: "center",
          fontFamily,
          zIndex: 10,
          padding: isPortrait ? "40px 30px" : "60px 80px",
          background: 'rgba(0,0,0,0.4)',
          borderRadius: isPortrait ? 24 : 40,
          border: `6px solid ${theme.primary}`,
          boxShadow: `${isPortrait ? 10 : 20}px ${isPortrait ? 10 : 20}px 0px rgba(0,0,0,0.5)`,
          maxWidth: "85%",
          position: 'relative',
        }}>
          {/* Top Badge */}
          <div style={{
            position: 'absolute',
            top: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            background: theme.primary,
            color: theme.background,
            padding: '6px 20px',
            borderRadius: 15,
            fontSize: isPortrait ? 14 : 20,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: 3,
            boxShadow: `0 5px 15px rgba(0,0,0,0.3)`
          }}>
            PRESENTATION
          </div>

          <h1 style={{ 
            fontSize: isPortrait ? 50 : 85, 
            fontWeight: 900, 
            margin: '20px 0 0 0', 
            lineHeight: 1.0, 
            color: titlePage.theme.textColor || theme.text,
            letterSpacing: isPortrait ? -2 : -4,
            textShadow: `6px 6px 0px ${theme.background}`,
            textTransform: 'uppercase',
          }}>
            <MarkdownText text={titlePage.title} theme={theme} />
          </h1>
          
          {titlePage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 18 : 24,
              fontWeight: 800,
              color: titlePage.theme.subtitleColor || theme.secondary,
              marginTop: 20,
              letterSpacing: isPortrait ? 3 : 6,
              textTransform: 'uppercase',
            }}>
              <MarkdownText text={titlePage.subtitle} theme={theme} />
            </p>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 3. GLASSMORPHIC MEDIA STYLE
  if (style === 'glassmorphic-media') {
    const splitDirection = isPortrait ? 'column' : 'row';
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center", opacity }}>
        <BackgroundEffects theme={theme} />
        
        {/* Extra pulsing backglow */}
        <div style={{
          position: 'absolute',
          width: isPortrait ? 300 : 500,
          height: isPortrait ? 300 : 500,
          borderRadius: '50%',
          background: theme.accent,
          filter: 'blur(150px)',
          opacity: 0.2 + Math.sin(frame / 20) * 0.05,
          zIndex: 5,
        }} />

        <div style={{
          transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
          opacity: entrance,
          fontFamily,
          zIndex: 10,
          padding: isPortrait ? "40px 24px" : "65px 75px",
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: "blur(60px)",
          borderRadius: isPortrait ? 30 : 50,
          border: `2px solid rgba(255,255,255,0.25)`,
          boxShadow: `0 50px 100px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.05)`,
          maxWidth: "90%",
          display: 'flex',
          flexDirection: splitDirection,
          gap: isPortrait ? 30 : 60,
          alignItems: 'center',
        }}>
          {/* Text container */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: isPortrait ? 'center' : 'left' }}>
            <h1 style={{ 
              fontSize: isPortrait ? 64 : 70, 
              fontWeight: 900, 
              margin: 0, 
              lineHeight: 1.15, 
              color: titlePage.theme.textColor || theme.text,
              letterSpacing: -1.5,
              background: `linear-gradient(to right, ${theme.text} 30%, ${theme.primary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              <MarkdownText text={titlePage.title} theme={theme} />
            </h1>
            {titlePage.subtitle && (
              <p style={{
                fontSize: isPortrait ? 28 : 30,
                fontWeight: 500,
                color: titlePage.theme.subtitleColor || theme.secondary,
                marginTop: 20,
                opacity: 0.8,
                whiteSpace: 'pre-wrap',
              }}>
                <MarkdownText text={titlePage.subtitle} theme={theme} />
              </p>
            )}
          </div>
          
          {/* Media Container */}
          {titlePage.media && (
            <div style={{
              flex: 0.8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{
                width: isPortrait ? 260 : 340,
                height: isPortrait ? 260 : 340,
                borderRadius: '50%',
                border: `6px solid ${theme.primary}`,
                boxShadow: `0 15px 35px rgba(0,0,0,0.5)`,
                overflow: 'hidden',
                transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])})`,
              }}>
                <Img 
                  src={staticFile(titlePage.media)} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 4. GLASSMORPHIC STYLE
  if (style === 'glassmorphic') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center", opacity }}>
        <BackgroundEffects theme={theme} />
        
        {/* Extra pulsing backglow */}
        <div style={{
          position: 'absolute',
          width: isPortrait ? 300 : 500,
          height: isPortrait ? 300 : 500,
          borderRadius: '50%',
          background: theme.accent,
          filter: 'blur(150px)',
          opacity: 0.2 + Math.sin(frame / 20) * 0.05,
          zIndex: 5,
        }} />

        <div style={{
          transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
          opacity: entrance,
          textAlign: "center",
          fontFamily,
          zIndex: 10,
          padding: isPortrait ? "50px 30px" : "90px 110px",
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: "blur(60px)",
          borderRadius: isPortrait ? 30 : 60,
          border: `2px solid rgba(255,255,255,0.25)`,
          boxShadow: `0 50px 100px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.05)`,
          maxWidth: "85%",
        }}>
          <h1 style={{ 
            fontSize: isPortrait ? 55 : 95, 
            fontWeight: 900, 
            margin: 0, 
            lineHeight: 1.15, 
            color: titlePage.theme.textColor || theme.text,
            letterSpacing: -2,
            background: `linear-gradient(to right, ${theme.text} 30%, ${theme.primary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            <MarkdownText text={titlePage.title} theme={theme} />
          </h1>
          {titlePage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 26 : 38,
              fontWeight: 500,
              color: titlePage.theme.subtitleColor || theme.secondary,
              marginTop: 25,
              opacity: 0.8,
            }}>
              <MarkdownText text={titlePage.subtitle} theme={theme} />
            </p>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 4. BOLD-BRUTALISM STYLE
  if (style === 'bold-brutalism') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center", opacity }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])}) rotate(${interpolate(entrance, [0, 1], [-3, 0])}deg)`,
          opacity: entrance,
          textAlign: "left",
          fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          zIndex: 10,
          padding: isPortrait ? "40px 30px" : "60px 80px",
          background: theme.primary,
          color: theme.background,
          border: `${isPortrait ? '6px' : '10px'} solid ${theme.text}`,
          boxShadow: `${isPortrait ? '12px' : '20px'} ${isPortrait ? '12px' : '20px'} 0px ${theme.text}`,
          maxWidth: "85%",
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div style={{
            background: theme.text,
            color: theme.primary,
            padding: "6px 16px",
            fontSize: isPortrait ? 16 : 24,
            fontWeight: 900,
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
            transform: 'rotate(-2deg)',
          }}>
            WARNING // HIGH IMPACT
          </div>
          <h1 style={{
            fontSize: isPortrait ? 55 : 95,
            fontWeight: 900,
            margin: 0,
            lineHeight: 0.9,
            letterSpacing: -1,
            textTransform: 'uppercase',
            color: theme.background,
          }}>
            <MarkdownText text={titlePage.title} theme={theme} primaryColor={theme.accent} />
          </h1>
          {titlePage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 20 : 28,
              fontWeight: 800,
              color: theme.background,
              margin: 0,
              textTransform: 'uppercase',
              borderTop: `4px solid ${theme.background}`,
              paddingTop: 15,
            }}>
              <MarkdownText text={titlePage.subtitle} theme={theme} primaryColor={theme.accent} />
            </p>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 5. CYBERPUNK-NEON STYLE
  if (style === 'cyberpunk-neon') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center", opacity }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(244, 114, 182, 0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(244, 114, 182, 0.08) 2px, transparent 2px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }} />
        <div style={{
          transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
          opacity: entrance,
          textAlign: "center",
          fontFamily: "monospace, Courier, 'Courier New'",
          zIndex: 10,
          padding: isPortrait ? "50px 30px" : "70px 90px",
          background: 'rgba(5, 5, 15, 0.9)',
          borderRadius: 8,
          border: `3px solid ${theme.primary}`,
          boxShadow: `0 0 30px ${theme.primary}, inset 0 0 15px rgba(255,255,255,0.05)`,
          maxWidth: "85%",
          position: 'relative',
        }}>
          {/* Cyberpunk corner elements */}
          <div style={{ position: 'absolute', top: -5, left: -5, width: 25, height: 25, borderTop: `6px solid ${theme.accent}`, borderLeft: `6px solid ${theme.accent}` }} />
          <div style={{ position: 'absolute', top: -5, right: -5, width: 25, height: 25, borderTop: `6px solid ${theme.accent}`, borderRight: `6px solid ${theme.accent}` }} />
          <div style={{ position: 'absolute', bottom: -5, left: -5, width: 25, height: 25, borderBottom: `6px solid ${theme.accent}`, borderLeft: `6px solid ${theme.accent}` }} />
          <div style={{ position: 'absolute', bottom: -5, right: -5, width: 25, height: 25, borderBottom: `6px solid ${theme.accent}`, borderRight: `6px solid ${theme.accent}` }} />
          
          <div style={{
            color: theme.accent,
            fontSize: isPortrait ? 12 : 18,
            fontWeight: 800,
            letterSpacing: 4,
            marginBottom: 20,
            textTransform: 'uppercase',
            textShadow: `0 0 8px ${theme.accent}`,
          }}>
            [ SYSTEM_BOOT_SEQUENCE // OK ]
          </div>
          
          <h1 style={{
            fontSize: isPortrait ? 50 : 80,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.1,
            color: theme.text,
            letterSpacing: isPortrait ? -1 : -2,
            textShadow: `0 0 15px ${theme.primary}, 0 0 30px ${theme.primary}`,
            textTransform: 'uppercase',
          }}>
            <MarkdownText text={titlePage.title} theme={theme} />
          </h1>
          
          {titlePage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 16 : 22,
              fontWeight: 400,
              color: theme.secondary,
              marginTop: 30,
              letterSpacing: 2,
              textShadow: `0 0 8px ${theme.secondary}`,
            }}>
              &gt;&gt; <MarkdownText text={titlePage.subtitle} theme={theme} />
            </p>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 6. EDITORIAL-SERIF STYLE
  if (style === 'editorial-serif') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", paddingLeft: isPortrait ? 40 : 160, paddingRight: isPortrait ? 40 : 160, opacity }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          maxWidth: "85%",
          textAlign: 'left',
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
          opacity: entrance,
        }}>
          <div style={{
            fontSize: isPortrait ? 14 : 20,
            fontWeight: 400,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: theme.secondary,
            marginBottom: 25,
            borderBottom: `1px solid ${theme.primary}50`,
            paddingBottom: 15,
          }}>
            Vol. I / Issue IV
          </div>
          <h1 style={{
            fontSize: isPortrait ? 55 : 90,
            fontWeight: 300,
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.05,
            color: theme.text,
            letterSpacing: -1,
          }}>
            <MarkdownText text={titlePage.title} theme={theme} />
          </h1>
          {titlePage.subtitle && (
            <p style={{
              fontFamily,
              fontSize: isPortrait ? 18 : 24,
              fontWeight: 400,
              color: theme.primary,
              marginTop: 25,
              letterSpacing: 1,
              lineHeight: 1.4,
              maxWidth: 600,
            }}>
              <MarkdownText text={titlePage.subtitle} theme={theme} />
            </p>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // 7. SPLIT-REVEAL STYLE
  if (style === 'split-reveal') {
    const leftWidth = isPortrait ? '100%' : '45%';
    const rightWidth = isPortrait ? '100%' : '55%';
    const leftHeight = isPortrait ? '35%' : '100%';
    const rightHeight = isPortrait ? '65%' : '100%';
    const splitDirection = isPortrait ? 'column' : 'row';

    return (
      <AbsoluteFill style={{ ...bgStyle, display: 'flex', flexDirection: splitDirection, opacity }}>
        {/* Left Side: Solid Accent Block */}
        <div style={{
          width: leftWidth,
          height: leftHeight,
          background: theme.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
          position: 'relative',
          transform: isPortrait 
            ? `translateY(${interpolate(entrance, [0, 1], [-100, 0])}%)`
            : `translateX(${interpolate(entrance, [0, 1], [-100, 0])}%)`,
          boxShadow: '10px 0 30px rgba(0,0,0,0.3)',
          zIndex: 15,
        }}>
          <div style={{
            fontFamily,
            fontSize: isPortrait ? 30 : 50,
            fontWeight: 900,
            color: theme.background,
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: 4,
            lineHeight: 1,
          }}>
            {titlePage.subtitle ? titlePage.subtitle.replace(/~~/g, '').split(' ')[0] : 'INTRO'}
          </div>
        </div>

        {/* Right Side: Title text */}
        <div style={{
          width: rightWidth,
          height: rightHeight,
          background: theme.background,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isPortrait ? 30 : 80,
          transform: isPortrait
            ? `translateY(${interpolate(entrance, [0, 1], [100, 0])}%)`
            : `translateX(${interpolate(entrance, [0, 1], [100, 0])}%)`,
          zIndex: 10,
        }}>
          <BackgroundEffects theme={theme} />
          <div style={{ zIndex: 12 }}>
            <h1 style={{
              fontFamily,
              fontSize: isPortrait ? 48 : 80,
              fontWeight: 900,
              color: theme.text,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}>
              <MarkdownText text={titlePage.title} theme={theme} />
            </h1>
            {titlePage.subtitle && (
              <p style={{
                fontFamily,
                fontSize: isPortrait ? 18 : 22,
                fontWeight: 600,
                color: theme.secondary,
                marginTop: 20,
              }}>
                <MarkdownText text={titlePage.subtitle} theme={theme} />
              </p>
            )}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 4. STANDARD STYLE (Fallback)
  return (
    <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center", opacity }}>
      <BackgroundEffects theme={theme} />
      <div style={{
        transform: `scale(${interpolate(entrance, [0, 1], [0.85, 1])}deg)`,
        opacity: entrance,
        textAlign: "center",
        fontFamily,
        zIndex: 10,
        padding: "80px 100px",
        background: theme.cardBg,
        backdropFilter: "blur(35px)",
        borderRadius: 50,
        border: `6px solid ${theme.primary}`,
        boxShadow: `0 30px 60px rgba(0, 0, 0, 0.5)`,
        maxWidth: "80%",
      }}>
        <h1 style={{ 
          fontSize: 90, 
          fontWeight: 900, 
          margin: 0, 
          lineHeight: 1.1, 
          color: titlePage.theme.textColor || theme.text,
          letterSpacing: -3,
          textShadow: `8px 8px 0px ${theme.background}`,
        }}>
          <MarkdownText text={titlePage.title} theme={theme} />
        </h1>
        {titlePage.subtitle && (
          <p style={{
            fontSize: 28,
            fontWeight: 700,
            color: titlePage.theme.subtitleColor || theme.secondary,
            marginTop: 30,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            <MarkdownText text={titlePage.subtitle} theme={theme} />
          </p>
        )}
        <div style={{
          height: 6,
          background: theme.accent,
          width: interpolate(entrance, [0, 1], [0, 250]),
          margin: "40px auto 0",
          borderRadius: 3,
          boxShadow: `0 0 15px ${theme.accent}`
        }} />
      </div>
    </AbsoluteFill>
  );
};

// Dynamic Media Component with startFrom support
const MediaRenderer: React.FC<{ path: string; type: 'image' | 'video'; startFromInSeconds?: number; style?: React.CSSProperties }> = ({ path, type, startFromInSeconds = 0, style }) => {
  const { fps } = useVideoConfig();
  const startFromFrames = Math.round(startFromInSeconds * fps);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      borderRadius: 24,
      overflow: 'hidden',
      border: '1.5px solid rgba(255, 255, 255, 0.1)',
      ...style
    }}>
      {/* Blurred background */}
      <div style={{
        position: 'absolute',
        inset: -10,
        filter: 'blur(30px) brightness(0.4)',
        zIndex: 1,
      }}>
        {type === 'image' ? (
          <Img src={staticFile(path)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <RemotionVideo 
            src={staticFile(path)} 
            volume={0} 
            startFrom={startFromFrames}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        )}
      </div>
      
      {/* Crisp foreground */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {type === 'image' ? (
          <Img src={staticFile(path)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <RemotionVideo 
            src={staticFile(path)} 
            volume={0} 
            startFrom={startFromFrames}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        )}
      </div>
    </div>
  );
};

const KaraokeText: React.FC<{
  lines: Array<Array<{ text: string; relStart: number; relEnd: number }>>;
  currentFrame: number;
  fps: number;
  theme: Theme;
  fontFamily: string;
  fontWeight: string;
}> = ({ lines, currentFrame, fps, theme, fontFamily, fontWeight }) => {
  const currentTime = currentFrame / fps;
  const { width, height } = useVideoConfig();
  const isPortrait = width < height;
  
  // Calculate total number of characters to decide font size
  const totalChars = lines.reduce((acc, line) => acc + line.reduce((lAcc, word) => lAcc + word.text.length, 0), 0);
  const fontSize = isPortrait
    ? (totalChars > 250 ? 38 : totalChars > 150 ? 46 : 54)
    : (totalChars > 250 ? 28 : totalChars > 150 ? 34 : 40);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'flex-start',
      width: '100%',
      justifyContent: 'center',
    }}>
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} style={{
          display: 'flex',
          flexWrap: 'wrap',
          lineHeight: '1.4',
          fontFamily,
          fontSize,
          fontWeight: fontWeight || 'bold',
        }}>
          {line.map((word, wordIdx) => {
            const isActive = currentTime >= word.relStart && currentTime <= word.relEnd;
            const isSpoken = currentTime > word.relEnd;
            
            // Smooth and easy to read active word highlight (no bouncy jumping animations)
            const scale = isActive ? 1.05 : 1;
            const translateY = 0;
            
            let color = 'rgba(255,255,255,0.35)';
            let textShadow = 'none';
            
            if (isActive) {
              color = theme.accent;
              textShadow = `0 0 8px ${theme.accent}aa`;
            } else if (isSpoken) {
              color = theme.text;
            }
            
            return (
              <span
                key={wordIdx}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  color,
                  textShadow,
                  marginRight: '12px',
                  transition: 'color 0.15s ease, text-shadow 0.15s ease',
                  transformOrigin: 'center bottom',
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Content Slide Component with Responsive Aspect-Ratio Support
const ContentSlide: React.FC<{ slide: SlideData; index: number; totalSlides: number; theme: Theme; fontFamily: string; fontWeight: string; disableAnimations?: boolean }> = ({ slide, index, totalSlides, theme, fontFamily, fontWeight, disableAnimations }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const isPortrait = width < height; // Check aspect ratio

  const entrance = disableAnimations
    ? 1
    : spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
  
  const exitFrames = 15;
  const exitStart = durationInFrames - exitFrames;
  const opacity = disableAnimations
    ? 1
    : frame >= exitStart
      ? interpolate(frame, [exitStart, durationInFrames - 1], [1, 0], { extrapolateLeft: 'clamp' })
      : 1;

  const textTranslateY = interpolate(entrance, [0, 1], [40, 0]);
  const mediaScale = interpolate(entrance, [0, 1], [0.95, 1]);

  const isHeadingOnly = !slide.content && !slide.media;
  const contentFontSize = slide.content.length > 200 ? 30 : slide.content.length > 100 ? 36 : 42;

  const renderTextContent = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1.2,
      transform: `translateY(${textTranslateY}px)`,
    }}>
      {slide.heading && (
        <h2 style={{
          fontFamily,
          fontSize: isHeadingOnly ? (isPortrait ? 70 : 90) : 54,
          fontWeight: 900,
          color: theme.primary,
          margin: '0 0 24px 0',
          lineHeight: 1.15,
          letterSpacing: -1.5,
        }}>
          <ReactMarkdown
            components={{
              strong: ({node, ...props}) => <span style={{color: theme.secondary, fontWeight: 900}} {...props} />,
              em: ({node, ...props}) => <span style={{color: theme.accent, fontWeight: 900, fontStyle: 'normal'}} {...props} />,
              del: ({node, ...props}) => <span style={{textDecoration: 'none', background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, borderBottom: `3px solid ${theme.accent}`, padding: '2px 6px', borderRadius: '4px', fontWeight: 900}} {...props} />,
              a: ({node, href, ...props}) => {
                if (href === 'highlight') {
                  return (
                    <span 
                      style={{
                        textDecoration: 'none', 
                        background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, 
                        borderBottom: `3px solid ${theme.accent}`, 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontWeight: 900
                      }} 
                      {...props} 
                    />
                  );
                }
                return <a href={href} style={{ color: theme.primary }} {...props} />;
              },
              code: ({node, ...props}) => <span style={{fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${theme.border}`, padding: '2px 6px', borderRadius: '6px', color: theme.primary, fontSize: '0.9em', fontWeight: 700}} {...props} />,
              p: ({node, ...props}) => <span {...props} />,
            }}
          >
            {slide.heading.replace(/~~(.*?)~~/g, "[$1](highlight)")}
          </ReactMarkdown>
        </h2>
      )}
      {slide.subheading && (
        <h3 style={{
          fontFamily,
          fontSize: isPortrait ? 24 : 32,
          fontWeight: 700,
          color: theme.secondary,
          margin: '-12px 0 24px 0',
          lineHeight: 1.2,
          letterSpacing: -0.5,
          opacity: 0.9,
        }}>
          <ReactMarkdown
            components={{
              strong: ({node, ...props}) => <span style={{color: theme.primary, fontWeight: 900}} {...props} />,
              em: ({node, ...props}) => <span style={{color: theme.accent, fontWeight: 900, fontStyle: 'normal'}} {...props} />,
              del: ({node, ...props}) => <span style={{textDecoration: 'none', background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, borderBottom: `3px solid ${theme.accent}`, padding: '2px 6px', borderRadius: '4px', fontWeight: 900}} {...props} />,
              a: ({node, href, ...props}) => {
                if (href === 'highlight') {
                  return (
                    <span 
                      style={{
                        textDecoration: 'none', 
                        background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, 
                        borderBottom: `3px solid ${theme.accent}`, 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontWeight: 900
                      }} 
                      {...props} 
                    />
                  );
                }
                return <a href={href} style={{ color: theme.primary }} {...props} />;
              },
              code: ({node, ...props}) => <span style={{fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${theme.border}`, padding: '2px 6px', borderRadius: '6px', color: theme.primary, fontSize: '0.9em', fontWeight: 700}} {...props} />,
              p: ({node, ...props}) => <span {...props} />,
            }}
          >
            {slide.subheading.replace(/~~(.*?)~~/g, "[$1](highlight)")}
          </ReactMarkdown>
        </h3>
      )}
      {slide.lines ? (
        <KaraokeText
          lines={slide.lines}
          currentFrame={frame}
          fps={fps}
          theme={theme}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
        />
      ) : slide.content && (
        <div style={{
          fontFamily,
          fontSize: isPortrait ? contentFontSize * 0.85 : contentFontSize,
          color: theme.text,
          lineHeight: 1.5,
          fontWeight: (fontWeight as any) || 600,
          opacity: 0.95
        }}>
          <ReactMarkdown
            components={{
              strong: ({node, ...props}) => <span style={{color: theme.secondary, fontWeight: 900}} {...props} />,
              em: ({node, ...props}) => <span style={{color: theme.accent, fontWeight: 900, fontStyle: 'normal'}} {...props} />,
              del: ({node, ...props}) => <span style={{textDecoration: 'none', background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, borderBottom: `3px solid ${theme.accent}`, padding: '2px 6px', borderRadius: '4px', fontWeight: 900}} {...props} />,
              a: ({node, href, ...props}) => {
                if (href === 'highlight') {
                  return (
                    <span 
                      style={{
                        textDecoration: 'none', 
                        background: `linear-gradient(120deg, ${theme.accent}35 0%, ${theme.accent}15 100%)`, 
                        borderBottom: `3px solid ${theme.accent}`, 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontWeight: 900
                      }} 
                      {...props} 
                    />
                  );
                }
                return <a href={href} style={{ color: theme.primary }} {...props} />;
              },
              code: ({node, ...props}) => <span style={{fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${theme.border}`, padding: '2px 6px', borderRadius: '6px', color: theme.primary, fontSize: '0.9em', fontWeight: 700}} {...props} />,
              p: ({node, ...props}) => <p style={{margin: '0 0 16px 0'}} {...props} />,
              ul: ({node, ...props}) => <ul style={{ margin: '0 0 20px 0', paddingLeft: 30, listStyleType: 'square' }} {...props} />,
              ol: ({node, ...props}) => <ol style={{ margin: '0 0 20px 0', paddingLeft: 30, listStyleType: 'decimal' }} {...props} />,
              li: ({node, ...props}) => <li style={{marginBottom: 10}} {...props} />,
            }}
          >
            {slide.content.replace(/~~(.*?)~~/g, "[$1](highlight)")}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );

  const renderMedia = () => {
    if (!slide.media || !slide.mediaType) return null;
    return (
      <div style={{
        flex: 1,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${mediaScale})`,
      }}>
        <MediaRenderer 
          path={slide.media} 
          type={slide.mediaType} 
          startFromInSeconds={slide.mediaStartFromInSeconds}
        />
      </div>
    );
  };

  const getLayout = () => {
    // Responsive stacked view for portrait resolutions (like Shorts/Reels)
    if (isPortrait) {
      if (slide.layout === 'media-only') return <div style={{ height: '100%', width: '100%' }}>{renderMedia()}</div>;
      if (slide.layout === 'text-only') return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', width: '100%', textAlign: 'center', padding: 40 }}>{renderTextContent()}</div>;
      if (slide.layout === 'full-background-media') {
        return (
          <AbsoluteFill style={{ padding: 0 }}>
            {slide.media && slide.mediaType && <MediaRenderer path={slide.media} type={slide.mediaType} startFromInSeconds={slide.mediaStartFromInSeconds} style={{ borderRadius: 0, border: 'none' }} />}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,20,0.95) 0%, rgba(10,13,20,0.6) 50%, rgba(10,13,20,0.85) 100%)', zIndex: 3 }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 4, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: theme.cardBg, backdropFilter: 'blur(30px)', padding: 40, borderRadius: 30, border: `2px solid ${theme.primary}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', width: '90%', textAlign: 'center' }}>
                {renderTextContent()}
              </div>
            </div>
          </AbsoluteFill>
        );
      }
      // split vertically for portrait
      const stackDirection = slide.layout === 'split-media-left' ? 'column' : 'column-reverse';
      return (
        <div style={{ display: 'flex', flexDirection: stackDirection, gap: 40, height: '100%', width: '100%', alignItems: 'stretch' }}>
          {renderMedia()}
          {renderTextContent()}
        </div>
      );
    }

    // Standard Landscape layout
    switch (slide.layout) {
      case 'split-media-left':
        return (
          <div style={{ display: 'flex', gap: 60, height: '100%', width: '100%', alignItems: 'stretch' }}>
            {renderMedia()}
            {renderTextContent()}
          </div>
        );
      case 'full-background-media':
        return (
          <AbsoluteFill style={{ padding: 0 }}>
            {slide.media && slide.mediaType && (
              <MediaRenderer 
                path={slide.media} 
                type={slide.mediaType} 
                startFromInSeconds={slide.mediaStartFromInSeconds}
                style={{ borderRadius: 0, border: 'none' }} 
              />
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,13,20,0.95) 0%, rgba(10,13,20,0.6) 50%, rgba(10,13,20,0.85) 100%)',
              zIndex: 3
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 4,
              padding: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: theme.cardBg,
                backdropFilter: 'blur(30px)',
                padding: '60px 80px',
                borderRadius: 40,
                border: `4px solid ${theme.primary}`,
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                maxWidth: '85%',
                textAlign: 'center'
              }}>
                {renderTextContent()}
              </div>
            </div>
          </AbsoluteFill>
        );
      case 'media-only':
        return (
          <div style={{ height: '100%', width: '100%' }}>
            {renderMedia()}
          </div>
        );
      case 'text-only':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            textAlign: 'center',
            padding: '40px 100px'
          }}>
            {renderTextContent()}
          </div>
        );
      case 'split-media-right':
      default:
        return (
          <div style={{ display: 'flex', gap: 60, height: '100%', width: '100%', alignItems: 'stretch' }}>
            {renderTextContent()}
            {renderMedia()}
          </div>
        );
    }
  };

  const entranceProgress = disableAnimations
    ? 1
    : spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const entranceTranslateX = disableAnimations ? 0 : interpolate(entranceProgress, [0, 1], [40, 0]);
  const entranceScale = disableAnimations ? 1 : interpolate(entranceProgress, [0, 1], [0.98, 1]);
  const entranceOpacity = disableAnimations
    ? 1
    : interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const exitProgress = disableAnimations
    ? 0
    : spring({ frame: Math.max(0, frame - exitStart), fps, config: { damping: 14, stiffness: 100 } });
  const exitTranslateX = disableAnimations ? 0 : interpolate(exitProgress, [0, 1], [0, -40]);
  const exitScale = disableAnimations ? 1 : interpolate(exitProgress, [0, 1], [1, 0.98]);
  const exitOpacity = disableAnimations
    ? 1
    : frame >= exitStart
      ? interpolate(frame, [exitStart, durationInFrames - 1], [1, 0], { extrapolateLeft: 'clamp' })
      : 1;

  const combinedTranslateX = entranceTranslateX + exitTranslateX;
  const combinedScale = entranceScale * exitScale;
  const combinedOpacity = entranceOpacity * exitOpacity;

  return (
    <AbsoluteFill style={{ padding: isPortrait ? 40 : 75 }}>
      <BackgroundEffects theme={theme} />
      
      {/* Slide Glass Container */}
      {slide.layout !== 'full-background-media' && (
        <div style={{
          width: '100%',
          height: '100%',
          background: theme.cardBg,
          backdropFilter: 'blur(35px)',
          borderRadius: isPortrait ? 36 : 48,
          border: `6px solid ${theme.primary}`,
          padding: isPortrait ? '40px 30px' : '60px 75px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          position: 'relative',
          transform: `translateX(${combinedTranslateX}px) scale(${combinedScale})`,
          opacity: combinedOpacity,
        }}>
          {getLayout()}
        </div>
      )}
      
      {slide.layout === 'full-background-media' && (
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `translateX(${combinedTranslateX}px) scale(${combinedScale})`,
          opacity: combinedOpacity,
        }}>
          {getLayout()}
        </div>
      )}

      {/* Modern Slide Page Indicator */}
      <div style={{
        position: 'absolute',
        bottom: isPortrait ? 60 : 100,
        right: isPortrait ? 60 : 120,
        fontFamily,
        fontSize: 18,
        fontWeight: 800,
        color: theme.primary,
        background: theme.cardBg,
        backdropFilter: 'blur(10px)',
        padding: '6px 16px',
        borderRadius: 12,
        border: `1.5px solid ${theme.primary}`
      }}>
        {index + 1} / {totalSlides}
      </div>
    </AbsoluteFill>
  );
};

// End Page Component with Style Variations
const EndSlide: React.FC<{ endPage: VideoProps['endPage']; theme: Theme; fontFamily: string; disableAnimations?: boolean }> = ({ endPage, theme, fontFamily, disableAnimations }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const style = endPage.style || 'standard';
  const isPortrait = width < height;

  const entrance = disableAnimations
    ? 1
    : spring({ frame, fps, config: { damping: 12, stiffness: 100 } });

  const bgStyle: React.CSSProperties = endPage.theme.background.includes('gradient')
    ? { backgroundImage: endPage.theme.background }
    : { backgroundColor: endPage.theme.background };

  // 1. MINIMALIST STYLE
  if (style === 'minimalist') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", paddingLeft: isPortrait ? 60 : 120, opacity: entrance }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          maxWidth: "80%",
          textAlign: 'left',
          fontFamily,
          borderLeft: `8px solid ${theme.secondary}`,
          paddingLeft: isPortrait ? 25 : 40,
        }}>
          <h1 style={{ fontSize: isPortrait ? 50 : 76, fontWeight: 900, color: theme.primary, margin: 0, letterSpacing: -1 }}>
            <MarkdownText text={endPage.title} theme={theme} />
          </h1>
          {endPage.subtitle && (
            <p style={{ fontSize: isPortrait ? 20 : 28, fontWeight: 400, color: theme.text, marginTop: 15 }}>
              <MarkdownText text={endPage.subtitle} theme={theme} />
            </p>
          )}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10, fontSize: isPortrait ? 18 : 22, color: theme.secondary }}>
            {endPage.contact && <div>📞 {endPage.contact}</div>}
            {endPage.website && <div>🌐 {endPage.website}</div>}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 2. THUMBNAIL STYLE
  if (style === 'thumbnail') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center" }}>
        <BackgroundEffects theme={theme} />
        
        {/* Border Corners */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
          const isTop = pos.includes('top');
          const isLeft = pos.includes('left');
          return (
            <div key={pos} style={{ 
              position: 'absolute', 
              top: isTop ? 40 : 'auto', 
              bottom: isTop ? 'auto' : 40, 
              left: isLeft ? 40 : 'auto', 
              right: isLeft ? 'auto' : 40, 
              width: isPortrait ? 60 : 120, 
              height: isPortrait ? 60 : 120, 
              borderLeft: isLeft ? `8px solid ${theme.primary}` : 'none',
              borderRight: isLeft ? 'none' : `8px solid ${theme.primary}`,
              borderTop: isTop ? `8px solid ${theme.primary}` : 'none',
              borderBottom: isTop ? 'none' : `8px solid ${theme.primary}`,
            }} />
          );
        })}

        <div style={{
          transform: `scale(${entrance})`,
          textAlign: "center",
          fontFamily,
          zIndex: 10,
          padding: isPortrait ? "40px 30px" : "60px 80px",
          background: 'rgba(0,0,0,0.4)',
          borderRadius: isPortrait ? 24 : 40,
          border: `6px solid ${theme.primary}`,
          boxShadow: `${isPortrait ? 10 : 20}px ${isPortrait ? 10 : 20}px 0px rgba(0,0,0,0.5)`,
          maxWidth: "85%",
        }}>
          <h1 style={{ fontSize: isPortrait ? 48 : 80, fontWeight: 900, color: theme.primary, margin: 0, textShadow: `6px 6px 0px ${theme.background}`, textTransform: 'uppercase' }}>
            <MarkdownText text={endPage.title} theme={theme} />
          </h1>
          {endPage.subtitle && (
            <p style={{ fontSize: isPortrait ? 18 : 24, fontWeight: 800, color: theme.secondary, letterSpacing: isPortrait ? 2 : 4, textTransform: 'uppercase', marginTop: 15 }}>
              <MarkdownText text={endPage.subtitle} theme={theme} />
            </p>
          )}
          <div style={{ height: 2, background: theme.border, width: 100, margin: '25px auto' }} />
          <div style={{ fontSize: isPortrait ? 18 : 24, color: theme.text, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {endPage.contact && <div>{endPage.contact}</div>}
            {endPage.website && <div style={{ color: theme.accent, fontWeight: 900 }}>{endPage.website}</div>}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 3. GLASSMORPHIC STYLE
  if (style === 'glassmorphic') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center" }}>
        <BackgroundEffects theme={theme} />
        
        {/* Pulsing backglow */}
        <div style={{
          position: 'absolute',
          width: isPortrait ? 300 : 500,
          height: isPortrait ? 300 : 500,
          borderRadius: '50%',
          background: theme.primary,
          filter: 'blur(150px)',
          opacity: 0.2,
          zIndex: 5,
        }} />

        <div style={{
          transform: `scale(${entrance})`,
          textAlign: "center",
          fontFamily,
          zIndex: 10,
          padding: isPortrait ? "50px 30px" : "70px 90px",
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: "blur(60px)",
          borderRadius: isPortrait ? 30 : 50,
          border: `2px solid rgba(255,255,255,0.25)`,
          boxShadow: `0 40px 80px rgba(0,0,0,0.45)`,
          maxWidth: "85%",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 25,
        }}>
          <div>
            <h1 style={{ fontSize: isPortrait ? 64 : 76, fontWeight: 900, color: theme.primary, margin: 0 }}>
              <MarkdownText text={endPage.title} theme={theme} />
            </h1>
            {endPage.subtitle && (
              <p style={{ fontSize: isPortrait ? 28 : 22, fontWeight: 700, color: theme.secondary, marginTop: 10 }}>
                <MarkdownText text={endPage.subtitle} theme={theme} />
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '100%' }}>
            {endPage.contact && (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: isPortrait ? '12px 20px' : '12px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', fontSize: isPortrait ? 24 : 22, color: theme.text }}>
                {endPage.contact}
              </div>
            )}
            {endPage.website && (
              <div style={{ fontSize: isPortrait ? 24 : 20, color: theme.accent, fontWeight: 900 }}>
                {endPage.website}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 4. BOLD-BRUTALISM STYLE
  if (style === 'bold-brutalism') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center" }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          transform: `scale(${entrance}) rotate(1deg)`,
          textAlign: "left",
          fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          zIndex: 10,
          padding: isPortrait ? "40px 30px" : "60px 80px",
          background: theme.accent,
          color: theme.background,
          border: `${isPortrait ? '6px' : '10px'} solid ${theme.text}`,
          boxShadow: `${isPortrait ? '12px' : '20px'} ${isPortrait ? '12px' : '20px'} 0px ${theme.text}`,
          maxWidth: "85%",
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <h1 style={{
            fontSize: isPortrait ? 50 : 90,
            fontWeight: 900,
            margin: 0,
            lineHeight: 0.9,
            letterSpacing: -1,
            textTransform: 'uppercase',
            color: theme.background,
          }}>
            <MarkdownText text={endPage.title} theme={theme} primaryColor={theme.accent} />
          </h1>
          {endPage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 18 : 28,
              fontWeight: 800,
              color: theme.background,
              margin: 0,
              textTransform: 'uppercase',
            }}>
              <MarkdownText text={endPage.subtitle} theme={theme} primaryColor={theme.accent} />
            </p>
          )}
          <div style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontSize: isPortrait ? 18 : 24,
            fontWeight: 800,
            fontFamily,
            color: theme.background,
            borderTop: `4px solid ${theme.background}`,
            paddingTop: 15,
          }}>
            {endPage.contact && <div>📞 {endPage.contact}</div>}
            {endPage.website && <div style={{ textTransform: 'lowercase' }}>🌐 {endPage.website}</div>}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 5. CYBERPUNK-NEON STYLE
  if (style === 'cyberpunk-neon') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center" }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(244, 114, 182, 0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(244, 114, 182, 0.08) 2px, transparent 2px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }} />
        <div style={{
          transform: `scale(${entrance})`,
          textAlign: "center",
          fontFamily: "monospace, Courier, 'Courier New'",
          zIndex: 10,
          padding: isPortrait ? "50px 30px" : "70px 90px",
          background: 'rgba(5, 5, 15, 0.9)',
          borderRadius: 8,
          border: `3px solid ${theme.primary}`,
          boxShadow: `0 0 30px ${theme.primary}, inset 0 0 15px rgba(255,255,255,0.05)`,
          maxWidth: "85%",
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: -5, left: -5, width: 25, height: 25, borderTop: `6px solid ${theme.accent}`, borderLeft: `6px solid ${theme.accent}` }} />
          <div style={{ position: 'absolute', top: -5, right: -5, width: 25, height: 25, borderTop: `6px solid ${theme.accent}`, borderRight: `6px solid ${theme.accent}` }} />
          <div style={{ position: 'absolute', bottom: -5, left: -5, width: 25, height: 25, borderBottom: `6px solid ${theme.accent}`, borderLeft: `6px solid ${theme.accent}` }} />
          <div style={{ position: 'absolute', bottom: -5, right: -5, width: 25, height: 25, borderBottom: `6px solid ${theme.accent}`, borderRight: `6px solid ${theme.accent}` }} />
          
          <h1 style={{
            fontSize: isPortrait ? 44 : 70,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.1,
            color: theme.text,
            letterSpacing: isPortrait ? -1 : -2,
            textShadow: `0 0 15px ${theme.primary}`,
            textTransform: 'uppercase',
          }}>
            <MarkdownText text={endPage.title} theme={theme} />
          </h1>
          
          {endPage.subtitle && (
            <p style={{
              fontSize: isPortrait ? 14 : 20,
              fontWeight: 400,
              color: theme.secondary,
              marginTop: 20,
              letterSpacing: 2,
            }}>
              // <MarkdownText text={endPage.subtitle} theme={theme} />
            </p>
          )}

          <div style={{ height: 2, background: theme.primary, width: 150, margin: '30px auto', opacity: 0.5 }} />

          <div style={{
            fontSize: isPortrait ? 16 : 20,
            color: theme.accent,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            textShadow: `0 0 8px ${theme.accent}`,
          }}>
            {endPage.contact && <div>&gt; {endPage.contact}</div>}
            {endPage.website && <div>&gt; {endPage.website}</div>}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 6. EDITORIAL-SERIF STYLE
  if (style === 'editorial-serif') {
    return (
      <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", paddingLeft: isPortrait ? 40 : 160, paddingRight: isPortrait ? 40 : 160 }}>
        <BackgroundEffects theme={theme} />
        <div style={{
          maxWidth: "85%",
          textAlign: 'left',
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
          opacity: entrance,
        }}>
          <h1 style={{
            fontSize: isPortrait ? 48 : 80,
            fontWeight: 300,
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.1,
            color: theme.text,
          }}>
            <MarkdownText text={endPage.title} theme={theme} />
          </h1>
          {endPage.subtitle && (
            <p style={{
              fontFamily,
              fontSize: isPortrait ? 18 : 22,
              fontWeight: 400,
              color: theme.secondary,
              marginTop: 20,
              letterSpacing: 1,
            }}>
              <MarkdownText text={endPage.subtitle} theme={theme} />
            </p>
          )}

          <div style={{ marginTop: 40, borderTop: `1px solid ${theme.primary}50`, paddingTop: 30, display: 'flex', flexDirection: 'column', gap: 15, fontFamily, fontSize: isPortrait ? 18 : 20, color: theme.primary }}>
            {endPage.contact && <div>{endPage.contact}</div>}
            {endPage.website && <div style={{ fontWeight: 800 }}>{endPage.website}</div>}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 7. SPLIT-REVEAL STYLE
  if (style === 'split-reveal') {
    const leftWidth = isPortrait ? '100%' : '45%';
    const rightWidth = isPortrait ? '100%' : '55%';
    const leftHeight = isPortrait ? '35%' : '100%';
    const rightHeight = isPortrait ? '65%' : '100%';
    const splitDirection = isPortrait ? 'column' : 'row';

    return (
      <AbsoluteFill style={{ ...bgStyle, display: 'flex', flexDirection: splitDirection }}>
        {/* Left Side: Solid Accent Block */}
        <div style={{
          width: leftWidth,
          height: leftHeight,
          background: theme.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
          position: 'relative',
          transform: isPortrait 
            ? `translateY(${interpolate(entrance, [0, 1], [-100, 0])}%)`
            : `translateX(${interpolate(entrance, [0, 1], [-100, 0])}%)`,
          boxShadow: '10px 0 30px rgba(0,0,0,0.3)',
          zIndex: 15,
        }}>
          <div style={{
            fontFamily,
            fontSize: isPortrait ? 30 : 48,
            fontWeight: 900,
            color: theme.background,
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: 4,
            lineHeight: 1,
          }}>
            THANK YOU
          </div>
        </div>

        {/* Right Side: End Page Details */}
        <div style={{
          width: rightWidth,
          height: rightHeight,
          background: theme.background,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isPortrait ? 30 : 80,
          transform: isPortrait
            ? `translateY(${interpolate(entrance, [0, 1], [100, 0])}%)`
            : `translateX(${interpolate(entrance, [0, 1], [100, 0])}%)`,
          zIndex: 10,
        }}>
          <BackgroundEffects theme={theme} />
          <div style={{ zIndex: 12 }}>
            <h1 style={{
              fontFamily,
              fontSize: isPortrait ? 44 : 64,
              fontWeight: 900,
              color: theme.text,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}>
              <MarkdownText text={endPage.title} theme={theme} />
            </h1>
            {endPage.subtitle && (
              <p style={{
                fontFamily,
                fontSize: isPortrait ? 18 : 20,
                fontWeight: 600,
                color: theme.secondary,
                marginTop: 15,
              }}>
                <MarkdownText text={endPage.subtitle} theme={theme} />
              </p>
            )}
            <div style={{
              marginTop: 35,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontFamily,
              fontSize: isPortrait ? 16 : 18,
              color: theme.primary,
            }}>
              {endPage.contact && <div>📞 {endPage.contact}</div>}
              {endPage.website && <div>🌐 {endPage.website}</div>}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // 4. STANDARD STYLE (Fallback)
  return (
    <AbsoluteFill style={{ ...bgStyle, justifyContent: "center", alignItems: "center" }}>
      <BackgroundEffects theme={theme} />
      <div style={{
        transform: `scale(${interpolate(entrance, [0, 1], [0.85, 1])})`,
        opacity: entrance,
        textAlign: "center",
        fontFamily,
        zIndex: 10,
        padding: "70px 90px",
        background: theme.cardBg,
        backdropFilter: "blur(40px)",
        borderRadius: 50,
        border: `6px solid ${theme.primary}`,
        boxShadow: `0 30px 60px rgba(0, 0, 0, 0.45)`,
        maxWidth: "80%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}>
        <div>
          <h1 style={{ 
            fontSize: 76, 
            fontWeight: 900, 
            margin: 0, 
            lineHeight: 1.1, 
            color: theme.primary,
            letterSpacing: -2,
            textShadow: `6px 6px 0px ${theme.background}`,
          }}>
            <MarkdownText text={endPage.title} theme={theme} />
          </h1>
          {endPage.subtitle && (
            <p style={{
              fontSize: 24,
              fontWeight: 800,
              color: endPage.theme.subtitleColor || theme.secondary,
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginTop: 15,
            }}>
              <MarkdownText text={endPage.subtitle} theme={theme} />
            </p>
          )}
        </div>

        <div style={{ height: 2, background: theme.border, width: 150, opacity: 0.5 }} />

        {endPage.contact && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '14px 28px',
            borderRadius: 20,
            border: `2px solid ${theme.primary}`,
            fontSize: 26,
            fontWeight: 700,
            color: theme.text,
          }}>
            {endPage.contact}
          </div>
        )}

        {endPage.website && (
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            color: theme.accent,
            letterSpacing: 1,
            textTransform: 'lowercase',
          }}>
            {endPage.website}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Main Video Assembler
export const Video: React.FC<VideoProps> = (config) => {
  const { video, audio, branding, titlePage, slides, endPage } = config;
  const { fps } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  const totalDuration = useVideoConfig().durationInFrames;

  // Resolve Theme: use specified themeName from config, fallback to royal-indigo
  const activeThemeName = video.themeName || "royal-indigo";
  const defaultTheme = THEMES[activeThemeName] || THEMES["royal-indigo"];
  
  // Merge resolved theme with custom theme overrides from config
  const theme = {
    ...defaultTheme,
    ...video.theme
  } as Theme;

  // Resolve Custom Typography
  const resolvedFontFamily = video.fontFamily && FONTS[video.fontFamily.toLowerCase()] 
    ? FONTS[video.fontFamily.toLowerCase()] 
    : fontFamily;
  
  const resolvedFontWeight = video.fontWeight || "600";

  // Background Audio Fade-in / Fade-out interpolation
  const fadeInFrames = (audio.fadeInInSeconds ?? 2) * fps;
  const fadeOutFrames = (audio.fadeOutInSeconds ?? 2) * fps;
  
  let musicVolume = audio.volume ?? 0.1;
  
  if (currentFrame < fadeInFrames && fadeInFrames > 0) {
    // Fade in at start
    musicVolume = interpolate(
      currentFrame,
      [0, fadeInFrames],
      [0, audio.volume ?? 0.1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (currentFrame >= totalDuration - fadeOutFrames && fadeOutFrames > 0) {
    // Fade out at end
    musicVolume = interpolate(
      currentFrame,
      [totalDuration - fadeOutFrames, totalDuration - 5],
      [audio.volume ?? 0.1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      {/* Background Audio */}
      {audio.musicPath && (
        <Audio 
          src={staticFile(audio.musicPath)} 
          volume={musicVolume} 
          loop={audio.loop} 
        />
      )}

      {/* Global Logo/Branding Overlays */}
      <BrandingOverlay
        branding={branding}
        theme={theme}
        currentFrame={currentFrame}
        totalDuration={totalDuration}
        fps={fps}
        titleShow={titlePage.show}
        titleSecs={titlePage.durationInSeconds}
        endShow={endPage.show}
        endSecs={endPage.durationInSeconds}
      />

      {/* Dynamic Progress Bar Overlay */}
      {video.progressBar?.show && (
        <ProgressBar
          show={video.progressBar.show}
          position={video.progressBar.position || 'bottom'}
          color={video.progressBar.color}
          height={video.progressBar.height}
          theme={theme}
          currentFrame={currentFrame}
          totalDuration={totalDuration}
        />
      )}

      {/* Dynamic Slide Sequencing using Absolute Timeline Positioning */}
      {titlePage.show && (
        <Sequence 
          from={0} 
          durationInFrames={Math.round(titlePage.durationInSeconds * fps)}
        >
          <TitleSlide titlePage={titlePage} theme={theme} fontFamily={resolvedFontFamily} disableAnimations={video.disableAnimations} />
        </Sequence>
      )}
      
      {slides.map((slide, index) => (
        <Sequence 
          key={slide.id} 
          from={Math.round((slide.startTime ?? 0) * fps)} 
          durationInFrames={Math.round(slide.durationInSeconds * fps)}
        >
          <ContentSlide slide={slide} index={index} totalSlides={slides.length} theme={theme} fontFamily={resolvedFontFamily} fontWeight={resolvedFontWeight} disableAnimations={video.disableAnimations} />
        </Sequence>
      ))}

      {endPage.show && (
        <Sequence 
          from={Math.round((endPage.startTime ?? 186.0) * fps)} 
          durationInFrames={Math.round(endPage.durationInSeconds * fps)}
        >
          <EndSlide endPage={endPage} theme={theme} fontFamily={resolvedFontFamily} disableAnimations={video.disableAnimations} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
