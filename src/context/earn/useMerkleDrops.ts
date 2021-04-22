import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { soliditySha3 } from 'web3-utils'
import { BigNumber, utils } from 'ethers'

import { MerkleDropClaimsQueryResult, useMerkleDropClaimsLazyQuery } from '../../graphql/ecosystem'
import { MerkleDrop, MerkleDropsMap } from './types'
import { MerkleTree } from '../../web3/MerkleTree'
import { BigDecimal } from '../../web3/BigDecimal'
import { SubscribedToken } from '../../types'

interface JsonReport {
  [account: string]: string
}

interface JsonReports {
  [token: string]: { [trancheNumber: string]: JsonReport }
}

const fetchReports = async (data: MerkleDropClaimsQueryResult['data']): Promise<JsonReports> => {
  const promises: Promise<[string, number, JsonReport]>[] = (data?.merkleDrops ?? []).flatMap(({ tranches, token: { id } }) =>
    tranches
      .filter(({ claims }) => claims.length === 0)
      .map(async ({ trancheNumber }) => {
        const response = await fetch(`/reports/tranches/${trancheNumber}/${id}.json`)
        const report: JsonReport = await response.json()
        return [id, trancheNumber, report] as [string, number, JsonReport]
      }),
  )

  const reports = await Promise.all(promises)

  return reports.reduce<JsonReports>(
    (prev, [token, trancheNumber, report]) => ({
      [token]: {
        ...prev[token],
        [trancheNumber.toString()]: report,
      },
    }),
    {},
  )
}

const getProof = (report: JsonReport, account: string, decimals: number): string[] => {
  const elements = Object.entries(report).map(([_account, amount]) =>
    soliditySha3(_account, utils.parseUnits(amount, decimals).toString()),
  ) as string[]

  const tree = new MerkleTree(elements)

  const element = soliditySha3(account, utils.parseUnits(report[account], decimals).toString()) as string

  return tree.getHexProof(element)
}

export const useMerkleDrops = (account?: string): { merkleDrops: MerkleDropsMap; refresh(): void } => {
  const fetchedReportsForAccount = useRef<string>()
  const [reports, setReports] = useState<JsonReports>()

  const [runMerkleDropsQuery, merkleDropsQuery] = useMerkleDropClaimsLazyQuery({
    fetchPolicy: 'cache-and-network',
  })

  const refresh = useCallback(() => {
    if (account) {
      runMerkleDropsQuery({ variables: { account } })
    }
  }, [runMerkleDropsQuery, account])

  useEffect(() => {
    refresh()
  }, [account, refresh])

  useEffect(() => {
    const shouldFetchReports =
      account &&
      merkleDropsQuery.variables?.account === account &&
      !merkleDropsQuery.loading &&
      fetchedReportsForAccount.current !== account

    if (shouldFetchReports) {
      fetchReports(merkleDropsQuery.data)
        .then(setReports)
        .catch(error => {
          console.error('Unable to fetch MerkleDrop reports', error)
        })
        .finally(() => {
          fetchedReportsForAccount.current = account
        })
    }
  }, [account, merkleDropsQuery])

  return useMemo(() => {
    const merkleDrops =
      account && reports && merkleDropsQuery.data
        ? Object.fromEntries(
            merkleDropsQuery.data.merkleDrops.map(({ id: address, tranches, token }) => {
              const unclaimedTranches = tranches
                .filter(({ trancheNumber, claims }) => {
                  // Must be unclaimed by this account
                  // Report must have an allocation for this account
                  return claims.length === 0 && reports[token.id]?.[trancheNumber.toString()]?.[account]
                })
                .map(({ trancheNumber }) => {
                  const report = reports[token.id][trancheNumber]

                  const allocation = utils.parseUnits(report[account], token.decimals).toString()

                  const proof = getProof(report, account, token.decimals)

                  return {
                    trancheNumber,
                    allocation,
                    proof,
                  }
                })

              const totalUnclaimed = new BigDecimal(
                unclaimedTranches.reduce((prev, current) => prev.add(current.allocation), BigNumber.from(0)),
                token.decimals,
              )

              const merkleDrop: MerkleDrop = {
                address,
                token: (token as unknown) as SubscribedToken,
                unclaimedTranches,
                totalUnclaimed,
              }
              return [address, merkleDrop]
            }),
          )
        : {}

    return { merkleDrops, refresh }
  }, [account, reports, merkleDropsQuery.data, refresh])
}
