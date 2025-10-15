"use client";
import { ReservationData } from "@/types/tickets";
import { Box } from "@mui/material";
import TicketItem from "@/components/tickets/TickemItem";

type TicketsListProps = {
  reservations: ReservationData[];
};

// Boxを使用する形に修正
export default function TicketList({ reservations }: TicketsListProps) {
  return (
    <Box>
      {reservations.map((item) => (
        <TicketItem key={item.id} reservation={item} />
      ))}
    </Box>
  );
}
