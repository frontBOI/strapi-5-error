import * as React from 'react'

import { Font } from '@react-email/components'

export default function Fonts() {
  return (
    <>
      {/* Pour trouver des polices sur un CDN, go sur https://www.cdnfonts.com/manrope.font */}
      <Font
        fontFamily="Manrope"
        fallbackFontFamily="Verdana"
        webFont={{
          url: 'https://fonts.cdnfonts.com/s/16243/manrope-regular.woff',
          format: 'woff',
        }}
        fontWeight={400}
      />

      <Font
        fontFamily="Manrope"
        fallbackFontFamily="Verdana"
        webFont={{
          url: 'https://fonts.cdnfonts.com/s/16243/manrope-bold.woff',
          format: 'woff',
        }}
        fontWeight="bold"
      />
    </>
  )
}
