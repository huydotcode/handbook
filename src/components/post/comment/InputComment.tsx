import { KeyboardEventHandler } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

type IFormData = {
    text: string;
};

interface Props {
    placeholder?: string;
    register: UseFormRegister<IFormData>;
    formRef: React.RefObject<HTMLFormElement | null>;
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
        <Textarea
            className="dark:placeholder: h-10 min-h-0 w-[calc(100%-40px)] flex-1 cursor-text resize-none overflow-y-scroll rounded-l-xl bg-transparent p-2 pt-[9px] text-start text-sm outline-none"
            placeholder={placeholder || 'Viết bình luận...'}
            spellCheck={false}
            autoComplete="off"
            onKeyPress={handleKeyPress}
            {...register('text', {
                required: true,
                validate: (value) => value.trim() !== '',
            })}
        ></Textarea>
    );
};
export default InputComment;
