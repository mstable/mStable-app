import React, { FC, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BoostDirector__factory } from '@mstable/protocol/dist/types/generated'
import { useAccount, useSigner } from '../../context/AccountProvider'
import { useDataState, useSelectedMassetState } from '../../context/DataProvider/DataProvider'
import { BoostedSavingsVaultState } from '../../context/DataProvider/types'
import { usePropose } from '../../context/TransactionsProvider'
import { ViewportWidth } from '../../theme'
import { Interfaces } from '../../types'
import { TransactionManifest } from '../../web3/TransactionManifest'
import { Button } from './Button'

interface Props {
  vault?: BoostedSavingsVaultState
}

const Toggle = styled(Button)`
  height: 3rem;
  border-radius: 1rem;
  background: ${({ highlighted }) => !highlighted && 'transparent'};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  color: ${({ theme, highlighted }) => !highlighted && theme.color.body};
`

const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  flex-direction: column;

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;

    > *:not(:last-child) {
      margin-bottom: 0;
      margin-right: 0.5rem;
    }
  }
`

const Info = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column;
  width: 100%;

  > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`

const Selection = styled.div`
  margin-bottom: 1rem;

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    margin: 0;
  }
`

const Container = styled.div`
  display: flex;
  border: 1px dashed ${({ theme }) => theme.color.defaultBorder};
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  flex-direction: column;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  span {
    font-size: 1.125rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: center;

    > div:first-child {
      flex-basis: 75%;
    }
    > div:last-child {
      flex-basis: 25%;
    }
  }
`

const formatTokenText = (str?: string): string => (str ?? '').replace(/fP/, '')

export const SelectBoost: FC<Props> = ({ vault }) => {
  const propose = usePropose()
  const signer = useSigner()
  const account = useAccount()
  const dataState = useDataState()
  const massetState = useSelectedMassetState()

  const { isImusd } = vault ?? {}

  const feederPoolVaults = useMemo(() => {
    const mbtcVault = dataState.mbtc?.savingsContracts?.v2?.boostedSavingsVault
    const mbtcFeederVaults = Object.keys(dataState.mbtc?.feederPools ?? {}).map(
      feederAddress => dataState.mbtc?.feederPools[feederAddress].vault,
    )
    const musdFeederVaults = Object.keys(dataState.musd?.feederPools ?? {}).map(
      feederAddress => dataState.musd?.feederPools[feederAddress].vault,
    )
    return [mbtcVault, ...mbtcFeederVaults, ...musdFeederVaults]
  }, [dataState])

  const { boostDirector, userVaults, vaultIds = {} } = massetState ?? {}

  const boostedVaults = useMemo(() => {
    if (!userVaults || !account) return
    const userBoostedVaultIds = userVaults[account] ?? []
    const boostedVaultAddresses = userBoostedVaultIds.map(id => vaultIds[id])
    return boostedVaultAddresses.map(v => feederPoolVaults.find(fv => fv?.address === v))
  }, [account, feederPoolVaults, userVaults, vaultIds])

  const [selectedVault, setSelectedVault] = useState<BoostedSavingsVaultState | undefined>()

  const handleSelection = useCallback((v?: BoostedSavingsVaultState) => setSelectedVault(v !== selectedVault ? v : undefined), [
    selectedVault,
  ])

  const isVaultBoosted = boostedVaults?.find(v => v?.stakingToken?.symbol === vault?.stakingToken?.symbol)

  const message =
    selectedVault === undefined
      ? `To continue receiving a boost on this vault please select one of the following vaults below to replace:`
      : `You have selected ${formatTokenText(selectedVault?.stakingToken?.symbol)} to replace with ${formatTokenText(
          vault?.stakingToken?.symbol,
        )}`

  if (isImusd || isVaultBoosted) return null

  return (
    <Container>
      <Selection>
        <h3>Maximum Vaults reached</h3>
        <p>{message}</p>
        <ToggleContainer>
          {boostedVaults?.map(v => (
            <Toggle
              key={v?.stakingToken?.symbol}
              onClick={() => handleSelection(v)}
              highlighted={v?.stakingToken?.symbol === selectedVault?.stakingToken?.symbol}
            >
              {formatTokenText(v?.stakingToken?.symbol)}
            </Toggle>
          ))}
        </ToggleContainer>
      </Selection>
      <Info>
        <div>
          <Button
            highlighted={!!selectedVault}
            onClick={() => {
              if (!signer || !selectedVault || !boostDirector) return

              const oldVaultAddress = selectedVault?.address
              const newVaultAddress = vault?.address

              if (!oldVaultAddress || !newVaultAddress) return

              propose<Interfaces.BoostDirector, 'setDirection'>(
                new TransactionManifest(
                  BoostDirector__factory.connect(boostDirector, signer),
                  'setDirection',
                  [oldVaultAddress, newVaultAddress, true],
                  {
                    present: 'Setting Boost Direction',
                    past: 'Set Boost Direction',
                  },
                ),
              )
            }}
          >
            Confirm Selection
          </Button>
        </div>
      </Info>
    </Container>
  )
}
