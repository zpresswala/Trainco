<%@ Page Language="VB" MasterPageFile="~/MasterPage1.master" AutoEventWireup="false" CodeFile="Register_Confirm.aspx.vb" Inherits="Register_Confirm" title="Untitled Page" MaintainScrollPositionOnPostBack="True" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <asp:SqlDataSource ID="RegRcd" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [RegistrationID], [Created], [RegOrderTotal], [RegCurrency], [RegCompanyName], [RegAuthFirstName], [RegAuthLastName], [RegAuthTitle], [RegAuthMailCode], [RegAuthAddress1], [RegAuthAddress2], [RegAuthCity], [RegAuthStateID], [RegAuthZipcode], [RegAuthPhone], [RegAuthPhoneExt], [RegAuthEmail], [RegBillFirstName], [RegBillLastName], [RegBillTitle], [RegBillMailCode], [RegBillAddress1], [RegBillAddress2], [RegBillCity], [RegBillStateID], [RegBillZipcode], [RegBillPhone], [RegBillPhoneExt], [RegBillEmail], [RegBillPaymentMethodTypeID], [RegBillCCTypeID], [RegBillCCName], [RegBillCCNumber], [RegBillCCExpirationMonth], [RegBillCCExpirationYear], [RegBillCheckNumber], [RegBillPONumber], [RegAuthCountry], [RegBillCountry] FROM [REGISTRATIONS] WHERE ([RegistrationID] = @RegistrationID)">
        <SelectParameters>
            <asp:QueryStringParameter Name="RegistrationID" QueryStringField="RID" Type="Int32" />
        </SelectParameters>
    </asp:SqlDataSource>
    <table border="0" cellpadding="0" cellspacing="0" style="margin-left: 10px; margin-right: 10px" width="600">
        <tr>
            <td colspan="3" style="height: 15px">
                <img height="15" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center; height: 14px;" valign="top">
                <strong>&nbsp;American Trainco Order Receipt</strong></td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="15" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td colspan="3" valign="bottom">
                Thank you for your order.&nbsp; Please 
                <asp:HyperLink ID="HyperLink1" runat="server" Target="_blank">print</asp:HyperLink>
                &nbsp;this receipt for your records.&nbsp;
                If you require customer service, please call 1-877-97-TRAIN or email us at sales@americantrainco.com.</td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="15" alt="" src="Images/Blank.gif" /></td>
        </tr>
    </table>
    <asp:DataList ID="DataList1" runat="server" DataKeyField="RegistrationID" DataSourceID="RegRcd">
        <ItemTemplate>
    <table border="0" cellpadding="0" cellspacing="0" style="margin-left: 10px; margin-right: 10px" width="600">
        <tr>
            <td style="width: 90px; text-align: right" valign="top">
                Authorizing &nbsp;<br />
                Information:&nbsp;</td>
            <td>
                <asp:Label ID="lblAuthInfo" runat="server" Text='<%# getAuthInfo(Eval("RegAuthFirstName"),Eval("RegAuthLastName"),Eval("RegAuthTitle"),Eval("RegCompanyName"),Eval("RegAuthMailCode"),Eval("RegAuthAddress1"),Eval("RegAuthAddress2"),Eval("RegAuthCity"),Eval("RegAuthStateID"),Eval("RegAuthZipcode"),Eval("RegAuthCountry"),Eval("RegAuthPhone"),Eval("RegAuthPhoneExt"),Eval("RegAuthEmail")) %>'></asp:Label></td>
            <td style="text-align: right; width: 200px" valign="top">
                <asp:Label ID="lblDate" runat="server" Text='<%# Eval("Created", "{0:d}") %>'></asp:Label><br />
                Order No.:
                <asp:Label ID="lblOrdNum" runat="server" Text='<%# Eval("RegistrationID") %>'></asp:Label><br />
                Order Total:
                <asp:Label ID="Label2" runat="server" Text='<%# Eval("RegOrderTotal", "{0:C}") %>'></asp:Label>
                <asp:Label ID="Label3" runat="server" Text='<%# Eval("RegCurrency") %>'></asp:Label></td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="15" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td style="width: 90px; text-align: right" valign="top">
                Billing &nbsp;<br />
                Information: &nbsp;</td>
            <td>
                <asp:Label ID="lblBillInfo" runat="server" Text='<%# getAuthInfo(Eval("RegBillFirstName"),Eval("RegBillLastName"),Eval("RegBillTitle"),Eval("RegCompanyName"),Eval("RegBillMailCode"),Eval("RegBillAddress1"),Eval("RegBillAddress2"),Eval("RegBillCity"),Eval("RegBillStateID"),Eval("RegBillZipcode"),Eval("RegBillCountry"),Eval("RegBillPhone"),Eval("RegBillPhoneExt"),Eval("RegBillEmail")) %>'></asp:Label></td>
            <td style="text-align: right; width: 200px" valign="top">
                <asp:Label ID="lblPaymentInfo" runat="server" Text='<%# getPayInfo(Eval("RegBillPaymentMethodTypeID"),Eval("RegBillCCTypeID"),Eval("RegBillCCName"),Eval("RegBillCCNumber"),Eval("RegBillCCExpirationMonth"),Eval("RegBillCCExpirationYear"),Eval("RegBillCheckNumber"),Eval("RegBillPONumber")) %>'></asp:Label></td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="15" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center">
                <hr noshade="noshade" />
                Order Summary
                <hr noshade="noshade" />
            </td>
        </tr>
        <tr>
            <td colspan="3" style="height: 15px">
                <img height="15" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td colspan="3">
                <asp:Label ID="lblOrderSummary" runat="server" Text='<%# getOrderSummary(Eval("RegistrationID")) %>'></asp:Label></td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="10" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td colspan="3">
                <hr noshade="noshade" />
                &nbsp;</td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="5" alt="" src="Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td style="width: 90px; text-align: right" valign="top">
                Thank You!&nbsp;</td>
            <td colspan="2">
                If you have questions concerning this order, please call us at (303) 531-4560.&nbsp;
                You may also send a fax to (303) 531-4565, or Email us at CustomerService@AmericanTrainco.com.&nbsp;<br />
                <br />
                Sincerely, Your Customer Service Staff at American Trainco</td>
        </tr>
        <tr>
            <td colspan="3">
                <img height="15" alt="" src="Images/Blank.gif" />
                
