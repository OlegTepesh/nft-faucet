export const state = () => ({
  recepeintAddress: {
    value: '',
    valid: true,
  },
  tokenAmount: {
    value: 1,
    valid: true,
  },
})

export const mutations = {
  setRecepeintAddress(state, value) {
    const valid = value.length >= 42 && window.web3.utils.isAddress(value)
    state.recepeintAddress.value = value
    state.recepeintAddress.valid = valid
  },
  setTokenAmount(state, value) {
    const valid = Number(value) >= 1 && Number(value) <= 42
    state.tokenAmount.value = value
    state.tokenAmount.valid = valid
  },
}
