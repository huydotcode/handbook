'use client';
import '@/styles/ui.scss';

import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Icons, { MenuBarEditorIcons } from '@/components/ui/Icons';
import { Level } from '@tiptap/extension-heading';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';

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
        <div className={className + ' overflow-y-scroll'}>
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
            {/* Hiển thị trạng thái trống (cho mục đích debug) */}
            {/* <div className="text-xs text-gray-500 mt-2">
                Editor trống: {isEmpty ? 'Có' : 'Không'}
            </div> */}
        </div>
    );
};

const headingLeves = [
    { level: 1, label: 'Heading 1' },
    { level: 2, label: 'Heading 2' },
    { level: 3, label: 'Heading 3' },
    { level: 4, label: 'Heading 4' },
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

                <Popover>
                    <PopoverContent>
                        <div className={'flex flex-col'}>
                            {headingLeves.map((heading) => (
                                <Button
                                    className={getClassName(
                                        'heading',
                                        heading.level
                                    )}
                                    variant={'text'}
                                    key={heading.level}
                                    onClick={() => {
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleHeading({
                                                level: heading.level as Level,
                                            })
                                            .run();
                                    }}
                                >
                                    {heading.label}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'ghost'}
                            className={'flex items-center gap-2'}
                        >
                            Heading 1 <Icons.ArrowDown />
                        </Button>
                    </PopoverTrigger>
                </Popover>

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
