export const generateOTP=()=>{
    return Math.floor(100000+Math.random()*900000).toString()
}

export const getOtpHtml = (otp, expiryMinutes = 10, appName = "Authentication") => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#f4f4f7; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0"
                 style="background:#ffffff; border-radius:8px; padding:30px;">
            <tr>
              <td align="center" style="font-size:22px; font-weight:bold; color:#333;">
                ${appName}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 0 10px; font-size:16px; color:#555;">
                Use the code below to verify your email:
              </td>
            </tr>
            <tr>
              <td align="center">
                <div style="display:inline-block; padding:14px 28px; font-size:32px;
                            letter-spacing:8px; font-weight:bold; color:#111;
                            background:#f0f0f5; border-radius:6px;">
                  ${otp}
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:20px; font-size:14px; color:#777;">
                This code expires in ${expiryMinutes} minutes.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:20px; font-size:12px; color:#999;">
                If you didn't request this, you can ignore this email.
                Never share this code with anyone.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
