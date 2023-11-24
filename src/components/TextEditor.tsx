'use client';
import React, { useCallback, useRef } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import TextAreaAutosize from 'react-textarea-autosize';

interface IFormData {
    option: 'public' | 'option';
    content: string;
}

interface Props {
    className: string;
    field: ControllerRenderProps<IFormData, 'content'>;
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
                    ref={editorRef}
                    value={value}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full h-auto resize-none outline-none bg-transparent"
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

// const [editorState, setEditorState] = useState(() =>
//   EditorState.createEmpty()
// );

{
    /* <div className={className + " " + "lg:hidden"} onClick={handleFocus}>
      <Editor
          editorKey="editor"
          placeholder={"Bạn đang nghĩ gì thế?"}
          spellCheck={false}
          ref={editorRef}
          editorState={editorState}
          onChange={onEditorStateChange}
          keyBindingFn={myKeyBindingFn}
          handleKeyCommand={handleKeyCommand}
        />
      </div> */
}

// const onEditorStateChange = (editorState: any) => {
//   if (editorState.target) {
//     onChange(editorState.target.value.replace(/\n/g, "<br/>"));
//   }

//   if (editorState instanceof EditorState) {
//     setEditorState(editorState);
//     return onChange(stateToHTML(editorState?.getCurrentContent()));
//   }
// };

// const handleKeyCommand = (command: string): DraftHandleValue => {
//   if (command === "enter_command") {
//     handleSubmit();
//     setEditorState(() => EditorState.createEmpty());
//   }

//   if (command === "shift-enter") {
//     setEditorState(RichUtils.insertSoftNewline(editorState));
//   }

//   return "not-handled";
// };

// const myKeyBindingFn = (e: any) => {
//   if (e.keyCode === 13 && e.shiftKey) {
//     return "shift-enter";
//   } else if (e.keyCode === 13) {
//     return "enter_command";
//   }

//   return getDefaultKeyBinding(e);
// };
