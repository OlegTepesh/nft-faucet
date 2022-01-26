export default {
  setWalletStatus(state, status) {
    state.status = status
  },
  setAddress(state, address) {
    state.address = address
  },
  setEthAccount(state, ethAccount) {
    state.ethAccount = ethAccount
  },
  setChainId(state, chainId) {
    state.chainId = chainId
  },
  setBalance(state, balance) {
    state.balance = balance
  },
  resetStatus(state) {
    state.status = null
  },
}
