// returns only process.env prefixed with CLIENT_{something}
export const getClientEnvironmentVariables = (options = {}) => {
  if (!process || !process.env) {
    return {}
  }

  const varsToExpose = ['NODE_ENV']

  const clientEnvironmentVariables = Object.keys(process.env)
    .filter(v => v.indexOf('CLIENT_') === 0)
    .reduce((a, key) => {
      a[key] = process.env[key]
      return a
    }, {})

  // any vars explicitly exposed will get added here
  varsToExpose.forEach(key => {
    const value = process.env[key]

    if (value !== undefined) {
      clientEnvironmentVariables[key] = value
    }
  })

  return clientEnvironmentVariables
}

export const configInjection = `
      const ENV_KEY = window.ENV_KEY = Symbol.for('ENV')

      // all public ENV vars injected here
      window[ENV_KEY] = ${JSON.stringify(getClientEnvironmentVariables() || {}, null, 2)}

      // getter for public vars (e.g. getEnv('CLIENT_ROOT_URL'))
      const getEnv = window.getEnv = (key = '', options = {}) => {
        let { required } = options
        let value = window[ENV_KEY][key]

        if (value === undefined && required) {
          console.warn('WARNING: Environment variable', key, 'was expected, but not found...')
        }

        return value
      }`

export const scriptWrapped = (src = '') => `<script>${src}</script>`
