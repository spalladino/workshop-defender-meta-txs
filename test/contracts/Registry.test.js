const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe("Registry", function() {
  beforeEach(async function() {
    this.registry = await deploy('Registry');
    this.accounts = await ethers.getSigners();
  });

  it("registers a name", async function() {
    const sender = this.accounts[1];
    const registry = this.registry.connect(sender);
    
    const receipt = await registry.register('defender').then(tx => tx.wait());
    
    expect(receipt.events[0].event).to.equal('Registered');
    expect(await registry.owners('defender')).to.equal(sender.address);
    expect(await registry.names(sender.address)).to.equal('defender');
  });
});
