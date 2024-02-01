import { TextareaAutosize } from '@mui/material';
import { KeyboardEventHandler, useEffect } from 'react';
import { UseFormRegister } from 'react-hook-form';

type IFormData = {
    text: string;
};

interface Props {
    placeholder?: string;
    register: UseFormRegister<IFormData>;
    formRef: React.RefObject<HTMLFormElement>;
}

const InputComment: React.FC<Props> = ({ placeholder, register, formRef }) => {
    const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    return (
        <TextareaAutosize
            className="h-10 w-[calc(100%-40px)] flex-1 cursor-text resize-none overflow-y-scroll rounded-l-xl bg-secondary p-2 pt-[9px] text-start text-sm outline-none dark:bg-dark-500 dark:placeholder:text-gray-400"
            placeholder={placeholder || 'Viết bình luận...'}
            spellCheck={false}
            autoComplete="off"
            onKeyPress={handleKeyPress}
            {...register('text', {
                required: true,
                validate: (value) => value.trim() !== '',
            })}
        ></TextareaAutosize>
    );
};
export default InputComment;
