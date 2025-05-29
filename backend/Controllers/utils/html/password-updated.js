module.exports = () => {
    // Generate today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Stores Platform - Password Updated</title>
  <!--[if mso]>
    <style>* { font-family: Arial, Helvetica, sans-serif !important; }</style>
  <![endif]-->
  <style>
    body { margin:0; padding:0; background:#f8f8f8; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { background:#ecebeb; padding:20px; text-align:center; }
    .header a.logo { font-size:24px; color:#333; text-decoration:none; font-weight:bold; }
    .content { padding:30px; color:#555; line-height:1.5; }
    .footer { background:#f0f0f0; padding:20px; text-align:center; font-size:12px; color:#888; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table class="container" cellpadding="0" cellspacing="0">
        <!-- Header -->
        <tr><td class="header">
          <a href="{{frontendUrl}}" class="logo">Stores Platform</a><br/>
          <span style="font-size:12px;color:#666;">${today}</span>
        </td></tr>

        <!-- Body -->
        <tr><td class="content">
          <h2 style="margin-top:0;color:#333;">Hello 👋</h2>
          <p>Your password has been <strong>successfully updated</strong>.</p>
          <p>If you did not perform this action, please <a href="{{supportUrl}}" style="color:#7367f0;">contact our support team</a> immediately.</p>
          <p>Thank you for choosing Stores Platform.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td class="footer">
          &copy; ${new Date().getFullYear()} Stores Platform. All rights reserved.<br/>
          <a href="{{supportUrl}}" style="color:#888;text-decoration:underline;">Support</a> &mdash; <a href="{{frontendUrl}}/privacy" style="color:#888;text-decoration:underline;">Privacy Policy</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};