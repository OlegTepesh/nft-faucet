<template>
  <div class="columns">
    <div class="column is-two-thirds-tablet is-half-desktop">
      <h1 class="title">Ethereum ERC721 NFT Faucet</h1>
      <h2 class="subtitle">Mint NFT to an address</h2>

      <div class="fields">
        <b-field
          label="Address"
          class="field-height"
          :type="{ 'is-danger': !isRecepeintAddressValid }"
          :message="isRecepeintAddressValid ? '' : `The address must be valid`"
        >
          <b-input
            v-model="recepeintAddress"
            name="address"
            placeholder="0x00000..."
            maxlength="42"
          />
        </b-field>

        <b-field
          label="Amount"
          class="field-height"
          :type="{ 'is-danger': !isTokenAmountValid }"
          :message="
            isTokenAmountValid
              ? ''
              : `You can't mint less than 1 or more than 42 tokens per transaction`
          "
        >
          <b-input
            v-model="tokenAmount"
            type="number"
            min="1"
            max="42"
            name="amount"
            placeholder="1"
          />
        </b-field>

        <div class="level is-mobile">
          <button
            v-if="ethAccount"
            class="button is-primary"
            :disabled="clicked"
            @click="mintNFT"
          >
            Mint Free NFT
          </button>
          <button v-else class="button is-primary" @click="connect">
            Connect
          </button>
        </div>
      </div>

      <div v-if="ethAccount" class="info columns is-multiline">
        <div class="column">
          <p class="heading">Network</p>
          <p class="title">
            {{ networkName }}
          </p>
        </div>
        <div class="column">
          <p class="heading">Balance</p>
          <p class="title">{{ balance }} {{ currency }}</p>
        </div>
        <div class="column">
          <p class="heading">Token Balance</p>
          <p class="title">{{ tokenBalance }} NFTF</p>
        </div>
        <div class="column is-12">
          <p class="heading">ETH Account</p>
          <p class="title">
            <a class="title" :href="addressUrl(ethAccount)" target="_blank">
              {{ ethAccount }}
            </a>
          </p>
        </div>
        <div class="column is-12">
          <p class="heading">NFT Contract Address</p>
          <p class="title">
            <a
              class="title"
              :href="addressUrl(contractAddress)"
              target="_blank"
            >
              {{ contractAddress }}
            </a>
          </p>
        </div>
        <div v-show="txs.length > 0" class="column is-12">
          <p class="heading">Sent transactions</p>
          <b-field class="explorer" grouped group-multiline>
            <p v-for="(tx, index) in txs" :key="index" class="control">
              <a :href="txHashUrl(tx)" target="_blank">
                {{ txHashUrl(tx) }}
              </a>
            </p>
          </b-field>
        </div>
      </div>
    </div>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import walletStatusTypes from '~/context/wallet-status-types'
import walletStatusNotifications from '~/context/wallet-status-notifications'

export default {
  name: 'IndexPage',
  components: {},
  data() {
    return {
      isLoading: false,
      clicked: false,
    }
  },
  computed: {
    ...mapState('wallet', ['ethAccount', 'netId', 'balance', 'chainId']),
    ...mapState('token', ['contractAddress', 'tokenBalance', 'txs']),
    ...mapGetters('wallet', ['networkConfig', 'networkName', 'currency']),
    // walletStatus() {
    //   return this.$store
    // },
    ...mapState({
      walletStatus: ({ wallet }) => wallet.status,
    }),
    recepeintAddress: {
      set(val) {
        this.$store.commit('setRecepeintAddress', val)
      },
      get() {
        return this.$store.state.recepeintAddress.value
      },
    },
    isRecepeintAddressValid() {
      return this.$store.state.recepeintAddress.valid
    },
    tokenAmount: {
      set(val) {
        this.$store.commit('setTokenAmount', val)
      },
      get() {
        return this.$store.state.tokenAmount.value
      },
    },
    isTokenAmountValid() {
      return this.$store.state.tokenAmount.valid
    },
  },
  watch: {
    walletStatus(newStatus) {
      switch (newStatus) {
        case walletStatusTypes.INITED:
          this.isLoading = true
          break
        case walletStatusTypes.NO_PROVIDER:
          this.$notify.error(walletStatusNotifications.NO_PROVIDER)
          this.$store.commit('wallet/resetStatus')
          break
        case walletStatusTypes.REJECTED:
          this.$notify.error(walletStatusNotifications.REJECTED)
          this.$store.commit('wallet/resetStatus')
          break
        case walletStatusTypes.SUCCESS:
          this.$notify.success(walletStatusNotifications.SUCCESS)
      }
      if (newStatus !== walletStatusTypes.INITED) {
        this.isLoading = false
      }
    },
  },
  methods: {
    ...mapActions('wallet', ['connect']),
    ...mapActions('token', ['mint']),
    txHashUrl(txHash) {
      return `${this.networkConfig.explorerUrl.tx}/${txHash}`
    },
    addressUrl(address) {
      return `${this.networkConfig.explorerUrl.address}/${address}`
    },
    async mintNFT() {
      if (!this.isRecepeintAddressValid || !this.isTokenAmountValid) {
        this.$notify.error(
          'Please make sure all fields are filled in correctly'
        )
        return
      }

      this.clicked = true
      await this.mint({ to: this.recepeintAddress, amount: this.tokenAmount })
      this.clicked = false
      this.$notify.success('Success')
    },
  },
}
</script>
