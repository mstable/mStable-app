// export interface RewardsVaultPeriod {
//   current: boolean;
//   start: Date;
//   end: Date;
//   period: number;
//   vaultBalance: {
//     amount: BigDecimal;
//     vested: boolean;
//   };
// }
//
// export interface RewardsVault {
//   address: string;
//   allRewardsUnlocked: boolean;
//   lockupPeriods: number;
//   period: number;
//   vaultStartTime: number;
//   vestingToken: string;
//   periods: RewardsVaultPeriod[];
// }

// const getRewardsVaultState: TransformFn<'rewardsVault'> = ({
//   stakingRewards: [
//     {
//       rewardsVault: {
//         lockupPeriods,
//         vaultStartTime,
//         period: rewardsVaultPeriod,
//         vestingToken,
//         vaultBalances,
//         id,
//         allRewardsUnlocked,
//       },
//     },
//   ],
// }) => {
//   const rewardsVault = {
//     address: id,
//     period: rewardsVaultPeriod,
//     allRewardsUnlocked,
//     lockupPeriods,
//     vestingToken: vestingToken.address,
//     vaultStartTime,
//   };
//
//   const now = new Date();
//   const vaultStart = new Date(rewardsVault.vaultStartTime * 1e3);
//
//   const periods = [...new Array(lockupPeriods)].map((_, index) => {
//     const period = index + 1;
//
//     const start = addSeconds(vaultStart, rewardsVault.period * period);
//
//     const end = addSeconds(vaultStart, rewardsVault.period * (period + 1));
//
//     const current = start <= now && end > now;
//
//     const vaultBalance = vaultBalances
//       .filter(vb => vb.period === period)
//       .map(({ amount, vested }) => ({
//         amount: new BigDecimal(amount, vestingToken.decimals),
//         vested,
//       }))[0] || {
//       amount: new BigDecimal(0, vestingToken.decimals),
//       vested: false,
//     };
//
//     return {
//       current,
//       end,
//       period,
//       start,
//       vaultBalance,
//     };
//   });
//
//   return {
//     ...rewardsVault,
//     periods,
//   };
// };

export {};
