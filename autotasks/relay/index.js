const ethers = require('ethers');
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');
const { relay } = require('../../src/relayer');

const ForwarderAbi = require('../../artifacts/openzeppelin-solidity/contracts/GSNv2/MinimalForwarder.sol/MinimalForwarder.json').abi;
const ForwarderAddress = process.env.FORWARDER_ADDRESS;

exports.handler = async function(event) {
  // Parse webhook payload
  const payload = JSON.parse(event.body);
  const { request, signature } = payload;
  
  // Initialize Relayer provider and signer, and forwarder contract
  const credentials = { ... event };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const forwarder = new ethers.Contract(ForwarderAddress, ForwarderAbi, signer);
  
  // Relay transaction!
  const tx = await relay(forwarder, request, signature);
  return { txHash: tx.hash };
}

// async function relay(forwarder, request, signature) {
//   // Validate request
//   const valid = await forwarder.verify(request, signature);
//   if (!valid) throw new Error(`Invalid request`);
  
//   // Send meta-tx through the relayer
//   const tx = await forwarder.execute(request, signature);
//   console.log(`Sent meta-tx: ${tx.hash}`);
//   return tx;
// }

// if (require.main === module) {
//   require('dotenv').config();
//   const { RELAYER_API_KEY: apiKey, RELAYER_API_SECRET: apiSecret } = process.env;
//   exports.handler({ apiKey, apiSecret })
//     .then(() => process.exit(0))
//     .catch(error => { console.error(error); process.exit(1); });
// }