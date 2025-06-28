import { ReactNode } from 'react';
import avatar_icon from '@/assets/avatar.svg';
import '@/pages/Projects/Projects.style.css';


interface PropTypes {
  name: string
  children: ReactNode
  onClick?: () => void
}

export const ButtonBotCard = ({ name, children, onClick }: PropTypes) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 bg-tg-background rounded-2xl h-[88px] pr-0 ProjectItemListButton"
    >
      <div className="flex gap-2 w-full">
        <div className="flex items-center justify-center rounded-lg size-14 aspect-square">
          <img
            src={avatar_icon}
            className="text-tg-primary-text object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-1 text-start min-w-[60%] text-tg-text py-[2px]">
          <p className="text-base font-bold truncate">{name}</p>
          <p className="font-medium text-sm text-start">{children}</p>
        </div>
      </div>
    </button>
  )
}