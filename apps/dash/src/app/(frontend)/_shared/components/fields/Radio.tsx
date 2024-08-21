interface OptionProps {
  hform: any;
  name?: string;
  group: string;
  description?: string;
  data?: any;
  label: string;
}
export default function RadioInput(props: OptionProps) {
  return (
    <div className="my-1 flex-grow">
      <div key={`option-${props.name}`} className="relative flex items-center">
        <div className="flex h-6 items-center">
          <input
            id={`option-${props.name}`}
            aria-describedby={`option-${props.name}-description`}
            {...props.hform.register(props.group)}
            value={props.data}
            type="radio"
            className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-600"
          />
        </div>
        <div className="ml-3 flex-grow items-center text-base leading-6">
          <label
            htmlFor={`option-${props.name}`}
            className="flex font-medium text-gray-900"
          >
            <div className="flex-grow">{props.label}</div>
          </label>{" "}
          {props.description && (
            <span id={`${props.name}-description`} className=" text-gray-500">
              {props.description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
