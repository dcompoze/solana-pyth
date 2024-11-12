import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Pyth } from "../target/types/pyth";
import { assert } from "chai";

describe("pyth", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Pyth as Program<Pyth>;

  // BTC/USD price feed on mainnet
  const BTC_USD_PRICE_FEED = new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU");

  // ETH/USD price feed on mainnet
  const ETH_USD_PRICE_FEED = new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB");

  it("Can fetch BTC price", async () => {
    try {
      await program.methods
        .getPrice()
        .accounts({
          priceFeed: BTC_USD_PRICE_FEED,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();

      // TODO: Capture and verify the emitted logs or add return values to your instruction to verify the price.

    } catch (error) {
      assert.fail(`Failed to fetch BTC price: ${error}`);
    }
  });

  it("Can fetch ETH price", async () => {
    try {
      await program.methods
        .getPrice()
        .accounts({
          priceFeed: ETH_USD_PRICE_FEED,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();

    } catch (error) {
      assert.fail(`Failed to fetch ETH price: ${error}`);
    }
  });

  it("Fails with invalid price feed account", async () => {
    try {
      // Random public key that isn't a price feed.
      const invalidPriceFeed = anchor.web3.Keypair.generate().publicKey;

      await program.methods
        .getPrice()
        .accounts({
          priceFeed: invalidPriceFeed,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();

      assert.fail("Should have failed with invalid price feed");
    } catch (error) {
      assert.include(
        error.message,
        "Invalid Pyth price feed account"
      );
    }
  });

  // TODO: Test with a local validator (need to set up mock price feeds).
  describe("Local validator tests", () => {
    // - Set up a mock Pyth program
    // - Create mock price feed accounts
    // - Update prices in the accounts

    beforeEach(async () => {
      // Set up mock price feeds here (requires additional setup with the Pyth SDK).
    });

    it("Works with local mock price feed", async () => {
      // Test with local mock price feed (requires implementing the mock setup first).
    });
  });
});
