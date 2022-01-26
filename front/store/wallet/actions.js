import walletStatusTypes from '@/context/wallet-status-types'
import networkConfig from '@/networkConfig'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')

const DEFAULT_NETWORK = networkConfig.getDefaultNetworkId().toString(16)

export default {
  async connect({ commit, dispatch }) {
    if (!this.$provider) {
      commit('setWalletStatus', walletStatusTypes.NO_PROVIDER)
      return
    }

    try {
      commit('setWalletStatus', walletStatusTypes.INITED)
      const [address] = await this.$provider.request({
        method: 'eth_requestAccounts',
      })

      if (address) {
        await dispatch('getChainId')
        commit('setEthAccount', address)
        commit('setRecepeintAddress', address, { root: true })
        commit('setWalletStatus', walletStatusTypes.SUCCESS)
        dispatch('addWalletInteractionListeners')
        dispatch('onSuccessfulConnection')
      } else {
        throw new Error('No wallet address provided')
      }
    } catch (e) {
      commit('setWalletStatus', walletStatusTypes.REJECTED)
      console.error(e.message)
    }
  },

  addWalletInteractionListeners({ commit, dispatch }) {
    this.$provider.on('accountsChanged', (accounts) => {
      commit('setEthAccount', accounts[0])
    })
    this.$provider.on('chainChanged', (chainId) => {
      // Metamask recommend reloading the page unless we have good reason not to
      window.location.reload()
    })
  },

  async getChainId({ commit, dispatch }) {
    const chainId = await this.$provider.request({
      method: 'eth_chainId',
      params: [],
    })
    const id = Number(chainId)

    if (!networkConfig[`netId${id}`]) {
      await dispatch('switchNetworkRequest')
    } else {
      window.web3 = createAlchemyWeb3(networkConfig[`netId${id}`].rpcUrl)
      commit('setChainId', id)
    }
  },

  onSuccessfulConnection({ dispatch }) {
    dispatch('getBalance')
    dispatch('token/getContractAddress', null, { root: true })
    dispatch('token/getTokenBalance', null, { root: true })
  },

  async getBalance({ commit, state }) {
    try {
      const balance = await this.$provider.request({
        method: 'eth_getBalance',
        params: [state.ethAccount, 'latest'],
      })
      const ethBalance = window.web3.utils.fromWei(balance)
      commit('setBalance', ethBalance)

      return balance
    } catch (err) {
      this.$notify.error('Transaction error')
      throw new Error(err.message)
    }
  },

  async switchNetworkRequest() {
    this.$notify.error(
      "Faucet doesn't support current network, please consider switch the network"
    )
    try {
      await this.$provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: DEFAULT_NETWORK }],
      })
      window.location.reload()
    } catch (e) {
      throw new Error('Current network not supported')
    }
  },
}
