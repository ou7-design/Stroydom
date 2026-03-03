"use client"

import { useEffect, useRef } from "react"

interface AnimatedTextProps {
  text: string
  fontSize?: number
  minWeight?: number
  maxWeight?: number
  animationDuration?: number
  delayMultiplier?: number
}

export function AnimatedText({
  text,
  fontSize = 150,
  minWeight = 0,
  maxWeight = 840,
  animationDuration = 1.5,
  delayMultiplier = 0.25,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const spans = containerRef.current.querySelectorAll("span")
    const numLetters = spans.length

    spans.forEach((span, i) => {
      const mappedIndex = i - numLetters / 2
      span.style.animationDelay = mappedIndex * delayMultiplier + "s"
    })
  }, [text, delayMultiplier])

  const characters = text.split("").map((char, index) => (
      <span
      key={index}
      aria-hidden="true"
      className="md:animate-[breath_1.5s_alternate_infinite_cubic-bezier(0.37,0,0.63,1)]"
      style={{
        animationFillMode: "both",
        fontVariationSettings: `"wght" ${minWeight}`,
        display: "inline-block",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ))

  return (
    <div className="flex justify-center items-center">
      <p
        ref={containerRef}
        aria-label={text}
        className="font-sans m-0 leading-none"
        style={{
          fontSize: `${fontSize}px`,
          fontFeatureSettings: '"wght"',
        }}
      >
        {characters}
      </p>
    </div>
  )
}
