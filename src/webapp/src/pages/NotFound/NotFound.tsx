import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { useNavigate } from 'react-router'

const NotFound = () => {

	const navigate = useNavigate()

	return (
		<PageLayout>
			<div></div>

			<div className="flex-grow flex items-center justify-center">
				<BlockTitle title="Страница не найдена">
					Кажется, вы забрели не туда. Такой страницы не существует.
				</BlockTitle>
			</div>
			<MainButtonBox onClick={() => navigate('/')}>
				Вернуться на главную
			</MainButtonBox>
		</PageLayout>
	)
}


export default NotFound