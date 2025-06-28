import React from 'react';
import OperationResult from '../OperationResult/OperationResult';
import { useOpenLink } from '@/hooks/useOpenWebLink';

const TariffControlSuccess: React.FC = () => {
  const { handleOpenWebLink } = useOpenLink();

  // Кастомное уведомление с внешней ссылкой
  const customNotice = (
    <p>
      Подробное руководство по настройке сервиса вы можете найти в{' '}
      <span
        className="text-tg-link cursor-pointer"
        onClick={() => handleOpenWebLink('https://mbel.notion.site/help-telegraphyx')}
      >
        инструкциях
      </span>
    </p>
  );

  return <OperationResult customNotice={customNotice} />;
};

export default TariffControlSuccess;
