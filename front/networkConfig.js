export default {
  getDefaultNetworkId: () => 3, // ropsten

  netId3: {
    verifyingContract: '0xeb404f026c128c0be32e64398b8fb378045da057',
    rpcCallRetryAttempt: 10,
    currencyName: 'rETH',
    explorerUrl: {
      tx: 'https://ropsten.etherscan.io/tx',
      address: 'https://ropsten.etherscan.io/address',
    },
    networkName: 'Ropsten',
    rpcUrl: `https://eth-ropsten.alchemyapi.io/v2/${process.env.alchemyId}`,
    gasPrice: { fast: 1, low: 1, standard: 1 },
    smartContractPollTime: 15,
    isEIP1559Supported: true,
  },
}
