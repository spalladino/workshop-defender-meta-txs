const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: 'GSNv2 Forwarder',
      version: '0.0.1',
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  }
};

async function signTypedData(signer, from, data) {
  // Hardhat VM and Metamask differ regarding EIP712 methods
  const isHardhat = data.domain.chainId == 31337;
  const [method, argData] = isHardhat
    ? ['eth_signTypedData', data]
    : ['eth_signTypedData_v3', JSON.stringify(data)]
  return await signer.send(method, [from, argData]);
}

async function signMetaTxRequest(signer, forwarder, request) {
  // Obtain nonce and chainId
  const { from } = request;
  const nonce = await forwarder.getNonce(from).then(nonce => nonce.toString());
  const chainId = await forwarder.provider.getNetwork().then(n => n.chainId);
  
  // Setup formatted data to sign
  const message = { value: 0, gas: 1e6, ...request, nonce };
  const signTypeData = getMetaTxTypeData(chainId, forwarder.address);
  const toSign = { ...signTypeData, message }

  // And ask the signer to sign it!
  const signed = await signTypedData(signer, from, toSign);
  return { signed, request: message };
}

module.exports = { signMetaTxRequest };