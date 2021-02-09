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
  const tx = await forwarder.execute(request, signature);
  if (process.env.NODE_ENV !== 'test') console.log(`Sent meta-tx: ${tx.hash}`);
  return tx;
}

module.exports = {
  relay,
}
