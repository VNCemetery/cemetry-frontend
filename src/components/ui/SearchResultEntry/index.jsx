const SearchResultEntry = ({ item, selectItem, highContrastMode }) => {
  return (
    <div
      onClick={selectItem}
      className={`p-6 mb-4 border-2 rounded-2xl cursor-pointer transition-all ${
        highContrastMode
          ? "bg-yellow-50 border-gray-400 hover:bg-yellow-100"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <Text size="xl" fw={600} className="mb-2">
            {item.fullName}
          </Text>
          <Text size="lg" c={highContrastMode ? "dark.7" : "dimmed"}>
            {item.homeTown || "Chưa có thông tin quê quán"}
          </Text>
        </div>
        <ActionIcon
          variant="light"
          color="blue"
          radius="xl"
          size={48}
          className="hover:scale-110 transition-transform"
        >
          <BiSolidInfoCircle size={24} />
        </ActionIcon>
      </div>
    </div>
  );
};
