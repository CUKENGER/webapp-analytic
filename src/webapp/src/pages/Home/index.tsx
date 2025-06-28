import { Link } from "react-router"
import logo_icon from "@/assets/logo.svg"
import { LogoText } from "./LogoText"
import { PageLayout } from '@/atoms/PageLayout'
import { UIButton } from '@/components/ui/UIButton'

export const Home = () => {
  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col justify-between max-w-[640px] mx-auto px-4">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="mb-4">
            <img src={logo_icon} />
          </div>
          <div className="text-center text-tg-text w-full flex flex-col items-center gap-2">
            <LogoText />
            <p className="text-xl text-center text-gray-dark w-full max-w-[640px] dark:text-tg-hint">
              Первая в мире Telegram Mini App по продвижению и аналитике
            </p>
          </div>
        </div>
        <Link to={"/projects"} className="button-container">
          <div className="px-6">
            <UIButton variant="primary">
              Начать
            </UIButton>
          </div>
        </Link>
      </div>
    </PageLayout>
  )
}
