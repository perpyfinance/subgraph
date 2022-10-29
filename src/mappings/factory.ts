import { ethereum, log } from "@graphprotocol/graph-ts";
import { Address } from "@graphprotocol/graph-ts";
import { VaultCreated } from "../types/Factory/Factory";
import { TradingVault, Factory } from '../types/schema';
import { TradingVault as VaultContract } from "../types/Factory/TradingVault";
import { Factory as FactoryContract } from "../types/Factory/Factory";
import { TradingVault as VaultTemplate } from "../types/templates";
import { VaultSnapshot } from "../types/schema";
import * as hp from './helper';


/**
 * This function should be called only once at the first vault created, when the subgraph isn't yet deployed
 * @param event The vault creation event
 * @returns The create factory entity
 */
export function _createFactory(event: VaultCreated): Factory {
    log.debug("CALL : _createFactory", []);
    const factory = new Factory(hp.FACTORY_ADDRESS);
    factory.vaultCount = 0;
    // const bindedFactory = FactoryContract.bind(Address.fromString(hp.FACTORY_ADDRESS));
    factory.lastSnapshotBlockTimestamp = event.block.timestamp;
    factory.lastSnapshotBlockNumber = event.block.number;
    factory.save();
    return factory;
}

/**
 * Update the full content of a vault
 * @param vAddress His address
 * @param vault The instance itself
 * @returns 
 */
export const updateVault = (vault: TradingVault): TradingVault => {
    log.debug("CALL : updateVault", []);
    // const vAddress = Address.fromString(vault.id)
    const bindedFactory = FactoryContract.bind(Address.fromString(hp.FACTORY_ADDRESS));
    const bindedVault = VaultContract.bind(Address.fromString(vault.id));
    // ToDo
    vault.save();
    return vault;
}

/**
 * Internal handler to create the vault
 * @param event Event of creation
 * @param factory Factory instance
 */
export function _createVault(event: VaultCreated, factory: Factory): TradingVault {
    /// Factory Info
    let vault = new TradingVault(event.params.vault.toHexString()) as TradingVault;
    vault.factory = factory.id;
    vault.vault = event.params.vault;
    vault.creator = event.transaction.from;
    vault.depositsCount = 0;
    vault.increasePositionCount = 0;
    vault.decreasePositionCount = 0;
    vault.redemptionsCount = 0;
    // const updatedVault = updateVault(vault);
    // updatedVault.save();
    vault.save();
    return vault;
}

/**
 * Create a vault, via the factory event
 * @param event /
 */
export function handleVaultCreated(event: VaultCreated): void {
    log.debug("CALL : handleCreateVault", []);
    // Factory (created when the first vault is created)
    let factory = Factory.load(hp.FACTORY_ADDRESS);
    if (factory === null) factory = _createFactory(event);
    factory.vaultCount = factory.vaultCount + 1;
    factory.save();
    // Vault
    const vault = _createVault(event, factory);
    VaultTemplate.create(event.params.vault);
    vault.save();
    factory.save();
}

/**
 * Take a snapshot for each vault
 * @param factory Factory instance
 * @param vaultAddress Vault address
 * @param block Block of the event
 * @param triggeredByEvent Wether or not the snapshot is triggered by an event or the `handbleBlock` handler. To be used in the frontend possibly
 */
export function newSnapshot(
    factory: Factory,
    vaultAddress: Address,
    block: ethereum.Block,
    triggeredByEvent: boolean,
): void {
    const vault = VaultContract.bind(vaultAddress);
    const entityName = hp.FACTORY_ADDRESS + "-" + vaultAddress.toHexString() + "-" + block.number.toString();
    // const status = vault.getVaultStatus();
    // const baseToken = vault.baseToken();
    // const tradedToken = vault.tradedToken();

    const snapshot = new VaultSnapshot(entityName);
    snapshot.factory = factory.id;
    snapshot.vault = vaultAddress.toHexString();
    const vStatus = vault.getVaultStatus();

    const positions = vault.getAllPositions();
    const bTPosition = positions[0];
    const tTPosition = positions[1];

    snapshot.TVL = vStatus.value0;
    snapshot.sharePrice = vStatus.value1;

    snapshot.bT_size = bTPosition.size;
    snapshot.bT_collateral = bTPosition.collateral;
    snapshot.bT_averagePrice = bTPosition.averagePrice;
    snapshot.bT_entryFundingRate = bTPosition.entryFundingRate;
    snapshot.bT_reserveAmount = bTPosition.reserveAmount;
    snapshot.bT_realisedPnl = bTPosition.realisedPnl;
    snapshot.bT_hasProfit = bTPosition.hasProfit;
    snapshot.bT_lastIncreasedTime = bTPosition.lastIncreasedTime;

    snapshot.tT_size = tTPosition.size;
    snapshot.tT_collateral = tTPosition.collateral;
    snapshot.tT_averagePrice = tTPosition.averagePrice;
    snapshot.tT_entryFundingRate = tTPosition.entryFundingRate;
    snapshot.tT_reserveAmount = tTPosition.reserveAmount;
    snapshot.tT_realisedPnl = tTPosition.realisedPnl;
    snapshot.tT_hasProfit = tTPosition.hasProfit;
    snapshot.tT_lastIncreasedTime = tTPosition.lastIncreasedTime;

    snapshot.timestamp = block.timestamp;
    snapshot.triggeredByEvent = triggeredByEvent;
    snapshot.save();
}

/**
 * New block handler
 * We also 
 * @notice It's normal that the graph will create tons of snapshots during the deploy/sync time, because it look over tons of past blocks
 * @param block Current Block
 * @returns /
 */
export function handleNewBlock(block: ethereum.Block): void {
    const factory = Factory.load(hp.FACTORY_ADDRESS);
    if (factory === null) {
        log.debug("handleNewBlock : No Factory yet", []);
        return;
    }
    if (!snapshotOrNot(block) == false) return;
    const factoryStorage = FactoryContract.bind(Address.fromString(hp.FACTORY_ADDRESS));
    const factoryState = factoryStorage.getFactoryState();
    const vaults = factoryState.value0;
    for (let x = 0; x < vaults.length; x++) {
        const vAddress = vaults[x];
        newSnapshot(factory, vAddress, block, false);
        let vault = TradingVault.load(vAddress.toString());
        if (vault === null) continue;
        // updateVault(vault); // Nothing to update for now
    }
    factory.lastSnapshotBlockTimestamp = block.timestamp;
    factory.lastSnapshotBlockNumber = block.number;
    factory.save();
}


/**
 * Tells if we should snapshot or not -- We snapshot only every 1 hour
 * @param block /
 * @returns /
 */
export function snapshotOrNot(block: ethereum.Block): boolean {
    const factory = Factory.load(hp.FACTORY_ADDRESS);
    if (factory === null) {
        log.debug("snapshotOrNot : No Factory yet", []);
        return false;
    }
    const lastSnapTimestamp = factory.lastSnapshotBlockTimestamp;
    const currentTime = block.timestamp;
    const elaspedTime = currentTime.minus(lastSnapTimestamp)
    const skipSnapshot = elaspedTime.le(hp.SNAPSHOT_TIMEFRAME_15_MIN);
    return skipSnapshot;
}
