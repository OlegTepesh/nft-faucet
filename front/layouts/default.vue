<template>
  <div>
    <nav class="navbar header" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item text-hide logo" href="/"> ERC721 NFT Faucet </a>
        </div>
      </div>
    </nav>
    <section class="main-content section">
      <div class="container">
        <Nuxt />
      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <div class="footer-brand text-hide logo">ERC721 NFT Faucet</div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>
