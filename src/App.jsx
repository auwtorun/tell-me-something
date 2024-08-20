import React from 'react'
import Create from './Create'
import Messages from './Messages'

const App = () => {
  return (
    <>
    <Create></Create>
    <div className='flex flex-col gap-4 m-6 h-full'>
      <Messages></Messages>
    </div>
    </>
  )
}

export default App