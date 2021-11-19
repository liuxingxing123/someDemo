import React, { useState ,useEffect} from 'react'

function Count () {
  const [count, setCount] = useState(0)
  
  const handleCount = () => {
    setCount(count+1)
  }

  useEffect(() => {
    document.title = `you clickd ${count}`
    console.log(999)
  }, [count]);
  return (
    <div>
      <p>you clicked {count} times</p>
      <button onClick={handleCount}>
        click me
      </button>
    </div>
  )
}

export default Count