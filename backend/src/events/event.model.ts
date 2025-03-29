export interface Event {
  id: string;
  message: string;
  status: "pending" | "completed" | "failed";
  created_at: Date;
}
