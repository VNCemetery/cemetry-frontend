import { Box } from "@mantine/core";

export default function HeaderWrapper({ children, ref }) {
  return (
    <div ref={ref} className="fixed top-0 left-0 right-0 z-[1000]">
      {children}
    </div>
  );
}
