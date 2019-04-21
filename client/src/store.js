import { writable } from 'svelte/store'

export const pageStore = writable('/')
export const userStore = writable({
  Username: localStorage.getItem('Username'),
  Role: localStorage.getItem('Role'),
  Visitor: localStorage.getItem('Visitor'),
  Firstname: localStorage.getItem('Firstname'),
  Lastname: localStorage.getItem('Lastname'),
})

export const updateUser = user => {
  userStore.set(user)
  Object.entries(user).forEach(([userAttrKey, userAttrValue]) => {
    localStorage.setItem(userAttrKey, userAttrValue)
  })
}

export const clearUser = () => {
  const unsubscribe = userStore.subscribe(user => {
    Object.keys(user).forEach(userAttrKey => {
      localStorage.setItem(userAttrKey, '')
    })
  })
  userStore.set({})
  unsubscribe()
}

export const changePage = path => {
  history.pushState({}, '', path)
  pageStore.set(path)
}
