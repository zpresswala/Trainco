<%@ Page Language="VB" MasterPageFile="~/MasterPage.master" AutoEventWireup="false" CodeFile="SignUp.aspx.vb" Inherits="Forms_SignUp1" title="Untitled Page" MaintainScrollPositionOnPostBack="true" %>

<%@ Register assembly="WebControlCaptcha" namespace="WebControlCaptcha" tagprefix="cc1" %>

<asp:Content ID="ContentHd" ContentPlaceHolderID="ContentPlaceHolderHead" runat="server">
    <script type="text/javascript">
        function autoTab(element, nextElement) {
            if (element.value.length == element.maxLength && nextElement != null) {
                nextElement.focus();
            }
        }
    </script> 
</asp:Content>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <asp:SqlDataSource ID="SqlDataSource11" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [StateID], [StateName] FROM [States] WHERE ([Active] = 1) ORDER BY [StateID]">
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource21" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [CountryCode], [CountryName] FROM [Countries] ORDER BY [SortOrder]"></asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource31" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [CourseTopicName] FROM [SearchList_Category] WHERE (NOT ([CourseTopicID] = 13)) AND (NOT ([CourseTopicID] = 16))"></asp:SqlDataSource>
    <table cellpadding="0" cellspacing="0" style="margin-left: 10px; empty-cells: hide;" width="750">
        <tr>
            <td style="width: 750px; height: 10px;">
                <asp:Image ID="Image2" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td style="width: 750px">
    Thank you for your interest in 
                <asp:Label ID="NameLabel" runat="server" Font-Names="Verdana,Helvetica,Arial" Font-Size="Small"
                    Text="Label"></asp:Label>&nbsp;seminars. Fill out the form below
    or 
                <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="mailto: sales@americantrainco.com?subject=Request More Information">click here now to send an email</asp:HyperLink><span
                    style="color: black">.&nbsp; <strong>
        We will respond within 24 hours.&nbsp; Or, for immediate Customer Service call </strong></span><strong>(303)
        531-4560 or 1-877-97-TRAIN.</strong></td>
        </tr>
        <tr style="color: #ff0000">
            <td style="width: 750px">
                <asp:Image ID="Image5" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr style="color: #ff0000">
            <td style="width: 750px">
                <span style="color: #000000"><span style="color: red">*</span></span> Required Entries</td>
        </tr>
        <tr>
            <td style="width: 750px">
                <asp:Image ID="Image1" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td style="width: 750px">
                <table style="margin: 0px; padding: 0px; width: 100%; empty-cells: hide;" 
                    cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="form1Labels">
                Email Address <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="Email" runat="server" Width="200px"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" ControlToValidate="Email"
                                ErrorMessage="Email is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td class="form1Labels">
                            First Name <span style="color: #ff0000">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="FirstName" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="FirstName"
                                ErrorMessage="First Name is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td class="form1Labels">
                Middle Name</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="MiddleName" runat="server"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td class="form1Labels">
                Last Name <span style="color: #ff0000">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="LastName" runat="server"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="LastName"
                                ErrorMessage="Last Name is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                Company <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="Company" runat="server" Width="200px"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ControlToValidate="Company"
                                ErrorMessage="Company is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                            <span style="color: black">
                Title</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="theTitle" runat="server"></asp:TextBox></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                Address Line 1 <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="Address1" runat="server" Width="200px"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ControlToValidate="Address1"
                                ErrorMessage="Address is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                Address Line 2</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="Address2" runat="server" Width="200px"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td class="form1Labels">
                City <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="City" runat="server" Width="125px"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ControlToValidate="City"
                                ErrorMessage="City is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                State/Province <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:DropDownList ID="State" runat="server" DataSourceID="SqlDataSource11" DataTextField="StateName"
                                DataValueField="StateName">
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ControlToValidate="State"
                                ErrorMessage="State is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                Postal Code <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:TextBox ID="Zipcode" runat="server" Width="125px"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" ControlToValidate="Zipcode"
                                ErrorMessage="Postal Code is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                Country <span style="color: red">*</span></td>
                        <td class="form1Entry">
                            <asp:DropDownList ID="Country" runat="server" DataSourceID="SqlDataSource21" DataTextField="CountryName"
                                DataValueField="CountryCode">
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" ControlToValidate="Country"
                                ErrorMessage="Country is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td class="form1Labels">
                            <span>Phone </span><span style="color: red">*</span></td>
                        <td class="form1Entry">
                            (<asp:TextBox ID="Phone1" runat="server" Width="30px" MaxLength="3"></asp:TextBox>)
                            <asp:TextBox ID="Phone2" runat="server" Width="30px" MaxLength="3"></asp:TextBox>-
                            <asp:TextBox ID="Phone3" runat="server" Width="40px" MaxLength="4"></asp:TextBox>
                    Ext.
                            <asp:TextBox ID="PhoneExt" runat="server" Width="40px"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" ControlToValidate="Phone3"
                                ErrorMessage="Phone # is required"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr style="font-weight: bold">
                        <td class="form1Labels">
                Fax</td>
                        <td class="form1Entry">
                            (<asp:TextBox ID="Fax1" runat="server" Width="30px" MaxLength="3"></asp:TextBox>)
                            <asp:TextBox ID="Fax2" runat="server" Width="30px" MaxLength="3"></asp:TextBox>-
                            <asp:TextBox ID="Fax3" runat="server" Width="40px" MaxLength="4"></asp:TextBox></td>
                    </tr>
                    <tr style="color: #000000">
                        <td>&nbsp;
                        </td>
                        <td>&nbsp;
                        </td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                            Subject of Interest?</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="tSubject2" runat="server" Width="125px"></asp:TextBox>
