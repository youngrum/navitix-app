"use client";
import { useState } from "react";
import { ReservationData } from "@/types/tickets";
import { Box, Pagination, Stack } from "@mui/material";
import TicketItem from "@/components/tickets/TickemItem";

type TicketsListProps = {
  reservations: ReservationData[];
};

const ITEMS_PER_PAGE = 10;

export default function TicketList({ reservations }: TicketsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReservations = reservations.slice(startIndex, endIndex);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    // ページ変更時にスクロール
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Stack spacing={3} sx={{ py: 2 }}>
      <Box>
        {currentReservations.map((reservation) => (
          <TicketItem key={reservation.id} reservation={reservation} />
        ))}
      </Box>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
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
