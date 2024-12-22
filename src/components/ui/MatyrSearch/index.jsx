import {
  ActionIcon,
  Badge,
  Card,
  CloseIcon,
  Group,
  Image,
  Input,
  Modal,
  Tabs,
  Text,
} from "@mantine/core";
import {
  BiArrowToLeft,
  BiChevronLeft,
  BiMenu,
  BiMicrophone,
  BiSearch,
} from "react-icons/bi";
import ReactMapGL, { Layer, Marker, Source } from "@goongmaps/goong-map-react";
import { useEffect, useRef, useState } from "react";
import { SVGOverlay } from "@goongmaps/goong-map-react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import { FiArrowLeft } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { BsArrowLeft, BsRecord } from "react-icons/bs";
import { IoRecording } from "react-icons/io5";

import { searchMatyrs } from "../../../services/searchService";

const MatyrSearch = () => {
  const headerWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const [searchKey, setSearchKey] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [
    opened_record_modal,
    { open: open_record_modal, close: close_record_modal },
  ] = useDisclosure(false);

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchData) => {
    try {
      console.log("Thông tin:", searchData);
      const results = await searchMatyrs(searchData);
      console.log("Kết quả tìm kiếm:", results);
      setSearchResults(results);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSearchResults([]);
    }
  };

  return (
    <>
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
      <div className="z-[204]">
        <div
          ref={headerWrapperRef}
          className={`fixed top-0 left-0 ${
            !opened ? "transparent" : "bg-white"
          } right-0 z-[203]`}
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
                onChange={(e) => setSearchKey(e.target.value)}
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

              {/* <ActionIcon
              variant="filled"
              radius={"xl"}
              color="gray"
              aria-label="Settings"
              onClick={() => {
                // Clear search input
                setSearchKey("");

                // Focus again
                searchInputRef.current.focus();
              }}
            >
              <BiMicrophone
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon> */}
            </div>
          </div>
        </div>
        {opened && (
          <div className="h-full flex flex-col gap-2 h-screen w-full z-[200] absolute">
            {/* Create virtual margin */}
            <div
              className="py-6 bg-white "
              style={{
                height: headerWrapperRef?.current?.offsetHeight || 0,
              }}
              // With the height is calculate from headerWrapperRef
            ></div>

            <div className="min-h-screen bg-white p-2">
              <div className="p-2">
                {/* Search recommendations */}
                {searchKey.length > 0 && (
                  <div>
                    <Text size="sm" weight={700}>
                      Gợi ý tìm kiếm
                    </Text>
                  </div>
                )}

                {/* Show search results */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MatyrSearch;
