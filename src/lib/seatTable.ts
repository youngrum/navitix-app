// 座席マスタ（物理的な座席配置）
export const seats = [
  // スクリーンNo.1 (110席) - 10行×11列を想定
  ...Array.from({ length: 10 }, (_, rowIndex) =>
    Array.from({ length: 11 }, (_, seatIndex) => ({
      id: rowIndex * 11 + seatIndex + 1,
      auditorium_id: 1,
      seat_row: String.fromCharCode(65 + rowIndex), // A, B, C...
      seat_number: (seatIndex + 1).toString(),
      seat_type: "standard" as const,
      is_available: true,
      fee: 1800,
    }))
  ).flat(),

  // スクリーンNo.2 (90席) - 9行×10列を想定
  ...Array.from({ length: 9 }, (_, rowIndex) =>
    Array.from({ length: 10 }, (_, seatIndex) => ({
      id: 150 + rowIndex * 10 + seatIndex + 1,
      auditorium_id: 2,
      seat_row: String.fromCharCode(65 + rowIndex),
      seat_number: (seatIndex + 1).toString(),
      seat_type: "standard" as const,
      is_available: true,
      fee: 1800,
    }))
  ).flat(),

  // スクリーンNo.3 (100席) -  10行×10列を想定
  ...Array.from({ length: 10 }, (_, rowIndex) =>
    Array.from({ length: 10 }, (_, seatIndex) => ({
      id: 270 + rowIndex * 10 + seatIndex + 1,
      auditorium_id: 3,
      seat_row: String.fromCharCode(65 + rowIndex),
      seat_number: (seatIndex + 1).toString(),
      seat_type: "standard" as const,
      is_available: true,
      fee: 1800,
    }))
  ).flat(),
];

// 座席予約状況（動的データ）
export const seat_reservations = [
  // schedule_id: 1 の予約例（いくつか予約済みにする）
  {
    id: 1,
    seat_id: 8,
    schedule_id: 1,
    reservation_id: 1001,
    status: "RESERVED" as const,
    locked_until: null,
  },
  {
    id: 2,
    seat_id: 9,
    schedule_id: 1,
    reservation_id: 1001,
    status: "RESERVED" as const,
    locked_until: null,
  },
  {
    id: 3,
    seat_id: 23,
    schedule_id: 1,
    reservation_id: 1002,
    status: "RESERVED" as const,
    locked_until: null,
  },
  {
    id: 4,
    seat_id: 24,
    schedule_id: 1,
    reservation_id: 1002,
    status: "RESERVED" as const,
    locked_until: null,
  },
  {
    id: 5,
    seat_id: 75,
    schedule_id: 1,
    reservation_id: null,
    status: "LOCKED" as const,
  }, // 仮予約中

  // schedule_id: 2 の予約例
  {
    id: 6,
    seat_id: 15,
    schedule_id: 2,
    reservation_id: 1003,
    status: "RESERVED" as const,
  },
  {
    id: 7,
    seat_id: 16,
    schedule_id: 2,
    reservation_id: 1003,
    status: "RESERVED" as const,
  },
  {
    id: 8,
    seat_id: 45,
    schedule_id: 2,
    reservation_id: null,
    status: "LOCKED" as const,
  }, // 仮予約中

  // schedule_id: 3 の予約例
  {
    id: 9,
    seat_id: 5,
    schedule_id: 3,
    reservation_id: 1004,
    status: "RESERVED" as const,
  },
  {
    id: 10,
    seat_id: 6,
    schedule_id: 3,
    reservation_id: 1004,
    status: "RESERVED" as const,
  },
];
