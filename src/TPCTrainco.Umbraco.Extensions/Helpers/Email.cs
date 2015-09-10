using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public class Email
    {
        public string EmailFrom { get; set; }
        public List<string> EmailToList { get; set; }
        public List<string> EmailCCList { get; set; }
        public List<string> EmailBccList { get; set; }
        public bool IsBodyHtml { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }

        public bool SendEmail()
        {
            bool success = false;

            bool debug = false;
            List<string> debugEmails = null;
            var message = new MailMessage();

            message.From = new MailAddress(this.EmailFrom.Trim());

            // Check for debug
            if (ConfigurationManager.AppSettings["Email:DebugSendTo"] != null && ConfigurationManager.AppSettings.Get("Email:DebugSendTo").Length > 0)
            {
                debugEmails = new List<string>();
                debugEmails = ConfigurationManager.AppSettings.Get("Email:DebugSendTo").Split(';').ToList();

                foreach (string emailTo in debugEmails)
                {
                    message.To.Add(new MailAddress(emailTo.Trim()));
                }
                debug = true;
            }

            if (false == debug)
            {
                if (this.EmailToList != null && this.EmailToList.Count > 0)
                {
                    foreach (string emailTo in this.EmailToList)
                    {
                        message.To.Add(new MailAddress(emailTo.Trim()));
                    }
                }

                if (this.EmailCCList != null && this.EmailCCList.Count > 0)
                {
                    foreach (string emailCC in this.EmailCCList)
                    {
                        message.CC.Add(new MailAddress(emailCC.Trim()));
                    }
                }

                if (this.EmailBccList != null && this.EmailBccList.Count > 0)
                {
                    foreach (string emailBcc in this.EmailBccList)
                    {
                        message.Bcc.Add(new MailAddress(emailBcc.Trim()));
                    }
                }
            }

            message.Subject = this.Subject.Trim();

            if (true == debug)
            {
                if (true == this.IsBodyHtml)
                {
                    this.Body = "<p><em>Email would have been sent to: " + String.Join(", ", this.EmailToList) + "</em></p>\n\r" + this.Body;
                }
                else
                {
                    this.Body = "Email would have been sent to: " + String.Join(", ", this.EmailToList) + "\n\r\n\r" + this.Body;
                }
            }

            message.Body = this.Body;
            message.IsBodyHtml = this.IsBodyHtml;

            if (message.To != null && message.To.Count > 0)
            {
                using (var smtp = new SmtpClient())
                {
                    smtp.Send(message);

                    success = true;
                }
            }

            return success;
        }
    }
}
