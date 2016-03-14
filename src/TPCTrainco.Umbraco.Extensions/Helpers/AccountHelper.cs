using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models.Account;
using TPCTrainco.Umbraco.Extensions.Objects;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.Models;

namespace TPCTrainco.Umbraco.Extensions.Helpers
{
    public static class AccountHelper
    {
        private const string _alg = "HmacSHA256";
        private const string _salt = "roduMbjVKvk5UNTuvkXUf"; // Generated at https://www.random.org/strings
        private const int _expirationMinutes = 360;

        public static string GenerateToken(string username, string host, string ip, string userAgent, long ticks)
        {
            string hash = string.Join(":", new string[] { username, ip, userAgent, ticks.ToString() });
            string hashLeft = "";
            string hashRight = "";

            using (HMAC hmac = HMACSHA256.Create(_alg))
            {
                hmac.Key = Encoding.UTF8.GetBytes(GetHashedPassword(host));
                hmac.ComputeHash(Encoding.UTF8.GetBytes(hash));

                hashLeft = Convert.ToBase64String(hmac.Hash);
                hashRight = string.Join(":", new string[] { username, ticks.ToString() });
            }

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(string.Join(":", hashLeft, hashRight)));
        }

        public static string GetHashedPassword(string password)
        {
            string key = string.Join(":", new string[] { password, _salt });

            using (HMAC hmac = HMACSHA256.Create(_alg))
            {
                // Hash the key.
                hmac.Key = Encoding.UTF8.GetBytes(_salt);
                hmac.ComputeHash(Encoding.UTF8.GetBytes(key));

                return Convert.ToBase64String(hmac.Hash);
            }
        }

        public static bool IsTokenValid(string token, string host, string ip, string userAgent)
        {
            bool result = false;

            try
            {
                // Base64 decode the string, obtaining the token:username:timeStamp.
                string key = Encoding.UTF8.GetString(Convert.FromBase64String(token));

                // Split the parts.
                string[] parts = key.Split(new char[] { ':' });
                if (parts.Length == 3)
                {
                    // Get the hash message, username, and timestamp.
                    string hash = parts[0];
                    string username = parts[1];
                    long ticks = long.Parse(parts[2]);
                    DateTime timeStamp = new DateTime(ticks);

                    bool expired = (DateTime.UtcNow - timeStamp).TotalMinutes > _expirationMinutes;
                    if (!expired)
                    {
                        // Hash the message with the key to generate a token.
                        string computedToken = GenerateToken(username, host, ip, userAgent, ticks);

                        // Compare the computed token with the one supplied and ensure they match.
                        result = (token == computedToken);
                    }
                }
            }
            catch
            {
            }

            return result;
        }

        public static string GetUsernameFromToken(string token)
        {
            var username = String.Empty;
            try
            {
                // Base64 decode the string, obtaining the token:username:timeStamp.
                string key = Encoding.UTF8.GetString(Convert.FromBase64String(token));

                // Split the parts.
                string[] parts = key.Split(new char[] { ':' });
                if (parts.Length == 3)
                {
                    username = parts[1];
                }
            }
            catch
            {
            }

            return username;
        }

