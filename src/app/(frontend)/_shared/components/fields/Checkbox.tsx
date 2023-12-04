interface CheckboxProps {
  name: string;
  hform: any;
  registeroptions?: any;
  label: string;
  description?: string;
  data?: any;
}

export default function CheckboxInput(props: CheckboxProps) {
  return (
    <div className="my-1 flex-grow">
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id={`checkbox-${props.name}`}
            aria-describedby={`checkbox-${props.name}-label`}
            {...props.hform.register(props.name, props.registeroptions)}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
        <div className="ml-3 flex flex-grow text-base leading-6">
          <label
            htmlFor={`checkbox-${props.name}`}
            className="flex-grow font-medium text-gray-900"
          >
            {props.label}
          </label>{" "}
          <span id={`checkbox-${props.name}-label`} className="text-gray-500">
            <span className="sr-only">{props.label}</span> {props.description}
          </span>
        </div>
      </div>
    </div>
  );
}
