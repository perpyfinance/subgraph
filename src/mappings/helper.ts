import { BigInt } from "@graphprotocol/graph-ts";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let BI_18 = BigInt.fromI32(18);

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// AVALANCHE = 0x60Db716feFF3323D36f88b6c288723BC1Cc078C2
export const FACTORY_ADDRESS = "0x60Db716feFF3323D36f88b6c288723BC1Cc078C2";
export const SNAPSHOT_TIMEFRAME_1H = BigInt.fromI32(60 * 60); // 1H
export const SNAPSHOT_TIMEFRAME_15_MIN = BigInt.fromI32(60 * 15); // 15'