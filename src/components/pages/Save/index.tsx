import React, { FC } from 'react'
import styled from 'styled-components'

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { useChainIdCtx, ChainIds } from '../../../context/NetworkProvider'
import { RewardStreamsProvider } from '../../../context/RewardStreamsProvider'
import { useSelectedMassetConfig } from '../../../context/MassetProvider'
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider'

import { PageAction, PageHeader } from '../PageHeader'
import { Save as SaveV2 } from './v2'
import { ViewportWidth } from '../../../theme'
import { SaveOverview } from './v2/SaveOverview'
import { InfoBox } from '../../core/InfoBox'
import { ToggleSave } from './ToggleSave'
import { SaveMigration } from './v1/SaveMigration'
import { OnboardingProvider } from './hooks'
import { InfoButton } from '../../core/InfoButton'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'

const ButtonPanel = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  align-items: flex-start;
  justify-content: center;
  border-radius: 1rem;
  padding: 1rem;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 1rem;

  > * {
    width: 100%;
    margin-top: 1rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > * {
      margin-bottom: 1rem;
      margin-top: 0;
      width: 100%;
    }
  }
`

const Content = styled.div`
  @media (min-width: ${ViewportWidth.l}) {
    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
    }
    > div:last-child {
      flex-basis: calc(35% - 0.5rem);
    }
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    display: flex;
    flex-direction: column;

    @media (min-width: ${ViewportWidth.l}) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
`

export const Save: FC = () => {
  const massetState = useSelectedMassetState()
  const massetConfig = useSelectedMassetConfig()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const vault = massetState?.savingsContracts.v2.boostedSavingsVault
  const [chainId] = useChainIdCtx()
  const showMigrationView = chainId === ChainIds.EthereumMainnet && selectedSaveVersion === 1 && massetConfig.hasV1Save

  const handleGovernanceClick = (): void => {
    window.open('https://governance.mstable.org', '_blank')
  }

  return (
    <RewardStreamsProvider vault={vault}>
      <OnboardingProvider>
        <PageHeader action={PageAction.Save} />
        {massetState ? (
          <Container>
            <SaveOverview />
            <Content>
              {showMigrationView ? <SaveMigration /> : <SaveV2 />}
              <Sidebar>
                {chainId === ChainIds.EthereumMainnet && massetConfig.hasV1Save && (
                  <ButtonPanel>
                    <ToggleSave />
                  </ButtonPanel>
                )}
                {chainId === ChainIds.EthereumMainnet && (
                  <InfoButton
                    title="Stake MTA"
                    content="Lockup MTA to participate in governance and earn platform rewards."
                    onClick={handleGovernanceClick}
                  />
                )}
                <InfoBox>
                  <h4>
                    <span>Using mStable Save</span>
                  </h4>
                  <p>
                    By depositing to {`i${massetConfig.formattedName}`} you will begin earning interest on your underlying{' '}
                    {massetConfig.formattedName}. {vault ? 'Deposits to the Vault will earn interest in addition to MTA rewards.' : ''}
                  </p>
                  <p>
                    Deposits from assets other than {massetConfig.formattedName} will first mint {massetConfig.formattedName} before being
                    deposited.
                  </p>
                </InfoBox>
              </Sidebar>
            </Content>
          </Container>
        ) : (
          <ThemedSkeleton height={400} />
        )}
      </OnboardingProvider>
    </RewardStreamsProvider>
  )
}
