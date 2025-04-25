import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // default permitido sin dominio
      to: "familiajoserene@gmail.com", // tu correo de prueba
      subject: `[Nuevo mensaje del formulario] ${subject}`,
      html: `
        <h2>Nuevo mensaje recibido</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email del remitente:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error enviando el correo:", error);
    return NextResponse.json({ error: error.message || "Error enviando el correo" }, { status: 500 });
  }
}
