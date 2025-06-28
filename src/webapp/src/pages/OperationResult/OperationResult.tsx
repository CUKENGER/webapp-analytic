import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SuccessPage } from '@/components/@common/SuccessPage';
import { PATHS } from '@/components/utils/paths';
import { useBackNavigate } from '@/hooks/useBackNavigate';
import { useOpenLink } from '@/hooks/useOpenWebLink';


// Тип для данных state
interface Paragraph {
  text: string;
  boldParts?: string[];
}

interface ContentData {
  paragraphs?: Paragraph[]
  text?: string;
  boldParts?: string[];
}

interface NoticeData {
  text: string;
  link?: {
    text: string;
    url?: string; // Внешняя ссылка
    path?: string; // Внутренний путь
		suffix?: string;
  };
}

interface ButtonData {
  text: string;
  redirectPath?: string;
}

// Основной тип state
export interface OperationResultState {
  content: ContentData;
  notice?: NoticeData;
  button?: ButtonData;
  backPath?: string | number;
  uuid?: string;
}

// Тип для пропсов компонента
interface OperationResultProps {
  customNotice?: React.ReactNode;
}

// Универсальный компонент
const OperationResult: React.FC<{ customNotice?: React.ReactNode }> = ({ customNotice }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleOpenWebLink } = useOpenLink();
  const state = location.state

  const { content, notice, button, backPath, uuid } = state;

  useBackNavigate(backPath ?? -1);

  // Обработка ошибки
  if (!state || !state.content) {
    return (
      <SuccessPage
        onClick={() => navigate(-2)}
        noticeText={<p>Произошла ошибка. Вернитесь назад.</p>}
      >
        <p>Данные операции не найдены.</p>
      </SuccessPage>
    );
  }

  // Рендеринг контента
  const renderContent = () => {
    // Если есть paragraphs, рендерим абзацы с отступами
    if (content.paragraphs) {
      return (
        <div className="flex flex-col gap-2 w-full">
          {content.paragraphs.map((paragraph, index) => {
            let text = paragraph.text;
            if (paragraph.boldParts) {
              paragraph.boldParts.forEach((part) => {
                text = text.replace(part, `<b>${part}</b>`);
              });
              return <p key={index} dangerouslySetInnerHTML={{ __html: text }} />;
            }
            return <p key={index}>{text}</p>;
          })}
        </div>
      );
    }

    // Если есть text, рендерим простой текст
    if (content.text) {
      let text = content.text;
      if (content.boldParts) {
        content.boldParts.forEach((part) => {
          text = text.replace(part, `<b>${part}</b>`);
        });
        return <p dangerouslySetInnerHTML={{ __html: text }} />;
      }
      return <p>{text}</p>;
    }

    return null; // Никогда не должно произойти из-за проверки выше
  };

  // Рендеринг уведомления
  const renderNotice = () => {
    if (customNotice) return customNotice; // Кастомное уведомление (для TariffControlSuccess)
    if (!notice) return undefined;

    if (notice.link) {
      const handleClick = () => {
        if (notice?.link?.url) {
          handleOpenWebLink(notice.link.url);
        } else if (notice?.link?.path) {
          navigate(notice.link.path);
        }
      };
      return (
        <span>
          {notice.text}{' '}
          <span className="text-tg-link cursor-pointer" onClick={handleClick}>
            {notice.link.text}
          </span>
          {notice.link.suffix && (
            <span className="text-tg-text">{notice.link.suffix}</span>
          )}
          {/* <span>.</span> */}
        </span>
      )
    }
    return <p>{notice.text}</p>;
  };

  // Обработчик кнопки
  const handleButtonClick = () => {
    if (uuid) {
      navigate(PATHS.projects.project(uuid), { replace: true });
    } else if (button?.redirectPath) {
      navigate(button.redirectPath, { replace: true });
    } else {
      navigate(PATHS.root, { replace: true });
    }
  };

  return (
    <SuccessPage
      onClick={button ? handleButtonClick : undefined}
      noticeText={renderNotice()}
      btnText={button?.text}
    >
      {renderContent()}
    </SuccessPage>
  );
};

export default OperationResult;