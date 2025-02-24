import React, { useState, useEffect } from "react";

import {
  DEFAULT_AUTO_SUGGEST_SIZE,
  DEFAULT_SEARCH_SIZE,
} from "../../../utils/constants";
import { flattenObject } from "../../../utils/objectUtil";
import { SelectDropdownSearch } from "../SelectDropdownSearch";
import {
  Flex,
  Input,
  Loader,
  Modal,
  NumberInput,
  Pagination,
  Text,
  Popover,
  Stack,
  Button,
} from "@mantine/core";
import { BiSearch } from "react-icons/bi";

import { HiAdjustments, HiCheck } from "react-icons/hi";
import SearchResultEntry from "./SearchResultEntry";
import { buildFilterFormQuery } from "../../../utils/queryBuilder";
import Loading from "../Loading";
import { useDisclosure } from "@mantine/hooks";
import { getMatyrs } from "../../../services/martyrManagementService";
import { useForm } from "@mantine/form";
import { useSearchMartyrStore } from "../../../store/useSearchMartyrStore";
import { useInfoStore } from "../../../store/useInfoStore";

const SearchPopupModal = ({
  searchKey,
  filters,
  setFilters,
  setSearchKey,
  searchResults,

  setCurrentPage,
  handleSearch,
  currentPage,
  offSetHeight,
  filterQuery,
  onSelectMartyrHandler,
  showAutoSuggestions,
  setShowAutoSuggestions,
  autoSuggestions,
  setAutoSuggestions,
}) => {
  const filterForm = useForm({
    mode: "uncontrolled",
  });

  const { grave_rows } = useInfoStore();

  const [isLoadingAutoSuggestions, setIsLoadingAutoSuggestions] =
    useState(false);

  const { isLoadingSearchResults } = useSearchMartyrStore();

  const handleAutoSuggest = async (searchKey) => {
    try {
      setIsLoadingAutoSuggestions(true);
      const results = await getMatyrs(searchKey, 0, DEFAULT_AUTO_SUGGEST_SIZE);
      const content = results.content;
      if (!content) {
        setAutoSuggestions([]);
        setShowAutoSuggestions(true);
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

  const [
    showFilterSetting,
    { open: openFilterSetting, close: closeFilterSetting },
  ] = useDisclosure(false);
  return (
    <div
      className="overflow-auto h-screen z-[9999] bg-white relative top-0 w-full"
      style={{
        marginTop: offSetHeight.toString() + "px",
      }}
    >
      {/* Filter modal */}
      <Modal
        className="fixed z-[9999999] top-0 left-0 rigth-0 bottom-0 "
        opened={showFilterSetting}
        onClose={closeFilterSetting}
        title={
          <Text size="xl" weight={700} className="p-2">
            Tìm kiếm nâng cao
          </Text>
        }
        fullScreen
        radius={0}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <form
          onSubmit={filterForm.onSubmit((values) => {
            let flattenFilters = flattenObject(filters);
            setSearchKey(searchKey.replace(/\s+/g, " "));
            const queryData = {
              ...values,
              ...flattenFilters,
            };

            const filters_query = buildFilterFormQuery(queryData);
            setCurrentPage(0);
            handleSearch({
              name: searchKey,
              page: 0,
              size: DEFAULT_SEARCH_SIZE,
              filters: filters_query,
            });
            closeFilterSetting();
          })}
        >
          <div className="min-h-[100vh] pb-32 overflow-auto px-6">
            <Stack spacing={32}>
              {/* Personal Information Section */}
              <div className="flex flex-col gap-4">
                <Text size="xl" weight={700} color="blue" className="pb-2">
                  Thông tin cá nhân
                </Text>
                <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg">
                  <Text size="lg" weight={500}>
                    Năm sinh - Năm mất
                  </Text>
                  <Flex gap={8} direction={{ base: "column", sm: "row" }}>
                    <NumberInput
                      size="xl"
                      key={filterForm.key("yearOfBirth")}
                      {...filterForm.getInputProps("yearOfBirth")}
                      min={1800}
                      max={2024}
                      radius="xl"
                      placeholder="Năm sinh"
                      label="Năm sinh"
                      className="flex-1"
                    />
                    <NumberInput
                      size="xl"
                      min={1800}
                      max={2024}
                      key={filterForm.key("dateOfDeath")}
                      {...filterForm.getInputProps("dateOfDeath")}
                      radius="xl"
                      placeholder="Năm mất"
                      label="Năm mất"
                      className="flex-1"
                    />
                  </Flex>

                  <div className="flex flex-col gap-2">
                    <Text size="lg" weight={500}>
                      Quê quán
                    </Text>
                    <Input
                      size="xl"
                      radius="xl"
                      key={filterForm.key("homeTown")}
                      {...filterForm.getInputProps("homeTown")}
                      placeholder="Ví dụ: Đồng Tháp"
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex flex-col gap-4">
                <Text size="xl" weight={700} color="blue" className="pb-2">
                  Vị trí mộ
                </Text>
                <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <Text size="lg" weight={500}>
                      Khu vực
                    </Text>
                    <SelectDropdownSearch
                      size="xl"
                      placeholder="Chọn khu vực"
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
                  </div>

                  <div className="flex flex-col gap-2">
                    <Text size="lg" weight={500}>
                      Hàng
                    </Text>
                    <SelectDropdownSearch
                      size="xl"
                      description="Chọn hàng"
                      placeholder="Chọn hàng mộ"
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
                        grave_rows && grave_rows[filters.graveRow.areaName]
                          ? grave_rows[filters.graveRow.areaName].map(
                              (item) => item.rowName
                            )
                          : []
                      }
                      value={filters.graveRow.rowName}
                    />
                  </div>
                </div>
              </div>
            </Stack>
          </div>

          <div className="border-t border-gray-200 flex gap-4 justify-end px-6 fixed bottom-0 py-6 bg-white w-full left-0">
            <Button
              onClick={() => {
                filterForm.reset();
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
              size="xl"
              radius="xl"
              className="flex-1"
            >
              Xóa bộ lọc
            </Button>
            <Button size="xl" type="submit" radius="xl" className="flex-1">
              Áp dụng
            </Button>
          </div>
        </form>
      </Modal>

      {/* Show suggestions section */}

      {showAutoSuggestions && (
        <div className="overflow-auto  absolute top-0 h-screen   z-[9999] w-full">
          <div className="px-2 pt-2">
            <Button
              size="md"
              radius={"xl"}
              className="w-full"
              onClick={() => {
                setAutoSuggestions([]);
                setShowAutoSuggestions(false);
                setCurrentPage(0);
                // Update searchKey to makesure it will only one space between words
                setSearchKey(searchKey.replace(/\s+/g, " "));
                handleSearch({
                  ...filterQuery,
                  name: searchKey,
                  page: 0,
                  size: DEFAULT_SEARCH_SIZE,
                });
              }}
            >
              TÌM KIẾM
            </Button>
          </div>
          {isLoadingAutoSuggestions ? (
            <Loading />
          ) : autoSuggestions.length > 0 ? (
            <div className="flex flex-col gap-1  p-2">
              <Text fw={"bolder"} fz={"lg"}>
                Đề xuất tìm kiếm
              </Text>
              {autoSuggestions.map((item) => (
                <SearchResultEntry
                  item={item}
                  match={searchKey}
                  selectItem={() => {
                    onSelectMartyrHandler(item);
                  }}
                  key={item.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1  p-2">
              <Text fw={"bolder"} fz={"lg"}>
                Đề xuất tìm kiếm
              </Text>
              <Text c="gray">Không có kết quả phù hợp</Text>
            </div>
          )}
        </div>
      )}

      {/* Show search result section */}
      {!showAutoSuggestions && (searchResults || isLoadingSearchResults) && (
        <>
          {isLoadingSearchResults ? (
            <Loading />
          ) : (
            <div className="flex bg-white flex-col gap-1  p-2">
              <>
                {searchResults?.content?.length > 0 ? (
                  <>
                    <div className="flex justify-start gap-2">
                      <Button
                        className="text-xl"
                        radius={"xl"}
                        onClick={() => {
                          openFilterSetting();
                        }}
                      >
                        Bộ lọc
                      </Button>
                    </div>
                    <Flex gap={4} m={4} align="center">
                      <Text c="black" fw={700}>
                        Đã tìm thấy{" "}
                      </Text>
                      <Text c="blue" fw={800}>
                        {searchResults?.totalElements} kết quả
                      </Text>
                    </Flex>
                    {searchResults?.content.map((item) => (
                      <SearchResultEntry
                        item={item}
                        key={item.id}
                        selectItem={() => {
                          onSelectMartyrHandler(item);
                        }}
                      />
                    ))}{" "}
                    <div className="flex justify-center w-full pb-4 px-8">
                      <Pagination
                        value={currentPage == 0 ? 1 : currentPage}
                        onChange={async (value) => {
                          setCurrentPage(value);

                          await handleSearch({
                            name: searchKey,
                            page: value - 1,
                          });

                          // Scroll to bottom with smooth behavior
                          window.scrollTo({
                            top: document.documentElement.scrollHeight,
                          });
                        }}
                        total={searchResults?.totalPages}
                        size="md"
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
                          <Text>Bạn có thể thử các thao tác nhanh</Text>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => {
                                openFilterSetting();
                              }}
                              size="xl"
                              radius="xl"
                              leftSection={<HiAdjustments size={20} />}
                              className="shadow-md"
                            >
                              Chọn khu vực tìm kiếm
                            </Button>
                            <Button
                              color="green"
                              radius={"xl"}
                              size="xl"
                              onClick={() => {
                                setAutoSuggestions([]);
                                setSearchKey("");
                                setShowAutoSuggestions(false);
                                handleSearch({
                                  name: "",
                                  page: 0,
                                  size: DEFAULT_SEARCH_SIZE,
                                });
                              }}
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
            </div>
          )}
        </>
      )}

      {/* Empty state when no suggestions or results */}
      {!(showAutoSuggestions || searchResults) && !isLoadingSearchResults && (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                openFilterSetting();
              }}
              size="xl"
              radius="xl"
              leftSection={<HiAdjustments size={20} />}
              className="shadow-md"
            >
              Chọn khu vực tìm kiếm
            </Button>
            <Button
              color="green"
              radius={"xl"}
              size="xl"
              onClick={() => {
                setAutoSuggestions([]);
                setSearchKey("");
                setShowAutoSuggestions(false);
                handleSearch({
                  name: "",
                  page: 0,
                  size: DEFAULT_SEARCH_SIZE,
                });
              }}
            >
              Hiển thị toàn bộ danh sách
            </Button>
          </div>
          <BiSearch size={64} className="text-blue-500 my-8" />

          <Text className="text-xl mb-2 font-medium">
            Bạn muốn tìm liệt sĩ?
          </Text>
          <Text className="text-gray-600 text-lg mb-6">
            Bạn có thể tìm theo tên hoặc chọn khu vực để dễ dàng tìm kiếm
          </Text>
        </div>
      )}
    </div>
  );
};

export default SearchPopupModal;
