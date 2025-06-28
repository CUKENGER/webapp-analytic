

export const ReloadIcon = ({ className, onClick }: { className?: string, onClick?: () => void }) => {
	return (
		<svg className={className} onClick={onClick} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 11C18 14.866 14.866 18 11 18C8.40901 18 6.14681 16.5923 4.93648 14.5M4 11C4 7.13401 7.13401 4 11 4C13.591 4 15.8532 5.4077 17.0635 7.5" stroke="#0080FF" strokeWidth="2" />
			<path d="M7.79289 13H3.5C3.22386 13 3 13.2239 3 13.5V17.7929C3 18.2383 3.53857 18.4614 3.85355 18.1464L8.14645 13.8536C8.46143 13.5386 8.23835 13 7.79289 13Z" fill="#0080FF" />
			<path d="M19 8.5V4.20711C19 3.76165 18.4614 3.53857 18.1464 3.85355L13.8536 8.14645C13.5386 8.46143 13.7617 9 14.2071 9H18.5C18.7761 9 19 8.77614 19 8.5Z" fill="#0080FF" />
		</svg>
	)
}