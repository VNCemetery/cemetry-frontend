import FloatingSelector from "../FloatingSelector";
import MartyrDetail from "./MartyrDetail";
import {
  DEFAULT_AUTO_SUGGEST_SIZE,
  DEFAULT_SEARCH_SIZE,
} from "../../../utils/constants";
import { flattenObject } from "../../../utils/objectUtil";
import { SelectDropdownSearch } from "../SelectDropdownSearch";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Badge,
  Card,
  CloseIcon,
  Drawer,
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
  TextInput,
  Popover,
  Stack,
  Button,
  Collapse,
} from "@mantine/core";
import VIETNAM_LOGO from "../../../assets/VIETNAM_FLAG_LOGO.png";
import {
  BiMicrophone,
  BiSearch,
  BiDotsVerticalRounded,
  BiSolidInfoCircle,
} from "react-icons/bi";
import { MdDirections, MdShare } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { FaMagic } from "react-icons/fa";
import { BsArrowLeft, BsQuestion } from "react-icons/bs";
import {
  HiOutlineDotsCircleHorizontal,
  HiLocationMarker,
} from "react-icons/hi";

import { getMatyrs } from "../../../services/martyrManagementService";
import { HiAdjustments, HiCheck } from "react-icons/hi";
import SearchResultEntry from "./SearchResultEntry";
import { useInfoStore } from "../../../store/useInfoStore";
import { useMatyrStore } from "../../../store/useMatyrStore";
import { useForm } from "@mantine/form";
import { buildFilterFormQuery } from "../../../utils/queryBuilder";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdMyLocation } from "react-icons/md";

