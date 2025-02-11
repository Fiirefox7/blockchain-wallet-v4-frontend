import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { includes } from 'ramda'

import Currencies from '@core/exchange/currencies'
import DataError from 'components/DataError'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import Loading from '../ActiveRewards.template.loading'
import { getData, getRemote } from './AccountSummary.selectors'
import AccountSummary from './AccountSummary.template.success'
import Unsupported from './AccountSummary.template.unsupported'
import {
  DataType,
  PriceChangeSymbolType,
  PropsType,
  RemoteType,
  SemanticColorsType
} from './AccountSummary.types'

const PENDING_TRANSACTIONS_MAX = 4

const AccountSummaryContainer = (props: PropsType) => {
  const [isTransactionsToggled, setIsTransactionsToggled] = useState<boolean>(false)
  const [isCoinDisplayed, setIsCoinDisplayed] = useState<boolean>(true)
  const [isBalanceDropdownToggled, setIsBalanceDropdownToggled] = useState<boolean>(false)
  const { coin, handleClose, showSupply, stepMetadata } = props
  const { totalBondingDeposits, walletCurrency }: DataType = useSelector(getData)
  const { data, error, isLoading, isNotAsked } = useRemote(getRemote)
  const dispatch = useDispatch()
  const unsupportedCurrencies = [Currencies.TWD.code, Currencies.CLP.code]
  const isFiatCurrencySupported = !includes(walletCurrency, unsupportedCurrencies)

  useEffect(() => {
    dispatch(actions.components.interest.fetchActiveRewardsLimits())
    dispatch(actions.components.interest.fetchPendingActiveRewardsTransactions({ coin }))
  }, [])

  useEffect(() => {
    if (isFiatCurrencySupported) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.WALLET_STAKING_DETAIL_VIEWED,
          properties: {
            currency: coin
          }
        })
      )
    }
  }, [coin, isFiatCurrencySupported])

  useEffect(() => {
    const isTransactionsToggledAutomatically: boolean | undefined =
      data &&
      data.pendingTransactions.length < PENDING_TRANSACTIONS_MAX &&
      data.pendingTransactions.length > 0

    if (isTransactionsToggledAutomatically) {
      setIsTransactionsToggled(true)
    } else {
      setIsTransactionsToggled(false)
    }
  }, [data?.pendingTransactions])

  const handleDepositClick = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_STAKING_DETAIL_DEPOSIT_CLICKED,
        properties: {
          currency: coin
        }
      })
    )
    dispatch(actions.components.interest.showActiveRewardsModal({ coin, step: 'DEPOSIT' }))
  }

  const handleEDDSubmitInfo = () => {
    dispatch(actions.components.interestUploadDocument.showModal({ origin: 'EarnPage' }))
  }

  const handleRefresh = () => {
    dispatch(actions.components.interest.showActiveRewardsModal({ coin, step: 'ACCOUNT_SUMMARY' }))
  }

  const handleTransactionsToggled = () => {
    setIsTransactionsToggled(!isTransactionsToggled)
  }

  const handleCoinToggled = () => {
    setIsCoinDisplayed(!isCoinDisplayed)
  }

  const handleBalanceDropdown = () => {
    setIsBalanceDropdownToggled(!isBalanceDropdownToggled)
  }

  if (error) return <DataError onClick={handleRefresh} />

  if (!data || isLoading || isNotAsked) return <Loading />

  const {
    accountBalances,
    activeRewardsEligible,
    activeRewardsRates,
    currentPrice,
    earnEDDStatus: { eddNeeded, eddPassed, eddSubmitted },
    pendingTransactions,
    priceChange
  }: RemoteType = data

  const isEDDRequired = eddNeeded && !eddSubmitted && !eddPassed
  const account = accountBalances && accountBalances[coin]
  const accountBalanceBase = account && account.balance
  const activeRewardsBalanceBase = account && account.totalRewards
  const isDepositEnabled = activeRewardsEligible[coin]
    ? activeRewardsEligible[coin]?.eligible
    : false
  const { rate, triggerPrice } = activeRewardsRates[coin]
  const formattedTriggerPrice =
    triggerPrice &&
    `${triggerPrice.substring(0, triggerPrice.length - 2)}.${triggerPrice.substring(
      triggerPrice.length - 2
    )}`

  const { percentChange } = priceChange.overallChange
  let priceChangeColor: SemanticColorsType = 'body'
  let priceChangeSymbol: PriceChangeSymbolType = ''

  switch (priceChange.overallChange.movement) {
    case 'up':
      priceChangeColor = 'success'
      priceChangeSymbol = '+'
      break
    case 'down':
      priceChangeColor = 'error'
      priceChangeSymbol = '-'
      break

    case 'none':
    default:
      priceChangeColor = 'body'
      priceChangeSymbol = ''
      break
  }

  return isFiatCurrencySupported ? (
    <AccountSummary
      account={account}
      accountBalanceBase={accountBalanceBase}
      activeRewardsBalanceBase={activeRewardsBalanceBase}
      coin={coin}
      currentPrice={currentPrice}
      handleBalanceDropdown={handleBalanceDropdown}
      handleClose={handleClose}
      handleCoinToggled={handleCoinToggled}
      handleDepositClick={handleDepositClick}
      handleEDDSubmitInfo={handleEDDSubmitInfo}
      handleTransactionsToggled={handleTransactionsToggled}
      isBalanceDropdownToggled={isBalanceDropdownToggled}
      isCoinDisplayed={isCoinDisplayed}
      isDepositEnabled={isDepositEnabled}
      isEDDRequired={isEDDRequired}
      isTransactionsToggled={isTransactionsToggled}
      pendingTransactions={pendingTransactions}
      percentChange={percentChange}
      priceChangeColor={priceChangeColor}
      priceChangeSymbol={priceChangeSymbol}
      rate={rate}
      showSupply={showSupply}
      stepMetadata={stepMetadata}
      totalBondingDeposits={totalBondingDeposits}
      triggerPrice={formattedTriggerPrice}
      walletCurrency={walletCurrency}
    />
  ) : (
    <Unsupported handleClose={handleClose} walletCurrency={walletCurrency} />
  )
}

export default AccountSummaryContainer
