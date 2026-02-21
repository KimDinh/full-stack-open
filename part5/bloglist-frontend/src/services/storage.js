const KEY = 'loggedUser'

const getUser = () => {
  const userJSON = localStorage.getItem(KEY)
  if (userJSON) {
    return JSON.parse(userJSON)
  }
  return null
}

const saveUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user))
}

const removeUser = () => {
  localStorage.removeItem(KEY)
}

export default { getUser, saveUser, removeUser }