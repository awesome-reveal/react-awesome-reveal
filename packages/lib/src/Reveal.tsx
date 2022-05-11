import type { Interpolation, Theme } from "@emotion/react";
import { ClassNames, css } from "@emotion/react";
import type { Keyframes } from "@emotion/serialize";
import { Children, isValidElement } from "react";
import { InView } from "react-intersection-observer";
import { isFragment } from "react-is";

import { fadeInLeft } from "./animations/fading_entrances";
import { getAnimationCss } from "./utils/animations";
import { isNullOrUndefined, isStringLike } from "./utils/js-types";

const hiddenCss = css`
  opacity: 0;
`;

const textBaseCss = css`
  display: inline-block;
  white-space: pre;
`;

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
   * From React 18, children must be explicitly typed.
   * @see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-typescript-definitions
   */
  children?: React.ReactNode;
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

export const Reveal: React.FC<RevealProps> = (props) => {
  const {
    cascade = false,
    damping = 0.5,
    delay = 0,
    duration = 1000,
    fraction = 0,
    keyframes = fadeInLeft,
    triggerOnce = false,
    css: revealCss,
    className,
    style,
    childClassName,
    childStyle,
    children,
    onVisibilityChange,
  } = props;

  if (isNullOrUndefined(children)) {
    return null;
  }

  if (isStringLike(children)) {
    const stringifiedChildren = String(children);

    return cascade ? (
      <InView
        threshold={fraction}
        triggerOnce={triggerOnce}
        onChange={onVisibilityChange}
      >
        {({ inView, ref }) => (
          <div
            ref={ref}
            className={className}
            css={[revealCss, textBaseCss]}
            style={style}
          >
            {stringifiedChildren.split("").map((char, index) => (
              <span
                key={index}
                className={className}
                css={
                  inView
                    ? getAnimationCss({
                        keyframes,
                        delay: delay + index * duration * damping,
                        duration,
                      })
                    : hiddenCss
                }
              >
                {char}
              </span>
            ))}
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
          css: revealCss,
          className,
          style,
        }}
      >
        {stringifiedChildren}
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
            className={className}
            css={
              inView
                ? [revealCss, getAnimationCss({ keyframes, delay, duration })]
                : hiddenCss
            }
            style={style}
          >
            {children}
          </div>
        )}
      </InView>
    );
  }

  return (
    <>
      {Children.map(children, (node, index) => {
        if (!isValidElement(node)) return null;

        const nodeCss: Interpolation<Theme>[] = node.props.css
          ? [node.props.css]
          : [];

        nodeCss.push(
          getAnimationCss({
            keyframes,
            delay: delay + (cascade ? index * duration * damping : 0),
            duration,
          })
        );

        switch (node.type) {
          case "ol":
          case "ul":
            return (
              <ClassNames>
                {({ cx }) => (
                  <node.type
                    {...node.props}
                    className={cx(className, node.props.className)}
                    style={{ ...style, ...node.props.style }}
                  >
                    <Reveal
                      {...{
                        cascade,
                        damping,
                        delay,
                        duration,
                        fraction,
                        keyframes,
                        triggerOnce,
                        css: revealCss,
                        childClassName,
                        childStyle,
                      }}
                    >
                      {node.props.children}
                    </Reveal>
                  </node.type>
                )}
              </ClassNames>
            );
          case "li":
            return (
              <InView
                threshold={fraction}
                triggerOnce={triggerOnce}
                onChange={onVisibilityChange}
              >
                {({ inView, ref }) => (
                  <ClassNames>
                    {({ cx }) => (
                      <node.type
                        {...node.props}
                        ref={ref}
                        className={cx(childClassName, node.props.className)}
                        css={inView ? [revealCss, ...nodeCss] : hiddenCss}
                        style={{ ...childStyle, ...node.props.style }}
                      />
                    )}
                  </ClassNames>
                )}
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
                    className={className}
                    css={inView ? [revealCss, ...nodeCss] : hiddenCss}
                    style={style}
                  >
                    <ClassNames>
                      {({ cx }) => (
                        <node.type
                          {...node.props}
                          className={cx(childClassName, node.props.className)}
                          style={{ ...childStyle, ...node.props.style }}
                        />
                      )}
                    </ClassNames>
                  </div>
                )}
              </InView>
            );
        }
      })}
    </>
  );
};
