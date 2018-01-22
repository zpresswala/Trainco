﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace TPCTrainco.Umbraco.Extensions.Objects
{

    #region EventTemplates
    public class EventTemplate
    {
        public string TemplateID { get; set; }
        public string UniqueIdentifier { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string AdvertisedDuration { get; set; }
        public string TemplateHosting { get; set; }
        public bool IsPrivate { get; set; }
        public string DefaultEventSessionType { get; set; }
        public string Status { get; set; }
        public bool PublishOnWebsite { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public List<object> Link { get; set; }
    }
    #endregion

    #region Events

    public class Event
    {
        public string EventID { get; set; }
        public string UniqueIdentifier { get; set; }
        public string Code { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime FinishDateTime { get; set; }
        public string Description { get; set; }
        public string LocationName { get; set; }
        public bool IsPrivate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public List<object> Link { get; set; }
        public EventTemplate Template { get; set; }
        public Dictionary<string,string> CustomFields { get; set; }
        public Region Region { get; set; }
        public List<string> Tags { get; set; }
        public List<Session> Sessions { get; set; }
    }

    public class Session
    {
        public string SessionID { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime FinishDateTime { get; set; }
        public string SessionType { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public List<string> Tags { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public Dictionary<string, string> CustomFields { get; set; }
        public Venue Venue { get; set; }
        public ArloContact Presenter { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public List<object> Link { get; set; }
    }

    public class Venue
    {
        public string VenueID { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public Address PhysicalAddress { get; set; }
        public ArloContact BookingContact { get; set; }
        public List<object> Link { get; set; }
    }

    public class ArloContact
    {
        public string ContactID { get; set; }
        public string UniqueIdentifier { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneWork { get; set; }
        public string PhoneHome { get; set; }
        public string CodePrimary { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
    }

    public class Address
    {
        public string StreetLine1 { get; set; }
        public string StreetLine2 { get; set; }
        public string StreetLine3 { get; set; }
        public string StreetLine4 { get; set; }
        public string SuburbOrRegion { get; set; }
        public string City { get; set; }
        public string StateOrProvince { get; set; }
        public string PostCode { get; set; }
        public string Country { get; set; }
    }

    public class Region 
    {
        public string RegionID { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
    }

    public class PublicEvents
    {
        public int TotalCount { get; set; }
        public int StartIndex { get; set; }
        public int Count { get; set; }
        public List<PublicEvent> Items { get; set; }
    }

    public class PublicEvent
    {
        public int EventID { get; set; }
        public string Name { get; set; }
        public Dictionary<string, string> RegistrationInfo { get; set; }
        public string ViewUri { get; set; }
        public List<AdvertisedOffer> AdvertisedOffers { get; set; }
        public List<Dictionary<string, object>> Categories { get; set; }
        public List<string> Tags { get; set; }
    }

    public class AdvertisedOffer
    {
        public int OfferID { get; set; }
        public string Label { get; set; }
        public bool IsDiscountOffer { get; set; }
        public Dictionary<string, object> OfferAmount { get; set; }
    }
    #endregion
}
