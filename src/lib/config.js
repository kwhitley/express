// returns only process.env prefixed with CLIENT_{something}
export const getClientEnvironmentVariables = () =>
  Object
    .keys(process && process.env || {})
    .filter(v => v.indexOf('CLIENT_') === 0)
    .reduce((a, key) => {
      a[key] = process.env[key]
      return a
    }, {})

export const configInjection = `
      const ENV_KEY = window.ENV_KEY = Symbol.for('ENV')

      // all public ENV vars injected here
      window[ENV_KEY] = ${JSON.stringify(getClientEnvironmentVariables() || {}, null, 2)}

      // getter for public vars (e.g. getEnv('CLIENT_AUTH0_DOMAIN'))
      const getEnv = window.getEnv = (key = '', options = {}) => {
        let { required } = options
        let value = window[ENV_KEY][key]

        if (value === undefined && required) {
          console.warn('WARNING: Environment variable', key, 'was expected, but not found...')
        }

        return value
      }`

export const scriptWrapped = (src = '') => `<script>${src}</script>`
