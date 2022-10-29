// Nothing

import * as TradingVaultEvents from "../types/Factory/TradingVault";
import { log } from '@graphprotocol/graph-ts';


// - event: Deposit(uint256,uint256)
export function handleDeposit(event: TradingVaultEvents.Deposit): void {
    log.debug("CALL : handleDeposit", []);
}

// - event: Rebalance(uint256[],uint256[])
export function handleRebalance(event: TradingVaultEvents.Rebalance): void {
    log.info("CALL: handleRebalance", [])
}

// - event: Redeem(uint256,uint256)
export function handleRedeem(event: TradingVaultEvents.Redeem): void {
    log.info("CALL: handleRedeem", [])
}

// - event: HarvestManagementFees(uint256,uint256)
export function handleHarvestManagementFees(event: TradingVaultEvents.HarvestManagementFees): void {
    log.info("CALL: handleHarvestManagementFees", [])
}

// - event: HarvestPerformanceFees(uint256,uint256)
export function handleHarvestPerformanceFees(event: TradingVaultEvents.HarvestPerformanceFees): void {
    log.info("CALL: handleHarvestPerformanceFees", [])
}

// - event: AddAsset(address)
export function handleAddAsset(event: TradingVaultEvents.AddAsset): void {
    log.info("CALL: handleAddAsset", [])
}

// - event: SetShareTransferability(bool)
export function handleSetShareTransferability(event: TradingVaultEvents.SetShareTransferability): void {
    log.info("CALL: handleSetShareTransferability", [])
}

// - event: SetSecurityProps((uint256,uint256,uint256,uint256,uint256,uint256,uint256))
export function handleSetSecurityProps(event: TradingVaultEvents.SetSecurityProps): void {
    log.info("CALL: handleSetSecurityProps", [])
}

// - event: SetConfigProps((bool,uint8,string,string))
export function handleSetConfigProps(event: TradingVaultEvents.SetConfigProps): void {
    log.info("CALL: handleSetConfigProps", [])
}

// - event: SetFeesProps((address,uint256,uint256,uint256,uint256,uint256))
export function handleSetFeesProps(event: TradingVaultEvents.SetFeesProps): void {
    log.info("CALL: handleSetFeesProps", [])
}

// - event: RedeemExecuted(address,uint256,uint256)
export function handleRedeemExecuted(event: TradingVaultEvents.RedeemExecuted): void {
    log.info("CALL: handleRedeemExecuted", [])
}

// - event: RedeemExecuteFail(address,uint256,uint256)
export function handleRedeemExecuteFail(event: TradingVaultEvents.RedeemExecuteFail): void {
    log.info("CALL: handleRedeemExecuteFail", [])
}

// - event: RedeemAsk(address,uint256,uint256)
export function handleRedeemAsk(event: TradingVaultEvents.RedeemAsk): void {
    log.info("CALL: handleRedeemAsk", [])
}

// - event: PositionDecrease(address[],address,uint256,uint256,bool,uint256)
export function handlePositionDecrease(event: TradingVaultEvents.PositionDecrease): void {
    log.info("CALL: handlePositionDecrease", [])
}

// - event: PositionIncrease(address[],address,uint256,uint256,uint256,bool,uint256)
export function handlePositionIncrease(event: TradingVaultEvents.PositionIncrease): void {
    log.info("CALL: handlePositionIncrease", [])
}
