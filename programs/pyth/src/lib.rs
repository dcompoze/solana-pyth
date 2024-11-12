use anchor_lang::prelude::*;
use pyth_sdk_solana::state::SolanaPriceAccount;

declare_id!("HT3aFQgSPGmLW5aDSY3bxBEygjwDL4rQD5VMjuuBz6sB");

#[program]
pub mod pyth {
    use super::*;

    pub fn get_price(ctx: Context<GetPrice>) -> Result<()> {
        // Get current timestamp from Solana clock
        let current_time = ctx.accounts.clock.unix_timestamp;
        // Maximum allowed age for the price in seconds.
        let max_age = 60;

        // Get the price feed account info.
        let price_feed_acc = &ctx.accounts.price_feed;

        // Load the price feed using the newer method.
        let price_feed = SolanaPriceAccount::account_info_to_feed(price_feed_acc)
            .map_err(|_| ProgramError::InvalidAccountData)?;

        // Get the current price and ensure it's not older than max_age seconds.
        let current_price = price_feed
            .get_price_no_older_than(current_time, max_age)
            .ok_or(CustomError::StalePrice)?;

        // Get price components.
        let price = current_price.price;
        let conf = current_price.conf;
        let expo = current_price.expo;

        // Calculate the actual price value.
        let real_price = (price as f64) * 10f64.powi(expo);
        let confidence = (conf as f64) * 10f64.powi(expo);

        msg!("Price: {}, Confidence: {}", real_price, confidence);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct GetPrice<'info> {
    /// The Pyth price feed account.
    pub price_feed: AccountInfo<'info>,
    /// The clock sysvar.
    pub clock: Sysvar<'info, Clock>,
}

#[error_code]
pub enum CustomError {
    #[msg("Invalid Pyth price feed account")]
    InvalidPriceFeed,
    #[msg("Price is too old")]
    StalePrice,
    #[msg("No price found in the price feed")]
    NoPriceFound,
}
