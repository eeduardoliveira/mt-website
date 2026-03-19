import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, area, message } = body;

    if (!name || !email || !area || !message) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta." },
        { status: 400 }
      );
    }

    // Email to the lawyer
    await transporter.sendMail({
      from: `"Website - Pedido de Consulta" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      replyTo: email,
      subject: `Novo Pedido de Consulta — ${area}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1916;">
          <div style="border-bottom: 2px solid #b8924a; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-weight: 300; font-size: 24px;">Novo Pedido de Consulta</h2>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #b8924a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px; vertical-align: top;">Nome</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8924a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1a1916;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8924a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Telefone</td>
              <td style="padding: 8px 0;">${phone || "Não indicado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8924a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Área</td>
              <td style="padding: 8px 0;">${area}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #b8924a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Mensagem</td>
              <td style="padding: 8px 0;">${message}</td>
            </tr>
          </table>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.08); font-size: 11px; color: rgba(26,25,22,0.5);">
            Enviado através do website margaridatempera.pt
          </div>
        </div>
      `,
    });

    // Confirmation email to the client
    await transporter.sendMail({
      from: `"Margarida Tempera — Escritório de Advogados" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Recebemos o seu pedido de consulta",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1916;">
          <div style="border-bottom: 2px solid #b8924a; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-weight: 300; font-size: 24px;">Obrigada pelo seu contacto</h2>
          </div>
          <p style="line-height: 1.6; font-size: 14px;">
            Estimado/a ${name},
          </p>
          <p style="line-height: 1.6; font-size: 14px;">
            Confirmamos a receção do seu pedido de consulta na área de <strong>${area}</strong>.
          </p>
          <p style="line-height: 1.6; font-size: 14px;">
            A sua mensagem será analisada e entraremos em contacto no prazo máximo de 24 horas úteis.
          </p>
          <p style="line-height: 1.6; font-size: 14px;">
            Com os melhores cumprimentos,<br/>
            <strong>Margarida Tempera</strong><br/>
            <span style="font-size: 12px; color: rgba(26,25,22,0.5);">Escritório de Advogados</span>
          </p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.08); font-size: 11px; color: rgba(26,25,22,0.5);">
            Inscrita na Ordem dos Advogados Portugueses
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Pedido recebido com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Erro ao processar o pedido." },
      { status: 500 }
    );
  }
}
