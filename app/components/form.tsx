import * as cache from "~/cache.client";
import { FormProps, Form as RouterForm } from "react-router";

export default function Form({ onSubmit, ...props }: FormProps) {
  return (
    <RouterForm
      {...props}
      onSubmit={(event) => {
        cache.clear();
        onSubmit?.(event);
      }}
    />
  );
}
