import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Initialize FHEVM CLI API for non-hardhat networks
  if (hre.network.name !== "hardhat") {
    await hre.fhevm.initializeCLIApi();
  }

  const deployed = await deploy("HealthMetrics", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`HealthMetrics contract: `, deployed.address);
};

export default func;
func.id = "deploy_health_metrics"; // id required to prevent reexecution
func.tags = ["HealthMetrics"];

