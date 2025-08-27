'use client';
import '@/styles/ui.scss';

import { Button } from '@/components/ui/Button';
import { MenuBarEditorIcons } from '@/components/ui/Icons';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { Color } from '@tiptap/extension-color';
import { Level } from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import {
    EditorContent,
    EditorProvider,
    useCurrentEditor,
    useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({
        HTMLAttributes: undefined,
        mergeNestedSpanStyles: false,
    }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
];

type EditorFieldProps = {
    className?: string;
    value: string;
    onChange: (value: string) => void;
    hasMenu?: boolean; // Thêm prop này để xác định có hiển thị menu hay không
};

export function EditorField({
    className = '',
    value,
    onChange,
    hasMenu = true,
}: EditorFieldProps) {
    const editor = useEditor({
        extensions,
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class:
                    'prose max-w-none p-4 min-h-[200px] rounded-md border border-secondary-2 dark:border-dark-secondary-2 bg-white dark:bg-dark-secondary-1 ' +
                    className,
            },
        },
    });

    // Cập nhật lại nội dung khi value ban đầu thay đổi
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [editor, value]);

    if (!editor) {
        return null;
    }

    const getClassName = (type: string, headingLevel?: number) => {
        return cn('rounded-md px-3 py-2', {
            'bg-primary-1 dark:bg-dark-primary-1': editor.isActive(
                type,
                headingLevel && { level: headingLevel }
            ),
        });
    };

    const activeHeading =
        headingLeves.find((h) =>
            editor.isActive('heading', { level: h.level })
        ) || null;

    const currentHeading = activeHeading
        ? activeHeading.label
        : editor.isActive('paragraph')
          ? 'Văn bản'
          : 'Định dạng';

    return (
        <>
            {hasMenu && (
                <div className="mb-2 rounded-xl bg-secondary-1 p-2 dark:bg-dark-secondary-1">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleBold().run()
                            }
                            disabled={
                                !editor.can().chain().focus().toggleBold().run()
                            }
                            className={getClassName('bold')}
                        >
                            <MenuBarEditorIcons.Bold />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleItalic().run()
                            }
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleItalic()
                                    .run()
                            }
                            className={getClassName('italic')}
                        >
                            <MenuBarEditorIcons.Italic />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleStrike().run()
                            }
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleStrike()
                                    .run()
                            }
                            className={getClassName('strike')}
                        >
                            <MenuBarEditorIcons.Strike />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleCode().run()
                            }
                            disabled={
                                !editor.can().chain().focus().toggleCode().run()
                            }
                            className={getClassName('code')}
                        >
                            <MenuBarEditorIcons.Code />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().unsetAllMarks().run()
                            }
                            className={getClassName('unset')}
                        >
                            <MenuBarEditorIcons.ClearMark />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().clearNodes().run()
                            }
                            className={getClassName('clear')}
                        >
                            <MenuBarEditorIcons.ClearNode />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().setParagraph().run()
                            }
                            className={getClassName('paragraph')}
                        >
                            <MenuBarEditorIcons.Paragraph />
                        </Button>

                        <Select
                            value={
                                activeHeading
                                    ? activeHeading.level.toString()
                                    : '0'
                            }
                            onValueChange={(value) => {
                                const level = parseInt(value);
                                if (level === 0) {
                                    editor.chain().focus().setParagraph().run();
                                } else {
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({
                                            level: level as Level,
                                        })
                                        .run();
                                }
                            }}
                        >
                            <SelectTrigger className="w-[140px] gap-2 border border-secondary-2 hover:cursor-pointer dark:border-dark-secondary-2">
                                <SelectValue placeholder="Định dạng">
                                    {currentHeading}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                <SelectItem
                                    className="cursor-pointer"
                                    value="0"
                                >
                                    Văn bản
                                </SelectItem>
                                {headingLeves.map((heading) => (
                                    <SelectItem
                                        key={heading.level}
                                        value={heading.level.toString()}
                                        className="cursor-pointer"
                                    >
                                        {heading.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleBulletList().run()
                            }
                            className={getClassName('bulletList')}
                        >
                            <MenuBarEditorIcons.BulletList />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleCodeBlock().run()
                            }
                            className={getClassName('block')}
                        >
                            <MenuBarEditorIcons.CodeBlock />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().toggleBlockquote().run()
                            }
                            className={getClassName('blockquote')}
                        >
                            <MenuBarEditorIcons.Blockquote />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().setHorizontalRule().run()
                            }
                            className={getClassName('heading')}
                        >
                            <MenuBarEditorIcons.HorizontalRule />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                editor.chain().focus().setHardBreak().run()
                            }
                            className={getClassName('heading')}
                        >
                            <MenuBarEditorIcons.HardBreak />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={
                                !editor.can().chain().focus().undo().run()
                            }
                            className={getClassName('heading')}
                        >
                            <MenuBarEditorIcons.Undo />
                        </Button>
                        <Button
                            variant={'ghost'}
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={
                                !editor.can().chain().focus().redo().run()
                            }
                            className={getClassName('heading')}
                        >
                            <MenuBarEditorIcons.Redo />
                        </Button>
                    </div>
                </div>
            )}

            <EditorContent editor={editor} />
        </>
    );
}

