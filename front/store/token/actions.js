import networkConfig from '@/networkConfig'
import contractABI from '@/abi/NFTFaucet.abi.json'

const loadContract = ({ ethAccount, chainId }) => {
  const contractAddress = networkConfig[`netId${chainId}`].verifyingContract
  return new window.web3.eth.Contract(contractABI, contractAddress, {
    from: ethAccount,
  })
}

export default {
  getContractAddress({ rootState, commit }) {
    try {
      const { ethAccount, chainId } = rootState.wallet
      const contract = loadContract({ ethAccount, chainId })
      commit('setContractAddress', contract._address)
    } catch (e) {
      this.$notify.error('Loading contract error')
      throw new Error(e.message)
    }
  },

  async getTokenBalance({ rootState, commit }) {
    try {
      const { ethAccount, chainId } = rootState.wallet
      const contract = loadContract({ ethAccount, chainId })
      const data = contract.methods.balanceOf(ethAccount).encodeABI()
      const params = {
        method: 'eth_call',
        params: [
          {
            data,
            from: ethAccount,
            to: contract._address,
          },
          'latest',
        ],
      }
      const balance = await this.$provider.request(params)

      commit('setTokenBalance', window.web3.utils.hexToNumberString(balance))
    } catch (e) {
      this.$notify.error('Transaction error')
      throw new Error(e.message)
    }
  },

  async mint({ rootState, commit }, { to, amount }) {
    try {
      const strAmount = amount.toString()
      const { ethAccount, chainId } = rootState.wallet
      const contract = loadContract({ ethAccount, chainId })

      const data = contract.methods.mint(to, strAmount).encodeABI()
      const gas = await contract.methods.mint(to, strAmount).estimateGas()

      const params = {
        method: 'eth_sendTransaction',
        params: [
          {
            data,
            value: '0',
            from: ethAccount,
            to: contract._address,
            gas: '0x' + gas.toString(16),
          },
        ],
      }

      const txHash = await this.$provider.request(params)
      commit('addTx', txHash)
    } catch (e) {
      this.$notify.error(e.message)
      console.error(e.message)
    }
  },
}
