'use client';
import React, { useCallback, useRef } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import TextAreaAutosize from 'react-textarea-autosize';

interface Props {
    className: string;
    field: ControllerRenderProps<IPostFormData, 'content'>;
    handleSubmit: (
        e?: React.BaseSyntheticEvent<object, any, any> | undefined
    ) => Promise<void>;
}

const TextEditor: React.FC<Props> = React.forwardRef(function TextEditor(
    { className, field, handleSubmit },
    ref
) {
    const { onChange, value } = field;

    const editorRef: React.RefObject<any> = useRef();

    const handleChange = (e: any) => {
        onChange(e.target.value);
    };

    const handleFocus = useCallback(() => {
        if (editorRef) {
            editorRef.current.focus();
        }
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && value.trim().length === 0) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit();
        }
    };

    return (
        <>
            <div className={className} onClick={handleFocus}>
                <TextAreaAutosize
                    autoComplete="off"
                    ref={editorRef}
                    value={value}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="h-auto w-full resize-none bg-transparent outline-none"
                    placeholder="Bạn đang nghĩ gì thế?"
                    spellCheck={false}
                    aria-label="Bạn đang nghĩ gì?"
                    wrap="hard"
                    rows={5}
                ></TextAreaAutosize>
            </div>
        </>
    );
});

export default TextEditor;
