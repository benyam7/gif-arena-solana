use anchor_lang::prelude::*; // we're sorta importing useful stuff from anchor

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");  // program id and has info for solana on how to run our program. Anchor has generated this for us.

#[program] // they called macros(they basically attach code to our module. like inhertitance) sorta -> everything in this little module below is our program that we want to create handlers for that other people can call.essentially this lets us actually call our Solana program from our frontend via a fetch request.
// "pub mod" : is Rust module (kinda like class/contract) where u can define vars and functions. and we named it myepicproject.
pub mod myepicproject {
    use super::*;
    // a fun that takes context and outputs Result.
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()>  { 
        Ok(())
    }
}

#[derive(Accounts)] // another macro here. we'll bsically be able to specify different account constraints.
pub struct StartStuffOff {}

 