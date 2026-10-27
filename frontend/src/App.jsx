import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./pages/login"
import Home from "./pages/home"

function App() {
  const navigate = useNavigate()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
