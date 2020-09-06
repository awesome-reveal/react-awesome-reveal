/** @jsx jsx */
import * as React from "react";
import { Interpolation, jsx } from "@emotion/core";
import { Keyframes } from "@emotion/serialize";
import { isFragment } from "react-is";
import { InView } from "react-intersection-observer";

// Animations
import fadeInLeft from "./animations/fading_entrances/fadeInLeft";

// Utils
import { getAnimationCss } from "./utils/animations";

export interface RevealProps {
  /**
   * Stagger its children animations.
   * @default false
   */
  cascade?: boolean;
  /**
   * Factor that affects the delay that each animated element in a cascade animation will be assigned.
   * @default 0.5
   */
  damping?: number;
  /**
   * Initial delay, in milliseconds.
   * @default 0
   */
  delay?: number;
  /**
   * Animation duration, in milliseconds.
   * @default 1000
   */
  duration?: number;
  /**
   * Float number between 0 and 1 indicating how much the element should be in viewport before the animation is triggered.
   * @default 0
   */
  fraction?: number;
  /**
   * Custom Emotion animation keyframes.
   */
  keyframes?: Keyframes;
  /**
   * Specifies if the animation should run only once or everytime the element enters/exits/re-enters the viewport.
   * @default false
   */
  triggerOnce?: boolean;
  /**
   * Custom Emotion styles.
   */
  css?: Interpolation;
  /**
   * Class names to add to the container element.
   */
  className?: string;
  /**
   * Inline styles to add to the container element.
   */
  style?: React.CSSProperties;
  /**
   * Class names to add to the child element.
   */
  childClassName?: string;
  /**
   * Inline styles to add to the child element.
   */
  childStyle?: React.CSSProperties;
}

const Reveal: React.FC<RevealProps> = ({
  cascade = false,
  damping = 0.5,
  delay = 0,
  duration = 1000,
  fraction = 0,
  keyframes = fadeInLeft,
  triggerOnce = false,
  css,
  className,
  style,
  childClassName,
  childStyle,
  children
}) => {
  function makeAnimated(nodes: React.ReactNode): React.ReactNode {
    if (!nodes) {
      return null;
    }

    if (typeof nodes === "string") {
      return makeAnimatedText(nodes);
    }

    if (isFragment(nodes)) {
      return (
        <InView threshold={fraction} triggerOnce={triggerOnce}>
          {({ inView, ref }) => (
            <div
              ref={ref}
              css={
                inView
                  ? [css, getAnimationCss({ keyframes, delay, duration })]
                  : { opacity: 0 }
              }
              className={className}
              style={style}
            >
              {nodes}
            </div>
          )}
        </InView>
      );
    }

    return React.Children.map(nodes, (node, index) => {
      const nodeElement = node as React.ReactElement;
      const nodeCss: Interpolation[] = nodeElement.props.css
        ? [nodeElement.props.css]
        : [];

      nodeCss.push(
        getAnimationCss({
          keyframes,
          delay: delay + (cascade ? index * duration * damping : 0),
          duration
        })
      );

      switch (nodeElement.type) {
        case "ol":
        case "ul":
          return React.cloneElement(
            nodeElement,
            { className, style },
            makeAnimated(nodeElement.props.children)
          );
        case "li":
          return (
            <InView threshold={fraction} triggerOnce={triggerOnce}>
              {({ inView, ref }) =>
                jsx(nodeElement.type, {
                  ...nodeElement.props,
                  ref,
                  css: inView ? [css, ...nodeCss] : { opacity: 0 },
                  className: childClassName,
                  style: childStyle
                })
              }
            </InView>
          );
        default:
          return (
            <InView threshold={fraction} triggerOnce={triggerOnce}>
              {({ inView, ref }) => (
                <div
                  ref={ref}
                  css={inView ? [css, ...nodeCss] : { opacity: 0 }}
                  className={className}
                  style={style}
                >
                  {React.cloneElement(nodeElement, {
                    className: childClassName,
                    style: childStyle
                  })}
                </div>
              )}
            </InView>
          );
      }
    });
  }

  function makeAnimatedText(text: string): React.ReactNode {
    const baseCss: Interpolation = {
      display: "inline-block",
      whiteSpace: "pre"
    };

    return (
      <InView threshold={fraction} triggerOnce={triggerOnce}>
        {({ inView, ref }) => (
          <div
            ref={ref}
            css={[css, baseCss]}
            className={className}
            style={style}
          >
            {text.split("").map((char, index) => {
              const textCss = inView
                ? getAnimationCss({
                    keyframes,
                    delay: delay + (cascade ? index * duration * damping : 0),
                    duration
                  })
                : { opacity: 0 };

              return (
                <span
                  key={index}
                  css={textCss}
                  className={childClassName}
                  style={childStyle}
                >
                  {char}
                </span>
              );
            })}
          </div>
        )}
      </InView>
    );
  }

  return <React.Fragment>{makeAnimated(children)}</React.Fragment>;
};

export default Reveal;