interface Props {
    className?: string;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    onEmptyStateChange?: (isEmpty: boolean) => void; // Optional callback for empty state changes
}

// Kiểm tra nội dung trống (loại bỏ tất cả các thẻ HTML và kiểm tra)
const isEditorEmpty = (html: string) => {
    // Loại bỏ tất cả các thẻ HTML
    const textContent = html.replace(/<[^>]*>/g, '');
    // Kiểm tra xem có text hay không
    return textContent.trim() === '';
};

// Kiểm tra nếu nội dung chỉ chứa <p></p> rỗng
const isOnlyEmptyParagraph = (html: string) => {
    return html.trim() === '<p></p>' || html.trim() === '';
};

const EditorV2 = ({
    className = '',
    setContent,
    content,
    onEmptyStateChange,
}: Props) => {
    const [isEmpty, setIsEmpty] = useState(isEditorEmpty(content));

    // Hook cho phép kiểm tra nội dung trống sau mỗi lần cập nhật
    useEffect(() => {
        const empty = isEditorEmpty(content);
        setIsEmpty(empty);

        // Gọi callback nếu có
        if (onEmptyStateChange) {
            onEmptyStateChange(empty);
        }
    }, [content, onEmptyStateChange]);

    return (
        <div className={cn('w-full', className)}>
            <EditorProvider
                slotBefore={<Menubar />}
                extensions={extensions}
                content={content}
                onUpdate={({ editor }) => {
                    const html = editor.getHTML();

                    // Nếu editor trống (chỉ có <p></p> rỗng), trả về chuỗi rỗng
                    if (isOnlyEmptyParagraph(html)) {
                        setContent('');
                    } else {
                        setContent(html);
                    }
                }}
            />
        </div>
    );
};

const headingLeves = [
    { level: 1, label: 'Tiêu đề 1' },
    { level: 2, label: 'Tiêu đề 2' },
    { level: 3, label: 'Tiêu đề 3' },
    { level: 4, label: 'Tiêu đề 4' },
];

const Menubar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    const getClassName = (type: string, headingLevel?: number) => {
        return cn('rounded-md px-3 py-2', {
            'bg-primary-1 dark:bg-dark-primary-1': editor.isActive(
                type,
                headingLevel && { level: headingLevel }
            ),
        });
    };

    const activeHeading =
        headingLeves.find((h) =>
            editor.isActive('heading', { level: h.level })
        ) || null;

    const currentHeading = activeHeading
        ? activeHeading.label
        : editor.isActive('paragraph')
          ? 'Văn bản'
          : 'Định dạng';

    return (
        <div className="mb-2 rounded-xl bg-secondary-1 p-2 dark:bg-dark-secondary-1">
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={getClassName('bold')}
                >
                    <MenuBarEditorIcons.Bold />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can().chain().focus().toggleItalic().run()
                    }
                    className={getClassName('italic')}
                >
                    <MenuBarEditorIcons.Italic />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can().chain().focus().toggleStrike().run()
                    }
                    className={getClassName('strike')}
                >
                    <MenuBarEditorIcons.Strike />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={getClassName('code')}
                >
                    <MenuBarEditorIcons.Code />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    className={getClassName('unset')}
                >
                    <MenuBarEditorIcons.ClearMark />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().clearNodes().run()}
                    className={getClassName('clear')}
                >
                    <MenuBarEditorIcons.ClearNode />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={getClassName('paragraph')}
                >
                    <MenuBarEditorIcons.Paragraph />
                </Button>

                <Select
                    value={activeHeading ? activeHeading.level.toString() : '0'}
                    onValueChange={(value) => {
                        const level = parseInt(value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({
                                    level: level as Level,
                                })
                                .run();
                        }
                    }}
                >
                    <SelectTrigger className="w-[140px] gap-2 border border-secondary-2 hover:cursor-pointer dark:border-dark-secondary-2">
                        <SelectValue placeholder="Định dạng">
                            {currentHeading}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                        <SelectItem className="cursor-pointer" value="0">
                            Văn bản
                        </SelectItem>
                        {headingLeves.map((heading) => (
                            <SelectItem
                                key={heading.level}
                                value={heading.level.toString()}
                                className="cursor-pointer"
                            >
                                {heading.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant={'ghost'}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={getClassName('bulletList')}
                >
                    <MenuBarEditorIcons.BulletList />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={getClassName('block')}
                >
                    <MenuBarEditorIcons.CodeBlock />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={getClassName('blockquote')}
                >
                    <MenuBarEditorIcons.Blockquote />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                    className={getClassName('heading')}
                >
                    <MenuBarEditorIcons.HorizontalRule />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().setHardBreak().run()}
                    className={getClassName('heading')}
                >
                    <MenuBarEditorIcons.HardBreak />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className={getClassName('heading')}
                >
                    <MenuBarEditorIcons.Undo />
                </Button>
                <Button
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className={getClassName('heading')}
                >
                    <MenuBarEditorIcons.Redo />
                </Button>
            </div>
        </div>
    );
};

export default EditorV2;
