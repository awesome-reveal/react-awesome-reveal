/** @jsx jsx */
import * as React from "react";
import { Interpolation, Theme, jsx } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";
import { InView } from "react-intersection-observer";

// Animations
import fadeInLeft from "./animations/fading_entrances/fadeInLeft";

// Utils
import { getAnimationCss } from "./utils/animations";
import { classnames } from "./utils/classnames";
import { isEmpty, isFragment, isStringLike } from "./utils/react-is";

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
  css?: Interpolation<Theme>;
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
  /**
   * Callback executed when the element enters or leaves the viewport.
   * If more than one element is being animated, this function is called
   * on each element.
   *
   * @param inView The current visibility flag.
   * @param entry The current IntersectionObserverEntry.
   */
  onVisibilityChange?(inView: boolean, entry: IntersectionObserverEntry): void;
}

export const Reveal: React.FC<RevealProps> = ({
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
  children,
  onVisibilityChange
}) => {
  if (isEmpty(children)) {
    return null;
  }

  if (isStringLike(children)) {
    const baseCss: Interpolation<Theme> = {
      display: "inline-block",
      whiteSpace: "pre"
    };

    return cascade ? (
      <InView
        threshold={fraction}
        triggerOnce={triggerOnce}
        onChange={onVisibilityChange}
      >
        {({ inView, ref }) => (
          <div
            ref={ref}
            css={[css, baseCss]}
            className={className}
            style={style}
          >
            {String(children)
              .split("")
              .map((char, index) => {
                const textCss = inView
                  ? getAnimationCss({
                      keyframes,
                      delay: delay + index * duration * damping,
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
    ) : (
      <Reveal
        {...{
          delay,
          duration,
          fraction,
          keyframes,
          triggerOnce,
          css,
          className,
          style
        }}
      >
        <React.Fragment>{String(children)}</React.Fragment>
      </Reveal>
    );
  }

  if (isFragment(children)) {
    return (
      <InView
        threshold={fraction}
        triggerOnce={triggerOnce}
        onChange={onVisibilityChange}
      >
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
            {children}
          </div>
        )}
      </InView>
    );
  }

  return (
    <React.Fragment>
      {React.Children.map(children, (node, index) => {
        const nodeElement = node as React.ReactElement;
        const nodeCss: Interpolation<Theme>[] = nodeElement.props.css
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
              {
                className: classnames(className, nodeElement.props.className),
                style: { ...style, ...nodeElement.props.style }
              },
              <Reveal
                {...{
                  cascade,
                  damping,
                  delay,
                  duration,
                  fraction,
                  keyframes,
                  triggerOnce,
                  css,
                  childClassName,
                  childStyle
                }}
              >
                {nodeElement.props.children}
              </Reveal>
            );
          case "li":
            return (
              <InView
                threshold={fraction}
                triggerOnce={triggerOnce}
                onChange={onVisibilityChange}
              >
                {({ inView, ref }) =>
                  jsx(nodeElement.type, {
                    ...nodeElement.props,
                    ref,
                    css: inView ? [css, ...nodeCss] : { opacity: 0 },
                    className: classnames(
                      childClassName,
                      nodeElement.props.className
                    ),
                    style: { ...childStyle, ...nodeElement.props.style }
                  })
                }
              </InView>
            );
          default:
            return (
              <InView
                threshold={fraction}
                triggerOnce={triggerOnce}
                onChange={onVisibilityChange}
              >
                {({ inView, ref }) => (
                  <div
                    ref={ref}
                    css={inView ? [css, ...nodeCss] : { opacity: 0 }}
                    className={className}
                    style={style}
                  >
                    {React.cloneElement(nodeElement, {
                      className: classnames(
                        childClassName,
                        nodeElement.props.className
                      ),
                      style: { ...childStyle, ...nodeElement.props.style }
                    })}
                  </div>
                )}
              </InView>
            );
        }
      })}
    </React.Fragment>
  );
};
