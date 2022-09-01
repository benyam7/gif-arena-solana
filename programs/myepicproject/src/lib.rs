use anchor_lang::prelude::*; // we're sorta importing useful stuff from anchor

declare_id!("8YehNCR8UvUeFqiYuSVwoQ6xX25RjACGNzk2bQMEQS8y");  // program id and has info for solana on how to run our program. Anchor has generated this for us(first time, now it's ours lol).

#[program] // they called macros(they basically attach code to our module. like inhertitance) sorta -> everything in this little module below is our program that we want to create handlers for that other people can call.essentially this lets us actually call our Solana program from our frontend via a fetch request.
// "pub mod" : is Rust module (kinda like class/contract) where u can define vars and functions. and we named it myepicproject.
pub mod myepicproject {
    use super::*;
    // a fun that takes context and outputs Result.
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()>  { 
          // Get a reference to the account
          let base_account = &mut ctx.accounts.base_account; // `&mut` gives us to make `changes` to `base_account`, otherwise we'd simply be workin w/ a "local copy" of `base_account`
          // initilize total_gifs
          base_account.total_gifs = 0; 
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()>{
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let gif_id = &mut 1;
        if base_account.gif_list.is_empty() {
            *gif_id = 0;
        }else {
            *gif_id = base_account.gif_list.len();
        }

        // build the struct
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
            id: *gif_id as u64, // so first item, will have an id of zero like index.
            vote_count: 0,
        };

        // add it to the gif_list vector
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }

    pub fn vote_for_gif(ctx: Context<VoteGif>, gif_id: u64) -> Result <()> {
        let base_account = &mut ctx.accounts.base_account;
        let gif_list = &mut base_account.gif_list;

        for i in 0..gif_list.len(){
            if gif_id == gif_list[i].id {
                gif_list[i].vote_count += 1; 
            }
        };
        Ok(())
    }

}

#[derive(Accounts)] // another macro here. we'll bsically be able to specify different account constraints.
pub struct StartStuffOff<'info> {// Attach certain variables to the StartStuffOff context . here we actually specify how to initialize it(account) and what to hold in our StartStuffOff context. We're setting the constraints.
    // we're telling we need "9000 kilobytes" for our program to run. the more the logic our program has, the more space it requires.
    // `init` : will tell Solana to create a new account owned by our current program
    // `payer` = `user` tell our program who's `paying` for the account to be created. in this case, it's the `user` calling the function.
    // `space = 9000`: allocates 9000 bytes of space for the account. Storing in Solana aint free. Users will pay 'rent' and if you don't 'validators' will clear the account!
    #[account(init, payer = user, space = 9000)]  // All we're doing here is tellin Solana how we want to initialize `BaseAccount`
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,  // is data passed into the program that proves to the program that the user calling this program actually owns their wallet account.
    pub system_program: Program <'info, System>, // is refference to the `SystemProgram` which is a the program that basically runs Solana. it does lots of suff but one of main is `to create accounts`. has an id of 11111111111111111111111111111111
}

// here we're creatin a `Context` named `AddGif` that has access to a mutable reference to `base_account`. if not mutable access, it may change data on my function but not change on account.
// so, `Context` is like something that can give access to what we want the user to do with our account state.(my explanation 😅)
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    // add siginer who calls te AddGif method to the struct so that we can save it.
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct VoteGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>
}

// create a custom struct for us to work with
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)] // basically tells anchor on how to serialize/deserialize the struct. remember `account` is a file, so we serialize our data to binary format before storing it, then deserialize when retrieving it.
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub id: u64,
    pub vote_count: u64,
}

// Tell Solanaa what we want to store on this account.
// Basically, tell our program what kind of account it can make and what to hold inside of it. So, `BaseAccount` holds and integer named `total_gifs`
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // attach a vector of type ItemStruct to the account
    pub gif_list: Vec<ItemStruct>,
}


//  solana programs are upgradeable