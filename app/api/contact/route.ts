import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailTranslations } from "@/lib/translations/email";
import type { Locale } from "@/lib/translations";

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

    const { name, email, phone, area, message, locale: rawLocale } = body;
    const locale: Locale = rawLocale || "pt";

    if (!name || !email || !area || !message) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta." },
        { status: 400 }
      );
    }

    const t = (key: string) => emailTranslations[key]?.[locale] ?? emailTranslations[key]?.pt ?? "";
    const dir = locale === "ar" ? "rtl" : "ltr";

    // Email to the lawyer (always in Portuguese)
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
            <tr>
              <td style="padding: 8px 0; color: #b8924a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Língua</td>
              <td style="padding: 8px 0;">${locale.toUpperCase()}</td>
            </tr>
          </table>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.08); font-size: 11px; color: rgba(26,25,22,0.5);">
            Enviado através do website margaridatempera.pt
          </div>
        </div>
      `,
    });

    // Confirmation email to the client (in their chosen language)
    await transporter.sendMail({
      from: `"Margarida Tempera — ${t("firmName")}" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: t("subject"),
      html: `
        <div dir="${dir}" style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1916;">
          <div style="border-bottom: 2px solid #b8924a; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-weight: 300; font-size: 24px;">${t("subject")}</h2>
          </div>
          <p style="line-height: 1.6; font-size: 14px;">
            ${t("greeting")} ${name},
          </p>
          <p style="line-height: 1.6; font-size: 14px;">
            ${t("confirmation")} <strong>${area}</strong>.
          </p>
          <p style="line-height: 1.6; font-size: 14px;">
            ${t("responseTime")}
          </p>
          <p style="line-height: 1.6; font-size: 14px;">
            ${t("signOff")}<br/>
            <strong>Margarida Tempera</strong><br/>
            <span style="font-size: 12px; color: rgba(26,25,22,0.5);">${t("firmName")}</span>
          </p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.08); font-size: 11px; color: rgba(26,25,22,0.5);">
            ${t("footer")}
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
