import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/fs-utils";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";

export async function POST(req) {
  try {
    const { receiver } = await req.json();
    if (!receiver) {
      return NextResponse.json({ error: "Receiver required" }, { status: 400 });
    }

    const messages = await readJSON("messages.json");
    if (!messages.length) {
      return NextResponse.json({ error: "No message found" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    await sendWhatsAppTemplate({
      to: receiver,
      sender: lastMessage.sender,
      message: lastMessage.message,
      documentUrl: lastMessage.documentPath,
    });

    const sent = await readJSON("sent_receivers.json");
    sent.push({
      receiver,
      sentAt: new Date().toISOString(),
    });

    await writeJSON("sent_receivers.json", sent);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
