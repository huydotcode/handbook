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
            className="h-10 bg-secondary flex-1 p-2 rounded-l-xl cursor-text text-sm text-start pt-[9px] overflow-y-scroll w-[calc(100%-40px)] resize-none outline-none dark:bg-dark-500 dark:placeholder:text-gray-400"
            placeholder={placeholder || 'Viết bình luận...'}
            spellCheck={false}
            onKeyPress={handleKeyPress}
            {...register('text', {
                required: true,
                validate: (value) => value.trim() !== '',
            })}
        ></TextareaAutosize>
    );
};
export default InputComment;
