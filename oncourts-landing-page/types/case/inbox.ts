/**
 * Inbox related types for case management
 */

// Order details interface
export interface OrderDetails {
  date: number;
  businessOfTheDay: string;
  orderId: string;
}

// Payment task interface
export interface PaymentTask {
  id: string;
  task: string;
  dueDate: string;
  daysRemaining: string;
}

// Inbox search response interface
export interface InboxSearchResponse {
  paymentTasks: PaymentTask[];
  orderDetailsList: OrderDetails[];
  totalCount: number;
}
