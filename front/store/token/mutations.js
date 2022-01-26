export default {
  setContractAddress(state, contractAddress) {
    state.contractAddress = contractAddress
  },
  setTokenBalance(state, tokenBalance) {
    state.tokenBalance = tokenBalance
  },
  addTx(state, txHash) {
    state.txs.push(txHash)
  },
}
