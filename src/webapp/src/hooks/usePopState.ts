import { useEffect } from "react"
import { useNavigate } from "react-router"

export const usePopState = (url: string) => {
  const navigate = useNavigate()

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault()
      navigate(url, { replace: true })
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [navigate])
}
