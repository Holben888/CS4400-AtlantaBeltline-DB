import { writable } from 'svelte/store'

console.log(localStorage.getItem('user'))

export const pageStore = writable('/')
export const userStore = writable({
  Username: localStorage.getItem('Username'),
  Role: localStorage.getItem('Role'),
  FirstName: localStorage.getItem('FirstName'),
  LastName: localStorage.getItem('LastName'),
})

export const updateUser = user => {
  userStore.set(user)
  Object.entries(user).forEach(([userAttrKey, userAttrValue]) => {
    localStorage.setItem(userAttrKey, userAttrValue)
  })
}

export const changePage = path => {
  history.pushState({}, '', path)
  pageStore.set(path)
}
