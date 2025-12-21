import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const userAddressRaw = "0xbDA5747bFD65F08deb54cb465e887D40e51B197f"; // Your MetaMask address
  const userAddress = ethers.getAddress(userAddressRaw.toLowerCase()); // Normalize address
  
  // Connect to localhost provider
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Create a signer for the MetaMask address (using provider only for read)
  const HealthMetrics = await ethers.getContractAt("HealthMetrics", contractAddress);
  
  console.log(`\n🔍 Checking data for address: ${userAddress}`);
  console.log(`📍 Contract: ${contractAddress}\n`);
  
  // Call hasHealthData with specific address context
  try {
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log(`❌ No contract at address ${contractAddress}`);
      return;
    }
    
    // Use staticCall to simulate call from specific address
    const hasDataCall = HealthMetrics.interface.encodeFunctionData("hasHealthData", []);
    const result = await provider.call({
      to: contractAddress,
      from: userAddress,
      data: hasDataCall,
    });
    
    const hasData = HealthMetrics.interface.decodeFunctionResult("hasHealthData", result)[0];
    console.log(`Has data: ${hasData}`);
    
    if (hasData) {
      const timestampCall = HealthMetrics.interface.encodeFunctionData("getTimestamp", []);
      const tsResult = await provider.call({
        to: contractAddress,
        from: userAddress,
        data: timestampCall,
      });
      const timestamp = HealthMetrics.interface.decodeFunctionResult("getTimestamp", tsResult)[0];
      console.log(`Timestamp: ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
    } else {
      console.log(`❌ No data found for this address`);
    }
  } catch (error: any) {
    console.error(`Error checking data: ${error.message}`);
  }
  
  const totalUsers = await HealthMetrics.getTotalUsers();
  console.log(`\n📊 Total users: ${totalUsers}`);
  
  for (let i = 0; i < totalUsers; i++) {
    const user = await HealthMetrics.getUserAtIndex(i);
    console.log(`  User ${i}: ${user}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

