use anchor_lang::prelude::*;

declare_id!("HT3aFQgSPGmLW5aDSY3bxBEygjwDL4rQD5VMjuuBz6sB");

#[program]
pub mod pyth {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
