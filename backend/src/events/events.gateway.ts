import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Inject, forwardRef } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { EventsService } from "./events.service";
import { Event } from "./event.model";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const events = await this.eventsService.getEvents();
    client.emit("events", events);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async broadcastEvent(event: Event) {
    this.server.emit("newEvent", event);
  }

  async broadcastEventUpdate(event: Event) {
    this.server.emit("eventUpdate", event);
  }

  @SubscribeMessage("createEvent")
  async handleCreateEvent(client: Socket, message: string) {
    try {
      const event = await this.eventsService.createEvent(message);
      await this.broadcastEvent(event);
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      client.emit("error", { message: "Failed to create event" });
    }
  }
}
