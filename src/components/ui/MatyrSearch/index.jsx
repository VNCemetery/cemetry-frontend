import {
  ActionIcon,
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
  Pagination,
  Select,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core";
import VIETNAM_LOGO from "../../../assets/VIETNAM_FLAG_LOGO.png";
import {
  BiArrowToLeft,
  BiChevronLeft,
  BiMenu,
  BiMicrophone,
  BiSearch,
  BiStar,
} from "react-icons/bi";
import ReactMapGL, { Layer, Marker, Source } from "@goongmaps/goong-map-react";
import { useEffect, useRef, useState } from "react";
import { SVGOverlay } from "@goongmaps/goong-map-react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import { FiArrowLeft } from "react-icons/fi";
import { FaArrowLeft, FaMagic } from "react-icons/fa";
import { BsArrowLeft, BsRecord } from "react-icons/bs";
import { IoRecording } from "react-icons/io5";

import { getAutoComplete } from "../../../services/martyrManagementService";
import { GrConfigure } from "react-icons/gr";
import { HiAdjustments, HiCheck } from "react-icons/hi";

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
  const [showAutoSuggestions, setShowAutoSuggestions] = useState(false);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

  const [searchSession, setSearchSession] = useState("");
  const handleSearch = async (searchData) => {
    try {
      // Hide auto suggestions
      setShowAutoSuggestions(false);
      // Set loading
      setIsLoadingSearchResults(true);
      // Clear search results
      setSearchResults([]);
      console.log("Thông tin:", searchData);
      const results = await getAutoComplete(searchData);
      console.log("Kết quả tìm kiếm:", results);
      setSearchResults([...results, ...results, ...results]);
      // Set uuid to search session
      setSearchSession(Math.random().toString(36).substring(7));
      setIsLoadingSearchResults(false);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSearchResults([]);
      setIsLoadingSearchResults(false);
    }
  };

  // Make mock func to return list of auto suggestions
  const getAutoSuggestions = async (searchKey) => {
    let init = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        birthYear: 1940,
        deathYear: 1968,
        province: "An Giang",
        avatar:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
      },
      {
        id: 2,
        name: "Nguyễn Văn B",
        birthYear: 1941,
        deathYear: 1969,
        avatar:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
        province: "Bắc Giang",
      },
      {
        avatar:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
        id: 3,
        name: "Nguyễn Văn C",
        birthYear: 1942,
        deathYear: 1970,
        province: "Bắc Kạn",
      },
      {
        avatar:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
        id: 5,
        name: "Trần Căn D",
        birthYear: 1943,
        deathYear: 1971,
        province: "Bạc Liêu",
      },
      {
        avatar:
          "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png",
        id: 6,
        name: "Trần Căn E",
        birthYear: 1944,
        deathYear: 1972,
        province: "Bắc Ninh",
      },
    ];

    let filtered = init.filter((item) =>
      item.name.toLowerCase().includes(searchKey.toLowerCase())
    );

    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return filtered;
  };

  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [isLoadingAutoSuggestions, setIsLoadingAutoSuggestions] =
    useState(false);

  const handleAutoSuggest = async (searchKey) => {
    try {
      setIsLoadingAutoSuggestions(true);
      const results = await getAutoComplete(searchKey);
      setShowAutoSuggestions(true);
      setIsLoadingAutoSuggestions(false);
      setAutoSuggestions(results);
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
        </div>{" "}
      </div>
      {opened && (
        <div className="bg-white h-screen z-[3] absolute top-0 w-full">
          <div>
            {/* Create virtual margin */}
            <div
              className="py-6 bg-white "
              style={{
                height: headerWrapperRef?.current?.offsetHeight || 0,
              }}
              // With the height is calculate from headerWrapperRef
            ></div>

            <div className="h-full bg-white">
              <div className="px-2 flex flex-col gap-2">
                {/* Search recommendations */}
                {showAutoSuggestions && (
                  <div className="min-h-screen">
                    <div
                      className="border-[1px] mb-1 border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
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

                <div className="bg-white">
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
                        {searchResults?.length > 0 && (
                          <>
                            <div class="flex flex-row gap-4 overflow-y-auto pb-2">
                              <div>
                                <Button radius={"xl"} variant="filled">
                                  <Flex
                                    gap={2}
                                    justify={"center"}
                                    align={"center"}
                                  >
                                    <Text c="white">Lọc</Text>
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
                                  data={["React", "Angular", "Vue", "Svelte"]}
                                  defaultValue="React"
                                  allowDeselect={false}
                                />
                              </div>
                              <div>
                                <Button radius={"xl"} variant="outline">
                                  <Flex
                                    gap={2}
                                    justify={"center"}
                                    align={"center"}
                                  >
                                    <Text>Bật ưu tiên</Text>
                                    <Text className="hidden">
                                      <HiCheck />
                                    </Text>
                                  </Flex>
                                </Button>
                              </div>
                              <div>
                                <Button radius={"xl"} variant="outline">
                                  <Flex
                                    gap={2}
                                    justify={"center"}
                                    align={"center"}
                                  >
                                    <Text>Bật ưu tiên</Text>
                                    <Text className="hidden">
                                      <HiCheck />
                                    </Text>
                                  </Flex>
                                </Button>
                              </div>
                            </div>
                            <Flex gap={2} align="center">
                              <Text c="gray">Tìm thấy </Text>
                              <Text c="blue">
                                {searchResults.length} kết quả
                              </Text>
                            </Flex>
                            {[
                              ...searchResults,
                              ...searchResults,
                              ...searchResults,
                            ].map((item) => (
                              <>
                                <div
                                  key={item.id}
                                  className="mb-2 border-[1px] border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
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
                                        {item.yearOfBirth && "-"}{" "}
                                        {item.yearOfBirth}
                                      </Text>
                                    </div>
                                  </Group>
                                </div>
                              </>
                            ))}
                            <div className="flex justify-center pb-2">
                              <Pagination total={10} size="sm" radius="lg" />
                            </div>
                          </>
                        )}
                      </>
                    )
                  }
                  {
                    // Search results
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
