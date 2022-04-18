import { ClassNames, css, Interpolation, jsx, Theme } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";
import { Children, FC } from "react";
import { InView } from "react-intersection-observer";
import { isFragment } from "react-is";

import fadeInLeft from "./animations/fading_entrances/fadeInLeft";
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
   * React 18 requires children to be explicitly listed in props
   * https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-typescript-definitions
   */
  children? React.ReactNode;
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

const Reveal: FC<RevealProps> = ({
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
}) => {
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
            css={[revealCss, textBaseCss]}
            className={className}
            style={style}
          >
            {stringifiedChildren.split("").map((char, index) => (
              <span
                key={index}
                css={
                  inView
                    ? getAnimationCss({
                        keyframes,
                        delay: delay + index * duration * damping,
                        duration,
                      })
                    : hiddenCss
                }
                className={childClassName}
                style={childStyle}
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
            css={
              inView
                ? [revealCss, getAnimationCss({ keyframes, delay, duration })]
                : hiddenCss
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
    <>
      {Children.map(children, (node, index) => {
        const nodeElement = node as React.ReactElement;
        const nodeCss: Interpolation<Theme>[] = nodeElement.props.css
          ? [nodeElement.props.css]
          : [];

        nodeCss.push(
          getAnimationCss({
            keyframes,
            delay: delay + (cascade ? index * duration * damping : 0),
            duration,
          })
        );

        switch (nodeElement.type) {
          case "ol":
          case "ul":
            return (
              <ClassNames>
                {({ cx }) =>
                  jsx(
                    nodeElement.type,
                    {
                      ...nodeElement.props,
                      className: cx(className, nodeElement.props.className),
                      style: { ...style, ...nodeElement.props.style },
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
                        css: revealCss,
                        childClassName,
                        childStyle,
                      }}
                    >
                      {nodeElement.props.children}
                    </Reveal>
                  )
                }
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
                    {({ cx }) =>
                      jsx(nodeElement.type, {
                        ...nodeElement.props,
                        ref,
                        css: inView ? [revealCss, ...nodeCss] : hiddenCss,
                        className: cx(
                          childClassName,
                          nodeElement.props.className
                        ),
                        style: { ...childStyle, ...nodeElement.props.style },
                      })
                    }
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
                    css={inView ? [revealCss, ...nodeCss] : hiddenCss}
                    className={className}
                    style={style}
                  >
                    <ClassNames>
                      {({ cx }) =>
                        jsx(nodeElement.type, {
                          ...nodeElement.props,
                          className: cx(
                            childClassName,
                            nodeElement.props.className
                          ),
                          style: { ...childStyle, ...nodeElement.props.style },
                        })
                      }
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

export default Reveal;
