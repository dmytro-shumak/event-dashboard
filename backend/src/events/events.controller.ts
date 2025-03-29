import { Controller, Get, Post, Body } from "@nestjs/common";
import { EventsService } from "./events.service";
import { Event } from "./event.model";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents(): Promise<Event[]> {
    return this.eventsService.getEvents();
  }

  @Post()
  async createEvent(@Body("message") message: string): Promise<Event> {
    return this.eventsService.createEvent(message);
  }
}
