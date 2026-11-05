export interface OrderHandoverAudit {
  orderId: string;
  confirmedByBuyer: boolean;
  confirmedBySeller: boolean;
  timestamp: Date;
}
