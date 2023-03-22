const { ethers, run, network } = require("hardhat")

async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to: ${simpleStorage.address}`)
    console.log(`ChainId is ${network.config.chainId}`)
    if (network.config.chainId == 5 && process.env.GOERLI_ETHERSCAN_APIKET) {
        console.log("Waiting for 6 txs before verifying...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieveFavoriteNumber()
    console.log(`Current value is: ${currentValue}`)
    const transactionResponse = await simpleStorage.storeFavoriteNumber(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieveFavoriteNumber()
    console.log(`Updated value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified"))
            console.log("already verified")
        else console.log(e)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
