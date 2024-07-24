import type { ReactNode } from "react";

const Container = ({children}:{children:ReactNode}) => {
  return <section className="container px-6 lg:px-0 @container">{children}</section>;
};
export default Container;
