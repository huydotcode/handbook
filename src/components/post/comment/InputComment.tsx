import { KeyboardEventHandler } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

type IFormData = {
    text: string;
};

interface Props {
    placeholder?: string;
    register: UseFormRegister<IFormData>;
    inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

const InputComment: React.FC<Props> = ({ placeholder, register, inputRef }) => {
    return (
        <Textarea
            className="cursor-text overflow-auto rounded-l-xl rounded-r-none bg-transparent p-2 text-start text-sm outline-none"
            placeholder={placeholder || 'Viết bình luận...'}
            // ref={inputRef}
            spellCheck={false}
            autoComplete="off"
            // onKeyPress={handleKeyPress}
            {...register('text', {
                required: true,
                validate: (value) => value.trim() !== '',
            })}
        />
    );
};
export default InputComment;
