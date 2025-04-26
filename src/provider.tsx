import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider locale="zh-CN" navigate={navigate} useHref={useHref}>
      <ToastProvider placement="top-center" toastProps={{timeout: 1500}} />
      {children}
    </HeroUIProvider>
  );
}
