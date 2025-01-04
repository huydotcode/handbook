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
            {...props}
            ref={ref}
            className={cn(
                'flex w-full flex-col rounded-xl border border-primary-1  px-6 py-4 dark:bg-dark-secondary-2',
                props.className
            )}
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
            {...props}
            className={cn(
                'mb-2 text-center text-2xl font-bold',
                props.className
            )}
            ref={ref}
        />
    );
});

const FormGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
    return (
        <div
            {...props}
            className={cn('mb-2 w-full', props.className)}
            ref={ref}
        />
    );
});

const FormInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
    return (
        <input
            {...props}
            ref={ref}
            className={cn(
                'mt-2 w-full rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1',
                props.className
            )}
        />
    );
});

const FormSelect = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement>
>((props, ref) => {
    return (
        <select
            {...props}
            ref={ref}
            className={cn(
                'mt-2 w-full rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1',
                props.className
            )}
        />
    );
});

const FormLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>((props, ref) => {
    return (
        <label
            {...props}
            className={cn('text-sm', props.className)}
            ref={ref}
        />
    );
});

const FormError = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
    return (
        <p
            {...props}
            ref={ref}
            className={cn('text-red-500', props.className)}
        />
    );
});

const FormTextArea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
    return (
        <textarea
            {...props}
            ref={ref}
            className={cn(
                'mt-2 w-full rounded-xl bg-primary-1 p-2 focus:border-none focus:outline-none dark:bg-dark-secondary-1',
                props.className
            )}
        />
    );
});

const FormButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
    return (
        <Button
            {...props}
            className={cn('mt-2', props.className)}
            variant={'primary'}
            type={'submit'}
        >
            {props.children}
        </Button>
    );
});

Form.displayName = 'Form';
FormTitle.displayName = 'FormTitle';
FormGroup.displayName = 'FormGroup';
FormInput.displayName = 'FormInput';
FormLabel.displayName = 'FormLabel';
FormError.displayName = 'FormError';
FormButton.displayName = 'FormButton';
FormSelect.displayName = 'FormSelect';
FormTextArea.displayName = 'FormTextArea';

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