&nbsp;or
                            <asp:DropDownList ID="tSubject" runat="server" DataSourceID="SqlDataSource31" DataTextField="CourseTopicName"
                                DataValueField="CourseTopicName">
                            </asp:DropDownList></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                            How many people is the training for?</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="tPeople" runat="server" Width="100px"></asp:TextBox></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                            How many days of training are you looking for?</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="tDays" runat="server" Width="100px"></asp:TextBox></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                            When would you like the training?</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="tWhen" runat="server" Width="200px"></asp:TextBox></td>
                    </tr>
                    <tr style="color: #000000">
                        <td class="form1Labels">
                            Special Notes</td>
                        <td class="form1Entry">
                            <asp:TextBox ID="tNotes" runat="server" Columns="35" Rows="4" TextMode="MultiLine"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td colspan="2" valign="top">
                <br />To help us reduce unnecessary mailings, please complete the following:<br /><br /></td>
                    </tr>
        <tr>
            <td class="form1Labels">
                How did you find out about our seminar(s)? <span style="color: #ff0000">*</span>
                <br />
                <br />
            </td>
            <td class="form1Entry">
    <asp:HiddenField ID="promoType" runat="server" />
    <asp:HiddenField ID="promoCode" runat="server" />
    <asp:HiddenField ID="promoDesc" runat="server" />
                    <asp:DropDownList ID="PromoTypeX" runat="server" AutoPostBack="True">
                        <asp:ListItem>Please Select</asp:ListItem>
                        <asp:ListItem>Direct Mail</asp:ListItem>
                        <asp:ListItem>Internet</asp:ListItem>
                        <asp:ListItem>Other</asp:ListItem>
                    </asp:DropDownList><br />
                    <asp:DropDownList ID="PromoDescX" runat="server" AutoPostBack="True">
                        <asp:ListItem></asp:ListItem>
                    </asp:DropDownList><br />
                    <asp:Label ID="PromoDesc3Label" runat="server" Font-Bold="False" 
                                    ForeColor="#CC3300" Text="or other helpful info about how you found us:"></asp:Label><br />
                    <asp:TextBox ID="PromoDesc3" runat="server" Rows="1" style="Overflow:hidden"></asp:TextBox><br />
                    <asp:Label ID="PromoDesc2Label" runat="server" Text="Label" Font-Bold="False" 
                        ForeColor="#CC3300"></asp:Label><br />
                    <asp:TextBox ID="PromoDesc2X" runat="server"></asp:TextBox>
  
            </td>
        </tr>

                    <tr>
                        <td>&nbsp;
                        </td>
                        <td>&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td class="form1Labels">
                Preferred Methods of Contact</td>
                        <td class="form1Entry">
                            <asp:CheckBox ID="cbEmail" runat="server" Text="Email" />
                            &nbsp;<asp:CheckBox ID="cbFax" runat="server" Text="Fax" />&nbsp;
                            <asp:CheckBox ID="cbMail" runat="server" Text="Postal Mail" />&nbsp;
                            <asp:CheckBox ID="cbPhone" runat="server" Text="Phone" /></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="width: 750px">
                <asp:Image ID="Image3" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td style="width: 750px">
                <cc1:CaptchaControl ID="CaptchaControl1" runat="server" CaptchaHeight="40" />
                <br />
                <br />
                <br />
                <asp:Button ID="btnSubmit" runat="server" Text="Submit Form" /></td>
        </tr>
        <tr>
            <td style="width: 750px">
                <asp:Image ID="Image4" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
    </table>

<!-- Google Code for General Info/In House Request Remarketing List -->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 1071752321;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "666666";
var google_conversion_label = "w_yHCMWrhAIQgcmG_wM";
var google_conversion_value = 0;
/* ]]> */
</script>
<script type="text/javascript" src="https://www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="https://www.googleadservices.com/pagead/conversion/1071752321/?label=w_yHCMWrhAIQgcmG_wM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>

</asp:Content>

