/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Keyframes } from "@emotion/serialize";
import { isFragment } from "react-is";
import { useInView } from "react-intersection-observer";

// Animations
import fadeInUp from "./animations/fading_entrances/fadeInUp";

// Utils
import { getAnimationCss } from "./utils/animations";

export interface RevealProps {
  /**
   * Custom Emotion animation.
   */
  animation?: Keyframes;
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
   * Specifies if the animation should run only once or everytime the element enters/exits/re-enters the viewport.
   * @default false
   */
  triggerOnce?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const Reveal: React.FC<RevealProps> = ({
  animation = fadeInUp,
  cascade = false,
  damping = 0.5,
  delay = 0,
  duration = 1000,
  fraction = 0,
  triggerOnce = false,
  children
}) => {
  const [ref, inView] = useInView({ threshold: fraction, triggerOnce });

  function makeAnimated(nodes: React.ReactNode): React.ReactNode {
    if (!nodes) {
      return null;
    }

    if (typeof nodes === "string") {
      return makeAnimatedText(nodes);
    }

    if (isFragment(nodes)) {
      return jsx(
        "div",
        {
          css: getAnimationCss({ keyframes: animation, delay })
        },
        nodes
      );
    }

    return React.Children.map(nodes, (node, index) => {
      const childElement = node as React.ReactElement;
      const css = childElement.props?.css ? [childElement.props?.css] : [];

      if (inView) {
        css.push(
          getAnimationCss({
            keyframes: animation,
            delay: delay + (cascade ? index * duration * damping : 0),
            duration
          })
        );
      } else {
        css.push({ opacity: 0 });
      }

      switch (childElement.type) {
        case "ol":
        case "ul":
          return jsx(
            childElement.type,
            childElement.props,
            makeAnimated(childElement.props.children)
          );
        case "li":
          css.push(
            getAnimationCss({
              delay: delay + index * duration * damping
            })
          );
          return jsx(
            childElement.type,
            { ...childElement.props, css },
            childElement.props.children
          );
        default:
          return jsx(
            childElement.type,
            { ...childElement.props, css },
            childElement.props.children
          );
      }
    });
  }

  function makeAnimatedText(text: string): React.ReactNode {
    const baseCss = css`
      display: inline-block;
      white-space: pre;
    `;

    return cascade
      ? text.split("").map((char, index) => (
          <span
            key={index}
            css={[
              baseCss,
              getAnimationCss({
                keyframes: animation,
                delay: delay + index * duration * damping,
                duration
              })
            ]}
          >
            {char}
          </span>
        ))
      : jsx(
          "div",
          {
            css: getAnimationCss({
              keyframes: animation,
              delay,
              duration
            })
          },
          text
        );
  }

  return <div ref={ref}>{makeAnimated(children)}</div>;
};
