import React from 'react';
import Button from './Button';
import { cn } from '@/lib/utils';

interface FormProps {
    children: React.ReactNode;
}

const Form = React.forwardRef<
    HTMLFormElement,
    React.FormHTMLAttributes<HTMLFormElement>
>((props, ref) => {
    return (
        <form
            className="flex w-full flex-col rounded-xl border border-primary-1 px-6 py-4 dark:bg-dark-secondary-2"
            ref={ref}
            {...props}
        >
            {props.children}
        </form>
    );
});

const FormTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
    return (
        <h1
            className="mb-2 text-center text-2xl font-bold"
            ref={ref}
            {...props}
        />
    );
});

const FormGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
    return <div className="mb-2 w-full" ref={ref} {...props} />;
});

const FormInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
    return (
        <input
            ref={ref}
            className="mt-2 w-full rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1"
            {...props}
        />
    );
});

const FormSelect = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement>
>((props, ref) => {
    return (
        <select
            ref={ref}
            className="mt-2 w-full rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1"
            {...props}
        />
    );
});

const FormLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>((props, ref) => {
    return (
        <label
            className={cn('text-sm', props.className)}
            ref={ref}
            {...props}
        />
    );
});

const FormError = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
    return <p ref={ref} className="text-red-500" {...props} />;
});

const FormTextArea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
    return (
        <textarea
            ref={ref}
            className="mt-2 w-full rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1"
            {...props}
        />
    );
});

const FormButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
    return (
        <Button
            className={'mt-2'}
            variant={'primary'}
            type={'submit'}
            {...props}
        >
            {props.children}
        </Button>
    );
});

export {
    Form,
    FormInput,
    FormLabel,
    FormError,
    FormButton,
    FormGroup,
    FormTitle,
    FormSelect,
    FormTextArea,
};
