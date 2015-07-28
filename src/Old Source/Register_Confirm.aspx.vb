Imports System.Data.SqlClient
Partial Class Register_Confirm
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim myFunc As New ATI_GlobalFunctions
        If Me.IsPostBack = False Then
            Page.Header.Title = "American Trainco - Facility, Plant and Industrial Maintenance Training Seminars"

            Dim mtNoIndx As New HtmlMeta()
            mtNoIndx.Name = "robots"
            mtNoIndx.Content = "noindex"
            Page.Header.Controls.Add(mtNoIndx)

            Dim mtD As New HtmlMeta()
            mtD.Name = "description"
            mtD.Content = "Over 70,000 Satisfied Students - Maintenance, Facility & Industrial Seminars & Training Programs including Electrical, HVAC, Pump, Mechanical, Codes and Facility & Plant Management Training Courses."
            Page.Header.Controls.Add(mtD)

            'Dim mtK As New HtmlMeta()
            'mtK.Name = "keywords"
            'mtK.Content = "Electrical training, industrial, maintenance, national electrical code, electric, national electric code, nfpa 70e, arc flash, course, plc, vfd, boiler operator, building maintenance seminar, air conditioning, pump class, maintenance management, nec, electrical safety, schematics, epa 608, refrigerant technician, allen Bradley, motor controls, nec, hydraulics , American Trainco"
            'Page.Header.Controls.Add(mtK)

            Dim yahooScript As New HtmlGenericControl("script")
            yahooScript.Attributes.Add("type", "text/javascript")
            yahooScript.Attributes.Add("src", "js/Yahoo_Conversion.js")
            Header.Controls.Add(yahooScript)

            myFunc.fillGlobals(Page.Request())

            'Dim gc As New StringBuilder
            'gc.Append("<!-- Google Code for ATI Order Confirm Conversion Page -->" + vbCr)
            'gc.Append("<script language='JavaScript' type='text/javascript'>" + vbCr)
            'gc.Append("<!-- " + vbCr)
            'gc.Append("var google_conversion_id = 1071752321;" + vbCr)
            'gc.Append("var google_conversion_language = 'en_US';" + vbCr)
            'gc.Append("var google_conversion_format = '1';" + vbCr)
            'gc.Append("var google_conversion_color = 'ffffff';" + vbCr)
            'gc.Append("if (1000) {" + vbCr)
            'gc.Append("var google_conversion_value = 1000;" + vbCr)
            'gc.Append("}" + vbCr)
            'gc.Append("var google_conversion_label = 'LJq2CMn8QxCByYb_Aw';" + vbCr)
            'gc.Append("//-->" + vbCr)
            'gc.Append("</script>" + vbCr)
            'gc.Append("<script language='JavaScript' src='https://www.googleadservices.com/pagead/conversion.js'>" + vbCr)
            'gc.Append("</script>" + vbCr)
            'gc.Append("<noscript>" + vbCr)
            'gc.Append("<img height='1' width='1' border='0' src='https://www.googleadservices.com/pagead/conversion/1071752321/?value=1000&amp;label=LJq2CMn8QxCByYb_Aw&amp;script=0'>" + vbCr)
            'gc.Append("</noscript>" + vbCr)

            ' Define the name and type of the client scripts on the page.
            'Dim csname1 As String = "googleTrack1"
            'Dim cstype As Type = Me.GetType()
            ' Get a ClientScriptManager reference from the Page class.
            'Dim cs As ClientScriptManager = Page.ClientScript

            ' Check to see if the startup script is already registered.
            'If (Not cs.IsStartupScriptRegistered(cstype, csname1)) Then
            'Dim googleScript As String = gc.ToString()
            'cs.RegisterStartupScript(cstype, csname1, googleScript, False)
            'End If

            Dim xRID As Integer = Page.Request.QueryString("RID")
            HyperLink1.NavigateUrl = "~/OrderReceipt_Print.aspx?RID=" + xRID.ToString()

            Session("cartRegID") = 0
            Session("cartSemNo") = 0
            Session("regTitle") = ""
            Session("regSID") = 0
            Session("regSelectedSID") = 0
            Session("regPPAmount") = 0

        End If
    End Sub

    Protected Function getOrderSummary(ByVal xRID As Integer) As String
        Dim dblQ As String = Chr(34)
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader
        Dim theText As String = "<Table cellpadding=" & dblQ & "0" & dblQ & " cellspacing=" & dblQ & "0" & dblQ & ">"
        Dim semDescLine As String = ""
        Dim lastSID As Integer = 0
        Dim thisSID As Integer = 0

        sql = "SELECT SCHEDULES.ScheduleID as SID, SCHEDULES.ScheduleSeminarNumber as SemNo, dbo.stripHTML(COURSES.CourseTitle) as Title, "
        sql = sql & "Cities.CityName + ', ' + States.StateAbbreviation + ' - ' + SCHEDULES.ScheduleDateDescription as Place, "
        sql = sql & "RegistrationAttendees.RegAttendeeFirstName + ' ' + RegistrationAttendees.RegAttendeeLastName AS Name, "
        sql = sql & "COURSES.CourseFee as Fee "
        sql = sql & "FROM SCHEDULES INNER JOIN "
        sql = sql & "RegistrationAttendeeSchedules ON SCHEDULES.ScheduleID = RegistrationAttendeeSchedules.ScheduleID INNER JOIN "
        sql = sql & "ScheduleCourseInstructors ON SCHEDULES.ScheduleID = ScheduleCourseInstructors.ScheduleID INNER JOIN "
        sql = sql & "COURSES ON ScheduleCourseInstructors.CourseID = COURSES.CourseID INNER JOIN "
        sql = sql & "Cities ON SCHEDULES.CityID = Cities.CityID INNER JOIN "
        sql = sql & "States ON SCHEDULES.StateID = States.StateID LEFT OUTER JOIN "
        sql = sql & "RegistrationAttendees ON RegistrationAttendeeSchedules.RegistrationAttendeeID = RegistrationAttendees.RegistrationAttendeeID "
        sql = sql & "WHERE (RegistrationAttendees.RegistrationID = " & xRID.ToString() & ") "
        sql = sql & "ORDER BY SCHEDULES.ScheduleID"

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                thisSID = dl("SID")
                If thisSID <> lastSID Then
                    If lastSID > 0 Then
                        theText = theText & "<tr><td colspan=" & dblQ & "3" & dblQ & "><br />" & vbCr
                    Else
                        theText = theText & "<tr><td colspan=" & dblQ & "3" & dblQ & ">"
                    End If
                    semDescLine = dl("SemNo") & ": " & dl("Title")
                    semDescLine = semDescLine & " - " & dl("Place")
                    theText = theText & semDescLine & "</td></tr>" & vbCr
                    theText = theText & "<tr><td colspan=" & dblQ & "3" & dblQ & ">" & vbCr
                    theText = theText & "<a href=" & dblQ & "Location_Info.aspx?SID="
                    theText = theText & dl("SID").ToString() & dblQ
                    theText = theText & " target=" & dblQ & "_blank" & dblQ & ">"
                    theText = theText & "click here for location information..</a></td></tr>" & vbCr
                    lastSID = dl("SID")
                End If
                theText = theText & "<tr><td style=" & dblQ & "width: 100px;" & dblQ & "></td>" & vbCr
                theText = theText & "<td style=" & dblQ & "width: 400px;" & dblQ & ">" & dl("Name") & "</td>" & vbCr
                theText = theText & "<td align=" & dblQ & "right" & dblQ & ">"
                theText = theText & FormatCurrency(dl("Fee")) & "</td></tr>" & vbCr

            End While
        Catch ex As Exception
        Finally
            sqlConn.Close()
        End Try
        theText = theText & "</table>" & vbCr

        Return theText
    End Function

    Protected Function getPayInfo(ByVal payMethodID As Integer, ByVal ccTypeID As Integer, ByVal ccName As String, ByVal ccNumber As String, ByVal ccExpM As Integer, ByVal ccExpY As Integer, ByVal chkNumber As String, ByVal poNumber As String) As String
        Dim theText As String = "Payment Method: "
        Select Case payMethodID
            Case 3
                Select Case ccTypeID
                    Case 3
                        theText = theText + "Visa" + vbCr
                    Case 4
                        theText = theText + "MC" + vbCr
                    Case 5
                        theText = theText + "Amex" + vbCr
                    Case 6
                        theText = theText + "Disc" + vbCr
                    Case Else
                        theText = theText + "CC" + vbCr
                End Select
                theText = theText + "CC Number: "
                Select Case Len(ccNumber)
                    Case 15
                        theText = theText + "**** ****** *" + Right(ccNumber, 4) + vbCr
                    Case Is > 4
                        theText = theText + "**** **** **** " + Right(ccNumber, 4) + vbCr
                    Case Else
                        theText = theText + "...**** " + Right(ccNumber, Len(ccNumber)) + vbCr
                End Select
                theText = theText + "Expiration: " + ccExpM.ToString() + "/" + ccExpY.ToString + vbCr
            Case 4
                theText = theText + "Check" + vbCr
                theText = theText + "Chk. Number: " + chkNumber + vbCr
            Case Else
                theText = theText + "Purchase Order" + vbCr
                theText = theText + "PO Number: " + poNumber + vbCr
        End Select

        theText = Replace(theText, vbCr, "<br />")

        Return theText
    End Function

    Protected Function getAuthInfo(ByVal xFN As Object, ByVal xLN As Object, ByVal xTIT As Object, ByVal xCO As Object, ByVal xMC As Object, ByVal xAD1 As Object, ByVal xAD2 As Object, ByVal xCTY As Object, ByVal xSTID As Object, ByVal xZIP As Object, ByVal xCTRY As Object, ByVal xPH As Object, ByVal xPHE As Object, ByVal xEM As Object) As String
        Dim FN As String = ""
        If Not xFN Is Nothing Then
            FN = xFN.ToString()
        End If
        Dim LN As String = ""
        If Not xLN Is Nothing Then
            LN = xLN.ToString()
        End If
        Dim TIT As String = ""
        If Not xTIT Is Nothing Then
            TIT = xTIT.ToString()
        End If
        Dim CO As String = ""
        If Not xCO Is Nothing Then
            CO = xCO.ToString()
        End If
        Dim MC As String = ""
        If Not xMC Is Nothing Then
            MC = xMC.ToString()
        End If
        Dim AD1 As String = ""
        If Not xAD1 Is Nothing Then
            AD1 = xAD1.ToString()
        End If
        Dim AD2 As String = ""
        If Not xAD2 Is Nothing Then
            AD2 = xAD2.ToString()
        End If
        Dim CTY As String = ""
        If Not xCTY Is Nothing Then
            CTY = xCTY.ToString()
        End If
        Dim STID As Integer = 0
        If Not xSTID Is Nothing Then
            STID = CInt(xSTID.ToString())
        End If
        Dim ZIP As String = "'"
        If Not xZIP Is Nothing Then
            ZIP = xZIP.ToString()
        End If
        Dim CTRY As String = ""
        If Not xCTRY Is Nothing Then
            CTRY = xCTRY.ToString()
        End If
        Dim PH As String = ""
        If Not xPH Is Nothing Then
            PH = xPH.ToString()
        End If
        Dim PHE As String = ""
        If Not xPHE Is Nothing Then
            PHE = xPHE.ToString()
        End If
        Dim EM As String = ""
        If Not xEM Is Nothing Then
            EM = xEM.ToString()
        End If

        Dim theText As String = ""
        theText = theText + FN + " " + LN + vbCr
        If TIT <> "" Then
            theText = theText + TIT + vbCr
        End If
        If CO <> "" Then
            theText = theText + CO + vbCr
        End If
        If MC <> "" Then
            theText = theText + MC + vbCr
        End If
        If AD1 <> "" Then
            theText = theText + AD1 + vbCr
        End If
        If AD2 <> "" Then
            theText = theText + AD2 + vbCr
        End If
        Dim xState As String = getStateAbbrv(STID)

        theText = theText + CTY + ", " + xState + "  " + ZIP + vbCr
        theText = theText + CTRY + vbCr
        theText = theText + "Phone: " + PH
        If PHE <> "" Then
            theText = theText + " Ext.: " + PHE
        End If
        theText = theText + vbCr
        theText = theText + "Email: " + EM

        theText = Replace(theText, vbCr, "<br />")

        Return theText
    End Function

    Protected Function getStateAbbrv(ByVal ID As Integer) As String
        Dim abbrv As String = ""
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String
        Dim dl As SqlDataReader

        sql = "SELECT StateAbbreviation FROM States WHERE StateID = " + ID.ToString()
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                abbrv = dl("StateAbbreviation")
            End While

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Return abbrv
    End Function

    Protected Sub LinkButton1_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim xRID As Integer = Page.Request.QueryString("RID")
        Server.Transfer("~/OrderReceipt_Print.aspx?RID=" & xRID.ToString())

    End Sub

    Protected Function getUTMlines(ByVal xRID As Integer) As String

        Dim UTMtxt2 As String = ""
        Dim cnt As Integer = 0
        Dim lastSID As Integer = 0
        Dim xT As String = ""
        Dim xP As String = ""
        Dim xF As String = ""

        Dim sTotal As String = ""
        Dim pos As Integer = 0
        Dim l As Integer = 0

        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader

        sql = "SELECT SCHEDULES.ScheduleID as SID, dbo.getShortType(SCHEDULES.ScheduleSeminarNumber) as Acr, "
        sql = sql & "dbo.stripHTML(COURSES.CourseTitle) as Title, COURSES.CourseFee as Fee "
        sql = sql & "FROM SCHEDULES INNER JOIN "
        sql = sql & "RegistrationAttendeeSchedules ON SCHEDULES.ScheduleID = RegistrationAttendeeSchedules.ScheduleID INNER JOIN "
        sql = sql & "ScheduleCourseInstructors ON SCHEDULES.ScheduleID = ScheduleCourseInstructors.ScheduleID INNER JOIN "
        sql = sql & "COURSES ON ScheduleCourseInstructors.CourseID = COURSES.CourseID LEFT OUTER JOIN "
        sql = sql & "RegistrationAttendees ON RegistrationAttendeeSchedules.RegistrationAttendeeID = RegistrationAttendees.RegistrationAttendeeID "
        sql = sql & "WHERE (RegistrationAttendees.RegistrationID = " & xRID.ToString() & ") "
        sql = sql & "ORDER BY SID"

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                If lastSID = 0 Then
                    lastSID = dl("SID")
                    xT = dl("Title")
                    xP = dl("Acr")
                    xF = dl("Fee").ToString()
                End If
                If dl("SID") = lastSID Then
                    cnt += 1
                Else
                    sTotal = xF
                    pos = InStr(sTotal, ".")
                    l = Len(sTotal)
                    If l > (pos + 2) Then
                        sTotal = Left(sTotal, l - 2)
                    End If
                    xF = sTotal
                    UTMtxt2 += vbCrLf & "UTM:I|" & xRID.ToString() & "|" & lastSID.ToString() & "|"
                    UTMtxt2 += xT & "|" & xP & "|" & xF & "|" & cnt.ToString()
                    cnt = 1
                    lastSID = dl("SID")
                    xT = dl("Title")
                    xP = dl("Acr")
                    xF = dl("Fee").ToString()
                End If

            End While
            sTotal = xF
            pos = InStr(sTotal, ".")
            l = Len(sTotal)
            If l > (pos + 2) Then
                sTotal = Left(sTotal, l - 2)
            End If
            xF = sTotal
            UTMtxt2 += vbCrLf & "UTM:I|" & xRID.ToString() & "|" & lastSID.ToString() & "|"
            UTMtxt2 += xT & "|" & xP & "|" & xF & "|" & cnt.ToString()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Return UTMtxt2
    End Function

    Protected Function getTotal(ByVal xRID As Integer) As String
        Dim sTotal As String = ""
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader
        sql = "SELECT RegOrderTotal FROM Registrations WHERE RegistrationID = " + xRID.ToString()
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            If dl.Read() Then
                sTotal = dl("RegOrderTotal").ToString()
            End If

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Dim pos As Integer = InStr(sTotal, ".")
        Dim l As Integer = Len(sTotal)
        If l > (pos + 2) Then
            sTotal = Left(sTotal, l - 2)
        End If

        Return sTotal
    End Function

    Protected Function getUTMtext(ByVal xRID As Integer, ByVal xSTID As Integer) As String
        Dim UTMtxt1 As String = ""
        Dim xState As String = ""
        If xSTID > 0 Then
            xState = getStateAbbrv(xSTID)
        End If
        Dim sTotal As String = ""
        Dim pos As Integer = 0
        Dim l As Integer = 0

        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader

        sql = "SELECT RegistrationID, RegCompanyName, RegOrderTotal, RegAuthCity, RegAuthCountry FROM Registrations WHERE RegistrationID = " + xRID.ToString()
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            If dl.Read() Then
                UTMtxt1 = "UTM:T|" & dl("RegistrationID").ToString() & "|"
                sTotal = dl("RegOrderTotal").ToString()
                pos = InStr(sTotal, ".")
                l = Len(sTotal)
                If l > (pos + 2) Then
                    sTotal = Left(sTotal, l - 2)
                End If
                UTMtxt1 += dl("RegCompanyName") & "|" & sTotal & "|"
                UTMtxt1 += "0|0|" & dl("RegAuthCity") & "|" & xState & "|" & dl("RegAuthCountry")
            End If

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try
        UTMtxt1 = UTMtxt1 & getUTMlines(xRID)

        Return UTMtxt1
    End Function

    Protected Sub sql_Exec(ByVal sql As String)
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            sqlCommand.ExecuteNonQuery()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

    End Sub

End Class
