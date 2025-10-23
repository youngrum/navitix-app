"use client";
import { useState, useEffect } from "react";
import { ReservationsTable } from "@/types/reservation";
import { Box, Pagination, Stack, Grow, CircularProgress } from "@mui/material";
import TicketItem from "@/components/tickets/TickemItem";

type TicketsListProps = {
  reservations: ReservationsTable[];
};

const ITEMS_PER_PAGE = 10;

export default function TicketList({ reservations }: TicketsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReservations = reservations.slice(startIndex, endIndex);

  // ページが変わったときにアニメーションをリセット
  useEffect(() => {
    setVisibleItems(new Set());

    const loadingTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);

    // 予約カードを順番にフェードイン
    currentReservations.forEach((reservation, index) => {
      setTimeout(
        () => {
          setVisibleItems((prev) => {
            const newSet = new Set(prev);
            newSet.add(String(reservation.id));
            return newSet;
          });
        },
        500 + index * 200
      );
    });

    // ローディングタイマーのリセット
    return () => {
      clearTimeout(loadingTimer);
    };
  }, [currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    setIsInitialLoading(true); // ページ変更時もローディング表示
  };

  if (isInitialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ py: 2 }}>
      <Box>
        {currentReservations.map((reservation) => (
          <Grow
            key={reservation.id}
            in={visibleItems.has(String(reservation.id))}
            timeout={600}
          >
            <div>
              <TicketItem reservation={reservation} />
            </div>
          </Grow>
        ))}
      </Box>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "text.primary",
              },
            }}
          />
        </Box>
      )}
    </Stack>
  );
}
