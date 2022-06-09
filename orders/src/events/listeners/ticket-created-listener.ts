import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from "@my-sgtickets/common";
import { Ticket } from "../../models/ticket";
import { ordersServiceQueueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
   queueGroupName = ordersServiceQueueGroupName;

   async onMessage(data: TicketCreatedEvent['data'], msg: Message) {

      const ticket = Ticket.build({
         title: data.title,
         price: data.price,
      });

      ticket._id = data.id;

      await ticket.save();

      // console.log(`id: ${ticket.id}`);
      // console.log(`title: ${ticket.title}`);
      // console.log(`price: ${ticket.price}`);

      msg.ack();
   }
}
