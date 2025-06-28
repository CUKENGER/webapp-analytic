import { PageLayout } from "@/atoms/PageLayout"
import { BlockContainer } from "@/components/@common/BlockContainer"
import { BlockTitle } from "@/components/@common/BlockTitle"
import { Notice } from "@/components/@common/Notice"
import { SectionTitle } from "@/components/@common/SectionTitle"
import { CopyIcon } from "@/components/icons/CopyIcon"
import { MainButtonBox } from "@/components/ui/MainButtonBox"
import { CustomRadioGroup } from "@/components/ui/radio-group"
import { PATHS } from '@/components/utils/paths'
import { useToast } from "@/hooks/use-toast"
import { copyText } from "@/utils/copyText"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { OperationResultState } from "../OperationResult/OperationResult"

const scripts = [
  { label: 'yaMetrica', value: "<script type='text/javascript'>(function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); for (let j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } } k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(98353639, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });</script>" },
  { label: 'tgphyx', value: "<script src='https://app.telegraphyx.ru/landing-connector?tgChannelID=-1001764336716&yaCounterID=98353639&withoutRedirectToChannel=123' defer></script>" },
  { label: 'tilda', value: "<script defer>document.addEventListener('DOMContentLoaded', () => {try { $('.header__button a').on('click', ev => { TgphxLC.onMarkedButtonClick(ev); return false; }); } catch(e) { console.log(e); }});</script>" },
]

const options = [
  { label: 'Без переадресации', value: 'noForward' },
  { label: "С переадресацией", value: 'forward' }
]

const ConnectLanding = () => {
  const [selectedOption, setSelectedOption] = useState(options[0].value)
  const navigate = useNavigate()
  const { id } = useParams()

  const { toast } = useToast()

  // Мемоизация скриптов для предотвращения лишних вычислений
  const scriptMap = useMemo(() => {
    return new Map(scripts.map((script) => [script.label, script]))
  }, [])

  const getTgphyxScript = useMemo(() => {
    const baseScript = scriptMap.get("tgphyx")
    if (!baseScript) return undefined
    return {
      ...baseScript,
      value:
        selectedOption === "noForward"
          ? baseScript.value.replace("withoutRedirectToChannel=123", "withoutRedirectToChannel=true")
          : baseScript.value.replace("withoutRedirectToChannel=123", "withoutRedirectToChannel=false"),
    }
  }, [selectedOption, scriptMap])

  const handleCopy = (code?: string) => {
    if (code) {
      copyText(code)
      toast({
        description: "Код скопирован"
      })
    }
  }

  const handleNext = () => {
    const state: OperationResultState = {
      content: {
        text: 'Вы настроили свой лендинг!'
      },
      notice: {
        text: 'Обязательно проверьте его работу после настройки!'
      },
      button: {
        text: 'Продолжить',
        redirectPath: PATHS.projects.landing.root(id ?? '/')
      },
      backPath: PATHS.projects.landing.root(id ?? '/')
    }
    navigate(PATHS.result, { state })
  }

  return (
    <PageLayout className="bg-tg-secondary">
      <BlockTitle title="Подключение лендинга">
        Описание
      </BlockTitle>
      <div className="flex flex-col gap-4">
        {/* Блок Яндекс Метрики */}
        <ScriptBlock
          title="1. Установите код Яндекс Метрики на лендинг"
          script={scriptMap.get("yaMetrica")}
          onCopy={handleCopy}
        />

        {/* Блок Telegraphyx с выбором опции */}
        <BlockContainer className="mt-0 px-0" itemClassName='pl-0'>
          <SectionTitle title="2. Выберите вариант и вставьте код на лендинг" />
          <div>
            <CustomRadioGroup
              options={options}
              classNameOption='px-4 leading-[1.4]'
              value={selectedOption}
              onChange={setSelectedOption}
            />
          </div>
          <div className="px-4 py-3 flex flex-col gap-2 text-start">
            {getTgphyxScript ? (
              <Notice>
                <pre className="whitespace-pre-wrap break-all text-sm">{getTgphyxScript.value}</pre>
              </Notice>
            ) : (
              <Notice>
                <span className="text-tg-destructive">Скрипт не найден.</span>
              </Notice>
            )}
          </div>
          {getTgphyxScript && (
            <div className="py-3 px-4 h-[46px]">
              <button
                onClick={() => handleCopy(getTgphyxScript.value)}
                className="flex w-full items-center justify-between text-tg-link font-bold hover:text-tg-link-hover transition-colors"
                aria-label="Скопировать код"
              >
                <span className="leading-[80%]">Скопировать код</span>
                <CopyIcon />
              </button>
            </div>
          )}
        </BlockContainer>

        {/* Блок Tilda */}
        <ScriptBlock
          title={
            <span className='leading-[1.4]'>
              3. Установите класс <span className="text-tg-link">"header__button"</span> на кнопку со
              ссылкой на канал
            </span>
          }
          script={scriptMap.get("tilda")}
          description="Если у вас лендинг на Tilda, вставьте этот HTML-код на страницу:"
          onCopy={handleCopy}
        />
      </div>

      <MainButtonBox onClick={handleNext}>
        Продолжить
      </MainButtonBox>

    </PageLayout>
  )
}

export default ConnectLanding


const ScriptBlock: React.FC<{
  title?: React.ReactNode
  script?: { label: string, value: string }
  description?: string
  onCopy: (code?: string) => void
}> = ({ title, script, description, onCopy }) => (
  <BlockContainer className="mt-0 px-0" itemClassName='pl-0'>
    {title && <SectionTitle title={title} />}
    <div className="px-4 py-3 flex flex-col gap-2 text-start">
      {description && <p className="text-sm text-tg-text">{description}</p>}
      {script ? (
        <Notice>
          <pre className="whitespace-pre-wrap break-all text-sm">{script.value}</pre>
        </Notice>
      ) : (
        <Notice>
          <span className="text-tg-destructive">Скрипт не найден.</span>
        </Notice>
      )}
    </div>
    {script && (
      <div className="py-3 px-4 h-[46px]">
        <button
          onClick={() => onCopy(script.value)}
          className="flex w-full items-center justify-between text-tg-link font-bold hover:text-tg-link-hover transition-colors"
          aria-label="Скопировать код"
        >
          <span className="leading-[80%]">Скопировать код</span>
          <CopyIcon />
        </button>
      </div>
    )}
  </BlockContainer>
)
