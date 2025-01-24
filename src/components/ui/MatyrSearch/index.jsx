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
  Input,
  Loader,
  Modal,
  NumberInput,
  Pagination,
  Tabs,
  Text,
  Popover,
  Stack,
  Button,
  Collapse,
} from "@mantine/core";
import VIETNAM_LOGO from "../../../assets/VIETNAM_FLAG_LOGO.png";
import {
  BiLeftArrow,
  BiMicrophone,
  BiSearch,
  BiSolidInfoCircle,
} from "react-icons/bi";
import { MdDirections, MdShare } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { FaMagic } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";

import { getMatyrs } from "../../../services/martyrManagementService";
import { HiAdjustments, HiCheck } from "react-icons/hi";
import SearchResultEntry from "./SearchResultEntry";
import { useInfoStore } from "../../../store/useInfoStore";
import { useMatyrStore } from "../../../store/useMatyrStore";
import { useForm } from "@mantine/form";
import { buildFilterFormQuery } from "../../../utils/queryBuilder";
import { FiMoreHorizontal } from "react-icons/fi";
import { FiMap } from "react-icons/fi"; // Add this import
import SearchPopupModal from "./SearchPopupModal";
import MartyrBriefInfo from "./MartyrBriefInfo";

const MatyrSearch = ({ onRouteFromCurrentLocation, onSelectLocationOnMap }) => {
  const searchInputRef = useRef(null);
  const headerRef = useRef(null);
  const [searchKey, setSearchKey] = useState("");
  const [opened, { open: openSearchPopup, close: closeSearchPopup }] =
    useDisclosure(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const loadMatyrs = useMatyrStore((state) => state.loadMatyrs);
  const clearMartrys = useMatyrStore((state) => state.clearMartrys);
  const [currentPage, setCurrentPage] = useState(0);

  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async ({
    name = "",
    page = 0,
    size = DEFAULT_SEARCH_SIZE,
    filters = [],
  }) => {
    try {
      setFilterQuery(filters);
      setShowAutoSuggestions(false);
      setIsLoadingSearchResults(true);
      setSearchResults(null);
      const results = await loadMatyrs(name, page, size, filters);
      if (!results) {
        setSearchResults(null);
        throw new Error("No result found");
      }
      setSearchResults(results);
      console.log("Kết quả tìm kiếm:", results);
      setShowSearchResults(true);
      setIsLoadingSearchResults(false);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSearchResults(null);
      setShowSearchResults(false);
      setIsLoadingSearchResults(false);
    }
  };

  const { grave_rows } = useInfoStore();
  const [filterQuery, setFilterQuery] = useState({});
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
        setShowAutoSuggestions(true);
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
    graveRow: {
      areaName: "",
      rowName: "",
    },
  });

  const { selectedMartyr, selectMartyr } = useMatyrStore();

  const filterForm = useForm({
    mode: "uncontrolled",
  });

  const [offsetHeight, setOffsetHeight] = useState(0);
  useEffect(() => {
    if (headerRef?.current?.offsetHeight === 0) {
      return;
    }
    setOffsetHeight(headerRef.current.offsetHeight);
  }, []);

  return (
    <>
      <Modal
        offset={8}
        radius="md"
        fullScreen={true}
        opened={showMartyrDetail}
        onClose={closeMartyrDetail}
        title="Thông tin liệt sĩ"
      >
        <MartyrDetail
          martyr={selectedMartyr}
          onRoute={() => {
            closeMartyrDetail();
            setShowRoutingOptions(true);
          }}
        />
      </Modal>{" "}
      <div className="z-[4]">
        <div
          ref={headerRef}
          className={`fixed top-0  left-0 ${
            !opened ? "transparent" : "bg-white"
          } right-0 z-[4]`}
        >
          {!opened && !(selectedMartyr === null) ? (
            <div className="flex flex-col w-full">
              <div className="rounded-xl m-2 p-2">
                <Button
                  size="lg"
                  onClick={() => {
                    selectMartyr(null);
                    // setShowRoutingOptions(false);
                    openSearchPopup();
                    // Change focus to input
                    searchInputRef.current.focus();
                  }}
                  variant="filled"
                  leftSection={<BsArrowLeft size={24} />}
                >
                  Trở về
                </Button>

                {/* <div className="flex-1 ml-1">
                    <Flex gap={2}>
                      <Text size="xl" fw={700} className="text-gray-600">
                        Liệt sĩ:{" "}
                      </Text>
                      <Text size="xl" fw={700} className="text-blue-600">
                        {selectedMartyr.fullName}
                      </Text>
                    </Flex>
                    <div className="mt-0">
                      {selectedMartyr.rankPositionUnit && (
                        <Text size="lg" fw={500}>
                          {selectedMartyr.rankPositionUnit}
                        </Text>
                      )}

                      <div className="flex flex-col mt-0">
                        <Text size="md" c="dimmed" fw={500}>
                          Khu {selectedMartyr.graveRow?.areaName || "---"}
                        </Text>
                        <Text size="md" c="dimmed" fw={500}>
                          Hàng {selectedMartyr.graveRow?.rowName || "---"}
                        </Text>
                        <Text size="md" c="dimmed" fw={500}>
                          Mộ số {selectedMartyr.graveCode || "---"}
                        </Text>
                      </div>

                      {selectedMartyr.homeTown && (
                        <Text size="md" c="dimmed" fw={500}>
                          Quê quán: {selectedMartyr.homeTown}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <ActionIconf
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
                  </div> */}
              </div>
              {/* 
                <Collapse in={showRoutingOptions}>
                  <div className="px-4 pb-2 flex flex-col gap-2">
                    <Button
                      fullWidth
                      variant="white"
                      color="blue"
                      radius="xl"
                      leftSection={
                        <FiMap size={20} className="text-blue-500" />
                      }
                      onClick={() => {
                        setShowRoutingOptions(false);
                        onRouteFromCurrentLocation();
                      }}
                    >
                      Tìm đường
                    </Button>
                    <Button
                      variant="white"
                      radius="xl"
                      fullWidth
                      color="gray"
                      leftSection={<HiLocationMarker size={20} />}
                      onClick={() => {
                        onSelectLocationOnMap();
                        setShowRoutingOptions(false);
                      }}
                    >
                      Chọn vị trí
                    </Button>
                  </div>
                </Collapse> */}
            </div>
          ) : (
            <div className="items-center flex gap-1 bg-white rounded-2xl  m-[.25rem]">
              <div className="flex items-center w-full text-gray-600   w-full p-1 gap-1">
                {!opened ? (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    aria-label="Settings"
                    onClick={() => {
                      openSearchPopup();
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
                    variant="filled"
                    size={"lg"}
                    radius={"xl"}
                    color="blue"
                    aria-label="Settings"
                    onClick={() => {
                      if (
                        showAutoSuggestions &&
                        searchResults?.content?.length > 0
                      ) {
                        setAutoSuggestions([]);
                        setShowAutoSuggestions(false);
                      } else {
                        // Check if auto suggestions is shown
                        setSearchKey("");
                        setShowAutoSuggestions(false);
                        setSearchResults(null);
                        closeSearchPopup();
                        close_record_modal();
                      }

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
                      openSearchPopup();
                      searchInputRef.current.focus();
                    }
                  }}
                  value={searchKey}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(0);
                      setAutoSuggestions([]);
                      setShowAutoSuggestions(false);
                      handleSearch({
                        name: e.target.value,
                        page: 0,
                        size: DEFAULT_SEARCH_SIZE,
                        ...filters,
                      });
                    }
                  }}
                  rightSectionPointerEvents="all"
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                  }}
                  radius="lg"
                  style={{
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  size="md"
                  className="w-full  border-none text-[2rem]"
                  placeholder="Nhập tên liệt sĩ"
                  rightSection={
                    <CloseIcon
                      aria-label="Clear input"
                      className="mr-2"
                      onClick={() => {
                        setSearchKey("");
                        searchInputRef.current.focus();
                      }}
                      style={{ display: searchKey ? undefined : "none" }}
                    />
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <MartyrBriefInfo
        martyr={selectedMartyr}
        onViewDetail={openMartyrDetail}
        onShowRoute={onRouteFromCurrentLocation}
      />
      {opened && (
        <SearchPopupModal
          offSetHeight={offsetHeight}
          filters={filters}
          autoSuggestions={autoSuggestions}
          setFilters={setFilters}
          grave_rows={grave_rows}
          clearMartrys={clearMartrys}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          handleSearch={handleSearch}
          filterForm={filterForm}
          setSearchKey={(value) => setSearchKey(value)}
          isLoadingSearchResults={isLoadingSearchResults}
          showFilterSetting={showFilterSetting}
          closeFilterSetting={closeFilterSetting}
          isLoadingAutoSuggestions={isLoadingAutoSuggestions}
          showAutoSuggestions={showAutoSuggestions}
          searchKey={searchKey}
          setShowAutoSuggestions={setShowAutoSuggestions}
          setAutoSuggestions={setAutoSuggestions}
          openFilterSetting={openFilterSetting}
          selectMartyr={selectMartyr}
          openMartyrDetail={openMartyrDetail}
          openSearchPopup={openSearchPopup}
          closeSearchPopup={closeSearchPopup}
          setFilterQuery={setFilterQuery}
          filterQuery={filterQuery}
          searchResults={searchResults}
        />
      )}
    </>
  );
};

export default MatyrSearch;
