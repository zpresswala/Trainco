<%@ Page Language="VB" MasterPageFile="~/MasterPage.master" AutoEventWireup="false" CodeFile="Register2b.aspx.vb" Inherits="Register2b" title="Untitled Page" MaintainScrollPositionOnPostBack="true" %>
<%@ Register assembly="AjaxControlToolkit" namespace="AjaxControlToolkit" tagprefix="cc1" %>

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
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [StateID], [StateAbbreviation], [StateName] FROM [States] WHERE ([Active] = @Active) ORDER BY [StateID]">
        <SelectParameters>
            <asp:Parameter DefaultValue="1" Name="Active" Type="Double" />
        </SelectParameters>
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [CountryName], [CountryCode] FROM [Countries] ORDER BY [SortOrder]">
    </asp:SqlDataSource>
    <asp:HiddenField ID="PromoType" runat="server" />
    <asp:HiddenField ID="PromoCode" runat="server" />
    <asp:HiddenField ID="PromoDesc" runat="server" />
    <asp:HiddenField ID="PastCust" runat="server" />
    <asp:HiddenField ID="rTakenBy" runat="server" />
    <asp:HiddenField ID="rMethod" runat="server" />

    <table cellpadding="0" cellspacing="0" 
        style="margin-left: 10px; width: 730px; empty-cells: hide; font-family: Arial; font-size: .9em; margin-right: 10px;">
        <tr>
            <td style="font-size: .8em; padding-left: 5px; padding-top: 2px;">
                <asp:Image ID="Image5" runat="server" ImageUrl="~/Images/Blank.gif" />Cart ID:
                <asp:Label ID="theID" runat="server" Text="Label"></asp:Label>
                </td>
                <td>
                <span style="color: #ff0000">*</span>
                Required Entries
                </td>
        </tr>
        <tr bgcolor="#E6E6E6">
            <td colspan="2" style="height: 19px; padding-left: 5px;">
                <asp:Image ID="Image8" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr bgcolor="#E6E6E6">
            <td nowrap="nowrap" valign="top" style="width: 280px; padding-left: 5px;">
                <strong>Are you a past customer?</strong></td>
            <td style="font-size: .8em; font-weight: 500; ">
                   <asp:DropDownList ID="ddPastCustomer" runat="server">
                        <asp:ListItem>Please Select</asp:ListItem>
                        <asp:ListItem>Yes</asp:ListItem>
                        <asp:ListItem>No</asp:ListItem>
                        <asp:ListItem>Not Sure</asp:ListItem>
                    </asp:DropDownList><br />

            </td>
        </tr>
        <tr bgcolor="#E6E6E6">
            <td nowrap="nowrap" valign="top" style="width: 250px; padding-left: 5px;">
                <strong>How did you find out<br />about our seminar(s)? <span style="color: #ff0000">*</span></strong>
                <br />
                <br />
                <asp:Label ID="cbError" runat="server" Font-Bold="False" ForeColor="Red"></asp:Label>
            </td>
            <td style="font-size: .8em; font-weight: 500; ">

                    <table style="width: 100%;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding-bottom: 3px; width: 200px;">
                    <asp:DropDownList ID="PromoTypeX" runat="server" AutoPostBack="True">
                        <asp:ListItem>Please Select</asp:ListItem>
                        <asp:ListItem>Direct Mail</asp:ListItem>
                        <asp:ListItem>Internet</asp:ListItem>
                        <asp:ListItem>Other</asp:ListItem>
                    </asp:DropDownList><br />
                    <asp:DropDownList ID="PromoDescX" runat="server" AutoPostBack="True">
                        <asp:ListItem></asp:ListItem>
                    </asp:DropDownList><br />
                            </td>
                            <td style="vertical-align: bottom; padding-bottom: 3px; padding-left: 6px;" 
                                rowspan="2">
                                <asp:Label ID="PromoDesc3Label" runat="server" Font-Bold="False" 
                                    ForeColor="#CC3300" Text="or other helpful info about how you found us:"></asp:Label>
                                <br />
                                <asp:TextBox ID="PromoDesc3" runat="server" Rows="1" style="Overflow:hidden"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="vertical-align: top; padding-bottom: 3px">
                    <asp:Label ID="PromoDesc2Label" runat="server" Text="Label" Font-Bold="False" 
                        ForeColor="#CC3300"></asp:Label><br />
                    <asp:TextBox ID="PromoDesc2X" runat="server"></asp:TextBox>
                    <br />
                            </td>
                        </tr>
                    </table>

           </td>
        </tr>

        <tr>
            <td colspan="2" style="padding-left: 5px;">
                <asp:Image ID="Image4" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td nowrap="nowrap" width="250" style="padding-left: 5px">
                <strong>Your Company Name </strong>
            </td>
            <td>
                <asp:TextBox ID="CompanyName" runat="server" Width="200px" TabIndex="4"></asp:TextBox></td>
        </tr>
        <tr>
            <td colspan="2" style="padding-left: 5px">
                <asp:Image ID="Image1" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>

        <tr>
            <td colspan="2">

                <table style="width: 100%" cellpadding="0" cellspacing="0">
                    <tr>
                       <td nowrap="nowrap" width="250" style="padding-left: 5px">
                            <strong>Authorizing Supervisor </strong>
                        </td>
                       <td>
                           <asp:CheckBox ID="cbAsAttendee" runat="server" AutoPostBack="True" Text=" Same as Attendee" /></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            First Name <span style="color: red">*</span>&nbsp;</td>
                        <td>
                            <asp:TextBox ID="authFName" runat="server" TabIndex="5"></asp:TextBox>
                            Last Name <span style="color: red">*</span>
                            <asp:TextBox ID="authLName" runat="server" TabIndex="6"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td style="height: 19px; text-align: right; padding-left: 5px;" width="250">
                            Title &nbsp;</td>
                        <td style="height: 19px">
                            <asp:TextBox ID="authTitle" runat="server" TabIndex="7"></asp:TextBox>
                           <asp:RequiredFieldValidator ID="RequiredField1" runat="server" ControlToValidate="authFName"
                               ErrorMessage="First Name is required!" Display="Dynamic"></asp:RequiredFieldValidator>&nbsp;
                           <asp:RequiredFieldValidator ID="RequiredField2" runat="server" ControlToValidate="authLName"
                               ErrorMessage="Last Name is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; height: 24px; padding-left: 5px;" width="250">
                            Mail Code / Building / Room # &nbsp;</td>
                        <td style="height: 24px">
                            <asp:TextBox ID="authMailCode" runat="server" Width="125px" TabIndex="8"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            Address Line 1 <span style="color: red">*</span>&nbsp;</td>
                        <td>
                            <asp:TextBox ID="authAddr1" runat="server" Width="200px" TabIndex="9"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredField3" runat="server" ControlToValidate="authAddr1"
                                ErrorMessage="Street Address is required!"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            Address Line 2 &nbsp;</td>
                        <td>
                            <asp:TextBox ID="authAddr2" runat="server" Width="200px" TabIndex="10"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250" valign="middle">
                            City <span style="color: red">*</span>&nbsp;</td>
                        <td valign="middle">
                            <asp:TextBox ID="authCity" runat="server" Width="125px" TabIndex="11"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredField4" runat="server" ControlToValidate="authCity"
                                ErrorMessage="City is required!" Display="Dynamic"></asp:RequiredFieldValidator>&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" valign="middle" width="250">
                            State / Province <span style="color: red">*</span>&nbsp;
                        </td>
                        <td valign="middle">
                            <asp:DropDownList ID="authState" runat="server"
                                DataSourceID="SqlDataSource1" DataTextField="StateAbbreviation" DataValueField="StateAbbreviation" TabIndex="12">
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredField5" runat="server" ControlToValidate="authState"
                                ErrorMessage="State is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" valign="middle" width="250">
                            Zip / Postal Code <span style="color: red">*</span>&nbsp;
                        </td>
                        <td valign="middle">
                            <asp:TextBox ID="authZip" runat="server" Width="80px" TabIndex="13" AutoPostBack="True" ></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredField6" runat="server" ControlToValidate="authZip"
                                ErrorMessage="Postal Code is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            Country <span style="color: red">*</span>&nbsp;
                        </td>
                        <td>
                            <asp:DropDownList ID="authCountry" runat="server" DataSourceID="SqlDataSource2" DataTextField="CountryName"
                                DataValueField="CountryCode" TabIndex="14">
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredField7" runat="server" ControlToValidate="authCountry"
                                ErrorMessage="Country is required!" Display="Dynamic"></asp:RequiredFieldValidator>&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250" valign="middle">
                            Phone <span style="color: red">*</span>&nbsp;</td>
                        <td valign="middle">
                            (<asp:TextBox ID="authPhone1" runat="server" Width="30px" TabIndex="15" MaxLength="3"></asp:TextBox>)
                            <asp:TextBox ID="authPhone2" runat="server" Width="30px" TabIndex="16" MaxLength="3"></asp:TextBox>-
                            <asp:TextBox ID="authPhone3" runat="server" Width="40px" TabIndex="17" MaxLength="4"></asp:TextBox>
                            Ext.
                            <asp:TextBox ID="authPhoneExt" runat="server" Width="40px" TabIndex="18"></asp:TextBox>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ControlToValidate="authPhone3"
                                ErrorMessage="Phone # is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250" valign="middle">
                            Fax &nbsp;</td>
                        <td valign="middle">
                            (<asp:TextBox ID="authFax1" runat="server" Width="30px" TabIndex="19" MaxLength="3"></asp:TextBox>)
                            <asp:TextBox ID="authFax2" runat="server" Width="30px" TabIndex="20" MaxLength="3"></asp:TextBox>-
                            <asp:TextBox ID="authFax3" runat="server" Width="40px" TabIndex="21" MaxLength="4"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            Email &nbsp;</td>
                        <td>
                            <asp:TextBox ID="authEmail" runat="server" Width="250px" TabIndex="22"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td width="250" style="padding-left: 5px">
                            <asp:Image ID="Image2" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                        <td>
                            <em>E-mail required for immediate registration confirmation &amp; course notifiations</em></td>
                    </tr>


                </table>

            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding-left: 5px; height: 19px;">
                <asp:Image ID="Image11" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr bgcolor="#E6E6E6">
            <td colspan="2">

                <table style="width: 100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-left: 5px">
                            <strong>Billing Information</strong></td>
                        <td>
                            <asp:CheckBox ID="cbBillSame" runat="server" Text=" Same as Authorizing Supervisor" AutoPostBack="True" TabIndex="23" /></td>
                    </tr>
                    <tr>
                    <td colspan="2">
                        <table style="width: 100%; padding-top: 3px; padding-bottom: 3px;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    First Name &nbsp;</td>
                                <td>
                                    <asp:TextBox ID="billFName" runat="server" TabIndex="24"></asp:TextBox>
                                    Last Name
                                    <asp:TextBox ID="billLName" runat="server" TabIndex="25"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    Title &nbsp;</td>
                                <td>
                                    <asp:TextBox ID="billTitle" runat="server" TabIndex="26"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    Mail Code / Building / Room # &nbsp;</td>
                                <td>
                                    <asp:TextBox ID="billMailCode" runat="server" Width="125px" TabIndex="27"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    Address Line 1 &nbsp;</td>
                                <td>
                                    <asp:TextBox ID="billAddr1" runat="server" Width="200px" TabIndex="28"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    Address Line 2 &nbsp;</td>
                                <td>
                                    <asp:TextBox ID="billAddr2" runat="server" Width="200px" TabIndex="29"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250" valign="middle">
                                    City &nbsp;</td>
                                <td valign="middle">
                                    <asp:TextBox ID="billCity" runat="server" Width="125px" TabIndex="30"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" valign="middle" width="250">
                                    &nbsp;State / Province&nbsp;
                                </td>
                                <td valign="middle">
                                    <asp:DropDownList ID="billState" runat="server" DataSourceID="SqlDataSource1"
                                        DataTextField="StateAbbreviation" DataValueField="StateAbbreviation" TabIndex="31">
                                    </asp:DropDownList></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" valign="middle" width="250">
                                    Zip / Postal Code&nbsp;
                                </td>
                                <td valign="middle">
                                    <asp:TextBox ID="billZip" runat="server" Width="80px" TabIndex="32" AutoPostBack="True" ></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    Country &nbsp;</td>
                                <td>
                                    <asp:DropDownList ID="billCountry" runat="server" DataSourceID="SqlDataSource2" DataTextField="CountryName"
                                        DataValueField="CountryCode" TabIndex="33">
                                    </asp:DropDownList></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250" valign="middle">
                                    Phone &nbsp;</td>
                                <td valign="middle">
                                    (<asp:TextBox ID="billPhone1" runat="server" Width="30px" TabIndex="34" MaxLength="3"></asp:TextBox>)
                                    <asp:TextBox ID="billPhone2" runat="server" Width="30px" TabIndex="35" MaxLength="3"></asp:TextBox>-
                                    <asp:TextBox ID="billPhone3" runat="server" Width="40px" TabIndex="36" MaxLength="4"></asp:TextBox>
                                    Ext.
                                    <asp:TextBox ID="billPhoneExt" runat="server" Width="40px" TabIndex="37"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250" valign="middle">
                                    Fax &nbsp;</td>
                                <td valign="middle">
                                    (<asp:TextBox ID="billFax1" runat="server" Width="30px" TabIndex="38" MaxLength="3"></asp:TextBox>)
                                    <asp:TextBox ID="billFax2" runat="server" Width="30px" TabIndex="39" MaxLength="3"></asp:TextBox>-
                                    <asp:TextBox ID="billFax3" runat="server" Width="40px" TabIndex="40" MaxLength="4"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td style="text-align: right; padding-left: 5px;" width="250">
                                    Email &nbsp;</td>
                                <td>
                                    <asp:TextBox ID="billEmail" runat="server" Width="250px" TabIndex="41"></asp:TextBox></td>
                            </tr>
                            <tr>
                                <td width="250" style="padding-left: 5px">
                                    </td>
                                <td>
                                    <em>E-mail required for immediate registration confirmation &amp; course notifiations</em></td>
                            </tr>
                        </table>  

                    </td>
                    </tr>
                </table>

            </td>
        </tr>

        <tr>
            <td width="250" style="padding-left: 5px">
                <asp:Image ID="Image3" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
            <td>
            </td>
        </tr>
        <tr>
            <td colspan="2">

                <table style="width: 100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="250" style="height: 16px; padding-left: 5px;">
                            <strong>Payment Information</strong></td>
                            <td style="height: 16px">
                            </td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            Order Total &nbsp;</td>
                        <td>
                            <asp:Label ID="OrderTotal" runat="server"></asp:Label></td>
                    </tr>
                    <tr>
                        <td style="text-align: right; padding-left: 5px;" width="250">
                            Payment Method <span style="color: red">*</span>&nbsp;</td>
                        <td>
                            <asp:DropDownList ID="PayMethod" runat="server" AutoPostBack="True" TabIndex="43">
                                <asp:ListItem>(Please Select)</asp:ListItem>
                                <asp:ListItem>Credit Card</asp:ListItem>
                                <asp:ListItem>Check</asp:ListItem>
                                <asp:ListItem>Purchase Order</asp:ListItem>
                                <asp:ListItem>Invoice Me</asp:ListItem>
                            </asp:DropDownList>
                            <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ControlToValidate="PayMethod"
                                ErrorMessage="Payment Method is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-left: 5px">
                            <asp:Image ID="Image6" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-left: 5px">
            
                            <asp:MultiView ID="MultiView1" runat="server">
                                <asp:View ID="ccView" runat="server">
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="width: 280px">
                                            </td>
                                            <td>
                                                Please note: The billing address for your credit card must match the<br />
                                                "Billing Information"
                                                address above.<br />
                                                <asp:Image ID="Image14" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px; text-align: right;">
                                                Credit Card Type <span style="color: red">*</span>&nbsp;</td>
                                            <td>
                                                <asp:DropDownList ID="ccType" runat="server" TabIndex="44">
                                                    <asp:ListItem>(Please Select)</asp:ListItem>
                                                    <asp:ListItem>Visa</asp:ListItem>
                                                    <asp:ListItem>Mastercard</asp:ListItem>
                                                    <asp:ListItem>American Express</asp:ListItem>
                                                    <asp:ListItem>Discover</asp:ListItem>
                                                </asp:DropDownList></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px; text-align: right;">
                                                Name on Card <span style="color: red">*</span>&nbsp;</td>
                                            <td>
                                                <asp:TextBox ID="ccName" runat="server" TabIndex="45"></asp:TextBox>
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ControlToValidate="ccName"
                                                    ErrorMessage="Name is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px; text-align: right;">
                                                Credit Card Number <span style="color: red">*</span>&nbsp;</td>
                                            <td>
                                                <asp:TextBox ID="ccNumber" runat="server" TabIndex="46"></asp:TextBox>
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ControlToValidate="ccNumber"
                                                    ErrorMessage="CC Number is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px; text-align: right;">
                                                Credit Card Expiration (mm/yyyy) <span style="color: red">*</span>&nbsp;</td>
                                            <td>
                                                <asp:DropDownList ID="ccMonth" runat="server" TabIndex="47">
                                                </asp:DropDownList>/<asp:DropDownList ID="ccYear" runat="server" TabIndex="48">
                                                </asp:DropDownList></td>
                                        </tr>
                                         <tr>
                                            <td style="width: 280px; text-align: right;">
                                                Card Verification Code <span style="color: red">*</span>&nbsp;</td>
                                            <td>
                                                <asp:TextBox ID="ccCVC" runat="server" TabIndex="48" Width="50px"></asp:TextBox>
                                                &nbsp;<asp:HyperLink ID="HyperLink15" runat="server" Font-Size="X-Small" 
                                                    NavigateUrl="~/about_CC_CVC.htm" Target="_blank">What&#39;s This?</asp:HyperLink>
                                                &nbsp;
                                                <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" ControlToValidate="ccCVC"
                                                    ErrorMessage="Card Verification Code is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                                        </tr>
                                       <tr>
                                            <td colspan="2">
                                                <asp:Image ID="Image7" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px">
                                            </td>
                                            <td>
                                                By submitting this order you agree to allow American Trainco to charge the above referenced 
                                                credit card for the "Order Total" above.<br />
                                                <br />
                                                Please click the 'Process Order' button only 1 time.&nbsp; After processing you will
                                                be directed to an order confirmation page where you may print a copy for your records.&nbsp;<br />
                                                <asp:Image ID="Image13" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                                        </tr>
                                    </table>
                                </asp:View>
                                <asp:View ID="ChkView" runat="server"><table cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="width: 280px; text-align: right;">
                                            Check Number &nbsp;</td>
                                        <td>
                                            <asp:TextBox ID="ChkNumber" runat="server" TabIndex="49"></asp:TextBox></td>
                                    </tr>
                                        <tr>
                                            <td colspan="2">
                                                <asp:Image ID="Image9" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px">
                                            </td>
                                            <td>
                                                Please make your check payable to American Trainco and submit 
                                                it prior to the class start to: <br /><br />
                                                &nbsp;&nbsp;P.O. Box 3397<br />
                                                &nbsp;&nbsp;Englewood, CO  80155</td>
                                        </tr>
                                </table>
                                </asp:View>
                                <asp:View ID="POView" runat="server"><table cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="width: 280px; text-align: right;">
                                            PO Number <span style="color: red">*</span> &nbsp;</td>
                                        <td>
                                            <asp:TextBox ID="PONumber" runat="server" TabIndex="50"></asp:TextBox>
                                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" ControlToValidate="PONumber"
                                                ErrorMessage="PO # is required!" Display="Dynamic"></asp:RequiredFieldValidator></td>
                                    </tr>
                                         <tr>
                                            <td colspan="2">
                                                <asp:Image ID="Image10" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px">
                                            </td>
                                            <td>
                                                Please submit your approved purchase order prior to the class start. You may fax it 
                                                to (303) 531-4565 or mail it to:&nbsp;<br /><br />
                                                &nbsp;&nbsp;American Trainco<br />
                                                &nbsp;&nbsp;P.O. Box 3397<br />
                                                &nbsp;&nbsp;Englewood, CO  80155</td>
                                        </tr>
                               </table>
                                </asp:View>
                                <asp:View ID="InvView" runat="server"><table cellpadding="1" cellspacing="0" width="100%">
                                         <tr>
                                            <td colspan="2">
                                                <asp:Image ID="Image16" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
                                        </tr>
                                        <tr>
                                            <td style="width: 280px">
                                            </td>
                                            <td>
                                                Your billing contact above will receive an invoice prior to the class start.<br /></td>
                                        </tr>
                               </table>
                                </asp:View>
                                <asp:View ID="EmptyView" runat="server">
                                </asp:View>
                            </asp:MultiView></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="height: 19px; text-align: center; padding-left: 5px;">
                            <asp:Label ID="ErrorLabel" runat="server" ForeColor="Red"></asp:Label></td>
                    </tr>


                </table>

            </td>
        </tr>

        <tr>
            <td width="250" valign="top" style="padding-left: 5px">
                &nbsp;<asp:Button ID="btnBack" runat="server" Text="<< Back <<" CausesValidation="False" /></td>
            <td>
                <asp:Button ID="btnContinue" runat="server" Text="Process Order" TabIndex="51" />
                <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                <ContentTemplate>
                &nbsp;
                </ContentTemplate></asp:UpdatePanel>
                <asp:UpdateProgress ID="UpdateProgress1" runat="server" AssociatedUpdatePanelID="UpdatePanel1">
                <ProgressTemplate>
                    <div style="position: relative; top: 29%; text-align: left; left: 0px; font-size: 1.0em; font-weight: 700; color: #003366; font-style: italic;"> 
                        Processing registration... <br />&nbsp;<br />
                    </div> 
                </ProgressTemplate>
                </asp:UpdateProgress>

            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding-left: 5px">
                <asp:Image ID="Image12" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
    </table>
<!-- Google Code for Purchase/CC Page Remarketing List -->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 1071752321;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "666666";
var google_conversion_label = "rinjCLWthAIQgcmG_wM";
var google_conversion_value = 0;
/* ]]> */
</script>
<script type="text/javascript" src="https://www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="https://www.googleadservices.com/pagead/conversion/1071752321/?label=rinjCLWthAIQgcmG_wM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>
</asp:Content>

