import networkConfig from '@/networkConfig'

export default {
  networkName(state) {
    return networkConfig[`netId${state.chainId}`].networkName
  },
  currency(state) {
    return networkConfig[`netId${state.chainId}`].currencyName
  },
  networkConfig(state) {
    return networkConfig[`netId${state.chainId}`]
  },
}
