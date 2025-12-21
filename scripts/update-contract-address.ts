import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Script to automatically update the contract address in frontend config
 * after deployment
 */
async function updateContractAddress() {
  try {
    // Read the deployment file
    const deploymentPath = join(__dirname, '../deployments/localhost/HealthMetrics.json');
    const deployment = JSON.parse(readFileSync(deploymentPath, 'utf-8'));
    const contractAddress = deployment.address;

    if (!contractAddress) {
      console.error('❌ No contract address found in deployment file');
      process.exit(1);
    }

    // Read the frontend config file
    const configPath = join(__dirname, '../frontend/src/config/contract.ts');
    let configContent = readFileSync(configPath, 'utf-8');

    // Update the localhost address
    const addressRegex = /localhost:\s*'0x[a-fA-F0-9]+'/;
    const newAddressLine = `localhost: '${contractAddress}'`;
    
    if (addressRegex.test(configContent)) {
      configContent = configContent.replace(addressRegex, newAddressLine);
      
      // Write back to file
      writeFileSync(configPath, configContent, 'utf-8');
      
      console.log('✅ Contract address updated in frontend config:');
      console.log(`   ${contractAddress}`);
    } else {
      console.error('❌ Could not find localhost address pattern in config file');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error updating contract address:', error);
    process.exit(1);
  }
}

updateContractAddress();

















