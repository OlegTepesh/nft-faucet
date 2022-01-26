import Noty from 'noty'

// this.$notify[type](message)
export default function ({ app }, inject) {
  const types = {
    error: 'error',
    success: 'success',
    warning: 'warning',
    show: 'info',
  }

  const options = {
    theme: 'mint',
    layout: 'topRight',
    timeout: 5000,
    closeWith: ['click'],
  }

  const notify = {
    create(type, message) {
      new Noty({
        ...options,
        type: types[type],
        text: message,
      }).show()
    },

    ...Object.keys(types).reduce((methods, type) => {
      methods[type] = (message) => {
        notify.create([type], message)
      }
      return methods
    }, {}),
  }
  inject('notify', notify)
}
