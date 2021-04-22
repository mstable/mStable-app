import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useClipboard } from 'use-clipboard-copy'
import { useLocation, useHistory } from 'react-router-dom'

import { useAccount, useIsMasquerading, useMasquerade } from '../../../../context/AccountProvider'
import { ExplorerLink } from '../../../core/ExplorerLink'
import { Button } from '../../../core/Button'
import { AddressInput } from './AddressInput'
import { useCurrentStakingRewardsContract } from '../StakingRewardsContractProvider'
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider'

const Input = styled.div`
  display: flex;
  padding: 8px 0;

  button {
    margin-left: 8px;
  }
`

const Form = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  width: 100%;
  padding-bottom: 32px;
  text-align: center;
  font-size: 12px;

  button {
    font-size: 10px;
    line-height: 100%;
  }
`

export const ViewAs: FC<{}> = () => {
  const { copy, copied } = useClipboard({ copiedTimeout: 1500 })
  const stakingRewards = useCurrentStakingRewardsContract()
  const account = useAccount()
  const isMasquerading = useIsMasquerading()
  const masquerade = useMasquerade()
  const { pathname } = useLocation()
  const history = useHistory()
  const [address, setAddress] = useState<string | undefined>()
  const massetName = useSelectedMassetName()

  const earnUrl = stakingRewards?.earnUrl

  const handleMasquerade = useCallback(() => {
    if (address) {
      masquerade(address)
    }
  }, [masquerade, address])

  const handleResetMasquerade = useCallback(() => {
    // Redirect to the normal path if needed
    if (account) {
      const index = pathname.indexOf(`/${account}`)
      if (index > 0) {
        history.push(pathname.slice(0, index))
      }
    }

    // Stop masquerading
    masquerade()
  }, [history, account, masquerade, pathname])

  const handleShare = useCallback(() => {
    if (earnUrl && account) {
      copy(`${window.location.host}/${massetName}${earnUrl}/${account}`)
    }
  }, [account, copy, earnUrl, massetName])

  return (
    <Container>
      {account ? (
        isMasquerading ? (
          <>
            Viewing balances as <ExplorerLink data={account} type="account" showData />
          </>
        ) : (
          <Button onClick={handleShare} title="Share my balances">
            {copied ? 'Copied link!' : 'Share my balances'}
          </Button>
        )
      ) : null}
      <Form>
        {isMasquerading ? (
          <Button onClick={handleResetMasquerade}>Reset</Button>
        ) : (
          <>
            <div>View balances of another user</div>
            <Input>
              <AddressInput onChangeValue={setAddress} />
              <Button onClick={handleMasquerade}>View</Button>
            </Input>
          </>
        )}
      </Form>
    </Container>
  )
}
