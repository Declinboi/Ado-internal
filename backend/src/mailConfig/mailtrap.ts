import { MailtrapClient } from "mailtrap";

const TOKEN = "8aadc93d505c280cd811ad07cd239a04";

export const mailClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};

