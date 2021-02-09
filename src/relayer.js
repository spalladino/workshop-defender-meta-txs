/**
 * ABI of the MinimalForwarder contract
 */
const ForwarderAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"verify","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

/**
 * Takes a request and signature, verifies them, and relays them to the forwarder contract
 * @param {*} forwarder forwarder ethers contract instance
 * @param {*} request meta-tx request
 * @param {*} signature meta-tx signature
 * @param {*} whitelist optional whitelist of accepted recipients
 */
async function relay(forwarder, request, signature, whitelist) {
  // Verify target contract whitelist
  if (whitelist && !whitelist.includes(request.to)) {
    throw new Error(`Rejected tx to non-whitelisted address ${request.to}`);
  }

  // Validate request
  const valid = await forwarder.verify(request, signature);
  if (!valid) {
    throw new Error(`Invalid request`);
  }
  
  // Send meta-tx through relayer
  const gasLimit = (parseInt(request.gas) + 50000).toString();
  const tx = await forwarder.execute(request, signature, { gasLimit });
  log(`Sent meta-tx: ${tx.hash}`);
  return tx;
}

function log(msg) {
  if (process.env.NODE_ENV !== 'test') console.log(msg);
}

module.exports = {
  relay,
  ForwarderAbi
}
