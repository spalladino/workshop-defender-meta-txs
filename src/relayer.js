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
}
