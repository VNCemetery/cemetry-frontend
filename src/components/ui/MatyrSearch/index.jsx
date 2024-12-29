import FloatingSelector from "../FloatingSelector";
import {
  DEFAULT_AUTO_SUGGEST_SIZE,
  DEFAULT_SEARCH_SIZE,
} from "../../../utils/constants";
import { SelectDropdownSearch } from "../SelectDropdownSearch";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Card,
  CloseIcon,
  Flex,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  MultiSelect,
  NumberInput,
  Pagination,
  Select,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core";
import VIETNAM_LOGO from "../../../assets/VIETNAM_FLAG_LOGO.png";
import { BiMicrophone, BiSearch } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button } from "@mantine/core";
import { FaMagic } from "react-icons/fa";
import { BsArrowLeft, BsQuestion } from "react-icons/bs";

import { getMatyrs } from "../../../services/martyrManagementService";
import { HiAdjustments, HiCheck } from "react-icons/hi";
import SearchResultEntry from "./SearchResultEntry";
import { useInfoStore } from "../../../store/useInfoStore";
import { useMatyrStore } from "../../../store/useMatyrStore";

const MatyrSearch = () => {
  const headerWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const [searchKey, setSearchKey] = useState("");

  const [opened, { open, close }] = useDisclosure(false);
  const [
    opened_record_modal,
    { open: open_record_modal, close: close_record_modal },
  ] = useDisclosure(false);

  const [searchResults, setSearchResults] = useState(null);

  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

  const loadMatyrs = useMatyrStore((state) => state.loadMatyrs);
  const clearMartrys = useMatyrStore((state) => state.clearMartrys);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchSession, setSearchSession] = useState("");
  const handleSearch = async ({
    name = "",
    page = 0,
    size = DEFAULT_SEARCH_SIZE,
  }) => {
    try {
      // Hide auto suggestions
      setShowAutoSuggestions(false);
      // Set loading
      setIsLoadingSearchResults(true);
      // Clear search results
      setSearchResults(null);
      const results = await loadMatyrs(name, page, size);
      // If content is null

      if (!results) {
        setSearchResults(null);
        // Throw error
        throw new Error("No result found");
      }
      setSearchResults(results);
      console.log("Kết quả tìm kiếm:", results);
      setShowSearchResults(true);
      // Set uuid to search session
      setSearchSession(Math.random().toString(36).substring(7));
      setIsLoadingSearchResults(false);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSearchResults(null);
      setShowSearchResults(false);
      setIsLoadingSearchResults(false);
    }
  };

  const { grave_rows } = useInfoStore();

  const [
    showFilterSetting,
    { open: openFilterSetting, close: closeFilterSetting },
  ] = useDisclosure(false);

  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [isLoadingAutoSuggestions, setIsLoadingAutoSuggestions] =
    useState(false);

  const handleAutoSuggest = async (searchKey) => {
    try {
      setIsLoadingAutoSuggestions(true);
      const results = await getMatyrs(searchKey, 0, DEFAULT_AUTO_SUGGEST_SIZE);
      const content = results.content;
      // If content is null
      if (!content) {
        setAutoSuggestions([]);
        // Throw error
        throw new Error("No content found");
      }
      setShowAutoSuggestions(true);
      setIsLoadingAutoSuggestions(false);
      setAutoSuggestions(content);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setAutoSuggestions([]);
      setIsLoadingAutoSuggestions(false);
    }
  };

  useEffect(() => {
    if (searchKey.length > 0) {
      handleAutoSuggest(searchKey);
    } else {
      setAutoSuggestions([]);
    }
  }, [searchKey]);

  // Filters
  const [filters, setFilters] = useState({
    area: "",
    row: "",
  });

  const rowInputRef = useRef(null);

  return (
    <>
      <div className="">
        {" "}
        <Modal
          style={{
            zIndex: 99999999,
          }}
          opened={opened_record_modal}
          onClose={close_record_modal}
          title="Tìm kiếm bằng giọng nói"
          centered
        >
          Tôi vẫn đang nghe
          {/* Modal content */}
        </Modal>
        <div className="z-[4]">
          <div
            ref={headerWrapperRef}
            className={`fixed top-0 left-0 ${
              !opened ? "transparent" : "bg-white"
            } right-0 z-[4]`}
          >
            <div
              className="
            items-center
           flex gap-1 bg-white rounded-full m-2 "
            >
              <div className="flex items-center w-full text-gray-600   w-full p-1 gap-1">
                {!opened ? (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    aria-label="Settings"
                    onClick={() => {
                      open();
                      // Change focus to input
                      searchInputRef.current.focus();
                    }}
                  >
                    <BiSearch
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    variant="transparent"
                    color="blue"
                    aria-label="Settings"
                    onClick={() => {
                      // Check if auto suggestions is shown
                      if (showAutoSuggestions) {
                        setShowAutoSuggestions(false);
                        return;
                      }
                      close();

                      close_record_modal();

                      // stop focus to input
                      searchInputRef.current.blur();
                    }}
                  >
                    <BsArrowLeft
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                )}
                <Input
                  ref={searchInputRef}
                  onClick={() => {
                    if (!opened) {
                      open();
                      // Change focus to input
                      searchInputRef.current.focus();
                    }
                  }}
                  value={searchKey}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      alert("Tìm kiếm");
                    }
                  }}
                  rightSectionPointerEvents="all"
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                  }}
                  radius="xl"
                  style={{
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  className="w-full  border-none"
                  placeholder="Nhập tên liệt sĩ"
                  rightSection={
                    searchKey.length > 0 ? (
                      <CloseIcon
                        aria-label="Clear input"
                        className="mr-2"
                        onClick={() => {
                          setSearchKey("");
                          searchInputRef.current.focus();
                        }}
                        style={{ display: searchKey ? undefined : "none" }}
                      />
                    ) : (
                      <ActionIcon
                        variant="transparent"
                        color="gray"
                        aria-label="Settings"
                        onClick={() => {
                          // Clear search input

                          open();

                          // Change focus to input
                          searchInputRef.current.focus();

                          // Open record modal
                          open_record_modal();

                          // Focus again
                        }}
                      >
                        <BiMicrophone
                          style={{ width: "70%", height: "70%" }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      {opened && (
        <div className="bg-white h-screen  z-[3] absolute top-0 w-full">
          <div>
            {/* Create virtual margin */}
            <div
              className="py-6 bg-white "
              style={{
                height: headerWrapperRef?.current?.offsetHeight || 0,
              }}
            ></div>

            <div className="h-full bg-white">
              <div className="px-2 flex flex-col  gap-2">
                {/* Search recommendations */}
                {/* Search recommendations */}
                {showAutoSuggestions && (
                  <div className="overflow-auto fixed bg-white h-screen pb-24  fixed z-[9999] w-full">
                    <div
                      className="border-[1px] mb-1 border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        // Clear cache
                        clearMartrys();
                        setCurrentPage(1);
                        handleSearch({ name: searchKey });
                      }}
                    >
                      {" "}
                      <Group gap="sm">
                        <Text c="blue">
                          <BiSearch />
                        </Text>
                        <Text>Tìm</Text>
                        <div>
                          <Text fz="lg" fw={500} color="blue">
                            {searchKey}
                          </Text>
                        </div>
                      </Group>
                    </div>
                    {isLoadingAutoSuggestions ? (
                      <div className="bg-white ">
                        <div className="flex gap-2 py-4 px-2 items-center justify-center">
                          <Loader size={30} />
                          <Text>Đang tải...</Text>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white flex flex-col gap-1">
                        {autoSuggestions?.length > 0 && (
                          <Flex gap={2} align="center">
                            <Text fz="md" fw={500} c="gray" className="p-2">
                              Gợi ý tìm kiếm
                            </Text>
                            <Text fz="sm" c="gray">
                              <FaMagic />
                            </Text>
                          </Flex>
                        )}

                        {autoSuggestions.map((item) => (
                          <div
                            key={item.id}
                            className="border-[1px] border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <Group gap="sm">
                              <Avatar
                                size={50}
                                src={VIETNAM_LOGO}
                                radius={50}
                              />
                              <div>
                                <Text fz="sm" fw={500}>
                                  {item.fullName}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                  {item.rankPositionUnit}
                                </Text>
                                <Text c="dimmed" fz="xs">
                                  {item.province &&
                                    "Quê quán: " + item.province}
                                  {item.yearOfBirth && "-"} {item.yearOfBirth}
                                </Text>
                              </div>
                            </Group>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Show search results */}
                <Modal
                  opened={showFilterSetting}
                  onClose={closeFilterSetting}
                  title="Bộ lọc"
                  fullScreen
                  radius={0}
                  transitionProps={{ transition: "fade", duration: 200 }}
                >
                  <div className="min-h-[80vh] overflow-auto">
                    <Tabs defaultValue="info">
                      <Tabs.List>
                        <Tabs.Tab value="info">Thông tin</Tabs.Tab>
                        <Tabs.Tab value="position">Vị trí</Tabs.Tab>
                      </Tabs.List>

                      <Tabs.Panel value="info">
                        <div className="flex flex-col gap-2 py-2">
                          <Text>Họ và tên</Text>
                          <Input
                            radius={"lg"}
                            placeholder="Nguyễn Văn A"
                            defaultValue={searchKey}
                          />
                        </div>
                        <div className="flex flex-col gap-2 py-2">
                          <Text>Năm sinh - năm mất</Text>
                          <Flex gap={4}>
                            <NumberInput
                              min={1800}
                              max={2024}
                              radius="lg"
                              placeholder="Năm sinh"
                            />
                            <NumberInput
                              min={1800}
                              max={2024}
                              radius="lg"
                              placeholder="Năm mất "
                            />
                          </Flex>
                        </div>
                        <div className="flex flex-col gap-2 py-2">
                          <Text>Quê quán</Text>
                          <Input radius={"lg"} placeholder="Ví dụ: Đồng Tháp" />
                        </div>
                      </Tabs.Panel>
                      <Tabs.Panel value="position">
                        <div className="flex flex-col gap-2 py-2">
                          <Text>Khu</Text>
                          <SelectDropdownSearch
                            placeholder="Tìm khu"
                            description="Chọn khu"
                            value={filters.area}
                            setValue={(value) => {
                              setFilters({ ...filters, area: value, row: "" });
                            }}
                            data={grave_rows ? Object.keys(grave_rows) : []}
                          />
                        </div>{" "}
                        <div className="flex flex-col gap-2 py-2">
                          <Text>Hàng</Text>
                          <SelectDropdownSearch
                            description={"Chọn hàng"}
                            placeholder="Tìm hàng"
                            setValue={(value) => {
                              setFilters({ ...filters, row: value });
                            }}
                            data={
                              grave_rows && grave_rows[filters.area]
                                ? grave_rows[filters.area].map(
                                    (item) => item.rowName
                                  )
                                : []
                            }
                            value={filters.row}
                          />
                        </div>{" "}
                      </Tabs.Panel>
                    </Tabs>
                  </div>

                  <div className="border-b-0 border-l-0 border-r-0 border-[1px] flex gap-2 justify-end px-4 absolute bottom-0  py-4 z-[999] w-full left-0">
                    <Button
                      variant="light"
                      size="md"
                      radius={"xl"}
                      fullWidth={true}
                    >
                      Xóa
                    </Button>
                    <Button size="md" radius={"xl"} fullWidth={true}>
                      Áp dụng
                    </Button>
                  </div>
                </Modal>
                <div className="bg-white  bg-red-400">
                  {/* {searchSession} */}
                  {
                    // Loading
                    isLoadingSearchResults ? (
                      <div className="bg-white ">
                        <div className="flex gap-2 py-4 px-2 items-center justify-center">
                          <Loader size={30} />
                          <Text>Đang tìm kiếm...</Text>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Filters */}
                        {searchResults ? (
                          <>
                            {searchResults?.content?.length > 0 ? (
                              <>
                                <div class="flex flex-row gap-4 overflow-y-auto pb-2">
                                  <div>
                                    <Button
                                      onClick={() => {
                                        openFilterSetting();
                                      }}
                                      radius={"xl"}
                                      variant="filled"
                                    >
                                      <Flex
                                        gap={2}
                                        justify={"center"}
                                        align={"center"}
                                      >
                                        <Text c="white">Bộ lọc</Text>
                                        <Text c="white">
                                          <HiAdjustments />
                                        </Text>
                                      </Flex>
                                    </Button>
                                  </div>
                                  <div className="w-full">
                                    <Select
                                      className="min-w-[8rem]"
                                      radius={"xl"}
                                      placeholder="Pick value"
                                      data={[
                                        "React",
                                        "Angular",
                                        "Vue",
                                        "Svelte",
                                      ]}
                                      defaultValue="React"
                                      allowDeselect={false}
                                    />
                                  </div>
                                </div>
                                <Flex gap={4} m={4} align="center">
                                  <Text c="gray">Tìm thấy </Text>
                                  <Text c="blue" fw={700}>
                                    {searchResults?.totalElements} kết quả
                                  </Text>
                                </Flex>
                                {searchResults?.content.map((item) => (
                                  <SearchResultEntry item={item} />
                                ))}{" "}
                                <div className="flex justify-center w-full pb-4 px-8">
                                  <Pagination
                                    value={currentPage}
                                    onChange={(value) => {
                                      setCurrentPage(value);
                                      handleSearch({
                                        name: searchKey,
                                        page: value - 1,
                                        size: DEFAULT_SEARCH_SIZE,
                                      });
                                    }}
                                    total={searchResults?.totalPages}
                                    size="xl"
                                    radius="xl"
                                    siblings={1}
                                  />
                                </div>
                                <div className="flex justify-center h-[4rem]"></div>
                              </>
                            ) : (
                              <>
                                <div className="flex gap-2 pt-24 px-2 items-center justify-center">
                                  <Text size="xl" c="gray">
                                    Không tìm thấy kết quả phù hợp
                                  </Text>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex gap-2 py-4 px-2 items-center justify-center">
                              <Text c="gray">Thử tìm kiếm 1 liệt sĩ</Text>
                            </div>
                          </>
                        )}
                      </>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatyrSearch;
