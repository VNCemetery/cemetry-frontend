import MartyrDetail from "./MartyrDetail";
import {
  DEFAULT_AUTO_SUGGEST_SIZE,
  DEFAULT_SEARCH_SIZE,
} from "../../../utils/constants";
import {
  ActionIcon,
  CloseIcon,
  Input,
  Loader,
  Modal,
  Button,
  Text,
  Burger,
  useMantineTheme,
  Drawer,
} from "@mantine/core";
import { BiSearch } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { BsArrowLeft } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";

import {
  getMartyrById,
  getMatyrs,
} from "../../../services/martyrManagementService";
import { useInfoStore } from "../../../store/useInfoStore";
import { useMatyrStore } from "../../../store/useMatyrStore";
import { useForm } from "@mantine/form";
import { FiHome, FiMap } from "react-icons/fi"; // Add this import
import SearchPopupModal from "./SearchPopupModal";
import MartyrBriefInfo from "./MartyrBriefInfo";
import { useLocation } from "react-router-dom";

const MatyrSearch = ({
  onClearRoute,
  onRouteFromCurrentLocation,
  onSelectLocationOnMap,
  closeDrawer,
  openedDrawer,
  openDrawer,
}) => {
  const { history } = useLocation();
  const location = useLocation();
  useEffect(() => {
    (async () => {
      const searchParams = new URLSearchParams(location.search);
      const martyrId = searchParams.get("martyrId");
      if (martyrId) {
        // Fetch martyr by id
        const martyr = await getMartyrById(martyrId);
        if (martyr) {
          selectMartyr(martyr);
          openMartyrDetail();
        }
      }
    })();
  }, []);

  const searchInputRef = useRef(null);
  const headerRef = useRef(null);
  const [searchKey, setSearchKey] = useState("");
  const [opened, { open: openSearchPopup, close: closeSearchPopup }] =
    useDisclosure(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
  const loadMartyrs = useMatyrStore((state) => state.loadMartyrs);
  const clearMartrys = useMatyrStore((state) => state.clearMartrys);
  const [currentPage, setCurrentPage] = useState(0);
  const [showRoutingOptions, setShowRoutingOptions] = useState(false);
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

      const results = await loadMartyrs(name, page, size, filters);
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

  const [showReturnToSearch, setShowReturnToSearch] = useState(false);
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
  }, [headerRef?.current?.offSetHeight, showReturnToSearch]);

  const [
    showRoutingHandlerPopup,
    { open: openRoutingHandlerPopup, close: closeRoutingHandlerPopup },
  ] = useDisclosure(false);

  useEffect(() => {
    let newShowReturnToSearch = !opened && !(selectedMartyr === null);
    setShowReturnToSearch(newShowReturnToSearch);
  }, [opened, selectedMartyr]);

  const clearMartyrIdFromUrl = () => {
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("martyrId");
    window.history.pushState({}, "", newUrl);
  };

  const theme = useMantineTheme();

  return (
    <>
      <Modal
        opened={showRoutingHandlerPopup}
        onClose={closeRoutingHandlerPopup}
        centered
        radius="md"
      >
        <div className="px-6 pb-4 flex flex-col gap-4">
          <Text size="xl" className="font-extrabold text-2xl text-center">
            VỊ TRÍ XUẤT PHÁT
          </Text>
          <Button
            fullWidth
            size="xl"
            variant="filled"
            color="blue"
            radius="md"
            className="py-4"
            leftSection={<FiMap size={28} />}
            onClick={() => {
              setShowRoutingOptions(false);
              closeRoutingHandlerPopup();
              onRouteFromCurrentLocation();
            }}
          >
            <span className="text-lg">Từ vị trí hiện tại</span>
          </Button>
          <Button
            size="xl"
            variant="filled"
            radius="md"
            fullWidth
            className="py-4"
            color="gray"
            leftSection={<HiLocationMarker size={28} />}
            onClick={() => {
              closeRoutingHandlerPopup();
              onSelectLocationOnMap();
              setShowRoutingOptions(false);
            }}
          >
            <span className="text-lg">Chọn vị trí khác</span>
          </Button>
        </div>
      </Modal>
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
            openRoutingHandlerPopup();
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
          {showReturnToSearch && (
            <div
              className="flex flex-col w-full"
              style={{
                height: offsetHeight,
              }}
            >
              <div className="rounded-xl m-2 p-2">
                <Button
                  size="lg"
                  onClick={() => {
                    selectMartyr(null);
                    clearMartyrIdFromUrl();
                    openSearchPopup();
                    searchInputRef.current.focus();
                  }}
                  variant="filled"
                  leftSection={<BsArrowLeft size={24} />}
                >
                  TRỞ VỀ
                </Button>
              </div>
            </div>
          )}

          {!showReturnToSearch && (
            <div className="flex w-full items-center">
              <div className="w-full items-center flex gap-1 bg-white py-1">
                <div className="flex items-center w-full text-gray-600   w-full p-1 gap-1">
                  {!opened ? (
                    <div className="flex flex-col items-center justify-center">
                      <Burger
                        lineSize={3}
                        size="md"
                        opened={openedDrawer}
                        onClick={openDrawer}
                        aria-label="Toggle navigation"
                      />
                    </div>
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
                          onClearRoute();

                          setSearchKey("");
                          setShowAutoSuggestions(false);
                          setSearchResults(null);
                          closeSearchPopup();
                          close_record_modal();
                        }
                      }}
                    >
                      <BsArrowLeft
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  )}
                  <Input
                    styles={{}}
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
            </div>
          )}
        </div>
      </div>
      <MartyrBriefInfo
        closeBrief={() => {
          selectMartyr(null);
          clearMartyrIdFromUrl();
          openSearchPopup();
          searchInputRef.current.focus();
        }}
        openRoutingHandlerPopup={openRoutingHandlerPopup}
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
          onSelectMartyrHandler={(martyr) => {
            closeSearchPopup();
            selectMartyr(martyr);
            // Update URL without page reload
            const newUrl = new URL(window.location);
            newUrl.searchParams.set("martyrId", martyr.id);
            window.history.pushState({}, "", newUrl);
            openMartyrDetail();
          }}
        />
      )}
    </>
  );
};

export default MatyrSearch;
