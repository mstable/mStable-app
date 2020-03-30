import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { ContractNames, Interfaces, SendTxManifest } from '../../types';
import { useBassets, useForgeRewardsContract } from '../../web3/hooks';
import { useSendTransaction } from '../../context/TransactionsProvider';
import { convertSimpleToExact } from '../../web3/maths';
import { useSelectedMassetToken, useUIContext } from '../../context/UIProvider';
import { TransactionDetailsDropdown } from '../forms/TransactionDetailsDropdown';
import { Form, FormRow } from '../core/Form';
import { Button } from '../core/Button';
import { H3, P } from '../core/Typography';
import { Size } from '../../theme';
import { Select } from '../core/Select';
import { AmountInput } from '../forms/AmountInput';
import { ReactComponent as ArrowsSVG } from './arrows.svg';

const massetNames = [ContractNames.mUSD, ContractNames.mGLD];

const InvertDirectionButton = styled.div`
  display: flex;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
  }
`;

const UnlockButton = styled(Button)`
  background: transparent;
  margin-right: 0;
  border-right: 0;
  height: 36px;
`;

const TokenWithUnlock = styled.div`
  display: flex;
  width: 152px;
`;

// <FormRow>
//   <Button
//     type="button"
//     onClick={approveBassetTotalSupply}
//     size={Size.m}
//   >
//     Approve total supply
//   </Button>
// </FormRow>
export const Swap: FC<{}> = () => {
  const [{ selectedMasset }, { selectMasset }] = useUIContext();
  const [bassetAddress, setBassetAddress] = useState<string | null>(null);
  const [massetQ, setMassetQ] = useState<number>(0); // TODO max value for massetQ (totalSupply)

  const { account } = useWallet();

  const sendTransaction = useSendTransaction();

  const massetToken = useSelectedMassetToken();
  const massetAddress = massetToken?.address;
  const forgeRewardsContract = useForgeRewardsContract();

  // const bassetContract = useERC20Contract(bassetAddress);
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

  const handleChangeMassetQ = useCallback(value => {
    setMassetQ(value);
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

  // const approveBassetTotalSupply = useCallback(async () => {
  //   if (!(bassetContract && basset)) throw new Error('Basset not selected');
  //   if (!forgeRewardsContract) throw new Error('Rewards contract not found');
  //
  //   sendTransaction({
  //     iface: bassetContract,
  //     fn: 'approve',
  //     args: [forgeRewardsContract.address, basset.token.totalSupply.toString()],
  //   } as SendTxManifest<Interfaces.ERC20, 'approve'>);
  // }, [bassetContract, forgeRewardsContract, basset, sendTransaction]);

  return (
    <Form onSubmit={mintSingleTo}>
      <H3>Send</H3>
      <FormRow>
        <AmountInput
          decimals={18}
          value={massetQ.toString()}
          onChange={handleChangeMassetQ}
        />
        <Select
          defaultValue={selectedMasset}
          name="masset"
          onChange={handleChangeMasset}
        >
          {massetNames.map(_masset => (
            <option key={_masset} value={_masset}>
              {_masset}
            </option>
          ))}
        </Select>
      </FormRow>
      <InvertDirectionButton>
        <ArrowsSVG />
      </InvertDirectionButton>
      <H3>Receive</H3>
      <FormRow>
        <AmountInput
          disabled
          decimals={18}
          onChange={handleChangeMassetQ}
          value={massetQ.toString()}
        />
        <TokenWithUnlock>
          <UnlockButton size={Size.m}>Unlock</UnlockButton>
          <Select
            defaultValue={bassets?.[0]?.token.symbol || ''}
            name="basset"
            onChange={handleChangeBasset}
          >
            {bassets.map(_basset => (
              <option key={_basset.id} value={_basset.id}>
                {_basset.token.symbol}
              </option>
            ))}
          </Select>
        </TokenWithUnlock>
      </FormRow>
      <FormRow>
        <Button type="submit" size={Size.m}>
          Swap
        </Button>
      </FormRow>
      <FormRow>
        <TransactionDetailsDropdown>
          <>
            <P>
              You are swapping {massetQ} mUSD for {massetQ}{' '}
              {basset?.token.symbol} (1:1).
            </P>
            <P>How about some more details here explaining what the deal is?</P>
            <P>
              Details are really nice and they might go on for a few lines. Here
              is another sentence. Watch out, this sentence ends with an
              exclamation mark!
            </P>
          </>
        </TransactionDetailsDropdown>
      </FormRow>
    </Form>
  );
};
