let accessToken: string | null = null

export const AUTH_CHANGED_EVENT = 'auth-changed'

function notifyAuthChanged(): void {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export const accessTokenStore = {
  get(): string | null {
    return accessToken
  },

  set(token: string): void {
    accessToken = token
    notifyAuthChanged()
  },

  clear(): void {
    accessToken = null
    notifyAuthChanged()
  },
}