<form name="utmform" id="utmform" action="">
<textarea name="utmtrans" id="utmtrans" cols="200" rows="2" style="display:none">
<%#getUTMtext(Eval("RegistrationID"), Eval("RegAuthStateID"))%>
</textarea></form>

<img src="https://1205612.r.msn.com/?type=1&domainId=1205612&dedup=1&actionid=26796&revenue=<%#getTotal(Eval("RegistrationID"))%>" width="1" height="1" />

<!-- Google Code for ATI Order Confirm Conversion Page -->
<script language="JavaScript" type="text/javascript">
<!--
var google_conversion_id = 1071752321;
var google_conversion_language = "en_US";
var google_conversion_format = "1";
var google_conversion_color = "ffffff";
if (1000) {
  var google_conversion_value = <%#getTotal(Eval("RegistrationID"))%>;
}
var google_conversion_label = "LJq2CMn8QxCByYb_Aw";
//-->
</script>
<script type="text/javascript" language="JavaScript" src="https://www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<img alt="" height="1" width="1" border="0" src="https://www.googleadservices.com/pagead/conversion/1071752321/?value=<%#getTotal(Eval("RegistrationID"))%>&amp;label=LJq2CMn8QxCByYb_Aw&amp;script=0" />
</noscript>
<script type="text/javascript" >
    microsoft_adcenterconversion_domainid = 97591;
    microsoft_adcenterconversion_cp = 5050;
</script>
<script type="text/javascript" language="JavaScript" src="https://0.r.msn.com/scripts/microsoft_adcenterconversion.js"></script>
<noscript><img width=1 height=1 SRC="https://97591.r.msn.com/?type=1&cp=1"/></noscript>

                </td>
        </tr>
    </table>
        </ItemTemplate>
    </asp:DataList>


</asp:Content>
