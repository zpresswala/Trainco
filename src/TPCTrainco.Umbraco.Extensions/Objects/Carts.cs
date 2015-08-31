using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TPCTrainco.Umbraco.Extensions.Models;
using TPCTrainco.Umbraco.Extensions.ViewModels;
using MoreLinq;
using System.Web;
using System.Runtime.Caching;
using System.ComponentModel.DataAnnotations;

namespace TPCTrainco.Umbraco.Extensions.Objects
{
    public class Carts
    {
        private string CacheCartKey = "CartGuid:";

        public CartResponse SaveCartItems(List<CartItem> cartItemList)
        {
            CartResponse response = new CartResponse();
            int cartRegID = 0;  // reg_ID = CART_ID

            // Check cart values
            if (cartItemList == null || cartItemList.Count <= 0)
            {
                response.Success = false;
                response.Message = "Cart is empty.";

                return response;
            }
            else
            {
                bool foundIssue = false;
                string issueMessage = null;

                foreach (CartItem cartItem in cartItemList)
                {
                    // check schedule
                    if (cartItem.Id > 0)
                    {
                        using (var db = new ATI_DevelopmentEntities1())
                        {
                            SCHEDULE schedule = db.SCHEDULES.Where(p => p.ScheduleID == cartItem.Id).FirstOrDefault();

                            if (schedule == null)
                            {
                                foundIssue = true;
                                issueMessage = "Schedule id not found.";
                                break;
                            }
                        }
                    }
                    else
                    {
                        foundIssue = true;
                        issueMessage = "Invalid schedule id.";
                        break;
                    }

                    // check quantity
                    if (cartItem.Quantity <= 0)
                    {
                        foundIssue = true;
                        issueMessage = "Invalid quanity number.";
                        break;
                    }
                }

                if (true == foundIssue)
                {
                    response.Success = false;
                    response.Message = issueMessage;

                    return response;
                }
            }

            // Create new cart
            List<City> cityList = null;
            List<State> stateList = null;
            short seminarNum = 0;
            using (var db = new ATI_DevelopmentEntities1())
            {
                cityList = db.Set<City>().ToList();
                stateList = db.Set<State>().ToList();
            }

            // Get Cart ID (reg_ID)


            using (var db = new ATI_DevelopmentEntities1())
            {
                cartRegID = db.temp_Reg.Max(p => p.reg_ID);

                cartRegID++;
            }

            // loop through cart
            foreach (CartItem cartItem in cartItemList)
            {
                seminarNum++;

                using (var db = new ATI_DevelopmentEntities1())
                {
                    temp_Reg tempReg = new temp_Reg();

                    string seminarTitle = null;
                    string seminarPlace = null;
                    string seminarFeeName = null;

                    SCHEDULE schedule = db.SCHEDULES.Where(p => p.ScheduleID == cartItem.Id).FirstOrDefault();

                    if (schedule != null)
                    {
                        City city = cityList.Where(p => p.CityID == schedule.CityID).FirstOrDefault();
                        State state = stateList.Where(p => p.StateID == schedule.StateID).FirstOrDefault();

                        ScheduleCourseInstructor scheduleCourseInstructor = db.ScheduleCourseInstructors.Where(p => p.ScheduleID == schedule.ScheduleID).FirstOrDefault();

                        if (scheduleCourseInstructor != null)
                        {
                            COURS course = db.COURSES.Where(p => p.CourseID == scheduleCourseInstructor.CourseID).FirstOrDefault();

                            if (course != null)
                            {
                                CourseFormat courseFormat = db.CourseFormats.Where(p => p.CourseFormatID == course.CourseFormatID).FirstOrDefault();

                                if (courseFormat != null)
                                {
                                    seminarTitle = course.TitlePlain;

                                    decimal courseFee = scheduleCourseInstructor.CourseFee ?? 0;

                                    seminarFeeName = courseFormat.CourseFormatName + " - $" + courseFee.ToString("N0");

                                    seminarPlace = city.CityName + ", " + state.StateAbbreviation + " - " + schedule.ScheduleDateDescription;

                                    // Create temp_Reg object
                                    tempReg.reg_ID = cartRegID;
                                    tempReg.reg_Date = DateTime.Now;
                                    tempReg.sem_No = seminarNum;
                                    tempReg.sem_SID = cartItem.Id;
                                    tempReg.sem_Title = seminarTitle;
                                    tempReg.sem_Place = seminarPlace;
                                    tempReg.sem_FeeName = seminarFeeName;
                                    tempReg.sem_FeeAmt = courseFee;
                                    tempReg.sem_Qty = cartItem.Quantity;

                                    db.temp_Reg.Add(tempReg);
                                    db.SaveChanges();
                                }
                            }
                        }
                    }
                }
            }

            response.Success = true;
            response.Message = "Success!";
            response.CartGuid = Guid.NewGuid().ToString().ToLower();

            RefreshCartCache(response.CartGuid, cartRegID);

            return response;
        }


