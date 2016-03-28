using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Security;
using TPCTrainco.Umbraco.Extensions.Attributes;
using TPCTrainco.Umbraco.Extensions.Helpers;
using TPCTrainco.Umbraco.Extensions.Models.Account;
using TPCTrainco.Umbraco.Extensions.Models.API.Request;
using TPCTrainco.Umbraco.Extensions.Models.API.Response;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;

namespace TPCTrainco.Umbraco.Extensions.Controllers
{
    // ~/api/Account/<method>
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AccountController : ApiController
    {
        #region HttpPost

        /// <summary>
        /// Logs a user in and return an auth token.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage Login(LoginRequestModel request)
        {
            var authToken = String.Empty;

            if (request != null && request.Username != null && request.Password != null && Membership.ValidateUser(request.Username, request.Password))
            {
                var member = ApplicationContext.Current.Services.MemberService.GetByUsername(request.Username);

                var host = Request.RequestUri.Host;

                var expiration = request.PersistantLogin ? DateTime.UtcNow.AddYears(100).Ticks : DateTime.UtcNow.Ticks;

                authToken = AccountHelper.GenerateToken(member.Key.ToString(), member.Email, Request.RequestUri.Host, UtilitiesHelper.GetClientIpAddress(Request), Request.Headers.UserAgent.ToString(), expiration);
            }

            var responseModel = new LoginResponseModel() {
                Status = String.IsNullOrEmpty(authToken) ? System.Net.HttpStatusCode.Unauthorized.ToString() : System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = String.IsNullOrEmpty(authToken) ? (int)System.Net.HttpStatusCode.Unauthorized : (int)System.Net.HttpStatusCode.OK,
                Result = authToken
            };

            return Request.CreateResponse(String.IsNullOrEmpty(authToken) ? System.Net.HttpStatusCode.Unauthorized : System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Sends a password reset email to the user.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage ForgottenPassword(ForgottenPasswordRequestModel request)
        {
            var success = AccountHelper.ForgottenPassword(request.Email, Request.RequestUri);

            return Request.CreateResponse(success ? System.Net.HttpStatusCode.OK : System.Net.HttpStatusCode.BadRequest);
        }        

        /// <summary>
        /// Create a new user account
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage CreateUser(CreateUserRequestModel request)
        {
            var user = AccountHelper.CreateUser(request.User, Request.RequestUri);

            if(!String.IsNullOrEmpty(request.Company.Username) && !request.Company.Username.Equals(request.User.Email))
            {
                request.Company = AccountHelper.GetCompany(request.Company.Username);
            }

            var success = AccountHelper.UpdateCompany(user.Email, request.Company);

            var responseModel = new CreateUserResponseModel()
            {
                Status = String.IsNullOrEmpty(user.ValidationCode) ? System.Net.HttpStatusCode.NotModified.ToString() : System.Net.HttpStatusCode.Created.ToString(),
                StatusCode = String.IsNullOrEmpty(user.ValidationCode) ? (int)System.Net.HttpStatusCode.NotModified : (int)System.Net.HttpStatusCode.Created,
                Result = user != null
            };

            return Request.CreateResponse(String.IsNullOrEmpty(user.ValidationCode) ? System.Net.HttpStatusCode.NotModified : System.Net.HttpStatusCode.Created, responseModel);
        }


        /// <summary>
        /// Activates a user account and logs the user in.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public HttpResponseMessage EmailVerification(EmailVerificationRequestModel request)
        {
            var authToken = String.Empty;

            IMember member = null;

            if (AccountHelper.EmailVerification(request.Email, request.ValidationCode, out member))
            {
                authToken = AccountHelper.GenerateToken(member.Key.ToString(), member.Email, Request.RequestUri.Host, UtilitiesHelper.GetClientIpAddress(Request), Request.Headers.UserAgent.ToString(), DateTime.UtcNow.Ticks);
            }

            var responseModel = new LoginResponseModel()
            {
                Status = String.IsNullOrEmpty(authToken) ? System.Net.HttpStatusCode.Unauthorized.ToString() : System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = String.IsNullOrEmpty(authToken) ? (int)System.Net.HttpStatusCode.Unauthorized : (int)System.Net.HttpStatusCode.OK,
                Result = authToken
            };

            return Request.CreateResponse(String.IsNullOrEmpty(authToken) ? System.Net.HttpStatusCode.Unauthorized : System.Net.HttpStatusCode.Accepted, responseModel);
        }


        /// <summary>
        /// Sends and email with course info to the provided email
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [TokenAuthorization]
        public HttpResponseMessage ShareCourse(ShareCourseRequestModel request)
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            AccountHelper.ShareCourse(memberKey, request.Email, request.CourseId, Request.RequestUri);

            return Request.CreateResponse(System.Net.HttpStatusCode.OK);
        }

        #endregion


        #region HttpGet
        
        /// <summary>
        /// Check if the user has already registered.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage UserExists([FromUri] UserExistsRequestModel request)
        {
            var exists = ApplicationContext.Current.Services.MemberService.Exists(request.Email);

            var responseModel = new UserExistsResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = exists
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Check if the provided email address has take a course before and if true returns the supervisors company info.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage HasTakenCourse([FromUri] HasTakenCourseRequestModel request)
        {
            var supervisorEmail = AccountHelper.GetSupervisorEmail(request.Email);

            var company = AccountHelper.GetCompany(supervisorEmail);

            var responseModel = new HasTakenCourseResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = company
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Get the clients IP address
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage GetClientIpAddress()
        {
            var ip = UtilitiesHelper.GetClientIpAddress(Request);

            var responseModel = new GetClientIpAddressResponseModel()
            {
                Status = System.Net.HttpStatusCode.Accepted.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.Accepted,
                Result = ip
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.Accepted, responseModel);
        }

        /// <summary>
        /// Get user profile info
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TokenAuthorization]
        public HttpResponseMessage GetUser()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var user = AccountHelper.GetUser(memberKey);

            var responseModel = new GetUserResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = user
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Get the users company info
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TokenAuthorization]
        public HttpResponseMessage GetCompany()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var company = AccountHelper.GetCompany(memberKey);      

            var responseModel = new GetCompanyResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = company
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Get the memebers billing information
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TokenAuthorization]
        public HttpResponseMessage GetBilling()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var billing = AccountHelper.GetBilling(memberKey);

            var responseModel = new GetBillingResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = billing
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Get the list of save courses for the user.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        [TokenAuthorization]
        public HttpResponseMessage GetSaveForLater()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var courses = AccountHelper.GetSaveForLater(memberKey);

            var responseModel = new GetSaveForLaterResponseModel() {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = courses
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        /// <summary>
        /// Get all upcoming courses that the user has registered for
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [TokenAuthorization]
        public HttpResponseMessage GetUpcomingCourses()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var courses = AccountHelper.GetUpcomingCourses(memberKey);

            var responseModel = new GetUpcomingEventsResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = courses
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }


        /// <summary>
        /// Get all past courses that the user has registered for
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        [TokenAuthorization]
        public HttpResponseMessage GetPastCourses()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var courses = AccountHelper.GetPastCourses(memberKey);

            var responseModel = new GetPastEventsResponseModel()
            {
                Status = System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.OK,
                Result = courses
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, responseModel);
        }

