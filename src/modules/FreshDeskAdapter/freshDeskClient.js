export function createTicket(key, call) {
  console.log('create ticket:', call);
  // fake return ticket object
  return {
    id: call.sessionId // This one should be ticket id. Just use sessionId as a mock ticket id
  };
}

export function updateTicket(key, ticketId, call) {
  console.log('update ticket:', call);
  // fake return ticket object
  return {
    id: call.sessionId // This one should be ticket id.
  };
}
