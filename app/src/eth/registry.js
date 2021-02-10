import { ethers } from 'ethers';
import { RegistryV2 as address } from '../deploy.json';
import { abi } from '../contracts/RegistryV2.sol/RegistryV2.json';

export function createInstance(provider) {
  return new ethers.Contract(address, abi, provider);
}
