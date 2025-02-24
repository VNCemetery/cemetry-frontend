import { useState, useEffect } from "react";
import {
  Center,
  Group,
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
  if (!search || !data?.length) return data;

  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) =>
      item[key]?.toString().toLowerCase().includes(query)
    )
  );
}

export default function SortableTable({
  data,
  columns,
  renderCell,
  onSort,
  sortConfig,
}) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(filterData(data, search));
  }, [data, search]);

  const handleSearchChange = (event) => {
    setSearch(event.currentTarget.value);
  };

  const rows = filteredData.map((row, index) => (
    <Table.Tr key={index}>
      {columns.map((column) => (
        <Table.Td key={column.key}>
          {renderCell ? renderCell(column.key, row) : row[column.key]}
        </Table.Td>
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
                sorted={sortConfig?.key === column.key}
                reversed={sortConfig?.direction === "DESC"}
                onSort={() => column.sortable !== false && onSort(column.key)}
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
