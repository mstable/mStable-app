import { emojisplosion, defaultPhysics, EmojisplosionSettings } from 'emojisplosion'
import { MutableRefObject, useCallback } from 'react'

export const useEmojisplosion = (
  ref: MutableRefObject<HTMLElement | undefined>,
  settings?: Partial<EmojisplosionSettings>,
): (() => void) => {
  return useCallback(() => {
    if (ref.current) {
      const { x, y, width, height } = ref.current?.getBoundingClientRect()

      emojisplosion({
        physics: {
          ...defaultPhysics,
          ...settings?.physics,
        },
        position: {
          x: x + width / 2,
          y: y + height / 2,
          ...settings?.position,
        },
        ...settings,
      })
    }
  }, [ref, settings])
}
