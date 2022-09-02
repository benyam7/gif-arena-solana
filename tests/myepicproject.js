const anchor = require("@project-serum/anchor");
const { mintTo } = require("@solana/spl-token");
const { SystemProgram, Connection, clusterApiUrl, LAMPORTS_PER_SOL, Keypair } =
  anchor.web3;
const splToken = require("@solana/spl-token");
const { min } = require("bn.js");
const { createMint, getMint, getOrCreateAssociatedTokenAccount, getAccount } =
  splToken;

const main = async () => {
  console.log("🚀 Starting test...");
  // create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider); // tell Anchor to set our provider. So, it gets this data from `solana config get`. in this case, it's grabbing our local env. This way Anchor knows to run our code locally.

  const program = anchor.workspace.Myepicproject; // this super cool thing given to us by Anchor that will automatically compile our code in lib.rs and get it deployed locally on a local `validator`. A lot of magic in one line.
  // Naming + folder strucure is mega mportant here. Ex: anchor know to look at `programs/myepicproject/src/lib.rs` b/c we used `anchor.workspace.Myepicproject` . So, you need to captilize the first letter(that what i thought)
  console.log(program, "program");
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

  await program.rpc.addGif(
    "https://giphy.com/clips/sleep-good-morning-wake-up-SqBgrlwX9NKONmGpJ1",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  await program.rpc.addGif(
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
  console.log(
    "👀 Vote count for first gif",
    account.gifList[0].voteCount.toNumber()
  );

  const tx3 = await program.rpc.voteForGif(new anchor.BN(1), {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log("👀 GIF Count", account.totalGifs.toString());
  console.log("👀 GIF List", account.gifList);
  console.log(
    "👀 Vote count for first gif after voting for first gif",
    account.gifList[0].voteCount.toNumber()
  );

  // request lamport for the senderAccount
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const senderAccount = anchor.web3.Keypair.generate();
  const recieverAccount = anchor.web3.Keypair.generate();

  const reqAirdropSignature = await connection.requestAirdrop(
    senderAccount.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  console.log("req tx", reqAirdropSignature);

  await connection.confirmTransaction(reqAirdropSignature);

  const airdropedBalance = await connection.getBalance(senderAccount.publicKey);
  console.log("balance airdropped", airdropedBalance);

  await program.rpc.tipGifYouLikeSomeSol(new anchor.BN(100), {
    accounts: {
      to: recieverAccount.publicKey,
      from: senderAccount.publicKey,

      systemProgram: SystemProgram.programId,
    },
    signers: [senderAccount],
  });

  const recievedSOL = await connection.getBalance(recieverAccount.publicKey);
  console.log("recievedSol", recievedSOL);
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
