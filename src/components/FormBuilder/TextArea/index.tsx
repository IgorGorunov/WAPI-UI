import React, {
    FormEvent,
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useImperativeHandle,
} from "react";
import { FieldPropsType } from "@/types/forms";
import "./styles.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

const TextArea = forwardRef<HTMLTextAreaElement, FieldPropsType>(
    (
        {
            classNames = "",
            name,
            label = "",
            type = "text", // not really used for textarea, but kept for compatibility
            onChange,
            isRequired = false,
            placeholder = "",
            errorMessage,
            disabled = false,
            value = "",
            rules,
            errors,
            needToasts = true,
            width,
            rows = 4,
            hint = "",
            ...otherProps
        },
        ref
    ) => {
        const innerRef = useRef<HTMLTextAreaElement | null>(null);

        // Expose the inner textarea to parent via forwarded ref
        useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement, []);

        const resizeTextarea = useCallback(() => {
            const el = innerRef.current;
            if (!el) return;

            // Reset height to recalc correctly, then set to scrollHeight
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight + 2}px`;
        }, []);

        const handleChange = useCallback(
            (event: FormEvent<HTMLTextAreaElement>) => {
                const { value } = event.target as HTMLTextAreaElement;
                if (onChange) onChange(value);
                // Resize on every change
                resizeTextarea();
            },
            [onChange, resizeTextarea]
        );

        // Resize on mount and whenever external value changes
        useEffect(() => {
            resizeTextarea();
        }, [value, resizeTextarea]);

        return (
            <TutorialHintTooltip
                hint={hint}
                classNames={`${width ? "width-" + width : ""}`}
            >
                <div
                    className={`form-control ${classNames ? classNames : ""} ${
                        isRequired ? "required" : ""
                    } ${disabled ? "is-disabled" : ""} ${
                        errorMessage ? "has-error" : ""
                    }`}
                >
                    {label && <label htmlFor={name}>{label}</label>}
                    <textarea
                        id={name}
                        placeholder={placeholder}
                        onChange={handleChange}
                        value={value as string}
                        disabled={disabled}
                        rows={rows}
                        {...otherProps}
                        ref={innerRef}
                        autoComplete="new-user-email"
                        aria-autocomplete="none"
                    />
                    {errorMessage && <p className="error">{errorMessage}</p>}
                </div>
            </TutorialHintTooltip>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;