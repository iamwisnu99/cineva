import nodemailer from 'nodemailer';

interface SendOtpParams {
  to: string;
  nama: string;
  otpCode: string;
}

/**
 * Creates nodemailer transporter using Gmail App Password.
 */
function createTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim()?.replace(/\s+/g, ''); // strip spaces from app password if any

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Generates high-end modern cinematic HTML email template
 */
function generateOtpEmailTemplate(nama: string, otpCode: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Akun Cineva</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07080b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #07080b; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #0e121b; border: 1px solid #1f273b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Top Accent Banner -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #f59e0b, #d97706, #ef4444);"></td>
          </tr>

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding: 40px 30px 20px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; font-weight: 900; font-size: 22px; color: #07080b; line-height: 44px;">
                    C
                  </td>
                  <td style="padding-left: 12px; text-align: left;">
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; line-height: 1;">
                      CINEVA<span style="display: inline-block; width: 6px; height: 6px; background-color: #f59e0b; border-radius: 50%; margin-left: 4px;"></span>
                    </div>
                    <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; font-weight: 600; margin-top: 3px;">
                      Stream with Comfortable
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 10px 40px 30px 40px; text-align: center;">
              <h1 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; letter-spacing: -0.3px;">
                Kode Verifikasi Akun Anda
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 24px 0;">
                Halo <strong style="color: #ffffff;">${nama}</strong>, selamat datang di <strong style="color: #f59e0b;">Cineva</strong>. Gunakan 6-digit kode OTP berikut untuk menyelesaikan pendaftaran akun Anda:
              </p>

              <!-- OTP Display Box -->
              <div style="background-color: #141a27; border: 1.5px dashed #f59e0b; border-radius: 14px; padding: 22px 15px; margin: 25px 0; text-align: center;">
                <div style="font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #f59e0b; font-family: 'Courier New', Courier, monospace; text-indent: 10px;">
                  ${otpCode}
                </div>
              </div>

              <!-- Expiry Note -->
              <p style="font-size: 12px; color: #64748b; margin: 15px 0 0 0; line-height: 1.5;">
                ⏱️ Kode ini berlaku selama <strong style="color: #cbd5e1;">10 menit</strong>. Jika Anda tidak pernah mendaftar di Cineva, Anda dapat mengabaikan email ini dengan aman.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="border-top: 1px solid #1a2234;"></div>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 20px 40px; background-color: #0b0e16; text-align: center;">
              <p style="font-size: 11px; color: #64748b; line-height: 1.5; margin: 0;">
                🛡️ Jangan pernah memberitahukan kode verifikasi ini kepada siapa pun, termasuk pihak yang mengatasnamakan Cineva.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 25px 40px; text-align: center; background-color: #07080b;">
              <p style="font-size: 11px; color: #475569; margin: 0;">
                © ${new Date().getFullYear()} Cineva: Stream with Comfortable. Seluruh hak cipta dilindungi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends OTP verification email via Gmail SMTP
 */
export async function sendOtpEmail({ to, nama, otpCode }: SendOtpParams): Promise<{ success: boolean; error?: string }> {
  const transporter = createTransporter();

  // If Gmail credentials are not configured, print to console for development fallback
  if (!transporter) {
    console.log('\n======================================================');
    console.log(`[Cineva OTP Sim] Gmail App Password belum diisi di .env.local`);
    console.log(`Penerima  : ${nama} <${to}>`);
    console.log(`KODE OTP  : ${otpCode}`);
    console.log(`Berlaku   : 10 Menit`);
    console.log('======================================================\n');
    return { success: true };
  }

  try {
    const fromAddress = process.env.GMAIL_USER?.trim();
    await transporter.sendMail({
      from: `"Cineva Streaming" <${fromAddress}>`,
      to,
      subject: `${otpCode} adalah Kode Verifikasi Pendaftaran Cineva Anda`,
      text: `Halo ${nama},\n\nKode verifikasi pendaftaran Cineva Anda adalah: ${otpCode}\n\nKode ini berlaku selama 10 menit.\nJangan berikan kode ini kepada siapa pun.`,
      html: generateOtpEmailTemplate(nama, otpCode),
    });

    return { success: true };
  } catch (err: any) {
    console.error('[Cineva Mailer Error]', err);
    return { success: false, error: err?.message || 'Gagal mengirim email verifikasi OTP.' };
  }
}
