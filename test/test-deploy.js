const { assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should Start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieveFavoriteNumber()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should Store a value when we call function storeFavoriteNumber", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.storeFavoriteNumber(
            expectedValue
        )
        await transactionResponse.wait(1)
        const currentValue = await simpleStorage.retrieveFavoriteNumber()
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should add a person's name and their favorite number", async function () {
        const expectedName = "Rawad"
        const expectedValue = "4"
        const transactionResponse = await simpleStorage.addPerson(
            expectedName,
            expectedValue
        )
        await transactionResponse.wait(1)
        const person = await simpleStorage.people(0)
        assert.equal(person.name, expectedName)
        assert.equal(person.favoriteNumber, expectedValue)
    })
})
