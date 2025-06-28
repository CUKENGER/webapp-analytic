import { NewWindowIcon } from "@/components/icons/NewWindowIcon";
import { SectionContainer } from "@/pages/TariffControl/TariffItem";
import { BlockContainer } from "./BlockContainer";


interface HelpBlockProps {
  image: string;
  image2?: string
  altImage: string
  title: string
  description: string
  onClick?: () => void
}

export const HelpBlock = ({ image, image2, altImage, title, description, onClick }: HelpBlockProps) => {
  return (
    <BlockContainer
      className="mt-0 px-0 card-shadow-default h-full"
      needBg={false}
      itemClassName="pl-0 flex flex-col h-full"
      needFlex={true}
    >
      <SectionContainer
        className="pt-3 flex-1 flex flex-col h-full"
        hasBorder={false}
      >
        <div>
          <div className="w-full h-[140px] flex justify-center items-center py-3 px-4">
            <img
              src={image}
              srcSet={`${image} 1x, ${image2} 2x`}
              alt={altImage}
              className="w-full h-[140px] object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="text-start flex flex-1 flex-col gap-1 py-3 px-4 leading-[1.4]">
          <p className="text-tg-text font-bold">{title}</p>
          <p className="text-tg-text text-sm flex-1">{description}</p>
        </div>
      </SectionContainer>
      <SectionContainer hasBorder={false} className="flex-none">
        <div className="w-full py-3 px-4 h-[46px]">
          <button
            className="flex justify-between w-full items-center"
            onClick={onClick}
          >
            <span className="text-tg-link font-bold">Перейти</span>
            <NewWindowIcon />
          </button>
        </div>
      </SectionContainer>
    </BlockContainer>
  )
}