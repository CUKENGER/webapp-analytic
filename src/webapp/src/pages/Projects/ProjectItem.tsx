import { Link } from 'react-router';
import { useGetChannelPhoto } from '@/api/hooks/useGetChannelPhoto';
import avatar_icon from '@/assets/avatar.svg';
import './Projects.style.css';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import plural from "plural-ru";
import { cn } from '@/lib/utils';


interface ProjectItemProps {
  uuid: string
  name: string
  rate?: string
  daytime?: number
}


export const ProjectItem = ({ uuid, name, rate, daytime }: ProjectItemProps) => {

  const launchParams = useLaunchParams()
  const tgAdminID =
    import.meta.env.VITE_TG_ADMIN_ID ?? launchParams?.initData?.user?.id?.toString()

  const { data: photo } = useGetChannelPhoto({ channelUuid: uuid, tgAdminID })

  return (
    <Link to={`/projects/${uuid}`}>
      <button className="flex items-center justify-between w-full p-4 bg-tg-background rounded-2xl pr-0 ProjectItemListButton">
        <div className="flex gap-2 w-full pr-4">
          <div className="flex items-center justify-center rounded-lg size-14 aspect-square">
            {photo && (
              <img
                src={photo.photoUrl}
                alt="Channel photo"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            {!photo && (
              <img
                src={avatar_icon}
                className="text-tg-primary-text object-cover rounded-lg"
              />
            )}
          </div>
          <div className="flex flex-col gap-1 text-start min-w-[60%] text-tg-text">
            <p className="text-base font-bold truncate">{name}</p>
            <p className={'font-medium text-sm'}>
              Тариф:&nbsp;
              <span className="font-bold">
                «{rate ? rate : 'Бесплатный'}»
                {daytime && daytime > 0 ? (
                  <span className={cn(daytime <= 3 && 'text-tg-destructive')}>
                    ({daytime} {plural(daytime, 'день', 'дня', 'дней')})
                  </span>
                ) : rate !== 'Бесплатный' && (
                  <span className="text-tg-destructive">(истёк)</span>
                )}
              </span>
            </p>
          </div>
        </div>
      </button>
    </Link>
  )
}