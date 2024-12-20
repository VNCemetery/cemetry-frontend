import { Box } from "@mantine/core";

export default function HeaderWrapper({ children }) {
  return (
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F2E7ED',
        zIndex: 1000
      }}
    >
      {children}
    </Box>
  );
}
