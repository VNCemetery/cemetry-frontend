import { Loader, Text } from "@mantine/core";
import React from "react";

const Loading = () => {
  return (
    <div className=" p-2">
      <div className="flex gap-1 items-center justify-center">
        <Loader size={30} />
        <Text>Đang tải...</Text>
      </div>
    </div>
  );
};

export default Loading;
