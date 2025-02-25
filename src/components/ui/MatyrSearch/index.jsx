import MartyrDetail from "./MartyrDetail";
import {
  DEFAULT_AUTO_SUGGEST_SIZE,
  DEFAULT_SEARCH_SIZE,
} from "../../../utils/constants";
import {
  ActionIcon,
  CloseIcon,
  Input,
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
import { FiHome, FiMap } from "react-icons/fi"; // Add this import
import SearchPopupModal from "./SearchPopupModal";
import MartyrBriefInfo from "./MartyrBriefInfo";
import { useLocation } from "react-router-dom";
import { useSearchMartyrStore } from "../../../store/useSearchMartyrStore";
import { GiGate } from "react-icons/gi";

const MatyrSearch = ({
  onClearRoute,
  clearPopupMartyr,
  onRouteFromCurrentLocation,
  onRouteFromGate,
  handleCancelSelection,
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
  const [opened, { open: openSearchPopup, close: closeSearchPopup }] =
    useDisclosure(false);

  const {
    filters,
    setFilters,
    searchKey,
    setSearchKey,
    searchResults,
    setSearchResults,
    currentPage,
    setCurrentPage,
    setAutoSuggestions,
    autoSuggestions,
    filterQuery,
    handleSearch,
    showAutoSuggestions,
    setShowAutoSuggestions,
  } = useSearchMartyrStore();

  const [
    showMartyrDetail,
    { open: openMartyrDetail, close: closeMartyrDetail },
  ] = useDisclosure(false);

  const [showReturnToSearch, setShowReturnToSearch] = useState(false);
  const { selectedMartyr, selectMartyr } = useMatyrStore();

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
            size="xl"
            variant="filled"
            radius="xl"
            fullWidth
            className="py-4"
            color="green"
            leftSection={<GiGate size={28} />}
            onClick={() => {
              closeRoutingHandlerPopup();
              onRouteFromGate();
            }}
          >
            <span className="text-lg">Đi từ cổng chính</span>
          </Button>
          <Button
            fullWidth
            size="xl"
            variant="filled"
            color="blue"
            radius="xl"
            className="py-4"
            leftSection={<FiMap size={28} />}
            onClick={() => {
              closeRoutingHandlerPopup();
              onRouteFromCurrentLocation();
            }}
          >
            <span className="text-lg">Từ vị trí hiện tại</span>
          </Button>
          <Button
            size="xl"
            variant="filled"
            radius="xl"
            fullWidth
            className="py-4"
            color="gray"
            leftSection={<HiLocationMarker size={28} />}
            onClick={() => {
              closeRoutingHandlerPopup();
              onSelectLocationOnMap();
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
            handleCancelSelection();
            closeMartyrDetail();
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
                  radius={"xl"}
                  onClick={() => {
                    // onClearRoute();
                    selectMartyr(null);
                    clearMartyrIdFromUrl();
                    openSearchPopup();

                    clearPopupMartyr();
                    searchInputRef?.current?.focus();
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
            <div
              className={`
                w-full transition-all duration-300  
                ${
                  opened ? "md:w-full" : " md:w-1/3"
                } flex rounded-xl bg-transparent items-center`}
            >
              <div
                className="w-full m-1 items-center flex gap-1 bg-white py-1 px-1"
                style={{
                  borderRadius: "1.5rem",
                }}
              >
                <div className="flex items-center w-full text-gray-600   w-full gap-1">
                  {!opened ? (
                    <div className="m-1 flex flex-col items-center justify-center">
                      <Burger
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
                        setSearchKey(searchKey.replace(/\s+/g, " "));
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
                    radius="xl"
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
      <Button
        className="absolute bottom-0 right-0 z-[1]"
        size="md"
        variant="filled"
      >
        Click me
      </Button>
      <MartyrBriefInfo
        closeBrief={() => {
          selectMartyr(null);
          clearMartyrIdFromUrl();
          openSearchPopup();
          searchInputRef.current.focus();
        }}
        openRoutingHandlerPopup={() => {
          handleCancelSelection();
          openRoutingHandlerPopup();
        }}
        martyr={selectedMartyr}
        onViewDetail={openMartyrDetail}
        onShowRoute={onRouteFromCurrentLocation}
      />
      {opened && (
        <SearchPopupModal
          offSetHeight={offsetHeight}
          filters={filters} // move to store
          setFilters={setFilters} // move to store
          setCurrentPage={setCurrentPage} // move to store
          currentPage={currentPage} // move to store
          handleSearch={handleSearch} // move to store
          setSearchKey={setSearchKey} // move to store
          showAutoSuggestions={showAutoSuggestions} // move to store
          setShowAutoSuggestions={setShowAutoSuggestions} // move to store
          searchKey={searchKey} // move to store
          autoSuggestions={autoSuggestions} // move to store
          setAutoSuggestions={setAutoSuggestions} // move to store
          filterQuery={filterQuery} // move to store
          searchResults={searchResults} // move to store
          onSelectMartyrHandler={(martyr) => {
            closeSearchPopup();
            selectMartyr(martyr);
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