        public CheckoutResponse SaveCheckoutItems(CheckoutCart checkoutCart)
        {
            CheckoutResponse response = new CheckoutResponse();

            response.Success = true;
            response.InvalidItems = new List<CheckoutItemResponse>();

            if (checkoutCart != null && checkoutCart.CheckoutItems != null && checkoutCart.CheckoutItems.Count > 0)
            {
                response.CartGuid = checkoutCart.CartGuid;

                foreach (CheckoutItem checkoutItem in checkoutCart.CheckoutItems)
                {
                    var valContext = new ValidationContext(checkoutItem, serviceProvider: null, items: null);
                    var validationResultList = new List<ValidationResult>();

                    bool isValid = Validator.TryValidateObject(checkoutItem, valContext, validationResultList);

                    if (false == isValid)
                    {
                        response.Success = false;
                        response.Message = "There was a problem with the form. Please verifiy each field and try again.";

                        foreach (ValidationResult validationResult in validationResultList)
                        {
                            CheckoutItemResponse itemResponse = new CheckoutItemResponse();
                            itemResponse.ElementId = "";

                            if (validationResult.MemberNames != null && validationResult.MemberNames.Count() > 0)
                            {
                                itemResponse.ElementId = validationResult.MemberNames.First().ToLower() + checkoutItem.AttendeeInc;
                            }

                            itemResponse.Message = validationResult.ErrorMessage;
                            response.InvalidItems.Add(itemResponse);
                        }
                    }
                    else
                    {
                        if (false == IsValidEmailAddress(checkoutItem.Email))
                        {
                            CheckoutItemResponse itemResponse = new CheckoutItemResponse();

                            itemResponse.ElementId = "email" + checkoutItem.AttendeeInc;

                            itemResponse.Message = "Invalid email address.";
                            response.InvalidItems.Add(itemResponse);
                        }
                    }
                }
            }
            else
            {
                response.Success = false;
                response.Message = "Invalid cart.";
            }

            if (true == response.Success)
            {
                List<temp_Reg> cart = GetCart(response.CartGuid);

                if (cart != null && cart.Count > 0)
                {
                    if (checkoutCart != null && checkoutCart.CheckoutItems != null && checkoutCart.CheckoutItems.Count > 0)
                    {
                        using (var db = new ATI_DevelopmentEntities1())
                        {
                            foreach (temp_Reg tempReg in cart)
                            {
                                List<CheckoutItem> checkoutItemList = checkoutCart.CheckoutItems.Where(p => p.SeminarId == tempReg.sem_SID).ToList();

                                if (checkoutItemList != null && checkoutItemList.Count > 0)
                                {
                                    foreach (CheckoutItem checkoutItem in checkoutItemList)
                                    {
                                        temp_Att tempAtt = new temp_Att();

                                        tempAtt.reg_SEQ = tempReg.reg_SEQ;
                                        tempAtt.att_No = checkoutItem.AttendeeNum;
                                        tempAtt.att_FName = checkoutItem.FirstName;
                                        tempAtt.att_LName = checkoutItem.LastName;
                                        tempAtt.att_Title = checkoutItem.Title;
                                        tempAtt.att_Email = checkoutItem.Email;
                                        tempAtt.reg_ID = tempReg.reg_ID;
                                        tempAtt.att_MName = "";
                                        tempAtt.att_Suffix = "";

                                        db.temp_Att.Add(tempAtt);
                                        db.SaveChanges();
                                    }
                                }
                            }
                        }
                    }
                }
            }


            return response;
        }


        public List<temp_Reg> GetCart(string cartGuid)
        {
            List<temp_Reg> cart = null;

            if (false == string.IsNullOrEmpty(cartGuid))
            {
                int regId = GetCartCache(cartGuid);

                if (regId > 0)
                {
                    using (var db = new ATI_DevelopmentEntities1())
                    {
                        cart = db.temp_Reg.Where(p => p.reg_ID == regId).ToList();
                    }
                }
            }

            return cart;
        }



        private int GetCartCache(string cartGuid)
        {
            object regIdObj = null;
            string regIdStr = null;
            int regId = 0;

            ObjectCache cache = MemoryCache.Default;

            regIdObj = cache.Get(CacheCartKey + cartGuid);

            regIdStr = regIdObj != null ? regIdObj.ToString() : null;

            if (false == string.IsNullOrEmpty(regIdStr))
            {
                regId = Convert.ToInt32(regIdStr);
            }

            return regId;
        }



        private void RefreshCartCache(string cartGuid, int regId)
        {
            string cacheKey = CacheCartKey + cartGuid;
            int cacheUpdateInMinutes = 10;
            ObjectCache cache = MemoryCache.Default;

            CacheItemPolicy policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(cacheUpdateInMinutes) };
            cache.Add(cacheKey, regId, policy);
        }



        private static bool IsValidEmailAddress(string emailAddress)
        {
            return new System.ComponentModel.DataAnnotations
                                .EmailAddressAttribute()
                                .IsValid(emailAddress);
        }
    }
}
