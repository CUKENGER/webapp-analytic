

export const RadioIcon = ({checked = false}: {checked?: boolean}) => {

	const fill = checked ? '#0080FF' : 'none'
	const stroke = checked ? '#0080FF' : 'var(--gray-stroke)'
	return (
		<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="4" y="4" width="14" height="14" rx="4" stroke={stroke} strokeWidth="1.4" />
			<rect x="6" y="6" width="10" height="10" rx="2" fill={fill} />
		</svg>
	)
}