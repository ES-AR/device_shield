const FormField = ({ label, hint, ...props }) => {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <input
        className="form-input"
        {...props}
      />
      {hint ? <span className="form-hint">{hint}</span> : null}
    </label>
  );
};

export default FormField;
