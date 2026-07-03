import { useEffect } from "react"
import { getProfile } from "./services/auth.service";

function App() {

  useEffect(() => {
    const load = async () => {
      const user = await getProfile();
      console.log(user);
    }
    load();
  }, [])

  return (
    <>

    </>
  )
}

export default App
