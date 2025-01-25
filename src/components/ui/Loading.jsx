import { Loader, Text } from "@mantine/core";
import React from "react";

const Loading = () => {
  return (
    <div className="h-full absolute top-0 w-full flex gap-1 items-center justify-center">
      <Loader size={30} />
      <Text>Đang tải...</Text>
    </div>
  );
};

export default Loading;
