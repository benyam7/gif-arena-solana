const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("🚀 Starting test...");
  // create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider); // tell Anchor to set our provider. So, it gets this data from `solana config get`. in this case, it's grabbing our local env. This way Anchor knows to run our code locally.

  const program = anchor.workspace.Myepicproject; // this super cool thing given to us by Anchor that will automatically compile our code in lib.rs and get it deployed locallly on a local `validator`. Al lot of magic in one line.
  // Naming + folder strucure is mega mportant here. Ex: anchor know to look at `programs/myepicproject/src/lib.rs` b/c we used `anchor.workspace.Myepicproject` . So, you need to captilize the first letter(that what i thought)

  // create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  }); // we're calling our function we're using camelCase here(anchor does that for us, so we can follow best practice.). and we `awiat` it which will wait for ourt local validator to "mine/validate" the instruction.

  console.log("📃 Your transaction signature", tx);

  // fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey); // retrieve the account we created
  console.log("👀 GIF Count", account.totalGifs.toString());

  const tx2 = await program.rpc.addGif(
    "https://giphy.com/clips/sleep-good-morning-wake-up-SqBgrlwX9NKONmGpJ1",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );
  // get the account again(cuz remember we're storing state in `accounts` in solana) to see what changed
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log("👀 GIF Count", account.totalGifs.toString());
  console.log("👀 GIF List", account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
