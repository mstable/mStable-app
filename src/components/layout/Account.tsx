import React, { FC } from 'react'

import { useAccountOpen } from '../../context/AppProvider'
import { Wallet } from '../wallet/Wallet'

export const Account: FC = () => {
  const accountOpen = useAccountOpen()
  return accountOpen ? <Wallet /> : null
}
