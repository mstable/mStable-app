import React, { FC, useEffect, useRef } from 'react'
import Jazzicon from 'jazzicon'
import styled from 'styled-components'

import { useWalletAddress } from '../../context/AccountProvider'

const Container = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 0.75rem;
`

export const UserIcon: FC = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const address = useWalletAddress()

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(20, parseInt(address.slice(2, 10), 16)))
    }
  }, [address])

  return <Container ref={ref} />
}
