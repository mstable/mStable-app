import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ContractNames, Interfaces, SendTxManifest } from '../../types';
import {
  useBassets,
  useERC20Contract,
  useForgeRewardsContract,
} from '../../web3/hooks';
import { useSendTransaction } from '../../context/TransactionsProvider';
import { convertSimpleToExact } from '../../web3/maths';
import { useSelectedMassetToken, useUIContext } from '../../context/UIProvider';
import { Form, FormRow } from '../core/Form';
import { Button } from '../core/Button';
import { Size } from '../../theme';

const massetNames = [ContractNames.mUSD, ContractNames.mGLD];

export const Mint: FC<{}> = () => {
  const [{ selectedMasset }, { selectMasset }] = useUIContext();
  const [bassetAddress, setBassetAddress] = useState<string | null>(null);
  const [massetQ, setMassetQ] = useState<number>(0); // TODO max value for massetQ (totalSupply)

  const { account } = useWallet();

  const sendTransaction = useSendTransaction();

  const massetToken = useSelectedMassetToken();
  const massetAddress = massetToken?.address;
  const forgeRewardsContract = useForgeRewardsContract();

  const bassetContract = useERC20Contract(bassetAddress);
  const bassets = useBassets(massetAddress);
  const basset = useMemo(
    () => bassets.find(b => b.token.address === bassetAddress),
    [bassets, bassetAddress],
  );

  useEffect(() => {
    if (bassets?.[0]) setBassetAddress(bassets[0].token.address);
  }, [bassets]);

  const handleChangeMasset = useCallback(
    event => {
      selectMasset(event.target.value);
      setMassetQ(0);
    },
    [selectMasset],
  );

  const handleChangeBasset = useCallback(event => {
    setBassetAddress(event.target.value);
  }, []);

  const handleChangeMassetQ = useCallback(event => {
    setMassetQ(event.target.value);
  }, []);

  const mintSingleTo = useCallback(
    async event => {
      event.preventDefault();

      if (!basset) throw new Error('Basset not selected');
      if (!forgeRewardsContract) throw new Error('Rewards contract not found');
      if (!account) throw new Error('Account not found');

      const tokenAddress = basset.token.address;
      const tokenQ = convertSimpleToExact(
        massetQ,
        basset.token.decimals,
      ).toString();

      sendTransaction({
        iface: forgeRewardsContract,
        fn: 'mintSingleTo',
        args: [tokenAddress, tokenQ, account, account],
      } as SendTxManifest<Interfaces.ForgeRewards, 'mintSingleTo'>);
    },
    [forgeRewardsContract, basset, massetQ, account, sendTransaction],
  );

  const approveBassetTotalSupply = useCallback(async () => {
    if (!(bassetContract && basset)) throw new Error('Basset not selected');
    if (!forgeRewardsContract) throw new Error('Rewards contract not found');

    sendTransaction({
      iface: bassetContract,
      fn: 'approve',
      args: [forgeRewardsContract.address, basset.token.totalSupply.toString()],
    } as SendTxManifest<Interfaces.ERC20, 'approve'>);
  }, [bassetContract, forgeRewardsContract, basset, sendTransaction]);

  return (
    <>
      <Form onSubmit={mintSingleTo}>
        <FormRow>
          <Button
            type="button"
            onClick={approveBassetTotalSupply}
            size={Size.m}
          >
            Approve total supply
          </Button>
        </FormRow>
        <div>mint</div>
        <FormRow>
          <input
            name="massetQ"
            type="number"
            min={0}
            onChange={handleChangeMassetQ}
          />
          <select
            defaultValue={selectedMasset}
            name="masset"
            onChange={handleChangeMasset}
          >
            {massetNames.map(_masset => (
              <option key={_masset} value={_masset}>
                {_masset}
              </option>
            ))}
          </select>
        </FormRow>
        <div>with</div>
        <FormRow>
          <input
            name="bassetQ"
            type="number"
            min={0}
            // onChange={handleChangeBassetQ}
            disabled
            value={massetQ}
          />
          <select
            defaultValue={bassets?.[0]?.token.symbol || ''}
            name="basset"
            onChange={handleChangeBasset}
          >
            {bassets.map(_basset => (
              <option key={_basset.id} value={_basset.id}>
                {_basset.token.symbol}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow>
          <Button type="submit" size={Size.m}>
            mint and earn 884 MTA
          </Button>
        </FormRow>
      </Form>
    </>
  );
};