        public static UserModel CreateUser(UserModel user, Uri uri)
        {
            try
            {
                if (!ApplicationContext.Current.Services.MemberService.Exists(user.Email))
                {
                    var member = ApplicationContext.Current.Services.MemberService.CreateMember(
                        username: user.Email,
                        email: user.Email,
                        name: String.Format("{0} {1}", user.FirstName, user.LastName),
                        memberTypeAlias: "Member"
                    );

                    var validationCode = Guid.NewGuid().ToString();
                    member.SetValue("validationCode", validationCode);

                    member.SetValue("umbracoMemberApproved", false);

                    member.Name = String.Format("{0} {1}", user.FirstName, user.LastName);

                    //member.RawPasswordValue = user.Password;                   

                    ApplicationContext.Current.Services.MemberService.Save(member);

                    ApplicationContext.Current.Services.MemberService.SavePassword(member, user.Password);

                    user.ValidationCode = validationCode;

                    var emailTemplete = GetEmailTemplate("New Account Verificaton");

                    if (emailTemplete != null)
                    {
                        string from = emailTemplete.GetProperty("emailFrom").Value.ToString();
                        string body = emailTemplete.GetProperty("emailBody").Value.ToString();
                        string subject = emailTemplete.GetProperty("emailSubject").Value.ToString();
                        string bcc = emailTemplete.GetProperty("emailToAlt").Value.ToString();
                        string siteUrlBase = String.Format("{0}://{1}", uri.Scheme, uri.Host);

                        var smtp = new Email();
                        smtp.EmailFrom = from;
                        smtp.EmailToList = new List<string>() { user.Email };
                        smtp.EmailBccList = bcc.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                        smtp.IsBodyHtml = true;
                        smtp.Subject = subject;
                        smtp.Body = body.Replace("{{VALIDATIONCODE}}", validationCode).Replace("{{SITEBASEURL}}", siteUrlBase);
                        smtp.SendEmail();
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.Error(typeof(AccountHelper), "Error creating new trainco member account.", ex);
            }

            return user;
        }

        public static bool ForgottenPassword(string email, Uri uri)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {
                try
                {
                    var validationCode = Guid.NewGuid().ToString();
                    member.SetValue("validationCode", validationCode);

                    ApplicationContext.Current.Services.MemberService.Save(member);

                    var emailTemplete = GetEmailTemplate("Forgotten Password");

                    if (emailTemplete != null)
                    {
                        string from = emailTemplete.GetProperty("emailFrom").Value.ToString();
                        string body = emailTemplete.GetProperty("emailBody").Value.ToString();
                        string subject = emailTemplete.GetProperty("emailSubject").Value.ToString();
                        string bcc = emailTemplete.GetProperty("emailToAlt").Value.ToString();
                        string siteUrlBase = String.Format("{0}://{1}", uri.Scheme, uri.Host);

                        var smtp = new Email();
                        smtp.EmailFrom = from;
                        smtp.EmailToList = new List<string>() { email };
                        smtp.EmailBccList = bcc.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                        smtp.IsBodyHtml = true;
                        smtp.Subject = subject;
                        smtp.Body = body.Replace("{{VALIDATIONCODE}}", validationCode).Replace("{{SITEBASEURL}}", siteUrlBase);
                        success = smtp.SendEmail();
                    }
                }
                catch (Exception ex)
                {
                    success = false;
                    LogHelper.Error(typeof(AccountHelper), "There was a problem sending forgotten password email.", ex);
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static bool UpdateSaveForLater(string email, string courseId)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null && !String.IsNullOrEmpty(courseId))
            {
                var favoritedCoursesRaw = member.GetValue<string>("favoritedCourses");

                var favoritedCourses = String.IsNullOrEmpty(favoritedCoursesRaw) ? new List<string>() : favoritedCoursesRaw.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(c => c.Trim()).ToList();
                if (!favoritedCourses.Contains(courseId))
                {
                    favoritedCourses.Add(courseId);
                    member.SetValue("favoritedCourses", String.Join(",", favoritedCourses));

                    try
                    {
                        ApplicationContext.Current.Services.MemberService.Save(member);
                    }
                    catch
                    {
                        success = false;
                    }
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static bool EmailVerification(string email, string validationCode)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByUsername(email);

            if (member != null && member.GetValue<string>("ValidationCode").Equals(validationCode))
            {
                member.SetValue("umbracoMemberApproved", true);
                try
                {
                    ApplicationContext.Current.Services.MemberService.Save(member);
                }
                catch
                {
                    success = false;
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static void ShareCourse(string fromEmail, string toEmail, int courseId, Uri uri)
        {
            var emailTemplete = GetEmailTemplate("Share Course");

            if (emailTemplete != null)
            {
                string from = emailTemplete.GetProperty("emailFrom").Value.ToString();
                string body = emailTemplete.GetProperty("emailBody").Value.ToString();
                string subject = emailTemplete.GetProperty("emailSubject").Value.ToString();
                string bcc = emailTemplete.GetProperty("emailToAlt").Value.ToString();

                Seminars seminars = new Seminars();
                var course = CacheObjects.GetCourseDetailList().FirstOrDefault(c => c.Id == courseId);

                if (course != null)
                {
                    string couresUrl = String.Format("{0}://{1}{2}", uri.Scheme, uri.Host, course.DetailsUrl);

                    var member = ApplicationContext.Current.Services.MemberService.GetByEmail(fromEmail);
                    var memberName = String.Format("{0} {1}", member.GetValue<string>("firatName"), member.GetValue<string>("lastName"));

                    var smtp = new Email();
                    smtp.EmailFrom = fromEmail; // TODO: Should this be from the system or the user?
                    smtp.EmailToList = new List<string>() { toEmail };
                    smtp.EmailBccList = bcc.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    smtp.IsBodyHtml = true;
                    smtp.Subject = subject;
                    smtp.Body = body.Replace("{{COURSEURL}}", couresUrl).Replace("{{MEMBERNAME}}", memberName);
                    smtp.SendEmail();
                }
            }
        }

        public static UserModel GetUser(string email)
        {
            UserModel user = null;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {
                user = new UserModel()
                {
                    Email = member.Email,
                    FirstName = member.GetValue<string>("firstName"),
                    LastName = member.GetValue<string>("lastName"),
                    Title = member.GetValue<string>("title"),
                    Phone = member.GetValue<string>("phone"),
                    PhoneExtension = member.GetValue<string>("phoneExtension"),
                    FavoritedCourses = member.GetValue<string>("favoritedCourses"),
                    ValidationCode = member.GetValue<string>("validationCode")
                };
            }

            return user;
        }

        public static CompanyModel GetCompany(string email)
        {
            CompanyModel company = null;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {
                company = new CompanyModel()
                {
                    Name = member.GetValue<string>("companyName"),
                    Address1 = member.GetValue<string>("address1"),
                    Address2 = member.GetValue<string>("address2"),
                    Country = member.GetValue<string>("country"),
                    City = member.GetValue<string>("city"),
                    State = member.GetValue<string>("state"),
                    PostalCode = member.GetValue<string>("postalCode"),
                    Industry = member.GetValue<string>("industry"),
                    NumberOfEmployees = member.GetValue<string>("numberOfEmployees"),
                    ExternalTrainingUsageAmount = member.GetValue<string>("extentalTrianingUsageAmount")
                };
            }

            return company;
        }

        public static BillingModel GetBilling(string email)
        {
            BillingModel billing = null;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {
                billing = new BillingModel()
                {
                    Name = member.GetValue<string>("billingCompanyName"),
                    Address1 = member.GetValue<string>("billingAddress1"),
                    Address2 = member.GetValue<string>("billingAddress2"),
                    Country = member.GetValue<string>("billingCountry"),
                    City = member.GetValue<string>("billingCity"),
                    State = member.GetValue<string>("billingState"),
                    PostalCode = member.GetValue<string>("billingPostalCode")
                };
            }

            return billing;
        }

        public static IEnumerable<CourseModel> GetSaveForLater(string email)
        {
            var courses = new List<CourseModel>();

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {
                var favoritedCoursesRaw = member.GetValue<string>("favoritedCourses");
                var courseIds = String.IsNullOrEmpty(favoritedCoursesRaw) ? Enumerable.Empty<int>() : member.GetValue<string>("favoritedCourses").Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(c => Convert.ToInt32(c.Trim()));

                foreach (var courseId in courseIds)
                {
                    var courseDetail = CacheObjects.GetCourseDetailList().FirstOrDefault(c => c.Id == courseId);
                    if (courseDetail != null)
                    {
                        courses.Add(new CourseModel()
                        {
                            CourseDetail = courseDetail
                        });
                    }
                }
            }

            return courses;
        }

        public static bool UpdateCompany(string email, CompanyModel company)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {                
                member.SetValue("companyName", company.Name);
                member.SetValue("address1", company.Address1);
                member.SetValue("address2", company.Address2);
                member.SetValue("country", company.Country);
                member.SetValue("city", company.City);
                member.SetValue("state", company.State);
                member.SetValue("postalCode", company.PostalCode);

                member.SetValue("howDidYouAboutUs", company.HowDidYouAboutUs);
                member.SetValue("promoCode", company.PromCode);
                member.SetValue("industry", company.Industry);
                member.SetValue("role", company.Role);                
                member.SetValue("extentalTrianingUsageAmount", company.ExternalTrainingUsageAmount);
                member.SetValue("numberOfEmployees", company.NumberOfEmployees);
                member.SetValue("trainingTopics", company.TrainingTopics);

                try
                {
                    ApplicationContext.Current.Services.MemberService.Save(member);
                }
                catch
                {
                    success = false;
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static bool UpdateBilling(string email, BillingModel billing)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {
                member.SetValue("billingCompanyName", billing.Name);
                member.SetValue("billingAddress1", billing.Address1);
                member.SetValue("billingAddress2", billing.Address2);
                member.SetValue("billingCountry", billing.Country);
                member.SetValue("billingCity", billing.City);
                member.SetValue("billingState", billing.State);
                member.SetValue("billingPostalCode", billing.PostalCode);

                try
                {
                    ApplicationContext.Current.Services.MemberService.Save(member);
                }
                catch
                {
                    success = false;
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static bool UpdateUser(string email, UserModel user)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null)
            {                
                member.SetValue("firstName", user.FirstName);
                member.SetValue("lastName", user.LastName);
                member.SetValue("title", user.Title);
                member.SetValue("phone", user.Phone);
                member.SetValue("phoneExtension", user.PhoneExtension);

                member.Username = email;
                member.Email = email;

                try
                {
                    ApplicationContext.Current.Services.MemberService.Save(member);
                }
                catch
                {
                    success = false;
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static bool DeleteSaveForLater(string email, string courseId)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null && !String.IsNullOrEmpty(courseId))
            {
                var favoritedCoursesRaw = member.GetValue<string>("favoritedCourses");

                var favoritedCourses = favoritedCoursesRaw.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(c => c.Trim()).ToList();
                if (favoritedCourses.Contains(courseId))
                {
                    favoritedCourses.Remove(courseId);
                    member.SetValue("favoritedCourses", String.Join(",", favoritedCourses));

                    try
                    {
                        ApplicationContext.Current.Services.MemberService.Save(member);
                    }
                    catch
                    {
                        success = false;
                    }
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static bool UpdatePassword(string email, string password, string validationCode)
        {
            var success = true;

            var member = ApplicationContext.Current.Services.MemberService.GetByEmail(email);

            if (member != null && member.GetValue<string>("validationCode").Equals(validationCode))
            {
                try
                {
                    ApplicationContext.Current.Services.MemberService.SavePassword(member, password);
                }
                catch
                {
                    success = false;
                }
            }
            else
            {
                success = false;
            }

            return success;
        }

        public static IPublishedContent GetEmailTemplate(string name)
        {
            IPublishedContent emailTemplate = null;

            IEnumerable<IPublishedContent> emailTemplates = Helpers.Nodes.SiteSettingsDirect().Children.FirstOrDefault(n => n.DocumentTypeAlias == "EmailTemplates").Children;

            if (emailTemplates != null)
            {
                emailTemplate = emailTemplates.Where(p => p.Name == name).FirstOrDefault();
            }

            return emailTemplate;
        }

        public static string GetSupervisorEmail(string email)
        {
            var supervisorsEmail = String.Empty;

            var attendee = Registrations.GetRegistrationAttendeesByEmail(email).OrderByDescending(a => a.RegistrationAttendeeID).FirstOrDefault();

            if (attendee != null)
            {
                var registration = Registrations.GetRegistrationById(attendee.RegistrationID);

                if (registration != null)
                {
                    supervisorsEmail = registration.RegAuthEmail;
                }
            }

            return supervisorsEmail;
        }

        public static IEnumerable<CourseModel> GetUpcomingCourses(string email)
        {
            return GetCourses(email).Where(c => c.ScheduleDate < DateTime.Now);
        }

        public static IEnumerable<CourseModel> GetPastCourses(string email)
        {
            return GetCourses(email).Where(c => c.ScheduleDate >= DateTime.Now);
        }

        private static List<CourseModel> GetCourses(string email)
        {
            var courses = new List<CourseModel>();

            List<CourseScheduleRegistration> courseSchedules = new List<CourseScheduleRegistration>();

            var attendeeRegistrations = Registrations.GetRegistrationAttendeesByEmail(email);

            if (attendeeRegistrations != null)
            {
                foreach (var attendeeRegistration in attendeeRegistrations)
                {
                    var registrationAttendeesSchedules = Registrations.GetRegistrationAttendeesSchedules(attendeeRegistration.RegistrationID);

                    if (registrationAttendeesSchedules != null && registrationAttendeesSchedules.Count() > 0)
                    {
                        foreach (var registrationAttendeesSchedule in registrationAttendeesSchedules)
                        {
                            var scheduleCourseInstructor = CacheObjects.GetScheduleCourseList().FirstOrDefault(i => i.ScheduleID == registrationAttendeesSchedule.ScheduleID);
                            if (scheduleCourseInstructor != null)
                            {
                                courseSchedules.Add(new CourseScheduleRegistration()
                                {
                                    CourseId = scheduleCourseInstructor.CourseID,
                                    ScheduleId = scheduleCourseInstructor.ScheduleID,
                                    RegistrationId = attendeeRegistration.RegistrationID
                                });
                            }
                        }
                    }
                }
            }

            Seminars seminars = new Seminars();

            foreach (var courseSchedule in courseSchedules)
            {
                var courseId = courseSchedule.CourseId;
                var scheduleId = courseSchedule.ScheduleId;
                var registrationId = courseSchedule.RegistrationId;

                var courseDetail = CacheObjects.GetCourseDetailList().FirstOrDefault(c => c.Id == courseId);
                var scheduleDetail = CacheObjects.GetScheduleList().FirstOrDefault(c => c.ScheduleID == scheduleId);

                var content = ApplicationContext.Current.Services.ContentService.GetById(courseDetail.NodeId);

                var materials = new List<MaterialModel>();

                var materialIdsRaw = content.GetValue<string>("materials");

                if (!String.IsNullOrEmpty(materialIdsRaw))
                {
                    var materialIds = materialIdsRaw.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(i => Convert.ToInt32(i));
                    foreach (var materialId in materialIds)
                    {
                        var media = ApplicationContext.Current.Services.MediaService.GetById(materialId);
                        if (media != null)
                        {
                            materials.Add(new MaterialModel()
                            {
                                Url = media.GetValue<string>("umbracoFile")
                            });
                        }
                    }
                }

                var attendees = new List<AttendeeModel>();

                var registrationAttendees = Registrations.GetRegistrationAttendees(registrationId);

                foreach (var registrationAttendee in registrationAttendees)
                {
                    attendees.Add(new AttendeeModel()
                    {
                        Email = registrationAttendee.RegAttendeeEmail,
                        FirstName = registrationAttendee.RegAttendeeFirstName,
                        LastName = registrationAttendee.RegAttendeeLastName,
                        Title = registrationAttendee.RegAttendeeTitle
                    });
                }

                courses.Add(new CourseModel()
                {
                    CourseDetail = courseDetail,
                    ScheduleDate = scheduleDetail.ScheduleDate,
                    ScheduleDateDescription = scheduleDetail.ScheduleDateDescription,
                    Materials = materials,
                    Attendees = attendees
                });
            }

            return courses;
        }
    }

    internal class CourseScheduleRegistration
    {
        public int CourseId { get; set; }
        public int ScheduleId { get; set; }
        public int RegistrationId { get; set; }
    }
}
