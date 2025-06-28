import { PageLayout } from "@/atoms/PageLayout";
import { BlockContainer } from "@/components/@common/BlockContainer";
import { BlockContentChevron } from "@/components/@common/BlockContentChevron";
import { BlockTitle } from "@/components/@common/BlockTitle";
import { MainButtonBox } from "@/components/ui/MainButtonBox";


const Stats = () => {

  const balance = 9000
  const isButtonDisabled = balance >= 10000

  return (
    <PageLayout className="bg-bottom-menu">
      <BlockTitle title="Статистика" classNameTitle="text-white-text" />
      <div>
        <BlockContainer
          className="mt-0 px-0 card-shadow-default border-[#363E4E] bg-[#363E4E]"
          itemClassName="pl-0 bg-bottom-menu"
          divideClassName="bg-[#363E4E]"
          needBg={false}
        >
          <div className="px-4">
            <BlockContentChevron
              param="Ваш баланс"
              value={`${balance} ₽`}
              needIcon={false}
              needCursorPointer={false}
              needHover={false}
              classNameBlock="text-white-text"
            />
          </div>
          <div className="px-4">
            <BlockContentChevron
              param="Привлечено пользователей"
              value="8"
              needIcon={false}
              needCursorPointer={false}
              needHover={false}
              classNameBlock="text-white-text"
            />
          </div>
          <div className="px-4">
            <BlockContentChevron
              param="Подключено каналов"
              value="2"
              needIcon={false}
              needCursorPointer={false}
              needHover={false}
              classNameBlock="text-white-text"
            />
          </div>
          <div className="px-4">
            <BlockContentChevron
              param="Платных пользователей"
              value="0"
              needIcon={false}
              needCursorPointer={false}
              needHover={false}
              classNameBlock="text-white-text"
            />
          </div>
          <div className="py-3 px-4">
            <p className="text-start text-sm leading-[1.4]">
              Вы сможете запросить вывод вашего баланса от 10 000 ₽.
            </p>
          </div>
        </BlockContainer>
      </div>
      <MainButtonBox disabled={!isButtonDisabled}>
        Запросить вывод
      </MainButtonBox>
    </PageLayout>
  )
}

export default Stats