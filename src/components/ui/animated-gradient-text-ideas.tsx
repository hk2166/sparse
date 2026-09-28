import { AnimatedGradientText } from "@/registry/magicui/animated-gradient-text";

export function AnimatedGradientTextDemo() {
  return (
    <AnimatedGradientText
      speed={2}
      colorFrom="#f70818"
      colorTo="#72061c"
      className="text-4xl font-semibold tracking-tight"
    >
      Fast Gradient
    </AnimatedGradientText>
  )
}