const MatyrSearch = ({}) => {
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
    filters = [],
  }) => {
    try {
      // Hide auto suggestions
      setShowAutoSuggestions(false);
      // Set loading
      setIsLoadingSearchResults(true);
      // Clear search results
      setSearchResults(null);
      alert("GIVE: " + JSON.stringify(filters));
      const results = await loadMatyrs(name, page, size, filters);
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

  const [
    showMartyrDetail,
    { open: openMartyrDetail, close: closeMartyrDetail },
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

  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (searchKey.length > 0) {
      handleAutoSuggest(searchKey);
    } else {
      setAutoSuggestions([]);
    }
  }, [searchKey]);

  // Filters
  const [filters, setFilters] = useState({
    graveRow: {
      areaName: "",
      rowName: "",
    },
  });

  const { selectedMartyr, selectMartyr } = useMatyrStore();

  const filterForm = useForm({
    mode: "uncontrolled",
  });

  // Add closePopover to useDisclosure hooks
  const [popoverOpened, { close: closePopover, open: openPopover }] =
    useDisclosure();

  // Add new state for routing options
  const [showRoutingOptions, setShowRoutingOptions] = useState(false);

  return (
    <>
      <div className="">
        {" "}
        <Modal
          offset={8}
          radius="md"
          fullScreen={true}
          opened={showMartyrDetail}
          onClose={closeMartyrDetail}
          title="Thông tin liệt sĩ"
        >
          <MartyrDetail martyr={selectedMartyr} />
          {/* Drawer content */}
        </Modal>{" "}
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
        <div className="z-[4] ">
          <div
            ref={headerWrapperRef}
            className={`fixed top-0  left-0 ${
              !opened ? "transparent" : "bg-white"
            } right-0 z-[4]`}
          >
            {selectedMartyr ? (
              <div className="flex flex-col w-full">
                <div className="flex items-center bg-white rounded-full m-2 p-2">
                  <ActionIcon
                    variant="transparent"
                    color="blue"
                    onClick={() => {
                      selectMartyr(null);
                      setSearchKey("");
                      setShowRoutingOptions(false);
                    }}
                  >
                    <BsArrowLeft
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                  <div className="flex-1 ml-2">
                    <Text fw={500}>
                      <span className="text-gray-400">Liệt sĩ </span>
                      {selectedMartyr.fullName}
                    </Text>
                    <Text c="dimmed" fz="xs">
                      {selectedMartyr.homeTown || "Chưa có thông tin quê quán"}
                    </Text>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ActionIcon
                      variant="filled"
                      color="green"
                      radius="xl"
                      size="lg"
                      className={`hover:scale-110 transition-transform ${
                        showRoutingOptions ? "rotate-180" : ""
                      }`}
                      onClick={() => setShowRoutingOptions(!showRoutingOptions)}
                    >
                      <MdDirections size={24} className="text-white" />
                    </ActionIcon>

                    <Popover
                      position="bottom-end"
                      shadow="md"
                      opened={popoverOpened}
                      onChange={closePopover}
                    >
                      <Popover.Target>
                        <ActionIcon
                          variant="filled"
                          color="blue"
                          radius="xl"
                          size="lg"
                          className="hover:scale-110 transition-transform"
                          onClick={openPopover}
                        >
                          <FiMoreHorizontal size={24} className="text-white" />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="dimmed">
                            Tùy chọn
                          </Text>
                          <Button
                            variant="filled"
                            color="blue"
                            fullWidth
                            leftSection={<BiSolidInfoCircle size={16} />}
                            onClick={() => {
                              openMartyrDetail();
                              closePopover();
                            }}
                          >
                            Xem chi tiết
                          </Button>
                          <Text size="sm" fw={500} c="dimmed">
                            Thao tác khác
                          </Text>
                          <Button
                            variant="light"
                            color="gray"
                            fullWidth
                            leftSection={<MdShare size={16} />}
                            onClick={() => {
                              closePopover();
                            }}
                          >
                            Chia sẻ thông tin
                          </Button>
                        </Stack>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>

                <Collapse in={showRoutingOptions}>
                  <div className="px-4 pb-2 flex flex-col gap-2">
                    <Button
                      fullWidth
                      variant="white"
                      color="blue"
                      radius="xl"
                      leftSection={
                        <MdMyLocation size={20} className="text-blue-500" />
                      }
                      onClick={() => {
                        alert("Chỉ đường từ vị trí hiện tại");
                        setShowRoutingOptions(false);
                      }}
                    >
                      Từ vị trí hiện tại
                    </Button>
                    <Button
                      variant="white"
                      radius="xl"
                      fullWidth
                      color="gray"
                      leftSection={<HiLocationMarker size={20} />}
                      onClick={() => {
                        alert("Chọn điểm trên bản đồ");
                        setShowRoutingOptions(false);
                      }}
                    >
                      Chọn điểm trên bản đồ
                    </Button>
                  </div>
                </Collapse>
              </div>
            ) : (
              <div className="items-center flex gap-1 bg-white rounded-full m-2">
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
            )}
          </div>
        </div>
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
                {showAutoSuggestions && (
                  <div className="overflow-auto fixed bg-white h-screen pb-24  fixed z-[9999] w-full">
                    <div
                      className="border-[1px] mb-1 border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        // Clear cache
                        clearMartrys();
                        setCurrentPage(1);

                        filterForm.initialize({
                          fullName: searchKey,
                          yearOfBirth: "",
                          dateOfDeath: "",
                          homeTown: "",
                        });
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
                  <form
                    onSubmit={filterForm.onSubmit((values) => {
                      // transform values with filters
                      let flattenFilters = flattenObject(filters);
                      const queryData = {
                        ...values,
                        ...flattenFilters,
                      };

                      // Build API query
                      const filters_query = buildFilterFormQuery(queryData);
                      alert("FILTERS: " + JSON.stringify(filters_query));
                      // Clear cache
                      clearMartrys();
                      setCurrentPage(1);
                      handleSearch({
                        name: searchKey,
                        page: 0,
                        size: DEFAULT_SEARCH_SIZE,
                        filters: filters_query,
                      });
                      closeFilterSetting();
                    })}
                  >
                    <div className="min-h-[80vh] overflow-auto">
                      <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tabs.List>
                          <Tabs.Tab value="info">Thông tin</Tabs.Tab>
                          <Tabs.Tab value="position">Vị trí</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="info">
                          <div className="flex flex-col gap-2 py-2">
                            <Text>Năm sinh - năm mất</Text>
                            <Flex gap={4}>
                              <NumberInput
                                key={filterForm.key("yearOfBirth")}
                                {...filterForm.getInputProps("yearOfBirth")}
                                min={1800}
                                max={2024}
                                radius="lg"
                                placeholder="Năm sinh"
                              />
                              <NumberInput
                                min={1800}
                                max={2024}
                                key={filterForm.key("dateOfDeath")}
                                {...filterForm.getInputProps("dateOfDeath")}
                                radius="lg"
                                placeholder="Năm mất "
                              />
                            </Flex>
                          </div>
                          <div className="flex flex-col gap-2 py-2">
                            <Text>Quê quán</Text>
                            <Input
                              radius={"lg"}
                              key={filterForm.key("homeTown")}
                              {...filterForm.getInputProps("homeTown")}
                              placeholder="Ví dụ: Đồng Tháp"
                            />
                          </div>
                        </Tabs.Panel>
                        <Tabs.Panel value="position">
                          <div className="flex flex-col gap-2 py-2">
                            <Text>Khu</Text>
                            <SelectDropdownSearch
                              placeholder="Tìm khu"
                              description="Chọn khu"
                              value={filters.graveRow.areaName}
                              setValue={(value) => {
                                setFilters({
                                  ...filters,
                                  graveRow: {
                                    areaName: value,
                                    rowName: "",
                                  },
                                });
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
                                setFilters({
                                  ...filters,
                                  graveRow: {
                                    ...filters.graveRow,
                                    rowName: value,
                                  },
                                });
                              }}
                              data={
                                grave_rows &&
                                grave_rows[filters.graveRow.areaName]
                                  ? grave_rows[filters.graveRow.areaName].map(
                                      (item) => item.rowName
                                    )
                                  : []
                              }
                              value={filters.graveRow.rowName}
                            />
                          </div>{" "}
                        </Tabs.Panel>
                      </Tabs>
                    </div>

                    <div className="border-b-0 border-l-0 border-r-0 border-[1px] flex gap-2 justify-end px-4 absolute bottom-0  py-4 z-[999] w-full left-0">
                      <Button
                        onClick={() => {
                          // Reset filterForm
                          filterForm.reset();
                          // Clear cache
                          clearMartrys();
                          setCurrentPage(1);
                          handleSearch({
                            name: searchKey,
                            page: 0,
                            size: DEFAULT_SEARCH_SIZE,
                          });

                          // Reset local filters
                          setFilters({
                            graveRow: {
                              areaName: "",
                              rowName: "",
                            },
                          });
                        }}
                        variant="light"
                        size="md"
                        radius={"xl"}
                        fullWidth={true}
                      >
                        Xóa
                      </Button>
                      <Button
                        size="md"
                        type="submit"
                        radius={"xl"}
                        fullWidth={true}
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </form>
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
                        <div class="flex flex-row gap-4 overflow-y-auto pb-2">
                          <div>
                            <Button
                              onClick={() => {
                                setActiveTab("info");
                                openFilterSetting();
                              }}
                              radius={"xl"}
                              variant="filled"
                            >
                              <Flex gap={2} justify={"center"} align={"center"}>
                                <Text c="white">Bộ lọc</Text>
                                <Text c="white">
                                  <HiAdjustments />
                                </Text>
                              </Flex>
                            </Button>
                          </div>
                        </div>
                        {searchResults ? (
                          <>
                            {searchResults?.content?.length > 0 ? (
                              <>
                                <Flex gap={4} m={4} align="center">
                                  <Text c="gray">Tìm thấy </Text>
                                  <Text c="blue" fw={700}>
                                    {searchResults?.totalElements} kết quả
                                  </Text>
                                </Flex>
                                {searchResults?.content.map((item) => (
                                  <SearchResultEntry
                                    item={item}
                                    selectItem={() => {
                                      close();
                                      selectMartyr(item);
                                      openMartyrDetail();
                                    }}
                                  />
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
                                <div className="flex flex-col gap-2 pt-24 px-2 items-center justify-center">
                                  <Text size="xl" c="gray">
                                    Không tìm thấy kết quả phù hợp
                                  </Text>
                                  <>
                                    <div className="flex gap-2 py-4 px-2 flex-col gap-2 items-center justify-center">
                                      <Text>
                                        Bạn có thể thử các thao tác nhanh
                                      </Text>
                                      <div className="flex flex-col gap-2">
                                        <Button
                                          color="orange"
                                          radius={"xl"}
                                          size="xl"
                                        >
                                          Thử tìm theo khu
                                        </Button>
                                        <Button
                                          color="green"
                                          radius={"xl"}
                                          size="xl"
                                        >
                                          Hiển thị toàn bộ danh sách
                                        </Button>
                                      </div>
                                    </div>
                                  </>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex gap-2 py-4 px-2 flex-col gap-2 items-center justify-center">
                              <Text>Bạn có thể thử các thao tách nhanh</Text>
                              <div className="flex flex-col gap-2">
                                <Button
                                  onClick={() => {
                                    setActiveTab("position");

                                    openFilterSetting();
                                  }}
                                  color="orange"
                                  radius={"xl"}
                                  size="xl"
                                >
                                  Thử tìm theo khu
                                </Button>{" "}
                              </div>
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
