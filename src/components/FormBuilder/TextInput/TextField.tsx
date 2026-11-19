import React, {FormEvent, forwardRef, useCallback} from "react";
import {FieldPropsType} from "@/types/forms";
import styles from "./styles.module.scss";
import TutorialHintTooltip from "@/components/TutorialHintTooltip";

const URL_REGEX = /(https?:\/\/[^\s;]+|www\.[^\s;]+)/gi;

const extractFirstUrl = (val: string): string | null => {
  if (!val) return null;
  const match = val.match(/(https?:\/\/[^\s;]+|www\.[^\s;]+)/i);
  if (!match) return null;
  const url = match[0];
  return url.startsWith('www.') ? `https://${url}` : url;
};

const renderTextWithLinks = (val: string) => {
  if (!val) return null;
  const parts = val.split(URL_REGEX);
  return parts.map((part, index) => {
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      const href = part.startsWith('www.') ? `https://${part}` : part;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="is-link"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const TextField = forwardRef<HTMLInputElement, FieldPropsType>(({
      classNames='',
      name,
      label='',
      type='text',
      onChange,
      isRequired = false,
      placeholder = '',
      errorMessage,
      disabled = false,
      isLoading = false,
      value='',
      rules,
      errors,
      needToasts=true,
      width,
      hint='',
      notDisable,
      noCounters = true,
      onlyAllowedSymbols = false,
      onlyWholeNumbers = false,
    onKeyDownFn,
    btnName = '',
    onBtnClick,
    hasLink = false,
      ...otherProps
}, ref) => {

  //const validRegex = /^[a-zA-Z0-9\s.,\-+_:;!?*()\[\]'"]+$/;
  // const invalidRegex = /[^a-zA-Z0-9\s.,\-+_:;!?—*'"%&#()\[\]]+/g;
    const invalidRegex = /[^A-Za-z0-9\s\-\—+_\.,:;!?*'"%&#()\[\]]+/g;


  const handleChange = useCallback((event: FormEvent) => {
      const {value} = event.target as HTMLInputElement;

      if (onChange) {
          if (onlyAllowedSymbols) {
              const sanitizedValue = value.replace(invalidRegex, '');
              onChange(sanitizedValue);
          // } else if (type==='number' && onlyWholeNumbers) {
          //     const newValue = value.replace(/\D/g, "");
          //     onChange(newValue);
          } else onChange(value);
      }
  } ,[] )

  const getDate = (dateStr: string) => {
      const date = !dateStr ? new Date() : new Date(dateStr);
      return date.toISOString().substring(0,10);
  }

  const curVal = (type === 'number') ? value as number : type=== 'date' ? (getDate(value as string)) : value as string;

  const firstUrl = hasLink && typeof curVal === 'string' ? extractFirstUrl(curVal) : null;

    const onKeyDown = (e) => {
        if (e.key === 'Enter') e.preventDefault();
        onlyWholeNumbers && (e.key === '.' || e.key === ',') && e.preventDefault();
        if (onKeyDownFn && e.key === "Enter") onKeyDownFn();
    }
  //     e.key === 'Enter' && e.preventDefault();
  //     onlyWholeNumbers && (e.key === '.' || e.key === ',') && e.preventDefault();
  // }

  return (
    <TutorialHintTooltip hint={hint} classNames={`${width ? "width-"+width : ""}`}>
        <div className={`${styles['form-control'] || 'form-control'} ${styles[classNames] || classNames}  ${isRequired ? styles["required"] : ''} ${disabled ? `${styles['is-disabled'] || 'is-disabled'} is-disabled` : ''}  ${errorMessage ? styles['has-error']+' has-error' : ''}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className={styles['input-wrapper']}>
              {hasLink && disabled ? (
                <>
                  <input
                    ref={ref}
                    id={name}
                    type="hidden"
                    value={curVal || ""}
                    {...otherProps}
                  />
                  <div
                    id={`${name}-display`}
                    className={`${styles['disabled-link-field']} ${firstUrl ? styles['has-link-btn'] : ''}`}
                  >
                    {typeof curVal === 'string' && curVal ? (
                      renderTextWithLinks(curVal)
                    ) : (
                      <span className={styles['placeholder-text']}>{placeholder || '\u00A0'}</span>
                    )}
                  </div>
                </>
              ) : (
                <input
                  ref={ref}
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  onChange={handleChange}
                  value={curVal || ""}
                  disabled={disabled}
                  onKeyDown={onKeyDown}
                  {...otherProps}
                  autoComplete="new-user-email"
                  aria-autocomplete='none'
                  className={`${noCounters ? 'no-counters' : ''} ${isLoading ? styles['input--loading'] || '' : ''} ${hasLink && firstUrl ? styles['input--with-link'] || '' : ''}`.trim()}
                />
              )}
              {isLoading ? <span className={styles['input-spinner']} aria-label="Loading" /> : null}
              {hasLink && firstUrl ? (
                <a
                  href={firstUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['form-input-link-btn']}
                  title="Open link in new tab"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              ) : null}
              {btnName && onBtnClick ? <button type={'button'} disabled={disabled} className={styles['form-input-btn']} onClick={onBtnClick}>{btnName}</button> : null}
            </div>
            {errorMessage && <p className={`${styles.error} error`}>{errorMessage}</p>}
          {/*{errors && name in errors ? (*/}
          {/*  <p className="error er1">*/}
          {/*    {(errors && errors[name]?.message) || errorMessage}*/}
          {/*  </p>*/}
          {/*) : null}*/}
        </div>
    </TutorialHintTooltip>

  );
});

export default TextField;
