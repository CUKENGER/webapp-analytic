import { ReactNode } from "react";
import { Notice } from "../@common/Notice";
import { UITextarea, UITextareaProps } from "./UITextarea";

interface PropTypes extends UITextareaProps {
	footerLabel: string | ReactNode;
	noticeText?: string;
}

export const UITextareaField = ({
	footerLabel,
	noticeText,
	...rest
}: PropTypes) => {
	return (
		<div className="w-full flex flex-col gap-2">
			<UITextarea {...rest} />
			{noticeText && (
				<Notice error className="text-start">
					{noticeText}
				</Notice>
			)}
			<p className="text-start text-sm text-gray leading-[1.4]">{footerLabel}</p>
		</div>
	);
};
