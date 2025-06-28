import { forwardRef, ReactNode } from "react";
import { Notice } from "../@common/Notice";
import { UIInput, UIInputProps } from "./UIInput";

interface PropTypes extends UIInputProps {
  footerLabel: string | ReactNode;
  noticeText?: string;
}

export const UITextFieldNotice = forwardRef<HTMLInputElement, PropTypes>(({
  footerLabel,
  noticeText,
  ...rest
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <UIInput {...rest} ref={ref} />
      {noticeText && <Notice error className="text-start">{noticeText}</Notice>}
      <p className="text-start text-sm text-gray leading-[1.4]">{footerLabel}</p>
    </div>
  );
})
