const { ethers } = require('hardhat');
const { signMetaTxRequest } = require('../src/signer');
const { readFileSync, writeFileSync } = require('fs');

function getInstance(name) {
  const address = JSON.parse(readFileSync('deploy.json'))[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then(f => f.attach(address));
}

async function main() {
  const forwarder = await getInstance('MinimalForwarder');
  const registry = await getInstance("RegistryV2");

  const { NAME: name, ADDRESS: from, PRIVATE_KEY: signer } = process.env;
  const data = registry.interface.encodeFunctionData('register', [name || 'sign-test']);
  const result = await signMetaTxRequest(signer, forwarder, {
    to: registry.address, from, data
  });

  const stringified = JSON.stringify(result, null, 2);
  writeFileSync('tmp/request.json', stringified);
  console.log(stringified);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}