const ethers = require('hardhat');

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

async function main() {
  const forwarder = await deploy('MinimalForwarder');
  const registry = await deploy("RegistryV2", this.forwarder.address);

  console.log(forwarder);
  console.log(registry);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}