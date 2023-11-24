import { useEffect, useRef } from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { AiOutlineLoading } from 'react-icons/ai';
import { BsFillSendFill } from 'react-icons/bs';
import Button from '../ui/Button';

interface Props {
    valueInput: string;
    setValueInput: React.Dispatch<React.SetStateAction<string>>;
    sendComment: (replyTo?: null) => Promise<void>;
    isSending: boolean;
    autoFocus?: boolean;
    placeholder?: string;
}

const InputComment: React.FC<Props> = ({
    valueInput,
    setValueInput,
    sendComment,
    isSending,
    autoFocus,
    placeholder,
}) => {
    // Xử lí với input
    const inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);

    // Handle key down
    const handleKeyPress: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        e
    ) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment(null);
        }
    };

    useEffect(() => {
        if (inputRef.current && autoFocus) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <div className="flex">
            <TextAreaAutosize
                className="h-10 bg-secondary flex-1 p-2 rounded-l-xl cursor-text text-sm text-start pt-[9px] overflow-y-scroll w-[calc(100%-40px)] resize-none outline-none dark:bg-dark-500 dark:placeholder:text-gray-400"
                ref={inputRef}
                name="text"
                onKeyPress={handleKeyPress}
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                placeholder={placeholder || 'Viết bình luận...'}
                spellCheck={false}
            ></TextAreaAutosize>

            <Button
                className="bg-secondary w-10 right-0 rounded-r-xl hover:bg-light-100 hover:cursor-pointer px-3 z-10 border-l-2 dark:bg-dark-500 dark:hover:bg-neutral-500"
                variant={'custom'}
                size={'none'}
                onClick={() => sendComment(null)}
            >
                {isSending ? (
                    <AiOutlineLoading className="animate-spin" />
                ) : (
                    <BsFillSendFill />
                )}
            </Button>
        </div>
    );
};
export default InputComment;
