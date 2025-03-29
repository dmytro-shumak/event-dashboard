import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { Event } from "./event.model";
import { v4 as uuidv4 } from "uuid";
import { EventsGateway } from "./events.gateway";

@Injectable()
export class EventsService {
  private events: Event[] = [];
  private retryAttempts = new Map<string, number>();
  private readonly MAX_RETRIES = 3;

  constructor(
    @Inject(forwardRef(() => EventsGateway))
    private readonly eventsGateway: EventsGateway,
  ) {}

  async createEvent(message: string): Promise<Event> {
    const event: Event = {
      id: uuidv4(),
      message,
      status: "pending",
      created_at: new Date(),
    };

    try {
      this.events.push(event);
      // Simulate event processing
      setTimeout(() => this.processEvent(event.id), 2000);
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Failed to create event");
    }
  }

  private async processEvent(id: string) {
    const eventIndex = this.events.findIndex((e) => e.id === id);
    if (eventIndex === -1) return;

    try {
      // Simulate random success/failure
      const success = Math.random() > 0.3;
      const updatedEvent = await this.updateEventStatus(
        id,
        success ? "completed" : "failed",
      );
      await this.eventsGateway.broadcastEventUpdate(updatedEvent);
    } catch (error) {
      console.error("Error processing event:", error);
      await this.retryEvent(id);
    }
  }

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async updateEventStatus(id: string, status: Event["status"]): Promise<Event> {
    const eventIndex = this.events.findIndex((e) => e.id === id);
    if (eventIndex === -1) {
      throw new Error("Event not found");
    }

    try {
      this.events[eventIndex] = {
        ...this.events[eventIndex],
        status,
      };
      return this.events[eventIndex];
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error("Failed to update event");
    }
  }

  async retryEvent(id: string): Promise<Event> {
    const attempts = this.retryAttempts.get(id) || 0;
    if (attempts >= this.MAX_RETRIES) {
      throw new Error("Max retry attempts reached");
    }

    this.retryAttempts.set(id, attempts + 1);
    const updatedEvent = await this.updateEventStatus(id, "pending");
    await this.eventsGateway.broadcastEventUpdate(updatedEvent);
    return updatedEvent;
  }
}
