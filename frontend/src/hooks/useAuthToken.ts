import { useState, useEffect } from "react";

const useAuthToken = () => {
    const [token, setToken] = useState <string| null>(null);

    useEffect(()=>{
        const savedToken =sessionStorage.getItem("token");
        setToken(savedToken);
    },[])
    
  return token
}

export default useAuthToken