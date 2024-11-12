// import { useState } from 'react'
import FileUpload from './component/FileUpload'
import './App.css'

function App() {

  // const [authToken, setAuthToken]= useState(null)
  //  const handleLoginSuccess  = (token) =>{
  //   setAuthToken(token)
  //  }
  return (
   <div>
    <FileUpload  />
    {/* {!authToken ? (
        <FileUpload authToken={authToken} />
      ) : (
        <FileUpload authToken={authToken} />
      )} */}
   </div>
  )
}

export default App
