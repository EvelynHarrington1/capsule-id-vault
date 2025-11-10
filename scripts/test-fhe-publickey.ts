import { ethers } from "hardhat";

async function main() {
  const aclAddress = "0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D";
  
  console.log("Testing FHE Public Key retrieval from ACL...");
  console.log("ACL Address:", aclAddress);
  
  // Check if contract exists
  const code = await ethers.provider.getCode(aclAddress);
  console.log("Contract code length:", code.length);
  
  if (code === "0x") {
    console.error("❌ ACL contract not found at this address!");
    return;
  }
  
  console.log("✅ ACL contract exists");
  
  // Try different function names
  const functionNames = ["getNetworkPublicKey", "getPublicKey", "publicKey"];
  
  for (const funcName of functionNames) {
    try {
      console.log(`\nTrying function: ${funcName}()`);
      const acl = await ethers.getContractAt(
        [
          {
            inputs: [],
            name: funcName,
            outputs: [{ name: "", type: "bytes" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        aclAddress
      );
      
      const publicKey = await acl[funcName]();
      console.log(`✅ Success with ${funcName}!`);
      console.log("Public Key (first 100 chars):", publicKey.substring(0, 100) + "...");
      console.log("Public Key length:", publicKey.length);
      break;
    } catch (err: any) {
      console.log(`❌ Failed with ${funcName}:`, err.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

