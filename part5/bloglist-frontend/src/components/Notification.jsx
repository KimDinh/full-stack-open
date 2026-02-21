const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const className = Object.hasOwn(message, 'error') ? 'error' : 'notification'
  return <div className={className}>{message[className]}</div>
}

export default Notification