const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const className = message.hasOwnProperty("error") ? "error" : "notification"
  return <div className={className}>{message[className]}</div>
};

export default Notification