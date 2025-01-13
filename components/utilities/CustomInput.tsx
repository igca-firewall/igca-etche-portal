import React from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Control } from "react-hook-form";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  className?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center border rounded-full overflow-hidden">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-3"
            />
          )}
          <FormControl>
            <Input
              type={props.name === "password" ? "password" : props.name === "guardianContact" ? "number": "text"}
              placeholder={props.placeholder}
              className="flex-1 px-4 py-2 border-none focus:outline-none"
              {...field}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="text-sm">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex items-center border rounded-full overflow-hidden">
          <FormControl>
            <Input
              type="date"
              placeholder={props.placeholder}
              {...field}
              value={field.value?.replace(/\//g, "-")} // Replace slashes with dashes
              onChange={(e) =>
                field.onChange(e.target.value.replace(/\//g, "-"))
              } // Ensure input updates correctly
              className="flex-1 px-4 py-2 border-none focus:outline-none pr-8"
            />
          </FormControl>
        </div>
      );
  
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="text-sm font-medium">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="text-red-500 text-xs mt-1" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
