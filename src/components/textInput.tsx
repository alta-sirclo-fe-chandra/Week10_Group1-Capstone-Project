import { ChangeEventHandler } from "react";

type input = {
  label: string;
  type: string;
  onChange?: ChangeEventHandler;
  placeholder?: any;
  value?: string;
  isInvalid?: boolean;
};

const TextInput = (input: input) => {
  return (
    <div className="form-group mt-3 text-start">
      <p>
        {input.label}
        <span className="input text-danger">*</span>
      </p>
      <input
        className={`form-control ${input.isInvalid ? "is-invalid" : ""}`}
        type={input.type}
        onChange={input.onChange}
        placeholder={input.placeholder}
        required
      />
    </div>
  );
};

export default TextInput;
