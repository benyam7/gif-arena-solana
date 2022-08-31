const anchor = require("@project-serum/anchor");

const main = async () => {
  console.log("🚀 Starting test...");

  anchor.setProvider(anchor.AnchorProvider.env()); // tell Anchor to set our provider. So, it gets this data from `solana config get`. in this case, it's grabbing our local env. This way Anchor knows to run our code locally.
  const program = anchor.workspace.Myepicproject; // this super cool thing given to us by Anchor that will automatically compile our code in lib.rs and get it deployed locallly on a local `validator`. Al lot of magic in one line.
  // Naming + folder strucure is mega mportant here. Ex: anchor know to look at `programs/myepicproject/src/lib.rs` b/c we used `anchor.workspace.Myepicproject` . So, you need to captilize the first letter(that what i thought)
  const tx = await program.rpc.startStuffOff(); // we're calling our function we're using camelCase here. and we `awiat` it which will wait for ourt local validator to "mine/validate" the instruction.

  console.log("📃 Your transaction signature", tx);
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
