Imports System.Data
Imports System.Data.SqlClient
Imports ATI_GlobalFunctions

Partial Class Forms_Register
    Inherits System.Web.UI.Page

    Private iTotalCost As Integer
    Private semCounter As Integer
    Private attCounter As Integer

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim myFunc As New ATI_GlobalFunctions
        Dim sql As String = ""
        Dim cnt As Integer = 0
        Dim userip As String = Request.UserHostAddress()

        If Me.IsPostBack = False Then
            'If userip = "64.25.235.194" Then
            'Server.TransferRequest("~/Register_Office.aspx")
            'End If


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

            myFunc.fillGlobals(Page.Request())

            'Dim vsID As Integer = Page.Request.QueryString("vsID")
            'If vsID = 0 Then
            'vsID = ViewState("vsID")
            'End If
            'If vsID = 0 Then
            'vsID = ATI_GlobalFunctions.new_vsID()
            'ViewState("vsID") = vsID
            'End If

            Dim xCS As Integer = Request.QueryString("CS")
            Dim xSID As Integer = Request.QueryString("SID")
            If xCS > 0 And xSID > 0 Then
                Session.Clear()
            End If

            If Session("cartRegID") Is Nothing Then
                Session.Add("cartRegID", 0)
                Session.Add("cartSemNo", 0)
            End If

            Session.Add("regTitle", "")
            Session.Add("regSID", 0)
            Session.Add("regSelectedSID", 0)
            Session.Add("regPPAmount", 0)
            Qty.Text = "0"
            calcTopTotals()
            ErrorLabel.Text = ""
            If xSID > 0 Then
                addToOrder_Hard(xSID, 1)
            End If

            If Session("cartRegID") > 0 Then
                sql = "SELECT COUNT(reg_ID) AS MaxID FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
                cnt = getMaxID(sql)
            Else
                cnt = 0
            End If
            ContinueError.Text = ""
            If cnt > 0 Then
                showHideAddDisplay("Hide")
            Else
                showHideAddDisplay("Show")
            End If
            topText.Visible = (cnt > 0)
        Else

        End If
        theID.Text = Session("cartRegID").ToString()
        iTotalCost = 0
        semCounter = 1

    End Sub

    Protected Sub TitleList_DataBound(ByVal sender As Object, ByVal e As System.EventArgs) Handles TitleList.DataBound
        TitleList.Items.Insert(0, "Please Select")
        TitleList.SelectedIndex = 0
        TitleList.Items(0).Value = ""
    End Sub
    Protected Sub LocationList_DataBound(ByVal sender As Object, ByVal e As System.EventArgs) Handles LocationList.DataBound
        LocationList.Items.Insert(0, "Please Select")
        LocationList.SelectedIndex = 0
        LocationList.Items(0).Value = 0
    End Sub
    Protected Sub DaysList_DataBound(ByVal sender As Object, ByVal e As System.EventArgs) Handles DaysList.DataBound
        DaysList.Items.Insert(0, "Please Select")
        DaysList.SelectedIndex = 0
        DaysList.Items(0).Value = "0|0"
    End Sub

    Protected Sub TitleList_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles TitleList.SelectedIndexChanged
        ErrorLabel.Text = ""
        Session("regTitle") = ""
        Session("regSID") = 0
        Session("regSelectedSID") = 0
        Session("regPPAmount") = 0
        If TitleList.SelectedIndex > 0 Then
            Session("regTitle") = TitleList.SelectedValue
        End If
        LocationList.SelectedIndex = -1
        DaysList.SelectedIndex = -1
        calcTopTotals()
    End Sub
    Protected Sub LocationList_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles LocationList.SelectedIndexChanged
        ErrorLabel.Text = ""
        Session("regSID") = 0
        Session("regSelectedSID") = 0
        Session("regPPAmount") = 0
        If LocationList.SelectedIndex > 0 Then
            Session("regSID") = LocationList.SelectedValue
        End If
        DaysList.SelectedIndex = -1
    End Sub
    Protected Sub DaysList_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles DaysList.SelectedIndexChanged
        ErrorLabel.Text = ""
        Session("regSelectedSID") = 0
        Session("regPPAmount") = 0
        If DaysList.SelectedIndex > 0 Then
            Dim xpos As Integer = InStr(DaysList.SelectedValue, "|")
            Dim xlen As Integer = Len(DaysList.SelectedValue)
            Session("regSelectedSID") = CInt(Left(DaysList.SelectedValue, xpos - 1))
            Session("regPPAmount") = CInt(Right(DaysList.SelectedValue, xlen - xpos))
        End If
        calcTopTotals()
    End Sub

    Protected Sub Qty_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles Qty.TextChanged
        ErrorLabel.Text = ""
        If Qty.Text = "" Then
            Qty.Text = "0"
        End If
        calcTopTotals()
    End Sub

    Protected Sub calcTopTotals()
        CostOne.Text = "$0."
        CostTotal.Text = "$0."
        CostOne.Text = FormatCurrency(Session("regPPAmount"), 0)
        CostTotal.Text = FormatCurrency(Session("regPPAmount") * CInt(Qty.Text), 0)
    End Sub

    Protected Function classTotal(ByVal ppAmt As Integer, ByVal qty As Integer) As String
        Return FormatCurrency(ppAmt * qty, 0)
    End Function

    Protected Sub SubtractOne_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim myBtn As LinkButton
        Dim myID As Integer
        Dim myFee As Integer
        Dim myQty As Integer
        myBtn = sender
        myID = CInt(myBtn.Attributes.Item("SemID").ToString())
        myFee = CInt(myBtn.Attributes.Item("SemFee").ToString())
        myQty = CInt(myBtn.Attributes.Item("SemQty").ToString())
        Dim sql As String = ""
        ContinueError.Text = ""

        If myQty > 1 Then
            myQty = myQty - 1
            Dim cost As Integer = myFee * myQty
            sql = "UPDATE temp_Reg SET sem_Qty = " & myQty.ToString() & " WHERE reg_SEQ = " & myID.ToString()
            sql_Exec(sql)
            sql = "UPDATE temp_Cust SET reg_Cost = " & cost.ToString() & " WHERE reg_ID = " & Session("cartRegID").ToString()
            sql_Exec(sql)
            sql = "SELECT MAX(att_No) AS MaxID FROM temp_Att WHERE reg_SEQ = " & myID.ToString()
            myQty = getMaxID(sql)
            sql = "DELETE FROM temp_Att WHERE reg_SEQ = " & myID.ToString() & " AND att_NO = " & myQty.ToString()
            sql_Exec(sql)
            Server.Transfer("~/Register.aspx?SID=0")
        Else
            sql = "DELETE from temp_Att WHERE reg_SEQ = " & myID.ToString()
            sql_Exec(sql)
            sql = "DELETE from temp_Reg WHERE reg_SEQ = " & myID.ToString()
            sql_Exec(sql)
            myID = getNoSems()
            If myID = 0 Then
                sql = "DELETE from temp_Cust WHERE reg_ID = " & Session("cartRegID").ToString()
                sql_Exec(sql)
                Session("cartRegID") = 0
            End If
            Session("cartSemNo") = myID
            Server.Transfer("~/Register.aspx?SID=0")
        End If

    End Sub

    Protected Sub AddOne_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim myBtn As LinkButton
        Dim myID As Integer
        Dim myFee As Integer
        Dim myQty As Integer
        myBtn = sender
        myID = CInt(myBtn.Attributes.Item("SemID").ToString())
        myFee = CInt(myBtn.Attributes.Item("SemFee").ToString())
        myQty = CInt(myBtn.Attributes.Item("SemQty").ToString())
        Dim sql As String = ""
        ContinueError.Text = ""

        myQty = myQty + 1
        Dim cost As Integer = myFee * myQty

        sql = "UPDATE temp_Reg SET sem_Qty = " & myQty.ToString() & " WHERE reg_SEQ = " & myID.ToString()
        sql_Exec(sql)
        sql = "UPDATE temp_Cust SET reg_Cost = " & cost.ToString() & " WHERE reg_ID = " & Session("cartRegID").ToString()
        sql_Exec(sql)
        sql = "INSERT INTO temp_Att (reg_Seq, att_No, reg_ID) VALUES ("
        sql &= myID.ToString() & ", " & myQty.ToString() & ", " & Session("cartRegID").ToString() & ")"
        sql_Exec(sql)
        Server.Transfer("~/Register.aspx?SID=0")

    End Sub

    Protected Sub RemoveSeminar_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim myBtn As LinkButton
        Dim myID As Integer
        myBtn = sender
        myID = CInt(myBtn.Attributes.Item("SeminarID").ToString())

        Dim sql As String = ""
        sql = "DELETE from temp_Att WHERE reg_SEQ = " & myID.ToString()
        sql_Exec(sql)
        sql = "DELETE from temp_Reg WHERE reg_SEQ = " & myID.ToString()
        sql_Exec(sql)

        myID = getNoSems()
        If myID = 0 Then
            sql = "DELETE from temp_Cust WHERE reg_ID = " & Session("cartRegID").ToString()
            sql_Exec(sql)
            Session("cartRegID") = 0
        End If
        ContinueError.Text = ""
        Session("cartSemNo") = myID
        Server.Transfer("~/Register.aspx?SID=0")

    End Sub

    Protected Sub updateAttendee(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim myTextBox As TextBox
        myTextBox = sender

        Dim myID As Integer
        Dim myAttendeeID As Integer
        Dim myText As String
        Dim myField As Integer

        myID = CInt(myTextBox.Attributes.Item("SeminarID").ToString())
        myAttendeeID = CInt(myTextBox.Attributes.Item("AttendeeID").ToString())
        myText = checkString(myTextBox.Text, 255)
        myField = CInt(myTextBox.Attributes.Item("FieldNo").ToString())

        Dim sql As String
        sql = "UPDATE temp_Att SET "
        Select Case myField
            Case 1
                sql = sql & "att_FName = '" & myText & "' WHERE reg_SEQ = " & myID.ToString()
                sql = sql & " AND att_No = " & myAttendeeID.ToString()
            Case 2
                sql = sql & "att_LName = '" & myText & "' WHERE reg_SEQ = " & myID.ToString()
                sql = sql & " AND att_No = " & myAttendeeID.ToString()
            Case 3
                sql = sql & "att_Title = '" & myText & "' WHERE reg_SEQ = " & myID.ToString()
                sql = sql & " AND att_No = " & myAttendeeID.ToString()
            Case 4
                sql = sql & "att_Email = '" & myText & "' WHERE reg_SEQ = " & myID.ToString()
                sql = sql & " AND att_No = " & myAttendeeID.ToString()
        End Select
        sql_Exec(sql)

    End Sub

    Protected Sub RemoveAttendee_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        Dim myBtn As LinkButton
        Dim myID As Integer
        Dim myAttendeeID As Integer
        myBtn = sender
        myID = CInt(myBtn.Attributes.Item("SeminarID").ToString())
        myAttendeeID = CInt(myBtn.Attributes.Item("AttendeeID").ToString())

        Dim sql As String = ""

        attCounter = getSemQty(myID)
        If attCounter > 1 Then
            sql = "DELETE from temp_Att WHERE reg_SEQ = " & myID.ToString()
            sql = sql & " AND att_No = " & myAttendeeID.ToString()
            sql_Exec(sql)
            sql = "UPDATE temp_Reg SET sem_Qty = " & (attCounter - 1).ToString() & " WHERE reg_SEQ = " & myID.ToString()
            sql_Exec(sql)
        Else
            sql = "DELETE from temp_Att WHERE reg_SEQ = " & myID.ToString()
            sql_Exec(sql)
            sql = "DELETE from temp_Reg WHERE reg_SEQ = " & myID.ToString()
            sql_Exec(sql)
            myID = getNoSems()
            If myID = 0 Then
                sql = "DELETE from temp_Cust WHERE reg_ID = " & Session("cartRegID").ToString()
                sql_Exec(sql)
                Session("cartRegID") = 0
            End If
            Session("cartSemNo") = myID

        End If
        ContinueError.Text = ""
        Server.Transfer("~/Register.aspx?SID=0")

    End Sub

    Protected Sub btnAdd_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnAdd.Click
        If TitleList.SelectedIndex < 1 Then
            ErrorLabel.Text = "Please select a title!"
        ElseIf LocationList.SelectedIndex < 1 Then
            ErrorLabel.Text = "Please select a time and place!"
        ElseIf DaysList.SelectedIndex < 1 Then
            ErrorLabel.Text = "Please select the days to attend!"
        ElseIf CInt(Qty.Text) < 1 Then
            ErrorLabel.Text = "Please enter the number of attendees!"
        Else
            ErrorLabel.Text = ""
            ContinueError.Text = ""

            addToOrder(Session("regSelectedSID"), CInt(Qty.Text))

            TitleList.SelectedIndex = 0
            Session("regTitle") = ""
            Session("regSID") = 0
            Session("regSelectedSID") = 0
            Session("regPPAmount") = 0
            Qty.Text = "0"
            calcTopTotals()

            Server.Transfer("~/Register.aspx?SID=0")

        End If

    End Sub

    Protected Sub addToOrder(ByVal xSID As Integer, ByVal xQty As Integer)

        initCart()
        Dim thisRegID As Integer = Session("cartRegID")
        Dim thisSemNo As Integer = Session("cartSemNo")
        Dim thisSEQ As Integer = 0
        Dim safety As Integer = 1
        While thisRegID < 10 And safety < 3
            Session("cartRegID") = 0
            initCart()
            thisRegID = Session("cartRegID")
            safety = safety + 1
        End While

        Dim sql As String = ""

        sql = "INSERT INTO temp_Reg (reg_ID, reg_Date, sem_No, sem_SID, sem_Title, "
        sql = sql & "sem_Place, sem_FeeName, sem_FeeAmt, sem_Qty) VALUES ("
        sql = sql & thisRegID.ToString() & ", "
        sql = sql & "'" & Now().ToString & "', "
        sql = sql & thisSemNo.ToString() & ", "
        sql = sql & xSID.ToString() & ", "
        sql = sql & "'" & Session("regTitle") & "', "
        sql = sql & "'" & LocationList.SelectedItem.Text & "', "
        sql = sql & "'" & DaysList.SelectedItem.Text & "', "
        sql = sql & Session("regPPAmount").ToString() & ", "
        sql = sql & xQty.ToString() & ")"

        thisSEQ = sql_addReg(sql)

        Dim x As Integer = 0
        For x = 1 To xQty
            sql = "INSERT INTO temp_Att (reg_ID, reg_SEQ, att_No) VALUES ("
            sql = sql & thisRegID.ToString() & ", "
            sql = sql & thisSEQ.ToString() & ", "
            sql = sql & x.ToString & ")"
            sql_Exec(sql)
        Next x

    End Sub

    Protected Function isNewSchedule(ByVal xSID As Integer) As Boolean
        Dim isNew As Boolean = True
        Dim thisRegID As Integer = Session("cartRegID")
        Dim qty As Integer = 0
        Dim sql As String = ""

        sql = "SELECT COUNT(sem_SID) AS MaxID FROM temp_Reg WHERE reg_ID = " + thisRegID.ToString()
        sql = sql + " AND sem_SID = " + xSID.ToString()
        qty = getMaxID(sql)
        If qty > 0 Then
            isNew = False
        End If
        Return isNew

    End Function

    Protected Sub addToOrder_Hard(ByVal xSID As Integer, ByVal xQty As Integer)

        If isNewSchedule(xSID) Then
            initCart()
            Dim thisRegID As Integer = Session("cartRegID")
            Dim thisSemNo As Integer = Session("cartSemNo")
            Dim thisSEQ As Integer = 0
            Dim sql2 As String = ""
            Dim safety As Integer = 1
            While thisRegID < 10 And safety < 3
                Session("cartRegID") = 0
                initCart()
                thisRegID = Session("cartRegID")
                safety = safety + 1
            End While

            Dim sqlConn As New SqlConnection
            Dim sqlCommand As SqlCommand
            Dim strConnection As String
            Dim sql As String
            Dim dl As SqlDataReader

            sql = "SELECT SCHEDULES.ScheduleID AS SchID, (CourseFormats.CourseFormatName + ' - $' "
            sql = sql & "+ LTRIM(STR(ROUND(ScheduleCourseInstructors.CourseFee, 0)))) AS FeeName, ScheduleCourseInstructors.CourseFee AS FeeAmt, "
            sql = sql & "COURSES.TitlePlain AS Title, (Cities.CityName + ', ' "
            sql = sql & "+ States.StateAbbreviation + ' - ' + SCHEDULES.ScheduleDateDescription) AS Place "
            sql = sql & "FROM CourseFormats INNER JOIN "
            sql = sql & "COURSES ON CourseFormats.CourseFormatID = COURSES.CourseFormatID INNER JOIN "
            sql = sql & "ScheduleCourseInstructors ON COURSES.CourseID = ScheduleCourseInstructors.CourseID INNER JOIN "
            sql = sql & "SCHEDULES ON ScheduleCourseInstructors.ScheduleID = SCHEDULES.ScheduleID INNER JOIN "
            sql = sql & "Cities ON SCHEDULES.CityID = Cities.CityID INNER JOIN "
            sql = sql & "States ON SCHEDULES.StateID = States.StateID "
            sql = sql & "WHERE(dbo.SCHEDULES.ScheduleID = " & xSID.ToString() & ") AND ("
            sql = sql & "dbo.SCHEDULES.ScheduleDate > '" & Today().ToString() & "')"

            strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
            Try
                sqlConn = New SqlConnection(strConnection)
                sqlCommand = New SqlCommand(sql, sqlConn)
                sqlConn.Open()
                sqlCommand.Connection = sqlConn
                dl = sqlCommand.ExecuteReader()
                While dl.Read()
                    sql2 = "INSERT INTO temp_Reg (reg_ID, reg_Date, sem_No, sem_SID, sem_Title, "
                    sql2 = sql2 & "sem_Place, sem_FeeName, sem_FeeAmt, sem_Qty) VALUES ("
                    sql2 = sql2 & thisRegID.ToString() & ", "
                    sql2 = sql2 & "'" & Now().ToString & "', "
                    sql2 = sql2 & thisSemNo.ToString() & ", "
                    sql2 = sql2 & xSID.ToString() & ", "
                    sql2 = sql2 & "'" & dl("Title") & "', "
                    sql2 = sql2 & "'" & dl("Place") & "', "
                    sql2 = sql2 & "'" & dl("FeeName") & "', "
                    sql2 = sql2 & dl("FeeAmt").ToString() & ", "
                    sql2 = sql2 & xQty.ToString() & ")"
                End While

            Catch ex As Exception

            Finally
                sqlConn.Close()
            End Try

            If sql2 <> "" Then
                thisSEQ = sql_addReg(sql2)

                Dim x As Integer = 0
                For x = 1 To xQty
                    sql = "INSERT INTO temp_Att (reg_ID, reg_SEQ, att_No) VALUES ("
                    sql = sql & thisRegID.ToString() & ", "
                    sql = sql & thisSEQ.ToString() & ", "
                    sql = sql & x.ToString & ")"
                    sql_Exec(sql)
                Next x
            End If

        End If

    End Sub

    Protected Function sql_addReg(ByVal sql As String) As Integer
        Dim thisSeq As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim dl As SqlDataReader
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            sqlCommand.ExecuteNonQuery()

            sql = "SELECT MAX(reg_SEQ) AS highSeq FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
            sqlCommand.CommandText = sql
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                thisSeq = dl("highSeq")
            End While

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try
        Return thisSeq

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

    Protected Sub startCust()
        Dim sql As String
        Dim theID As Integer = 0
        Dim theTotal As Integer = 0

        If (Session("cartRegID") < 1) Then
            initCart()
        End If

        sql = "SELECT SUM(sem_Total - sem_Discount) as MaxID FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
        theTotal = getMaxID(sql)

        sql = "SELECT COUNT(reg_ID) as MaxID FROM temp_CUST WHERE reg_ID = " & Session("cartRegID").ToString()
        theID = getMaxID(sql)

        sql = ""
        If theID < 1 Then
            sql = "INSERT INTO temp_CUST (reg_ID, reg_Cost) VALUES ("
            sql = sql & Session("cartRegID").ToString() & ", " & theTotal.ToString() & ")"
            sql_Exec(sql)

            'Referrer Info to sql temp_Cust record
            If Not Session("gReferrer") Is Nothing Then
                sql = "UPDATE temp_CUST SET RefName = '" & Session("gReferrer") & "'"

                If Not Session("gKeyCode") Is Nothing Then
                    sql = sql & ", RefKey = " & Session("gKeyCode")
                End If
                If Not Session("gCompany") Is Nothing Then
                    sql = sql & ", RefCompany = '" & Session("gCompany") & "'"
                End If
                If Not Session("gFName") Is Nothing Then
                    sql = sql & ", RefFName = '" & Session("gFName") & "'"
                End If
                If Not Session("gLName") Is Nothing Then
                    sql = sql & ", RefLName = '" & Session("gLName") & "'"
                End If
                sql = sql & " WHERE reg_ID = " & Session("cartRegID").ToString()
                sql_Exec(sql)

            End If
        Else
            sql = "UPDATE temp_CUST SET reg_Cost = " & theTotal.ToString()
            sql = sql & " WHERE reg_ID = " & Session("cartRegID").ToString()
            sql_Exec(sql)
        End If

        'sql = "UPDATE temp_CUST SET CEURelated = '" & checkString(CEUQuestion.SelectedValue, 50) & "' "
        'If CEUQuestion.SelectedValue = "Yes" Then
        'sql &= ", " & "CEUEntity = '" & checkString(CEUEntity.Text, 225) & "' "
        'End If
        'sql &= "WHERE reg_ID = " & Session("cartRegID").ToString()
        'sql_Exec(sql)

        'Promo info to temp_Cust
        'sql = "UPDATE temp_CUST SET promoCode = '" & checkString(PromoCode.Text, 255) & "', "
        'sql &= "promoType = '" & PromoType.SelectedValue & "', "
        'sql &= "promoDesc = '" & checkString(PromoDesc.Text, 255) & "' "
        'sql &= "WHERE reg_ID = " & Session("cartRegID").ToString()
        'sql_Exec(sql)

        'Discount based on promo?



    End Sub

    Protected Sub initCart()
        Dim thisRegID As Integer = 1
        Dim thisSemNo As Integer = 1
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String
        Dim dl As SqlDataReader
        If Session("cartRegID") = 0 Then
            sql = "SELECT MAX(reg_ID) AS highID FROM temp_Reg"
        Else
            thisRegID = Session("cartRegID")
            sql = "SELECT MAX(sem_No) AS highSem FROM temp_Reg WHERE reg_ID = " & thisRegID.ToString()
        End If
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                If Session("cartRegID") = 0 Then
                    thisRegID = dl("highID") + 1
                Else
                    thisSemNo = dl("highSem") + 1
                End If
            End While
        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Session("cartRegID") = thisRegID
        Session("cartSemNo") = thisSemNo

    End Sub

    Protected Function get_Attendees(ByVal xSEQ As Integer) As SqlDataSource
        Dim sds As New SqlDataSource
        Dim sql As String = ""

        sds.ConnectionString = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()

        sql = "SELECT reg_SEQ, att_No, att_FName, att_LName, att_Title, att_Email, att_MName, att_Suffix "
        sql = sql & "FROM temp_Att WHERE reg_SEQ = " & xSEQ.ToString & " "
        sql = sql & "ORDER BY att_No"
        sds.SelectCommand = sql

        Return sds
    End Function

    Protected Sub btnCheckOut_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnCheckOut.Click
        SaveAttendees()
        If Session("cartRegID") > 0 Then
            'btnON_ModalPopupExtender.Show()
            startCust()

            Response.Redirect("~/Register2b.aspx")
        Else
            'btnON_ModalPopupExtender.Hide()
            ContinueError.Text = "You have no seminar registrations on your order!"
            Server.Transfer("~/Register.aspx?SID=0")
        End If

    End Sub

    Protected Sub DataList1_ItemDataBound(ByVal sender As Object, ByVal e As System.Web.UI.WebControls.DataListItemEventArgs) Handles DataList1.ItemDataBound
        Dim myLbl As Label
        myLbl = e.Item.FindControl("RegCost")
        iTotalCost = iTotalCost + CInt(myLbl.Text)
        TotalCost.Text = FormatCurrency(iTotalCost)
        semCounter = semCounter + 1

    End Sub

    Private Sub UpdateAttendeeRecord(ByVal RegID As Integer, ByVal AttendeeID As Integer, ByVal Firstname As String, ByVal Lastname As String, ByVal Title As String, ByVal Email As String, ByVal middleName As String, ByVal xSuffix As String)
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String

        sql = "UPDATE temp_Att SET att_FName = '" & checkString(Firstname, 255)
        sql = sql & "', att_LName = '" & checkString(Lastname, 255)
        sql = sql & "', att_Title = '" & checkString(Title, 255)
        sql = sql & "', att_Email = '" & checkString(Email, 255)
        sql = sql & "', att_MName = '" & checkString(middleName, 50)
        sql = sql & "', att_Suffix = '" & checkString(xSuffix, 10) & "' "
        sql = sql & "WHERE reg_SEQ = " & RegID.ToString() & " AND att_No = " & AttendeeID.ToString()

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
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

    Private Sub SaveAttendees()
        Dim sfirstName As String
        Dim slastName As String
        Dim smi As String
        Dim sSuffix As String
        Dim sTitle As String
        Dim sEmail As String
        Dim iregID As Integer
        Dim myLinkBtn As LinkButton
        Dim myTxtBox As TextBox
        Dim iAttendID As Integer
        For Each myItem As DataListItem In DataList1.Items
            Dim myRepeater As Repeater = myItem.FindControl("Repeater1")
            For Each mySubItem As RepeaterItem In myRepeater.Items
                sfirstName = ""
                slastName = ""
                smi = ""
                sSuffix = ""
                sTitle = ""
                sEmail = ""
                iregID = 0
                iAttendID = 0
                myTxtBox = mySubItem.FindControl("FName")
                sfirstName = myTxtBox.Text
                myTxtBox = mySubItem.FindControl("LName")
                slastName = myTxtBox.Text
                myTxtBox = mySubItem.FindControl("MName")
                smi = myTxtBox.Text
                myTxtBox = mySubItem.FindControl("Suffix")
                sSuffix = myTxtBox.Text
                myTxtBox = mySubItem.FindControl("Title")
                sTitle = myTxtBox.Text
                myTxtBox = mySubItem.FindControl("Email")
                sEmail = myTxtBox.Text
                myLinkBtn = mySubItem.FindControl("HyperLink1")
                iregID = CInt(myLinkBtn.Attributes.Item("SeminarID"))
                iAttendID = CInt(myLinkBtn.Attributes.Item("AttendeeID"))
                UpdateAttendeeRecord(iregID, iAttendID, sfirstName, slastName, sTitle, sEmail, smi, sSuffix)
            Next
        Next
    End Sub

    Protected Function display_SeminarCount() As Integer
        attCounter = 0
        Return semCounter
    End Function

    Protected Function display_AttendeeCount() As Integer
        attCounter = attCounter + 1
        Return attCounter
    End Function

    Protected Function getNoSems() As Integer
        Dim theNo As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String
        Dim dl As SqlDataReader
        sql = "SELECT COUNT(reg_ID) AS nbr FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                theNo = dl("nbr")
            End While

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try
        Return theNo

    End Function

    Protected Function getSemQty(ByVal xSID As Integer) As Integer
        Dim theQty As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String
        Dim dl As SqlDataReader

        sql = "SELECT sem_Qty FROM temp_Reg WHERE reg_SEQ = " & xSID.ToString()
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                theQty = dl("sem_Qty")
            End While
        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try
        Return theQty

    End Function

    Protected Sub btnBrowse_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnBrowse.Click
        SaveAttendees()
        ContinueError.Text = ""
        Response.Redirect("~/GeneralCatalog2.aspx")

    End Sub

    Protected Function getMaxID(ByVal sql As String) As Integer
        Dim maxID As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim dl As SqlDataReader
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                maxID = dl("MaxID")
            End While
        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try
        Return maxID

    End Function

    Protected Function checkString(ByVal xStr As String, ByVal xMax As Integer) As String
        Dim theText As String = Replace(xStr, "'", "")
        Dim theLen As Integer = Len(theText)
        If theLen > xMax And xMax > 0 Then
            theText = Left(theText, xMax)
        End If
        Return theText
    End Function

    Protected Sub btnAddMore_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnAddMore.Click
        SaveAttendees()
        ContinueError.Text = ""
        showHideAddDisplay("Show")
    End Sub

    Protected Sub showHideAddDisplay(ByVal whch As String)
        btnAddMore.Attributes.Remove("style")
        Dim sql As String = ""
        Dim cnt As Integer = 0
        sql = "SELECT COUNT(reg_ID) AS MaxID FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
        cnt = getMaxID(sql)

        If whch = "Show" Then
            btnAddMore.Attributes.Add("style", "visibility:hidden")
            If cnt = 0 Then
                btnCheckOut.Attributes.Add("style", "visibility:hidden")
                btnBrowse.Attributes.Add("style", "visibility:hidden")
                browseLabel.Attributes.Add("style", "visibility:hidden")
                TotalLabel.Attributes.Add("style", "visibility:hidden")
                TotalCost.Attributes.Add("style", "visibility:hidden")
            End If
            MultiView1.SetActiveView(SemSelect)
        Else
            btnAddMore.Attributes.Add("style", "visibility:visible")
            If cnt = 0 Then
                btnCheckOut.Attributes.Add("style", "visibility:visible")
                btnBrowse.Attributes.Add("style", "visibility:visible")
                browseLabel.Attributes.Add("style", "visibility:visible")
                TotalLabel.Attributes.Add("style", "visibility:visible")
                TotalCost.Attributes.Add("style", "visibility:visible")
            End If
            MultiView1.SetActiveView(SemHide)
        End If

    End Sub

    Protected Sub btnCancelAdd_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnCancelAdd.Click
        ErrorLabel.Text = ""
        ContinueError.Text = ""
        Server.Transfer("~/Register.aspx?SID=0")

    End Sub

    'Protected Sub bContCheckout_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles bContCheckout.Click
    'startCust()
    'Response.Redirect("~/Register2b.aspx")
    'End Sub

    'Protected Sub btnON_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnON.Click
    'btnON_ModalPopupExtender.Show()
    'End Sub

    'Protected Sub updateforDiscount()

    'Dim pCode As String = checkString(PromoCode.Text, 255)
    'Dim pStarts As Date = Today()
    'Dim pEnds As Date = Today()
    'Dim pPercent As Integer = 0
    'Dim pDolPerDay As Integer = 0
    'Dim pDolFlat As Integer = 0
    'Dim sqlConn As New SqlConnection
    'Dim sqlCommand As SqlCommand
    'Dim dl As SqlDataReader
    'Dim sql As String = "SELECT * FROM [Discounts] WHERE [PromoCode] = '" & pCode & "'"
    'Dim strConnection As String = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
    'Dim cont As Boolean = True
    'Dim didOne As Boolean = False

    'Is there a promo code?
    'If (Len(pCode) < 1) Then
    'cont = False
    'End If

    'If cont Then
    'Check for a discount record for the promo code??
    'Try
    'sqlConn = New SqlConnection(strConnection)
    'SqlCommand = New SqlCommand(Sql, sqlConn)
    'sqlConn.Open()
    'SqlCommand.Connection = sqlConn
    'dl = SqlCommand.ExecuteReader()
    'While dl.Read()
    'pStarts = dl("PromoStarts")
    'pEnds = dl("PromoEnds")
    'pPercent = dl("Open_Percent")
    'pDolPerDay = dl("Open_DolPerDay")
    'pDolFlat = dl("Open_DolFlat")
    'End While
    'If pStarts > Today() Then
    'cont = False
    'End If
    'If pEnds < Today() Then
    'cont = False
    'End If
    'If (pPercent + pDolPerDay + pDolFlat) < 1 Then
    'cont = False
    'End If

    'Catch ex As Exception
    'cont = False
    'Finally
    'sqlConn.Close()
    'End Try
    'End If

    'If cont Then 'Still good to go
    'Dim pid As Integer = Session("cartRegID")
    'Dim ttldiscount As Double = 0
    'Dim discount As Double = 0
    'Dim seq As Integer = 0
    'Dim feeName As String = ""
    'Dim feeAmt As Double = 0
    'Dim feeQty As Integer = 0
    'Dim feeTtl As Double = 0
    'Dim feeDisc As Double = 0

    'loop through each temp_Reg record
    'Sql = "SELECT * FROM [temp_Reg] WHERE [reg_ID] = " & pid
    'sqlConn = New SqlConnection(strConnection)
    'SqlCommand = New SqlCommand(Sql, sqlConn)
    'sqlConn.Open()
    'SqlCommand.Connection = sqlConn
    'dl = SqlCommand.ExecuteReader()
    'While dl.Read()
    'seq = dl("reg_SEQ")
    'feeName = dl("sem_FeeName")
    'feeAmt = dl("sem_FeeAmt")
    'feeQty = dl("sem_Qty")
    'feeTtl = dl("sem_Total")
    'feeDisc = dl("sem_Discount")
    'discount = 0
    'If (pDolFlat > 0) Then
    'discount = pDolFlat * feeQty
    'ElseIf pPercent > 0 Then
    'discount = feeTtl * (pPercent / 100)
    'ElseIf pDolPerDay > 0 Then
    'If (Left(feeName, 4) = "Both") Then
    'discount = (pDolPerDay * 2) * feeQty
    'ElseIf (Left(feeName, 5) = "Three") Then
    'discount = (pDolPerDay * 3) * feeQty
    'Else
    'discount = pDolPerDay * feeQty
    'End If
    'End If
    'discount = Math.Round(discount, 0)

    'If discount <> feeDisc Then
    'Sql = "UPDATE [temp_Reg] SET [sem_Discount] = "
    'Sql &= discount.ToString() & " WHERE([reg_SEQ] = " & seq.ToString() & ")"
    'sql_Exec(Sql)
    'didOne = True
    'End If

    'End While

    'If (didOne) Then
    'Sql = "SELECT SUM(sem_Total - sem_Discount) as MaxID FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
    'pid = getMaxID(Sql)
    'Sql = "UPDATE temp_CUST SET reg_Cost = " & pid.ToString()
    'Sql = Sql & " WHERE reg_ID = " & Session("cartRegID").ToString()
    'sql_Exec(Sql)
    'End If

    'End If

    'End Sub

    'Protected Sub CEUQuestion_SelectedIndexChanged(sender As Object, e As EventArgs) Handles CEUQuestion.SelectedIndexChanged
    'ceuRow.Visible = (CEUQuestion.SelectedValue = "Yes")

    'End Sub
End Class
