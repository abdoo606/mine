import { CONFIG } from "./config";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
// Transfer(address,address,uint256) topic signature (keccak256).
const TRANSFER_TOPIC =
  "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

/** Decode a Base58Check (Tron) address to raw bytes. */
function base58ToBytes(input: string): Uint8Array {
  let num = BigInt(0);
  for (const ch of input) {
    const idx = ALPHABET.indexOf(ch);
    if (idx === -1) throw new Error("invalid base58 char");
    num = num * BigInt(58) + BigInt(idx);
  }
  let hex = num.toString(16);
  if (hex.length % 2) hex = "0" + hex;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  let zeros = 0;
  for (const ch of input) {
    if (ch === "1") zeros++;
    else break;
  }
  const out = new Uint8Array(zeros + bytes.length);
  out.set(bytes, zeros);
  return out;
}

/** 20-byte payload hex of a Tron base58 address (drops the 0x41 prefix + checksum). */
function addressPayloadHex(address: string): string {
  const bytes = base58ToBytes(address);
  // bytes[0] = 0x41 prefix, bytes[1..21] = payload, bytes[21..25] = checksum
  return Buffer.from(bytes.slice(1, 21)).toString("hex");
}

/** Best-effort on-chain verification of a USDT (TRC20) transaction. */
export async function verifyUsdtPayment(
  txid: string,
  expectedAmount: number,
  toAddress: string,
): Promise<{ verified: boolean; amount?: number; reason?: string }> {
  const cleanTx = txid.trim().toLowerCase();
  if (!/^0x[a-f0-9]{64}$/.test(cleanTx) && !/^[a-f0-9]{64}$/.test(cleanTx)) {
    return { verified: false, reason: "Invalid transaction hash format." };
  }

  const expectedTo = addressPayloadHex(toAddress).toLowerCase();
  const expectedContract = addressPayloadHex(CONFIG.usdtContract).toLowerCase();

  try {
    const res = await fetch("https://api.trongrid.io/wallet/gettransactioninfobyid", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ value: cleanTx, visible: true }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!res.ok) {
      return { verified: false, reason: "Tron network is busy. Awaiting manual confirmation." };
    }
    const data = (await res.json()) as TronTxInfo;

    // Transaction must be mined/confirmed.
    if (data.blockNumber == null) {
      return { verified: false, reason: "Transaction not found or not confirmed yet." };
    }
    if (!Array.isArray(data.log) || data.log.length === 0) {
      return { verified: false, reason: "No TRC20 transfer found in this transaction." };
    }

    for (const entry of data.log) {
      const contract = (entry.address || "").toLowerCase();
      const topics = entry.topics || [];
      if (topics[0]?.toLowerCase() !== TRANSFER_TOPIC) continue;
      if (contract !== "41" + expectedContract && contract !== expectedContract) continue;

      const toTopic = (topics[2] || "").toLowerCase();
      const toPayload = toTopic.slice(-40);
      if (toPayload !== expectedTo) continue;

      const amount = entry.data ? parseInt(entry.data, 16) / 10 ** CONFIG.decimals : 0;
      if (amount + 1e-6 >= expectedAmount) {
        return { verified: true, amount };
      }
      return {
        verified: false,
        reason: `Amount sent (${amount} USDT) is less than required (${expectedAmount} USDT).`,
      };
    }

    return { verified: false, reason: "Payment was not sent to the correct wallet." };
  } catch (err) {
    return {
      verified: false,
      reason: "Auto-verification unavailable — pending manual confirmation.",
    };
  }
}

interface TronTxInfo {
  id?: string;
  blockNumber?: number;
  blockTimeStamp?: number;
  contract_address?: string;
  receipt?: { result?: string };
  log?: {
    address: string;
    data: string;
    topics: string[];
  }[];
}
