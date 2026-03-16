import { useEffect, useState, useRef } from 'react'

export function useReveal(options = {}) {
  const [el, setEl] = useState(null)

  useEffect(() => {
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          if (options.once !== false) observer.unobserve(el)
        }
      },
      { threshold: options.threshold || 0.15, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [el])

  return setEl
}

export function useRevealGroup(count, options = {}) {
  const refs = Array.from({ length: count }, () => useRef(null))

  useEffect(() => {
    refs.forEach((ref, i) => {
      const el = ref.current
      if (!el) return
      el.style.transitionDelay = `${i * (options.stagger || 0.1)}s`

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('visible')
            observer.unobserve(el)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(el)
    })
  }, [])

  return refs
}
