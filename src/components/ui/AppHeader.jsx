import { VscBook, VscCode } from "react-icons/vsc";
import { BiCoin, BiChevronDown, BiPieChartAlt, BiSearch } from "react-icons/bi";
import { FiBarChart, FiBell, FiHome, FiInfo, FiMap } from "react-icons/fi";

import { AppDrawer, navigationItems } from "./AppDrawer";
import LOGO from "../../assets/LOGO.png";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  CloseIcon,
  Collapse,
  Divider,
  Drawer,
  Flex,
  Group,
  HoverCard,
  Input,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./AppHeader.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchMartyrStore } from "../../store/useSearchMartyrStore";
import { useEffect, useRef, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import SearchPopupModal from "./MatyrSearch/SearchPopupModal";

const mockdata = [
  {
    icon: VscCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: BiCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: VscBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: FiBarChart,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: BiPieChartAlt,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: FiBell,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

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

  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [offSetHeight, setOffSetHeight] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    if (headerRef?.current?.offsetHeight === 0) {
      return;
    }
    searchInputRef.current.focus();

    setOffSetHeight(headerRef.current.offsetHeight);
  }, [headerRef?.current?.offSetHeight, showSearchModal]);

  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`fixed top-0 left-0  transition-all duration-300 ease-in-out min-h-screen overflow-auto bottom-0 right-0 z-[99999] ${
          showSearchModal ? "" : "hidden"
        }`}
      >
        <div className={`h-full relative`}>
          <div className="  z-[4]">
            <div
              ref={headerRef}
              className={`fixed top-0  left-0 ${
                !showSearchModal ? "transparent" : "bg-white"
              } right-0 z-[4]`}
            >
              <div className="flex w-full items-center">
                <div className="w-full items-center flex gap-1 bg-white py-1">
                  <div className="flex items-center w-full text-gray-600   w-full p-1 gap-1">
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
                          setShowSearchModal(false);
                          setSearchKey("");
                          setShowAutoSuggestions(false);
                          setSearchResults(null);
                        }
                      }}
                    >
                      <BsArrowLeft
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <Input
                      value={searchKey}
                      ref={searchInputRef}
                      onClick={() => {
                        if (!showSearchModal) {
                          openSearchPopup();
                          searchInputRef.current.focus();
                        }
                      }}
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
            </div>
          </div>

          <SearchPopupModal
            offSetHeight={offSetHeight}
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
              let newUrlPath = `/map?martyrId=${martyr.id}`;
              window.location = newUrlPath;
            }}
          />
        </div>
      </div>
      <Box className="sticky top-0 w-full bg-white z-[9999]">
        <header className={classes.header}>
          <div className="flex items-center h-full gap-4 justify-between w-full ">
            {/* LEFT GROUP */}
            <div className="flex gap-4 ">
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="md"
              />
              <Group
                className="transition-all ease-in-out cursor-pointer  hover:bg-gray-100 p-1 rounded-xl "
                visibleFrom="md" // className="p-2 transition-all ease-in-out duration-150 hover:cursor-pointer  hover:bg-gray-100 rounded-xl flex gap-2 items-center justify-center"
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Avatar src={LOGO} alt="Logo" radius="xl" />
              </Group>
              <Flex
                visibleFrom="md"
                gap={4}
                justify={"center"}
                align={"center"}
              >
                {navigationItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "filled" : "default"}
                    radius={"xl"}
                    rightSection={item.icon}
                    component="a"
                    onClick={() => {
                      navigate(item.href);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Flex>
            </div>
            <Group className="flex w-full items-center">
              <Input
                size="lg"
                className="w-full"
                onClick={() => {
                  searchInputRef?.current?.focus();
                  setShowSearchModal(true);
                }}
                value={searchKey}
                radius={"xl"}
                placeholder="Tìm kiếm liệt sĩ"
                leftSection={<BiSearch className="text-[1.5rem]" />}
                styles={(theme) => ({
                  input: {
                    "&::placeholder": {
                      color: theme.colors.red[6],
                      opacity: 1,
                    },
                  },
                })}
              />
            </Group>
          </div>
        </header>

        <AppDrawer
          opened={drawerOpened}
          toggleDrawer={toggleDrawer}
          closeDrawer={closeDrawer}
        />
      </Box>
    </>
  );
}
