import { AlertCircle, Check, LoaderCircle } from 'lucide-react';

export function Field({ label, name, error, hint, optional, className = '', children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={name}>
        {label}
        {optional && <span className="optional"> (facultatif)</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="field__hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

// Champ texte relié à son libellé et à son message d'erreur.
export function TextField({ label, name, error, hint, optional, className, onInput, ...inputProps }) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  const Tag = inputProps.rows ? 'textarea' : 'input';
  return (
    <Field label={label} name={name} error={error} hint={hint} optional={optional} className={className}>
      <Tag
        id={name}
        name={name}
        className="input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        onInput={onInput}
        {...inputProps}
      />
    </Field>
  );
}

export function SelectField({ label, name, error, hint, optional, className, options, placeholder, onInput, ...selectProps }) {
  return (
    <Field label={label} name={name} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={name}
        name={name}
        className="input"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onInput={onInput}
        {...selectProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// Groupe de cases à cocher affichées en pastilles.
export function ChipGroup({ legend, name, options, error, hint, defaultValues = [], onChange, className = '' }) {
  return (
    <fieldset className={`field ${error ? 'has-error' : ''} ${className}`.trim()} style={{ border: 0, padding: 0, margin: 0 }}>
      <legend className="field__label" style={{ padding: 0, marginBottom: '0.5rem' }}>
        {legend}
      </legend>
      <div className="chips">
        {options.map((option) => (
          <label key={option.value} className="chip">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
              onChange={onChange}
            />
            <span className="chip__tick">
              <Check strokeWidth={3} />
            </span>
            {option.label}
          </label>
        ))}
      </div>
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error">{error}</p>}
    </fieldset>
  );
}

export function ConsentCheckbox({ error, onChange, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="check">
        <input type="checkbox" name="consentement" onChange={onChange} aria-invalid={error ? 'true' : undefined} />
        <span>{children}</span>
      </label>
      {error && <p className="field__error">{error}</p>}
    </div>
  );
}

// Champ piège pour les robots : invisible et ignoré par les humains.
export function Honeypot() {
  return (
    <div className="honeypot" aria-hidden="true">
      <label>
        Site web
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormAlert({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert--error" role="alert">
      <AlertCircle aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function SubmitButton({ submitting, children, className = 'btn btn--dark', icon: IconAfter }) {
  return (
    <button type="submit" className={className} disabled={submitting}>
      {submitting ? (
        <>
          <LoaderCircle className="spinner" aria-hidden="true" /> Envoi en cours…
        </>
      ) : (
        <>
          {children}
          {IconAfter && <IconAfter aria-hidden="true" />}
        </>
      )}
    </button>
  );
}
