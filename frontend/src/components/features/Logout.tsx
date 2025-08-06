import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

const Logout = () => {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login");
    }
    return (
        <Button className="bg-transparent" data-test="logout-button" onClick={handleLogout}>Logout</Button>
    )
}

export default Logout