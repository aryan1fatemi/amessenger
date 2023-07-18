import clsx from "clsx"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form" 

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  disabled?: boolean;
}
const Input: React.FC<InputProps> = ({
  label,
  id,
  type ,
  required,
  register,
  errors,
 disabled}) => {
  return (
    <div>
        <label className="block text-sm font-medium leading-6 text-sky-900" htmlFor={id}>{label}</label>
        <div className="mt-2">
            <input
                type={type}
                id={id}
                autoComplete={id}
                disabled={disabled}
                { ...register(id, { required })} 
                className={clsx(`form-input 
                  block 
                  w-full  
                  rounded-md
                  border-0
                  py-1.5
                  text-sky-900
                  shadow-sm
                  ring-1
                  ring-insest
                  ring-sky-300
                  focus:ring-2
                  focus:ring-inset
                  focus:ring-gray-600
                  sm:text-sm
                  sm:leading-6`, errors[id] && "focus:ring-pink-700")}/> 
    
        </div>
    </div>
  )
}

export default Input