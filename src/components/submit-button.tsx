"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import type { ReactNode } from "react";

const SubmitButton = ({children}:{children:ReactNode}) => {

  const { pending } = useFormStatus();

  return <Button aria-disabled={pending} type="submit">
    {pending ? "Submitting..." : children}
  </Button>;
};
export default SubmitButton;
