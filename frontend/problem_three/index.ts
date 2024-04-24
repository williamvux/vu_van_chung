{/*
  I see that WalletBalance and FormattedWalletBalance are used as types, and don't have any inheritance. So
I change two interfaces to type: type WalletBalance, type: FormattedWalletBalance.
*/}

type WalletBalance = {
  currency: string;
  amount: number;
}
type FormattedWalletBalance = {
  currency: string;
  amount: number;
  formatted: string;
}


{/*
  The getPriority function is so large and inefficency to read,
I could change it to Map, or Object for for faster lookup.
In my case, I change it to object and use useMemo with zero dependency to memozise it.
So React will render getPriority once.
*/}

const blockchainPriorities = useMemo(() => ({
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
}), []);

const getPriority = (blockchain: any): number => useCallback(() => {
  return blockchainPriorities[blockchain] ?? -99;
}, [blockchainPriorities]);

{/**
  I could not find any information about BoxProps, so I keep it.
*/}

{/**
  I am not sure about this situation, but maybe it is a typo error, If it  is not a typo error,
  I commented may solution below, because React will throw a warning that variable balancePriority is not used,
  and a error that lhsPriority is not declared.
  And React will warn that lack of dependencies. It is getPriority
*/}
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {  // =======> HERE: lhsPriority change to balancePriority
       if (balance.amount <= 0) {
         return true;
       }
    }
    return false
  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
      return -1;
    } else if (rightPriority > leftPriority) {
      return 1;
    }
  });
}, [balances, prices]);

{/**
  use useMemo to reduce the number of caculation of below code, or i could group it to the above code.
  but I will keep it like below
*/}

const formattedBalances = useMemo(() => sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()
  }
}), [sortedBalances]);

{/**
  Another typo error: const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number)
  => const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number)
  When we render a list of component with map. we should redundant computation.
  const usdValue = prices[balance.currency] * balance.amount;
  We see that we don't use balance.currency for any props of WalletRow,
  and we need to use additional prop that is usdValue.
  If I write those code, I will fix it below.
*/}

// Change type
type FormattedWalletBalance = {
  usdValue: number;
  amount: number;
  formatted: string;
}
// re-map data
const formattedBalances: FormattedWalletBalance[] = useMemo(() => sortedBalances.map((balance: WalletBalance) => {
  return {
    usdValue: prices[balance.currency] * balance.amount,
    amount: balance.amount,
    formatted: balance.amount.toFixed()
  }
}), [sortedBalances]);

//then
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
  return (
    <WalletRow
      className={classes.row}
      key={index}
      amount={balance.amount}
      usdValue={balance.usdValue}
      formattedAmount={balance.formatted}
    />
  );
});



{/**
  Anti-pattern: Deep object spread: formattedBalances.
  Spreading the entire balance object within the formattedBalances map creates a new object for each balance.
  This can be inefficient for large numbers of balances.
  Just creat a new object with only the required properties 
*/}

const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
  ...balance,
  formatted: balance.amount.toFixed(),
}));