        #endregion


        #region HttpPut

        /// <summary>
        /// Updates the users password
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut]
        public HttpResponseMessage UpdatePassword(ResetPasswordRequestModel request)
        {
            var authToken = String.Empty;

            IMember member = null;

            if(String.IsNullOrEmpty(request.ValidationCode) && AccountHelper.IsTokenValid(Request.Headers.Authorization.Parameter, Request.RequestUri.Host, UtilitiesHelper.GetClientIpAddress(Request), Request.Headers.UserAgent.ToString()))
            {
                request.ValidationCode = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);
            }

            if (AccountHelper.UpdatePassword(request.Email, request.Password, request.ValidationCode, out member))
            {
                authToken = AccountHelper.GenerateToken(member.Key.ToString(), member.Email, Request.RequestUri.Host, UtilitiesHelper.GetClientIpAddress(Request), Request.Headers.UserAgent.ToString(), DateTime.UtcNow.Ticks);
            }

            var responseModel = new ResetPasswordResponseModel()
            {
                Status = String.IsNullOrEmpty(authToken) ? System.Net.HttpStatusCode.Unauthorized.ToString() : System.Net.HttpStatusCode.OK.ToString(),
                StatusCode = String.IsNullOrEmpty(authToken) ? (int)System.Net.HttpStatusCode.Unauthorized : (int)System.Net.HttpStatusCode.OK,
                Result = authToken
            };

            return Request.CreateResponse(String.IsNullOrEmpty(authToken) ? System.Net.HttpStatusCode.Unauthorized : System.Net.HttpStatusCode.Accepted, responseModel);
        }

        /// <summary>
        /// Updated the users company info
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut]
        [TokenAuthorization]
        public HttpResponseMessage UpdateCompany(UpdateCompanyRequestModel request)
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var success = AccountHelper.UpdateCompany(memberKey, request.Company);

            var responseModel = new UpdateCompanyResponseModel() {
                Status = System.Net.HttpStatusCode.Accepted.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.Accepted,
                Success = success,
                Result = request.Company
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.Accepted, responseModel);
        }

        /// <summary>
        /// Update the users billing info
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut]
        [TokenAuthorization]
        public HttpResponseMessage UpdateBilliong(UpdateBillingRequestModel request)
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var success = AccountHelper.UpdateBilling(memberKey, request.Billing);

            var responseModel = new UpdateBillingResponseModel()
            {
                Status = System.Net.HttpStatusCode.Accepted.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.Accepted,
                Result = request.Billing,
                Success = success
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.Accepted, responseModel);
        }

        /// <summary>
        /// Updates the users profile info
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut]
        [TokenAuthorization]
        public HttpResponseMessage UpdateUser(UpdateUserRequestModel request)
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var authToken = String.Empty;

            IMember member = null;

            if (AccountHelper.UpdateUser(memberKey, request.User, out member))
            {
                authToken = AccountHelper.GenerateToken(member.Key.ToString(), member.Email, Request.RequestUri.Host, UtilitiesHelper.GetClientIpAddress(Request), Request.Headers.UserAgent.ToString(), DateTime.UtcNow.Ticks);
            }

            var responseModel = new UpdateUserResponseModel()
            {
                Status = System.Net.HttpStatusCode.Accepted.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.Accepted,
                Success = String.IsNullOrEmpty(authToken),
                AuthToken = authToken,
                Result = request.User
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.Accepted, responseModel);
        }
        
        /// <summary>
        /// Update the saved list of courses for the user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut]
        [TokenAuthorization]
        public HttpResponseMessage UpdateSaveForLater(UpdateSaveForLaterRequestModel request)
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var success = AccountHelper.UpdateSaveForLater(memberKey, request.CourseId);

            return Request.CreateResponse(success ? System.Net.HttpStatusCode.Accepted : System.Net.HttpStatusCode.NotModified);
        }

        [HttpPut]
        [TokenAuthorization]
        public HttpResponseMessage DisableAccount()
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var success = AccountHelper.DisableUser(memberKey);

            return Request.CreateResponse(success ? System.Net.HttpStatusCode.Accepted : System.Net.HttpStatusCode.NotModified);
        }

        #endregion


        #region HttpDelete

        /// <summary>
        /// Deletes a course from the save list of courses for the user.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpDelete]
        [TokenAuthorization]
        public HttpResponseMessage DeleteSaveForLater(DeleteSaveForLaterRequestModel request)
        {
            var memberKey = AccountHelper.GetMemberKeyFromToken(Request.Headers.Authorization.Parameter);

            var success = AccountHelper.DeleteSaveForLater(memberKey, request.CourseId);

            var responseModel = new DeleteSaveForLaterResponseModel()
            {
                Status = System.Net.HttpStatusCode.Accepted.ToString(),
                StatusCode = (int)System.Net.HttpStatusCode.Accepted,
                Result = success
            };

            return Request.CreateResponse(System.Net.HttpStatusCode.Accepted, responseModel);
        }

        #endregion
    }
}
