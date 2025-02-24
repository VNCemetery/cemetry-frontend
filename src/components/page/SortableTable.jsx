import { useState } from "react";

import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import classes from "./SortableTable.module.css";
import { HiChevronDown, HiChevronUp, HiSelector } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

function Th({ children, reversed, sorted, onSort, sortable = true }) {
  const Icon = sorted ? (reversed ? HiChevronUp : HiChevronDown) : HiSelector;
  return (
    <Table.Th className={classes.th}>
      {sortable ? (
        <UnstyledButton onClick={onSort} className={classes.control}>
          <Group justify="space-between">
            <Text fw={500} fz="sm">
              {children}
            </Text>
            <Center className={classes.icon}>
              <Icon size={16} stroke={1.5} />
            </Center>
          </Group>
        </UnstyledButton>
      ) : (
        <Text fw={500} fz="sm">
          {children}
        </Text>
      )}
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

function sortData(data, payload, customSort) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (customSort) {
        return payload.reversed
          ? customSort(b[sortBy], a[sortBy])
          : customSort(a[sortBy], b[sortBy]);
      }

      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy].toString());
      }

      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    }),
    payload.search
  );
}

export default function SortableTable({ data, columns, customSort }) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      sortData(data, { sortBy: field, reversed, search }, customSort)
    );
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(
        data,
        { sortBy, reversed: reverseSortDirection, search: value },
        customSort
      )
    );
  };

  const rows = sortedData.map((row, index) => (
    <Table.Tr key={index}>
      {columns.map((column) => (
        <Table.Td key={column.key}>{row[column.key]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search..."
        mb="md"
        leftSection={<FiSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                sorted={sortBy === column.key}
                reversed={reverseSortDirection}
                onSort={() =>
                  column.sortable !== false && setSorting(column.key)
                }
                sortable={column.sortable !== false}
              >
                {column.label}
              </Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
