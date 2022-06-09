import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@my-sgtickets/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';

const setup = async (status: OrderStatus) => {
   const listener = new ExpirationCompleteListener(natsWrapper.client);

   const ticket = Ticket.build({
      title: 'concert',
      price: 20,
   });

   ticket._id = mongoose.Types.ObjectId().toHexString();

   await ticket.save();

   const order = Order.build({
      status,
      userId: 'alskdfj',
      expiresAt: new Date(),
      ticket,
   });

   await order.save();

   const data: ExpirationCompleteEvent['data'] = {
      orderId: order.id,
   };

   // @ts-ignore
   const msg: Message = {
      ack: jest.fn(),
   };

   return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
   const { listener, order, data, msg } = await setup(OrderStatus.Created);


   await listener.onMessage(data, msg);


   const updatedOrder = await Order.findById(order.id);
   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
   const { listener, order, data, msg } = await setup(OrderStatus.Created);


   await listener.onMessage(data, msg);


   expect(natsWrapper.client.publish).toHaveBeenCalled();

   const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
   );

   expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
   const { listener, data, msg } = await setup(OrderStatus.Created);


   await listener.onMessage(data, msg);


   expect(msg.ack).toHaveBeenCalled();
});

it('completed order remains completed', async () => {
   const { listener, order, data, msg } = await setup(OrderStatus.Complete);


   await listener.onMessage(data, msg);


   const notUpdatedOrder = await Order.findById(order.id);
   expect(notUpdatedOrder!.status).toEqual(OrderStatus.Complete);
});
