import React, { FC, useCallback, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'

import { useTokenAllowance } from '../../../../context/TokensProvider'
import { useOwnAccount, useSigner } from '../../../../context/AccountProvider'
import { useNetworkAddresses } from '../../../../context/NetworkProvider'
import { TransactionForm } from '../../../forms/TransactionForm'
import { TokenAmount } from '../../../core/TokenAmount'
import { NumberFormat } from '../../../core/Amount'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import { useEarnAdminDispatch, useEarnAdminState } from './EarnAdminProvider'
import { Interfaces } from '../../../../types'
import { RewardsDistributor__factory } from '../../../../typechain'
import { BigDecimal } from '../../../../web3/BigDecimal'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { Button } from '../../../core/Button'
import { SendButton } from '../../../forms/SendButton'

const Row = styled.div`
  margin-bottom: 16px;
`

const Confirm: FC = () => {
  const {
    data: { rewardsToken },
    totalFunds,
    recipientAmounts,
  } = useEarnAdminState()

  const token = rewardsToken || { decimals: 18, symbol: 'MTA' }

  return (
    <>
      <Row>
        <h3>Total amount</h3>
        <TokenAmount symbol={token.symbol} amount={totalFunds} decimalPlaces={6} format={NumberFormat.Countup} countup={{ decimals: 6 }} />
      </Row>
      <Row>
        <h3>Breakdown</h3>
        <code>
          {Object.keys(recipientAmounts)
            .sort()
            .map(key => (
              <div key={key}>
                <div>{key}</div>
                <div>
                  {recipientAmounts[key].amount
                    ? `${recipientAmounts[key].amount?.format()} (${recipientAmounts[key].amount?.exact})`
                    : '-'}
                </div>
                <br />
              </div>
            ))}
        </code>
      </Row>
    </>
  )
}

const Input: FC = () => {
  const {
    data: { rewardsToken, rewardsDistributor },
    totalFunds,
  } = useEarnAdminState()
  const spender = rewardsDistributor?.id

  return rewardsToken && spender ? (
    <Row>
      {totalFunds && rewardsToken?.allowances[spender]?.exact.lt(totalFunds.exact) ? (
        <>
          <h3>Approve amount</h3>
          <p>
            Approve transfer of {totalFunds?.simple} {rewardsToken.symbol}
          </p>
          <SendButton
            valid
            title="Approve"
            handleSend={() => {}}
            approve={{
              address: rewardsToken?.address,
              amount: totalFunds,
              spender,
            }}
          />
        </>
      ) : null}
    </Row>
  ) : (
    <ThemedSkeleton />
  )
}

const CustomRecipients: FC = () => {
  const [recipientValue, setRecipientValue] = useState<string>()
  const { recipientAmounts } = useEarnAdminState()
  const { addCustomRecipient, removeCustomRecipient, setRecipientAmount } = useEarnAdminDispatch()

  return (
    <div>
      <Row>
        <h4>Recipients</h4>
        <div>
          <input placeholder="Recipient" onChange={e => setRecipientValue(e.target.value)} />
          <Button
            onClick={() => {
              if (recipientValue) {
                addCustomRecipient(recipientValue)
                setRecipientValue(undefined)
              }
            }}
          >
            Add recipient
          </Button>
        </div>
        <code>
          {Object.keys(recipientAmounts)
            .filter(recipient => recipientAmounts[recipient].custom)
            .map(recipient => (
              <div key={recipient}>
                <div>Address: {recipient}</div>
                <div>Amount: {recipientAmounts[recipient].amount?.format()}</div>
                <div>
                  Set amount:{' '}
                  <input
                    type="number"
                    onChange={e => {
                      setRecipientAmount(recipient, e.currentTarget.value)
                    }}
                  />
                </div>
                <div>
                  <Button
                    onClick={() => {
                      removeCustomRecipient(recipient)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
        </code>
      </Row>
    </div>
  )
}

const Inputs: FC<{ reason?: string }> = ({ reason }) => {
  const { useCustomRecipients } = useEarnAdminState()
  const { toggleCustomRecipients } = useEarnAdminDispatch()
  return (
    <div>
      {reason ? (
        <Row>
          <h3>Validation</h3>
          <div>{reason}</div>
        </Row>
      ) : null}
      <Row>
        <Button onClick={toggleCustomRecipients}>Toggle custom recipients</Button>
      </Row>
      {useCustomRecipients ? (
        <Row>
          <h3>Custom recipients/amounts</h3>
          <CustomRecipients />
        </Row>
      ) : null}
      <Input />
    </div>
  )
}

export const DistributeRewardsForm: FC = () => {
  const account = useOwnAccount()
  const signer = useSigner()
  const {
    data: { rewardsDistributor },
    useCustomRecipients,
    recipientAmounts,
    totalFunds,
  } = useEarnAdminState()
  const networkAddresses = useNetworkAddresses()

  const rewardsDistributorAddress = rewardsDistributor?.id

  const allowance = useTokenAllowance(networkAddresses.MTA, rewardsDistributorAddress)

  const reason = useMemo<string | undefined>(() => {
    if (!account) {
      return 'Not connected'
    }

    if (!(rewardsDistributorAddress && rewardsDistributor && allowance)) {
      return 'Fetching data'
    }

    if (!rewardsDistributor?.fundManagers.includes(account.toLowerCase())) {
      return 'Not a fund manager'
    }

    if (!totalFunds?.exact.gt(0)) {
      return 'Funds not allocated'
    }

    if (allowance.exact.lt(totalFunds?.exact)) {
      return 'Exceeds approved amount'
    }
    return undefined
  }, [account, allowance, rewardsDistributor, rewardsDistributorAddress, totalFunds])

  const valid = !reason

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.RewardsDistibutor, 'distributeRewards'> | void => {
      const contract =
        signer && rewardsDistributorAddress ? RewardsDistributor__factory.connect(rewardsDistributorAddress, signer) : undefined

      const args: [string[], BigNumber[]] = Object.entries(recipientAmounts)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, { custom }]) => (useCustomRecipients ? !!custom : !custom))
        .reduce<[string[], BigNumber[]]>(
          ([addresses, amounts], [recipient, { amount }]) =>
            amount?.exact
              ? [
                  [...addresses, recipient],
                  [...amounts, (amount as BigDecimal).exact],
                ]
              : [addresses, amounts],
          [[], []],
        )

      if (contract && args.length > 0) {
        return new TransactionManifest(
          contract,
          'distributeRewards',
          args,
          {
            present: 'Distributing rewards',
            past: 'Distributed rewards',
          },
          formId,
        )
      }
    },
    [signer, recipientAmounts, rewardsDistributorAddress, useCustomRecipients],
  )

  return (
    <TransactionForm
      confirm={<Confirm />}
      confirmLabel="Distribute rewards"
      createTransaction={createTransaction}
      formId="distributeRewards"
      input={<Inputs reason={reason} />}
      valid={valid}
    />
  )
}
