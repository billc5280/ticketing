import { Message } from 'node-nats-streaming';
import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@my-sgtickets/common";
import { Ticket } from "../../models/ticket";
import { ordersServiceQueueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
   queueGroupName = ordersServiceQueueGroupName;

   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

      const ticket = await Ticket.findByEvent(data);

      if (!ticket) {
         throw new Error('Ticket not found');
      }

      ticket.title = data.title;
      ticket.price = data.price;

      await ticket.save();

      // console.log(`id: ${ticket.id}`);
      // console.log(`title: ${ticket.title}`);
      // console.log(`price: ${ticket.price}`);
      // console.log(`version: ${ticket.version}`);

      msg.ack();
   }
}
