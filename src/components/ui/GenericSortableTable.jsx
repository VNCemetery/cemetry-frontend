import { useState } from "react";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdSearch,
  MdUnfoldMore,
} from "react-icons/md";
import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import classes from "./GenericSortableTable.module.css";

function Th({ children, reversed, sorted, onSort, sortable }) {
  if (!sortable) {
    return (
      <Table.Th className={classes.th}>
        <Text fw={500} fz="sm">
          {children}
        </Text>
      </Table.Th>
    );
  }

  const Icon = sorted
    ? reversed
      ? MdArrowUpward
      : MdArrowDownward
    : MdUnfoldMore;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search, columns) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    columns.some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData(data, payload, columns) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search, columns);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search,
    columns
  );
}

export function GenericSortableTable({ data, columns }) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const column = columns.find((col) => col.key === field);
    if (!column?.sortable) return;

    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      sortData(
        data,
        { sortBy: field, reversed, search },
        columns.map((col) => col.key)
      )
    );
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(
        data,
        { sortBy, reversed: reverseSortDirection, search: value },
        columns.map((col) => col.key)
      )
    );
  };

  const rows = sortedData.map((row, index) => (
    <Table.Tr key={index}>
      {columns.map((column) => (
        <Table.Td key={String(column.key)}>{row[column.key]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
      <Table.Tbody>
        <Table.Tr>
          {columns.map((column) => (
            <Th
              key={String(column.key)}
              sorted={sortBy === column.key}
              reversed={reverseSortDirection}
              onSort={() => setSorting(column.key)}
              sortable={column.sortable}
            >
              {column.label}
            </Th>
          ))}
        </Table.Tr>
      </Table.Tbody>
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
  );
}
