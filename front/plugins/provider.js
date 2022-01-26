export default function ({ app }, inject) {
  // to be used in future for provider class extension
  try {
    inject('provider', window.ethereum)
  } catch (e) {
    console.error(`Provider plugin injecting error: `, e.message)
  }
}
