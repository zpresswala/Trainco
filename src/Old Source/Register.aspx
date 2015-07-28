<%@ Page Language="VB" MasterPageFile="~/MasterPage.master" AutoEventWireup="false" CodeFile="Register.aspx.vb" Inherits="Forms_Register" Title="Untitled Page" MaintainScrollPositionOnPostBack="true" %>

<%@ Register assembly="AjaxControlToolkit" namespace="AjaxControlToolkit" tagprefix="cc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">

    <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT DISTINCT COURSES.TitlePlain AS Title&#13;&#10;FROM  COURSES INNER JOIN&#13;&#10;      ScheduleCourseInstructors ON COURSES.CourseID = ScheduleCourseInstructors.CourseID RIGHT OUTER JOIN&#13;&#10;      SCHEDULES ON ScheduleCourseInstructors.ScheduleID = SCHEDULES.ScheduleID&#13;&#10;WHERE (SCHEDULES.Active = 1) AND (SCHEDULES.ScheduleDate >= GETDATE()) AND (SCHEDULES.Display_Mktg = 1) AND (SCHEDULES.isCanadian = 0)&#13;&#10;ORDER BY Title">
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource2" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT [SchID], [PlaceDate] FROM [SearchList_RegLocation] WHERE ([Title] = @Title) ORDER BY [PlaceDate]">
        <SelectParameters>
            <asp:SessionParameter Name="Title" SessionField="regTitle" Type="String" />
        </SelectParameters>
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource3" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT SCHEDULES.ScheduleID AS SchID, (CourseFormats.CourseFormatName + ' - $' + LTrim(Str(Round(ScheduleCourseInstructors.CourseFee,0)))) AS FeeName, &#13;&#10;        LTrim(Str(SCHEDULES.ScheduleID)) + '|' + LTrim(Str(ScheduleCourseInstructors.CourseFee)) AS FeeAmount &#13;&#10;FROM CourseFormats INNER JOIN &#13;&#10;        Courses ON CourseFormats.CourseFormatID = COURSES.CourseFormatID INNER JOIN &#13;&#10;        ScheduleCourseInstructors ON Courses.CourseID = ScheduleCourseInstructors.CourseID INNER JOIN &#13;&#10;        SCHEDULES ON ScheduleCourseInstructors.ScheduleID = SCHEDULES.ScheduleID &#13;&#10;WHERE (SCHEDULES.ScheduleID = @regSID) OR &#13;&#10;     ((SCHEDULES.ScheduleParentID = @regSID)  AND (@regSID > 0) AND (RIGHT(SCHEDULES.ScheduleSeminarNumber,1) <> '0')) &#13;&#10;ORDER BY CourseFormats.CourseFormatName&#13;&#10;">
        <SelectParameters>
            <asp:SessionParameter Name="regSID" SessionField="regSID" />
        </SelectParameters>
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="SqlDataSource4" runat="server" ConnectionString="<%$ ConnectionStrings:ATI_WebConnectionString %>"
        SelectCommand="SELECT * FROM [temp_Reg] WHERE ([reg_ID] = @reg_ID) ORDER BY [sem_No]">
        <SelectParameters>
            <asp:SessionParameter Name="reg_ID" SessionField="cartRegID" Type="Int32" />
        </SelectParameters>
    </asp:SqlDataSource>
     &nbsp;
    
    <asp:Image ID="Image8" runat="server" ImageUrl="~/Images/Blank.gif" />
    <asp:ScriptManager ID="ScriptManager1" runat="server">
    </asp:ScriptManager>
    <table width="750" cellpadding="0" cellspacing="0" style="padding-right: 10px; margin-left: 10px">
        <tr>
            <td>
                <span id="topText" runat="server">
                    <strong><span style="color: navy">Your seminar registrations are listed below.&nbsp;<br />
                        Please complete all required (</span><span style="color: red">*</span><span style="color: navy">)
                            attendee details prior to continuing the checkout process...</span></strong></span></td>
        </tr>
        <tr>
            <td>
                <asp:Image ID="Image12" runat="server" Height="10px" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td>
                <asp:DataList ID="DataList1" runat="server" DataSourceID="SqlDataSource4">
                    <ItemTemplate>
                        <table cellpadding="0" cellspacing="0" style="width: 750px" bgcolor="whitesmoke">
                            <tr>
                                <td colspan="5" style="height: 19px" valign="top">
                                    <hr color="navy" noshade="noshade" size="1" />
                                    &nbsp;</td>
                            </tr>
                            <tr>
                                <td nowrap="nowrap" style="height: 19px;" valign="top">
                                    Seminar 
                                    <asp:Label ID="sem_NoLabel" runat="server" Text='<%# display_SeminarCount() %>' Width="5px"></asp:Label>&nbsp;&nbsp;</td>
                                <td colspan="4" valign="top" style="height: 19px">
                                    &nbsp;<asp:Label ID="sem_TitleLabel" runat="server" Text='<%# Eval("sem_Title") %>'></asp:Label></td>
                            </tr>
                            <tr>
                                <td valign="top" style="height: 18px">
                                    &nbsp;&nbsp;
                                    <asp:LinkButton ID="HyperLink2" runat="server" SeminarID='<%# Eval("reg_SEQ") %>' Font-Size="10pt" Text="Remove" CausesValidation="false" OnClick="RemoveSeminar_Click" TabIndex="-1" /></td>
                                <td valign="top" style="height: 18px;" nowrap="noWrap">
                                    &nbsp;<asp:Label ID="sem_PlaceLabel" runat="server" Text='<%# Eval("sem_Place") %>'></asp:Label>&nbsp;&nbsp;</td>
                                <td valign="top" style="height: 18px;" nowrap="noWrap">
                                    &nbsp;<asp:Label ID="sem_FeeNameLabel" runat="server" Text='<%# Eval("sem_FeeName") %>'></asp:Label>&nbsp;&nbsp;</td>
                                <td nowrap="nowrap" style="height: 18px;" valign="top">
                                    &nbsp;# Attendees:&nbsp;
                                    <asp:Label ID="sem_QtyLabel" runat="server" Text='<%# Eval("sem_Qty") %>' />&nbsp;&nbsp;
                                    <asp:LinkButton ID="HyperLink3" runat="server" Font-Underline="False" SemID='<%# Eval("reg_SEQ") %>' SemFee='<%# Eval("sem_FeeAmt") %>' SemQty='<%# Eval("sem_Qty") %>' Text=" + " CausesValidation="false" OnClick="AddOne_Click" TabIndex="-1" BackColor="#FFC0C0" Font-Bold="True" />&nbsp;
                                    <asp:LinkButton ID="LinkButton1" runat="server" Font-Underline="False" SemID='<%# Eval("reg_SEQ") %>' SemFee='<%# Eval("sem_FeeAmt") %>' SemQty='<%# Eval("sem_Qty") %>' Text=" - " CausesValidation="false" OnClick="SubtractOne_Click" TabIndex="-1" BackColor="#FFC0C0" Font-Bold="True" />&nbsp;</td>
                                <td nowrap="nowrap" style="height: 18px;" valign="top">
                                    &nbsp;Cost:&nbsp;
                                    <asp:Label ID="RegCost" runat="server" Text='<%# classTotal(Eval("sem_FeeAmt"), Eval("sem_Qty")) %>'></asp:Label></td>
                            </tr>
                            <tr>
                                <td valign="top" nowrap="noWrap">
                                    &nbsp;&nbsp;</td>
                                <td colspan="4" nowrap="nowrap" valign="top">
                                    <hr color="navy" noshade="noshade" size="1" width="90%" />
                                </td>
                            </tr>
                        </table>
                        <asp:Repeater ID="Repeater1" runat="server" DataSource='<%# get_Attendees(Eval("reg_SEQ")) %>'>
                            <ItemTemplate>
                                <table cellpadding="0" cellspacing="0" style="width: 100%" bgcolor="linen">
                                    <tr>
                                        <td style="height: 19px;" valign="top" nowrap="noWrap">
                                            &nbsp; Attendee 
                                            <asp:Label ID="att_NoLabel" runat="server" Text='<%# display_AttendeeCount() %>' Width="5px"></asp:Label>&nbsp;&nbsp;</td>
                                        <td style="height: 19px; text-align: right;" valign="top" nowrap="noWrap">
                                            First Name &nbsp;</td>
                                        <td colspan="3" nowrap="nowrap" style="height: 19px; padding-bottom: 5px;" valign="top">
                                            <asp:TextBox ID="FName" runat="server" Width="100px" Text='<%# Eval("att_FName") %>' />&nbsp;&nbsp;
                                            MI&nbsp;<asp:TextBox ID="MName" runat="server" Width="20px" Text='<%# Eval("att_MName") %>' />&nbsp;&nbsp;
                                            Last Name &nbsp;<asp:TextBox ID="LName" runat="server" Width="130px" Text='<%# Eval("att_LName") %>' />&nbsp;&nbsp;
                                            Suffix&nbsp;<asp:TextBox ID="Suffix" runat="server" Width="40px" Text='<%# Eval("att_Suffix") %>' /><br />                                           
                                            <span style="font-size:small"><i><span style="color: red">*</span> This is how the name will appear on the certificate and test files</i></span></td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="height: 19px;">
                                            &nbsp;&nbsp;&nbsp;&nbsp;<asp:LinkButton ID="HyperLink1" runat="server" Font-Size="8pt" Text="Remove" CausesValidation="false" OnClick="RemoveAttendee_Click" SeminarID='<%# Eval("reg_SEQ") %>' AttendeeID='<%# Eval("att_No") %>' TabIndex="-1" />
                                            &nbsp;&nbsp;
                                        </td>
                                        <td style="height: 19px; text-align: right;" valign="top" nowrap="noWrap">
                                            Title &nbsp;</td>
                                        <td colspan="3" nowrap="nowrap" valign="top" style="height: 19px">
                                            <asp:TextBox ID="Title" runat="server" Text='<%# Eval("att_Title") %>' /></td>
                                    </tr>
                                    <tr>
                                        <td style="height: 24px;" valign="top">
                                        <asp:RequiredFieldValidator ID="RequiredField1" runat="server"
                                        ErrorMessage="First Name is required!" ControlToValidate="FName" Display=Dynamic /></td>
                                        <td style="height: 24px; text-align: right;" valign="top" nowrap="noWrap">
                                            Email &nbsp;</td>
                                        <td colspan="3" nowrap="nowrap" style="height: 24px" valign="top">
                                            <asp:TextBox ID="Email" runat="server"  Width="250px" Text='<%# Eval("att_EMail") %>' /></td>
                                    </tr>
                                     <tr>
                                        <td colspan="2" valign="top">
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server"
                                        ErrorMessage="Last Name is required!" ControlToValidate="LName" Display=Dynamic />
                                        </td>
                                        <td colspan="3" valign="top">
                                        <i>E-mail used for immediate registration confirmation & course notifications</i></td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" style="height: 10px" valign="top"></td>
                                    </tr>
                              </table>
                            </ItemTemplate>
                        </asp:Repeater>
                    </ItemTemplate>
                </asp:DataList></td>
        </tr>
        <tr>
            <td>
                <asp:Image ID="Image2" runat="server" Height="10px" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>

        <tr>
            <td>
                <asp:MultiView ID="MultiView1" runat="server">
                    <asp:View ID="SemSelect" runat="server">
                        <div id="SeminarSelect" runat="server">
                <strong><span style="color: #000080">Use this selection box to register for seminars...<br />
                </span></strong>
                <asp:Image ID="Image1" runat="server" Height="10px" ImageUrl="~/Images/Blank.gif" /><table
                    bgcolor="palegoldenrod" cellpadding="3" cellspacing="0" style="width: 95%">
                    <tr>
                        <td nowrap="nowrap" valign="middle" align="right" style="width: 110px">
                            Select a Title:
                        </td>
                        <td colspan="5" valign="middle">
                            <asp:DropDownList ID="TitleList" runat="server" DataSourceID="SqlDataSource1" DataTextField="Title"
                                DataValueField="Title" AutoPostBack="True" TabIndex="1">
                            </asp:DropDownList></td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap" valign="middle" align="right" style="width: 110px">
                            Time &amp; Place:
                        </td>
                        <td valign="middle" style="width: 110px">
                            <asp:DropDownList ID="LocationList" runat="server" AutoPostBack="True" DataSourceID="SqlDataSource2"
                                DataTextField="PlaceDate" DataValueField="SchID" TabIndex="2">
                            </asp:DropDownList></td>
                        <td nowrap="nowrap" valign="middle" align="right" style="width: 110px">
                            # of Attendees:
                        </td>
                        <td valign="middle" style="width: 70px">
                            <asp:TextBox ID="Qty" runat="server" AutoPostBack="True" MaxLength="2" Width="20px"
                                Wrap="False"></asp:TextBox></td>
                        <td nowrap="nowrap" valign="middle" align="right" style="width: 117px">
                        </td>
                        <td valign="middle">
                            </td>
                    </tr>
                    <tr>
                        <td align="right" valign="middle" style="width: 110px">
                            Days to Attend:
                            </td>
                       <td valign="middle" style="width: 110px">
                            <asp:DropDownList ID="DaysList" runat="server" DataSourceID="SqlDataSource3" DataTextField="FeeName"
                                DataValueField="FeeAmount" AutoPostBack="True" TabIndex="3">
                            </asp:DropDownList></td>
                       <td valign="middle" align="right" style="width: 110px">
                            Seminar Cost:
                        </td>
                        <td valign="middle" style="width: 70px">
                            <asp:Label ID="CostOne" runat="server" Text="CostOne"></asp:Label></td>
                        <td valign="middle" style="width: 117px">
                            <asp:Button ID="btnCancelAdd" runat="server" Text="Cancel Add" /></td>
                        <td valign="middle">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td valign="middle" style="width: 110px" >
                        </td>
                        <td valign="middle" style="width: 110px" >
                        </td>
                        <td valign="middle" align="right" style="width: 110px">
                            Total Cost:
                        </td>
                        <td valign="middle" style="width: 70px" >
                            <asp:Label ID="CostTotal" runat="server" Text="CostTotal"></asp:Label></td>
                        <td colspan="2" valign="middle">
                            <asp:Button ID="btnAdd" runat="server" Text="Add to Order" TabIndex="5" CausesValidation="False" /></td>
                    </tr>
                </table>
                <asp:Image ID="Image3" runat="server" ImageUrl="~/Images/Blank.gif" Height="10px" /><br />
                <asp:Label ID="ErrorLabel" runat="server" Width="503px" Font-Bold="True" ForeColor="Red"></asp:Label></div>
                    </asp:View>
                    <asp:View ID="SemHide" runat="server">
                    </asp:View>
                </asp:MultiView></td>
        </tr>
    </table>
    <table cellpadding="0"
        cellspacing="0" style="margin-left: 10px; width: 750px">


        <tr>
            <td style="width: 750px">
                <strong><span style="color: navy">
                    </span></strong></td>
        </tr>
        <tr>
            <td style="width: 750px">
                <asp:Label ID="ContinueError" runat="server" Font-Bold="True" ForeColor="Red" Width="503px"></asp:Label></td>
        </tr>
        <tr>
            <td style="width: 750px">
                <asp:Image ID="Image11" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
        <tr>
            <td style="width: 750px; height: 16px;">
                Cart ID:
                <asp:Label ID="theID" runat="server" Text="Label"></asp:Label><br />
                <asp:Label ID="TotalLabel" runat="server" Text="Total Invoice: "></asp:Label>
                <asp:Label ID="TotalCost" runat="server"></asp:Label></td>
        </tr>
        <tr>
            <td style="width: 750px" nowrap="noWrap">
                <asp:Image ID="Image5" runat="server" ImageUrl="~/Images/Blank.gif" /><br />
                <asp:Button ID="btnCheckOut" runat="server" Text="Checkout Now" />
                <asp:Image ID="Image10" runat="server" ImageUrl="~/Images/Blank.gif" />
                <asp:Button ID="btnAddMore" runat="server" CausesValidation="False" Text="Register for Additional Seminars" /><br />
                &nbsp;
            </td>
       </tr>
        <tr>
            <td nowrap="nowrap" style="width: 750px; height: 24px;">
                <asp:Button ID="btnBrowse" runat="server" CausesValidation="False" Text="Continue Browsing" />&nbsp;
                <asp:Label ID="browseLabel" runat="server" Text="(* Just click the 'Register' menu option at the top of any page to return here..)"></asp:Label><span style="font-size: 10pt"></span></td>
        </tr>
        <tr>
            <td nowrap="nowrap" style="width: 750px">
                <asp:Image ID="Image4" runat="server" ImageUrl="~/Images/Blank.gif" /></td>
        </tr>
    </table>
<!-- Google Code for Register 2 Page Remarketing List -->
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 1071752321;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "666666";
var google_conversion_label = "eIScCL2shAIQgcmG_wM";
var google_conversion_value = 0;
/* ]]> */
</script>
<script type="text/javascript" src="https://www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="https://www.googleadservices.com/pagead/conversion/1071752321/?label=eIScCL2shAIQgcmG_wM&amp;guid=ON&amp;script=0"/>
</div>
</noscript>
</asp:Content>
