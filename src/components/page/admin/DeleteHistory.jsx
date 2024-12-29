import {
  Table,
  Text,
  Group,
  Paper,
  Title,
  LoadingOverlay,
  Badge,
  Pagination
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { getDeleteHistory } from '../../../services/martyrService';
import { notifications } from '@mantine/notifications';

export default function DeleteHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getDeleteHistory({
        page: page - 1,
        size: 10
      });
      setHistory(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải lịch sử xóa',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={loading} />
      
      <Title order={2} mb="lg">
        Lịch sử xóa
      </Title>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Mã liệt sĩ</Table.Th>
            <Table.Th>Họ và tên</Table.Th>
            <Table.Th>Thời gian xóa</Table.Th>
            <Table.Th>Người xóa</Table.Th>
            <Table.Th>Lý do</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {history.map((record) => (
            <Table.Tr key={record.id}>
              <Table.Td>{record.martyrCode}</Table.Td>
              <Table.Td>{record.martyrName}</Table.Td>
              <Table.Td>
                {new Date(record.deletedAt).toLocaleString('vi-VN')}
              </Table.Td>
              <Table.Td>{record.deletedBy}</Table.Td>
              <Table.Td>{record.reason || 'Không có'}</Table.Td>
            </Table.Tr>
          ))}
          {history.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text ta="center" c="dimmed">
                  Chưa có lịch sử xóa
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Group>
      )}
    </Paper>
  );
} 