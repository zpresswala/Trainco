Imports System.Data
Imports System.Data.SqlClient
Imports System.IO
Imports System.Net
Imports System.text
Partial Class Register2b
    Inherits System.Web.UI.Page
    Dim ccErrorText As String = ""

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

        Dim myFunc As New ATI_GlobalFunctions
        If Session("cartRegID") Is Nothing Then
            Session.Add("cartRegID", 0)
        End If
        Dim cid As Integer = 0
        cid = Page.Request.QueryString("cartid")
        If cid < 1 Then
            cid = Page.Request.QueryString("cart")
        End If
        If cid < 1 Then
            cid = Page.Request.QueryString("cid")
        End If
        If cid < 1 Then
            cid = Session("cartRegID")
        End If
        If cid = 0 Then
            cid = -1
            Session("cartRegID") = 0
        End If
        If cid > 0 Then
            Session("cartRegID") = cid
        End If
        theID.Text = Session("cartRegID").ToString()

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

            myFunc.fillGlobals(Page.Request())

            If Session("processingCC") Is Nothing Then
                Session.Add("processingCC", 0)
            End If

            PromoTypeX.SelectedIndex = 0
            PromoDescX.Items.Clear()
            PromoDesc2Label.Text = "Promotion Code:"
            PromoDesc2X.Text = ""
            PromoDesc3.Text = ""
            PromoType.Value = ""
            PromoCode.Value = ""
            PromoDesc.Value = ""
            PastCust.Value = ""
            rTakenBy.Value = ""
            rMethod.Value = ""

            Dim p1 As String = ""
            Dim p2 As String = ""
            Dim p3 As String = ""
            Dim p4 As String = ""

            authPhone1.Attributes.Add("onkeyup", "autoTab(" + authPhone1.ClientID() + "," + authPhone2.ClientID + ")")
            authPhone2.Attributes.Add("onkeyup", "autoTab(" + authPhone2.ClientID() + "," + authPhone3.ClientID + ")")
            'authPhone3.Attributes.Add("onkeyup", "autoTab(" + authPhone3.ClientID() + ",null)")
            authFax1.Attributes.Add("onkeyup", "autoTab(" + authFax1.ClientID() + "," + authFax2.ClientID + ")")
            authFax2.Attributes.Add("onkeyup", "autoTab(" + authFax2.ClientID() + "," + authFax3.ClientID + ")")
            'authFax3.Attributes.Add("onkeyup", "autoTab(" + authFax3.ClientID() + ",null)")

            billPhone1.Attributes.Add("onkeyup", "autoTab(" + billPhone1.ClientID() + "," + billPhone2.ClientID + ")")
            billPhone2.Attributes.Add("onkeyup", "autoTab(" + billPhone2.ClientID() + "," + billPhone3.ClientID + ")")
            'billPhone3.Attributes.Add("onkeyup", "autoTab(" + billPhone3.ClientID() + ",null)")
            billFax1.Attributes.Add("onkeyup", "autoTab(" + billFax1.ClientID() + "," + billFax2.ClientID + ")")
            billFax2.Attributes.Add("onkeyup", "autoTab(" + billFax2.ClientID() + "," + billFax3.ClientID + ")")
            'billFax3.Attributes.Add("onkeyup", "autoTab(" + billFax3.ClientID() + ",null)")

            Dim regID As Integer = cid
            If regID > 0 Then
                Dim sqlConn As New SqlConnection
                Dim sqlCommand As SqlCommand
                Dim strConnection As String
                Dim sql As String
                Dim dl As SqlDataReader
                sql = "SELECT * FROM temp_Cust WHERE reg_ID = " & regID.ToString
                strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
                Try
                    sqlConn = New SqlConnection(strConnection)
                    sqlCommand = New SqlCommand(sql, sqlConn)
                    sqlConn.Open()
                    sqlCommand.Connection = sqlConn
                    dl = sqlCommand.ExecuteReader()
                    Dim obj As Object
                    While dl.Read()
                        obj = dl("PastCustomer")
                        If Not obj Is System.DBNull.Value Then
                            PastCust.Value = obj.ToString()
                        End If
                        obj = dl("promoCode")
                        If Not obj Is System.DBNull.Value Then
                            PromoCode.Value = obj.ToString()
                        End If
                        obj = dl("promoType")
                        If Not obj Is System.DBNull.Value Then
                            PromoType.Value = obj.ToString()
                        End If
                        obj = dl("promoDesc")
                        If Not obj Is System.DBNull.Value Then
                            PromoDesc.Value = obj.ToString()
                        End If
                        obj = dl("CoName")
                        If Not obj Is System.DBNull.Value Then
                            CompanyName.Text = obj.ToString()
                        End If
                        obj = dl("authFName")
                        If Not obj Is System.DBNull.Value Then
                            authFName.Text = obj.ToString()
                        End If
                        obj = dl("authLName")
                        If Not obj Is System.DBNull.Value Then
                            authLName.Text = obj.ToString()
                        End If
                        obj = dl("authTitle")
                        If Not obj Is System.DBNull.Value Then
                            authTitle.Text = obj.ToString()
                        End If
                        obj = dl("authMailCode")
                        If Not obj Is System.DBNull.Value Then
                            authMailCode.Text = obj.ToString()
                        End If
                        obj = dl("authAddr1")
                        If Not obj Is System.DBNull.Value Then
                            authAddr1.Text = obj.ToString()
                        End If
                        obj = dl("authAddr2")
                        If Not obj Is System.DBNull.Value Then
                            authAddr2.Text = obj.ToString()
                        End If
                        obj = dl("authCity")
                        If Not obj Is System.DBNull.Value Then
                            authCity.Text = obj.ToString()
                        End If
                        obj = dl("authState")
                        If Not obj Is System.DBNull.Value Then
                            authState.SelectedValue = obj.ToString()
                        End If
                        obj = dl("authZip")
                        If Not obj Is System.DBNull.Value Then
                            authZip.Text = obj.ToString()
                        End If
                        obj = dl("authCountry")
                        If Not obj Is System.DBNull.Value Then
                            authCountry.SelectedValue = obj.ToString()
                        End If
                        obj = dl("authPhone1")
                        If Not obj Is System.DBNull.Value Then
                            authPhone1.Text = obj.ToString()
                        End If
                        obj = dl("authPhone2")
                        If Not obj Is System.DBNull.Value Then
                            authPhone2.Text = obj.ToString()
                        End If
                        obj = dl("authPhone3")
                        If Not obj Is System.DBNull.Value Then
                            authPhone3.Text = obj.ToString()
                        End If
                        obj = dl("authPhoneExt")
                        If Not obj Is System.DBNull.Value Then
                            authPhoneExt.Text = obj.ToString()
                        End If
                        obj = dl("authFax1")
                        If Not obj Is System.DBNull.Value Then
                            authFax1.Text = obj.ToString()
                        End If
                        obj = dl("authFax2")
                        If Not obj Is System.DBNull.Value Then
                            authFax2.Text = obj.ToString()
                        End If
                        obj = dl("authFax3")
                        If Not obj Is System.DBNull.Value Then
                            authFax3.Text = obj.ToString()
                        End If
                        obj = dl("authEmail")
                        If Not obj Is System.DBNull.Value Then
                            authEmail.Text = obj.ToString()
                        End If

                        obj = dl("billFName")
                        If Not obj Is System.DBNull.Value Then
                            billFName.Text = obj.ToString()
                        End If
                        obj = dl("billLName")
                        If Not obj Is System.DBNull.Value Then
                            billLName.Text = obj.ToString()
                        End If
                        obj = dl("billTitle")
                        If Not obj Is System.DBNull.Value Then
                            billTitle.Text = obj.ToString()
                        End If
                        obj = dl("billMailCode")
                        If Not obj Is System.DBNull.Value Then
                            billMailCode.Text = obj.ToString()
                        End If
                        obj = dl("billAddr1")
                        If Not obj Is System.DBNull.Value Then
                            billAddr1.Text = obj.ToString()
                        End If
                        obj = dl("billAddr2")
                        If Not obj Is System.DBNull.Value Then
                            billAddr2.Text = obj.ToString()
                        End If
                        obj = dl("billCity")
                        If Not obj Is System.DBNull.Value Then
                            billCity.Text = obj.ToString()
                        End If
                        obj = dl("billState")
                        If Not obj Is System.DBNull.Value Then
                            billState.SelectedValue = obj.ToString()
                        End If
                        obj = dl("billZip")
                        If Not obj Is System.DBNull.Value Then
                            billZip.Text = obj.ToString()
                        End If
                        obj = dl("billCountry")
                        If Not obj Is System.DBNull.Value Then
                            billCountry.SelectedValue = obj.ToString()
                        End If
                        obj = dl("billPhone1")
                        If Not obj Is System.DBNull.Value Then
                            billPhone1.Text = obj.ToString()
                        End If
                        obj = dl("billPhone2")
                        If Not obj Is System.DBNull.Value Then
                            billPhone2.Text = obj.ToString()
                        End If
                        obj = dl("billPhone3")
                        If Not obj Is System.DBNull.Value Then
                            billPhone3.Text = obj.ToString()
                        End If
                        obj = dl("billPhoneExt")
                        If Not obj Is System.DBNull.Value Then
                            billPhoneExt.Text = obj.ToString()
                        End If
                        obj = dl("billFax1")
                        If Not obj Is System.DBNull.Value Then
                            billFax1.Text = obj.ToString()
                        End If
                        obj = dl("billFax2")
                        If Not obj Is System.DBNull.Value Then
                            billFax2.Text = obj.ToString()
                        End If
                        obj = dl("billFax3")
                        If Not obj Is System.DBNull.Value Then
                            billFax3.Text = obj.ToString()
                        End If
                        obj = dl("billEmail")
                        If Not obj Is System.DBNull.Value Then
                            billEmail.Text = obj.ToString()
                        End If

                        obj = dl("reg_Cost")
                        If Not obj Is System.DBNull.Value Then
                            OrderTotal.Text = FormatCurrency(obj.ToString())
                        End If
                        obj = dl("payMethod")
                        If Not obj Is System.DBNull.Value Then
                            PayMethod.SelectedValue = obj.ToString()
                        End If
                        obj = dl("ccType")
                        If Not obj Is System.DBNull.Value Then
                            ccType.SelectedValue = obj.ToString()
                        End If
                        obj = dl("ccName")
                        If Not obj Is System.DBNull.Value Then
                            ccName.Text = obj.ToString()
                        End If
                        obj = dl("ccNumber")
                        If Not obj Is System.DBNull.Value Then
                            ccNumber.Text = obj.ToString()
                        End If
                        obj = dl("ccMonth")
                        If Not obj Is System.DBNull.Value Then
                            ccMonth.SelectedValue = CInt(obj.ToString())
                        End If
                        obj = dl("ccYear")
                        If Not obj Is System.DBNull.Value Then
                            ccYear.SelectedValue = CInt(obj.ToString())
                        End If
                        obj = dl("ccCVC")
                        If Not obj Is System.DBNull.Value Then
                            ccCVC.Text = obj.ToString()
                        End If
                        obj = dl("chkNo")
                        If Not obj Is System.DBNull.Value Then
                            ChkNumber.Text = obj.ToString()
                        End If
                        obj = dl("poNo")
                        If Not obj Is System.DBNull.Value Then
                            PONumber.Text = obj.ToString()
                        End If

                        obj = dl("pDrop1")
                        If Not obj Is System.DBNull.Value Then
                            p1 = obj.ToString()
                        End If
                        obj = dl("pDrop2")
                        If Not obj Is System.DBNull.Value Then
                            p2 = obj.ToString()
                        End If
                        obj = dl("pEntry1")
                        If Not obj Is System.DBNull.Value Then
                            p3 = obj.ToString()
                        End If
                        obj = dl("pEntry2")
                        If Not obj Is System.DBNull.Value Then
                            p4 = obj.ToString()
                        End If
                        obj = dl("regTakenBy")
                        If Not obj Is System.DBNull.Value Then
                            rTakenBy.Value = obj.ToString()
                        End If
                        obj = dl("regMethod")
                        If Not obj Is System.DBNull.Value Then
                            rMethod.Value = obj.ToString()
                        End If

                    End While

                Catch ex As Exception

                Finally
                    sqlConn.Close()
                End Try
            End If

            Select Case PayMethod.SelectedValue
                Case "Credit Card"
                    MultiView1.SetActiveView(ccView)
                Case "Check"
                    MultiView1.SetActiveView(ChkView)
                Case "Purchase Order"
                    MultiView1.SetActiveView(POView)
                Case "Invoice Me"
                    MultiView1.SetActiveView(InvView)
                Case Else
                    MultiView1.SetActiveView(EmptyView)
            End Select

            Select Case PastCust.Value
                Case "Yes"
                    ddPastCustomer.SelectedIndex = 1
                Case "No"
                    ddPastCustomer.SelectedIndex = 2
                Case "Not Sure"
                    ddPastCustomer.SelectedIndex = 3
                Case Else
                    ddPastCustomer.SelectedIndex = 0
            End Select

            If Len(p1) > 2 Then
                PromoTypeX.SelectedValue = p1
                fillPromoDescX()
                PromoDescX.SelectedValue = p2
                setPromoDesc2Label()
                PromoDesc2X.Text = p3
                PromoDesc3.Text = p4
            Else
                Select Case Left(PromoType.Value, 5)
                    Case "Direc"
                        PromoTypeX.SelectedIndex = 1
                    Case "Inter"
                        PromoTypeX.SelectedIndex = 2
                    Case "Other"
                        PromoTypeX.SelectedIndex = 3
                    Case Else
                        PromoTypeX.SelectedIndex = 0
                End Select
                fillPromoDescX()
                Select Case PromoType.Value
                    Case "Direct Mail - Postcard"
                        PromoDescX.SelectedIndex = 3
                    Case "Direct Mail - Envelope"
                        PromoDescX.SelectedIndex = 2
                    Case "Direct Mail - Single Brochures in Regular Envelope"
                        PromoDescX.SelectedIndex = 1
                    Case "Direct Mail - Mini Poster in Large Envelope"
                        PromoDescX.SelectedIndex = 2
                    Case "Direct Mail - Other"
                        PromoDescX.SelectedIndex = 4
                    Case "Internet - Google"
                        PromoDescX.SelectedIndex = 1
                    Case "Internet - Yahoo"
                        PromoDescX.SelectedIndex = 2
                    Case "Internet - Bing"
                        PromoDescX.SelectedIndex = 3
                    Case "Internet - Website"
                        PromoDescX.SelectedIndex = 4
                    Case "Internet - Other"
                        PromoDescX.SelectedIndex = 5
                    Case "Other - Email"
                        PromoDescX.SelectedIndex = 1
                    Case "Other - Fax"
                        PromoDescX.SelectedIndex = 2
                    Case "Other - Magazine Ad"
                        PromoDescX.SelectedIndex = 3
                    Case "Other - Tradeshow"
                        PromoDescX.SelectedIndex = 4
                    Case "Other - Referral"
                        PromoDescX.SelectedIndex = 5
                    Case "Other - Other"
                        PromoDescX.SelectedIndex = 6
                End Select
                PromoDesc2X.Text = PromoCode.Value
                PromoDesc3.Text = PromoDesc.Value
                setPromoDesc2Label()
            End If

            'If (billFName.Text = authFName.Text) And (billLName.Text = authLName.Text) And (billAddr1.Text = authAddr1.Text) _
            'And (billPhone1.Text = authPhone1.Text) And (billEmail.Text = authEmail.Text) Then
            'cbBillSame.Checked = True

            'Else
            cbBillSame.Checked = False

            'End If

            'cbError.Text = ""
            'ErrorLabel.Text = ""

            If Not IsNothing(Page.Request.Params.Get("error")) Then
                ErrorLabel.Text = Page.Request.QueryString("error")
                If ErrorLabel.Text = "Please select 1 checkbox option!" Then
                    cbError.Text = ErrorLabel.Text
                End If
            End If
        End If
    End Sub

    Protected Sub ccMonth_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles ccMonth.Init
        If ccMonth.Items.Count = 0 Then
            ccMonth.Items.Clear()
            Dim mo(11) As Integer
            Dim cnt As Integer = 1
            Dim x As Integer
            For x = 0 To 11 Step 1
                mo(x) = cnt
                cnt = cnt + 1
            Next
            ccMonth.DataSource = mo
            ccMonth.DataBind()
        End If
    End Sub

    Protected Sub ccYear_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles ccYear.Init
        If ccYear.Items.Count = 0 Then
            ccYear.Items.Clear()
            Dim yr(14) As Integer
            Dim cnt As Integer = Year(Today())
            Dim x As Integer
            For x = 0 To 14 Step 1
                yr(x) = cnt
                cnt = cnt + 1
            Next
            ccYear.DataSource = yr
            ccYear.DataBind()
        End If

    End Sub

    Protected Sub cbAsAttendee_CheckedChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles cbAsAttendee.CheckedChanged
        If cbAsAttendee.Checked Then
            Dim regID As Integer = Session("cartRegID")
            Dim sqlConn As New SqlConnection
            Dim sqlCommand As SqlCommand
            Dim strConnection As String
            Dim sql As String
            Dim dl As SqlDataReader
            sql = "SELECT TOP 1 temp_Att.att_FName as FName, temp_Att.att_LName as LName, "
            sql = sql & "temp_Att.att_Title as Title, temp_Att.att_Email as Email "
            sql = sql & " FROM temp_Reg INNER JOIN temp_Att ON temp_Reg.reg_SEQ = "
            sql = sql & "temp_Att.reg_SEQ WHERE (temp_Reg.reg_ID = " & regID.ToString() & ") "
            sql = sql & "ORDER BY temp_Att.reg_SEQ, temp_Att.att_No"
            strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
            Try
                sqlConn = New SqlConnection(strConnection)
                sqlCommand = New SqlCommand(sql, sqlConn)
                sqlConn.Open()
                sqlCommand.Connection = sqlConn
                dl = sqlCommand.ExecuteReader()
                While dl.Read()
                    authFName.Text = dl("FName")
                    authLName.Text = dl("LName")
                    authTitle.Text = dl("Title")
                    authEmail.Text = dl("Email")
                End While

            Catch ex As Exception

            Finally
                sqlConn.Close()
            End Try
            ErrorLabel.Text = ""
            cbError.Text = ""
            'Server.Transfer("~/Register2b.aspx")

        End If
    End Sub

    Protected Sub cbBillSame_CheckedChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles cbBillSame.CheckedChanged

        If cbBillSame.Checked Then
            billFName.Text = authFName.Text
            billLName.Text = authLName.Text
            billTitle.Text = authTitle.Text
            billMailCode.Text = authMailCode.Text
            billAddr1.Text = authAddr1.Text
            billAddr2.Text = authAddr2.Text
            billCity.Text = authCity.Text
            billState.SelectedIndex = authState.SelectedIndex
            billZip.Text = authZip.Text
            billCountry.SelectedIndex = authCountry.SelectedIndex
            billPhone1.Text = authPhone1.Text
            billPhone2.Text = authPhone2.Text
            billPhone3.Text = authPhone3.Text
            billPhoneExt.Text = authPhoneExt.Text
            billFax1.Text = authFax1.Text
            billFax2.Text = authFax2.Text
            billFax3.Text = authFax3.Text
            billEmail.Text = authEmail.Text

            saveCust()

        End If
        ErrorLabel.Text = ""
        cbError.Text = ""
        'btnContinue.Enabled = (processButtonState() = 0)
        'Server.Transfer("~/Register2b.aspx")

    End Sub

    Protected Sub PayMethod_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PayMethod.SelectedIndexChanged
        Select Case PayMethod.SelectedValue
            Case "Credit Card"
                MultiView1.SetActiveView(ccView)
            Case "Check"
                MultiView1.SetActiveView(ChkView)
            Case "Purchase Order"
                MultiView1.SetActiveView(POView)
            Case "Invoice Me"
                MultiView1.SetActiveView(InvView)
            Case Else
                MultiView1.SetActiveView(EmptyView)
        End Select
        ErrorLabel.Text = ""
        cbError.Text = ""
        'btnContinue.Enabled = (processButtonState() = 0)
        'Server.Transfer("~/Register2b.aspx")

    End Sub

    Protected Sub btnBack_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnBack.Click
        ErrorLabel.Text = ""
        cbError.Text = ""
        saveCust()
        Response.Redirect("~/Register.aspx?SID=0")
    End Sub

    Protected Sub btnContinue_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnContinue.Click
        saveCust()
        ErrorLabel.Text = ""
        cbError.Text = ""
        Dim bContinue As Boolean = True
        Dim paytype As String = PayMethod.SelectedValue

        If bContinue = True And authPhone1.Text = "" Then
            bContinue = False
            ErrorLabel.Text = "Authorizing person phone number is required!"
        End If
        If bContinue = True And PayMethod.SelectedIndex < 1 Then
            bContinue = False
            ErrorLabel.Text = "A Payment Method is required!"
        End If
        Select Case paytype
            Case "Credit Card"
                If bContinue = True And ccType.SelectedIndex < 1 Then
                    bContinue = False
                    ErrorLabel.Text = "The CC Type is required!"
                End If
        End Select
        If bContinue = True Then
            bContinue = PromoTypeX.SelectedIndex > 0
            If bContinue = False Then
                cbError.Text = "Please select how you found us!"
                ErrorLabel.Text = cbError.Text
            End If
        End If
        If bContinue = True Then
            bContinue = PromoDescX.SelectedIndex > 0
            If bContinue = False Then
                cbError.Text = "Please select an option for " & PromoTypeX.SelectedValue & "!"
                ErrorLabel.Text = cbError.Text
            End If
        End If

        If bContinue = True Then
            'System.Threading.Thread.Sleep(5000)
            processOrder()
        Else
            btnContinue.Enabled = True
            Server.Transfer("~/Register2b.aspx?error=" + ErrorLabel.Text)
        End If
    End Sub

    Protected Sub saveCust()
        Dim regID As Integer = Session("cartRegID")
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim errCode As Integer = -1

        promoCleanup()

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        sqlConn = New SqlConnection(strConnection)
        sqlCommand = New SqlCommand("dbo.update_TempCust", sqlConn)
        sqlCommand.CommandType = Data.CommandType.StoredProcedure

        sqlCommand.Parameters.Add(New SqlParameter("@p1", SqlDbType.Int))
        sqlCommand.Parameters.Add(New SqlParameter("@p2", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p3", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p4", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p5", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p6", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p7", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p8", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p9", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p10", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p11", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p12", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p13", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p14", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p15", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p16", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p17", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p18", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p19", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p20", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p21", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p22", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p23", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p24", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p25", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p26", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p27", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p28", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p29", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p30", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p31", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p32", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p33", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p34", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p35", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p36", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p37", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p38", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p39", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p40", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p41", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p42", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p43", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p44", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p45", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p46", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p47", SqlDbType.Int))
        sqlCommand.Parameters.Add(New SqlParameter("@p48", SqlDbType.Int))
        sqlCommand.Parameters.Add(New SqlParameter("@p49", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p50", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p51", SqlDbType.VarChar, 5))
        sqlCommand.Parameters.Add(New SqlParameter("@p52", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p53", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p54", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p55", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p56", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p57", SqlDbType.VarChar, 255))
        sqlCommand.Parameters.Add(New SqlParameter("@p58", SqlDbType.VarChar, 255))

        sqlCommand.Parameters("@p1").Value = regID
        sqlCommand.Parameters("@p2").Value = checkString(PromoCode.Value, 255)
        sqlCommand.Parameters("@p3").Value = checkString(PromoType.Value, 255)
        sqlCommand.Parameters("@p4").Value = checkString(PromoDesc.Value, 255)
        sqlCommand.Parameters("@p5").Value = checkString(CompanyName.Text, 255)
        sqlCommand.Parameters("@p6").Value = checkString(authFName.Text, 255)
        sqlCommand.Parameters("@p7").Value = checkString(authLName.Text, 255)
        sqlCommand.Parameters("@p8").Value = checkString(authTitle.Text, 255)
        sqlCommand.Parameters("@p9").Value = checkString(authMailCode.Text, 255)
        sqlCommand.Parameters("@p10").Value = checkString(authAddr1.Text, 255)
        sqlCommand.Parameters("@p11").Value = checkString(authAddr2.Text, 255)
        sqlCommand.Parameters("@p12").Value = checkString(authCity.Text, 255)
        sqlCommand.Parameters("@p13").Value = authState.SelectedValue
        sqlCommand.Parameters("@p14").Value = checkString(authZip.Text, 20)
        sqlCommand.Parameters("@p15").Value = authCountry.SelectedValue
        sqlCommand.Parameters("@p16").Value = checkString(authPhone1.Text, 3)
        sqlCommand.Parameters("@p17").Value = checkString(authPhone2.Text, 3)
        sqlCommand.Parameters("@p18").Value = checkString(authPhone3.Text, 4)
        sqlCommand.Parameters("@p19").Value = checkString(authPhoneExt.Text, 20)
        sqlCommand.Parameters("@p20").Value = checkString(authFax1.Text, 3)
        sqlCommand.Parameters("@p21").Value = checkString(authFax2.Text, 3)
        sqlCommand.Parameters("@p22").Value = checkString(authFax3.Text, 4)
        sqlCommand.Parameters("@p23").Value = checkString(authEmail.Text, 255)
        sqlCommand.Parameters("@p24").Value = checkString(billFName.Text, 255)
        sqlCommand.Parameters("@p25").Value = checkString(billLName.Text, 255)
        sqlCommand.Parameters("@p26").Value = checkString(billTitle.Text, 255)
        sqlCommand.Parameters("@p27").Value = checkString(billMailCode.Text, 255)
        sqlCommand.Parameters("@p28").Value = checkString(billAddr1.Text, 255)
        sqlCommand.Parameters("@p29").Value = checkString(billAddr2.Text, 255)
        sqlCommand.Parameters("@p30").Value = checkString(billCity.Text, 255)
        sqlCommand.Parameters("@p31").Value = billState.SelectedValue
        sqlCommand.Parameters("@p32").Value = checkString(billZip.Text, 20)
        sqlCommand.Parameters("@p33").Value = billCountry.SelectedValue
        sqlCommand.Parameters("@p34").Value = checkString(billPhone1.Text, 3)
        sqlCommand.Parameters("@p35").Value = checkString(billPhone2.Text, 3)
        sqlCommand.Parameters("@p36").Value = checkString(billPhone3.Text, 4)
        sqlCommand.Parameters("@p37").Value = checkString(billPhoneExt.Text, 20)
        sqlCommand.Parameters("@p38").Value = checkString(billFax1.Text, 3)
        sqlCommand.Parameters("@p39").Value = checkString(billFax2.Text, 3)
        sqlCommand.Parameters("@p40").Value = checkString(billFax3.Text, 4)
        sqlCommand.Parameters("@p41").Value = checkString(billEmail.Text, 255)
        sqlCommand.Parameters("@p42").Value = ""
        If PayMethod.SelectedIndex < 1 Then
            sqlCommand.Parameters("@p43").Value = ""
        Else
            sqlCommand.Parameters("@p43").Value = PayMethod.SelectedValue
        End If
        If ccType.SelectedIndex < 1 Then
            sqlCommand.Parameters("@p44").Value = ""
        Else
            sqlCommand.Parameters("@p44").Value = ccType.SelectedValue
        End If
        sqlCommand.Parameters("@p45").Value = checkString(ccName.Text, 255)
        sqlCommand.Parameters("@p46").Value = checkString(ccNumber.Text, 20)
        sqlCommand.Parameters("@p47").Value = ccMonth.SelectedValue
        sqlCommand.Parameters("@p48").Value = ccYear.SelectedValue
        sqlCommand.Parameters("@p49").Value = checkString(ChkNumber.Text, 50)
        sqlCommand.Parameters("@p50").Value = checkString(PONumber.Text, 50)
        sqlCommand.Parameters("@p51").Value = checkString(ccCVC.Text, 4)
        sqlCommand.Parameters("@p52").Value = checkString(PromoTypeX.SelectedValue, 255)
        sqlCommand.Parameters("@p53").Value = checkString(PromoDescX.SelectedValue, 255)
        sqlCommand.Parameters("@p54").Value = checkString(PromoDesc2X.Text, 255)
        sqlCommand.Parameters("@p55").Value = checkString(PromoDesc3.Text, 255)
        sqlCommand.Parameters("@p56").Value = "Customer Web"
        sqlCommand.Parameters("@p57").Value = ""
        If ddPastCustomer.SelectedIndex > 0 Then
            sqlCommand.Parameters("@p58").Value = checkString(ddPastCustomer.SelectedValue, 255)
        Else
            sqlCommand.Parameters("@p58").Value = checkString(PastCust.Value, 255)
        End If

        Try
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            errCode = sqlCommand.ExecuteScalar()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

    End Sub

    Protected Sub authZip_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles authZip.TextChanged
        Dim theObj As Object = sender
        If Not theObj Is Nothing Then
            zipLookup(sender.Text.ToString(), 1)
        End If
        ErrorLabel.Text = ""
        cbError.Text = ""
        'Server.Transfer("~/Register2b.aspx")
    End Sub

    Protected Sub billZip_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles billZip.TextChanged
        Dim theObj As Object = sender
        If Not theObj Is Nothing Then
            zipLookup(sender.Text.ToString(), 2)
        End If
        ErrorLabel.Text = ""
        cbError.Text = ""
        'Server.Transfer("~/Register2b.aspx")
    End Sub

    Protected Sub ccType_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles ccType.SelectedIndexChanged
        ErrorLabel.Text = ""
        cbError.Text = ""
    End Sub

    Private Sub zipLookup(ByVal zip As String, ByVal whch As Integer)
        Dim xCity As String = ""
        Dim xState As String = ""
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String
        Dim dl As SqlDataReader
        sql = "SELECT CityName, StateAbbrv FROM Zipcodes WHERE Zipcode = " & zip
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                xCity = dl("CityName")
                xState = dl("StateAbbrv")
            End While

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        If xCity <> "" And xState <> "" Then
            If whch = 1 Then
                authCity.Text = xCity
                If authState.Items.Contains(authState.Items.FindByText(xState)) = True Then
                    authState.SelectedValue = xState
                End If
                If cbBillSame.Checked Then
                    billCity.Text = authCity.Text
                    If billState.Items.Contains(billState.Items.FindByText(xState)) = True Then
                        billState.SelectedValue = xState
                    End If
                End If
            Else
                billCity.Text = xCity
                If billState.Items.Contains(billState.Items.FindByText(xState)) = True Then
                    billState.SelectedValue = xState
                End If
            End If
            saveCust()

        End If

    End Sub

    Protected Function checkString(ByVal xStr As String, ByVal xMax As Integer) As String
        Dim theText As String = Replace(xStr, "'", "")
        Dim theLen As Integer = Len(theText)
        If theLen > xMax And xMax > 0 Then
            theText = Left(theText, xMax)
        End If
        Return theText
    End Function

    Protected Sub processOrder()
        Dim sql As String = ""
        Dim cartID As Integer = Session("cartRegID")
        Dim RID As Integer = 0
        Dim paytype As String = PayMethod.SelectedValue
        Dim isError As Boolean = False
        Dim errCode As Integer = 0
        Dim theDate As DateTime = DateTime.Now
        Dim dat2 As String = theDate.ToShortDateString
        Dim alreadyDone As Boolean = False


        If cartID = 0 Then
            Response.Redirect("~/Register_Error.aspx")
        Else
            If paytype = "Credit Card" Then
                'verify it's not a duplicate
                If isCardProcessed() Then
                    alreadyDone = True
                Else
                    errCode = processCC2()
                End If
                isError = (errCode <> 0)

            Else
                'verify it's not a duplicate
                If isTRCreated() Then
                    alreadyDone = True
                End If

            End If
            If isError Then

                'email about cc processing error...
                sql = "INSERT INTO temp_Errors ("
                sql = sql + "errDate, tempRegID, attFName, attLName) VALUES ("
                sql = sql + "'" + theDate.ToString() + "', "
                sql = sql + cartID.ToString() + ", "
                sql = sql + "'CC Process Error', "
                sql = sql + "'" + checkString(ccErrorText, 255) + "')"
                sql_Exec(sql)

                MultiView1.SetActiveView(EmptyView)
                Server.Transfer("~/Register2b.aspx?error=" + ccErrorText)
            Else

                If alreadyDone Then

                    Dim sqlConn As New SqlConnection
                    Dim sqlCommand As SqlCommand
                    Dim strConnection As String
                    strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
                    sqlConn = New SqlConnection(strConnection)
                    sqlCommand = New SqlCommand("dbo.getTRNumberForCartID", sqlConn)
                    sqlCommand.CommandType = Data.CommandType.StoredProcedure
                    sqlCommand.Parameters.Add(New SqlParameter("@cartID", SqlDbType.Int))
                    sqlCommand.Parameters("@cartID").Value = cartID
                    Try
                        sqlConn.Open()
                        sqlCommand.Connection = sqlConn
                        RID = sqlCommand.ExecuteScalar()

                    Catch ex As Exception

                    Finally
                        sqlConn.Close()
                    End Try
                    Response.Redirect("~/Register_Confirm.aspx?RID=" & RID.ToString())

                Else

                    RID = spAddRegistration()
                    If RID = 0 Then
                        ErrorLabel.Text = "There was an error processing your registration! "
                        ErrorLabel.Text = ErrorLabel.Text + "Please call customer service for assistance..."
                        Dim errText As String = ""
                        errText = errText + "THERE WAS AN ERROR PROCESSING A REGISTRATION<br />" + vbCr
                        errText = errText + "FROM THE WEBSITE AND BOTH A REGISTRATION RECORD AND<br />" + vbCr
                        errText = errText + "ATTENDEE RECORD(S) WERE NOT CREATED IN THE DATABASE!!<br />" + vbCr
                        errText = errText + " *** Cart ID: " + cartID.ToString() + "<br />" + vbCr
                        emailError(cartID, errText)
                        Response.Redirect("~/Register_Error.aspx")
                        'Server.Transfer("~/Register2b.aspx?error=" + ErrorLabel.Text)
                    Else
                        emailConfirmations(cartID, RID)
                        MultiView1.SetActiveView(EmptyView)
                        Response.Redirect("~/Register_Confirm.aspx?RID=" & RID.ToString())
                    End If

                End If

            End If
        End If

    End Sub

    Protected Function isCardProcessed() As Boolean
        Dim cartID As Integer = Session("cartRegID")
        Dim cnt As Integer = 0

        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sqlText As String = "SELECT COUNT(*) FROM CC_Log WHERE ProcessedFrom <> 'MartinEPA' AND ProcessedFrom <> 'Filemaker' AND Approval = 1 AND Cart_ID = " & cartID.ToString()
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        sqlConn = New SqlConnection(strConnection)
        sqlCommand = New SqlCommand(sqlText, sqlConn)

        Try
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            cnt = sqlCommand.ExecuteScalar()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Return (cnt > 0)

    End Function

    Protected Function isTRCreated() As Boolean
        Dim cnt As Integer = 0
        Dim timeCutoff As DateTime = DateAdd(DateInterval.Minute, -5, Now())
        Dim cartID As Integer = Session("cartRegID")

        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sqlText As String = "SELECT COUNT(*) FROM REGISTRATIONS WHERE (CartID = " & cartID.ToString() & ")"
        'sqlText &= " AND (RegOrderTotal = " & OrderTotal.Text & ") AND (Created > '" & timeCutoff.ToString() & "')"

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        sqlConn = New SqlConnection(strConnection)
        sqlCommand = New SqlCommand(sqlText, sqlConn)

        Try
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            cnt = sqlCommand.ExecuteScalar()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Return (cnt > 0)

    End Function


    Protected Function processCC2() As Integer
        Dim cartID As Integer = Session("cartRegID")
        Dim ErrCode As Integer = -1
        Dim sMonth As String = ccMonth.SelectedValue.ToString()
        Dim sYear As String = ccYear.SelectedValue.ToString()
        If Len(sMonth) = 1 Then
            sMonth = "0" + sMonth
        End If
        If Len(sYear) = 4 Then
            sYear = Right(sYear, 2)
        End If

        Dim theDesc As String = CompanyName.Text & "_"
        theDesc = theDesc & authPhone1.Text & "-" & authPhone2.Text & "-" & authPhone3.Text + "_"
        theDesc = theDesc & authLName.Text & "_" + authFName.Text

        Dim sPhone As String = ""
        Dim sFax As String = ""
        sPhone = "(" + billPhone1.Text + ") " + billPhone2.Text + "-" + billPhone3.Text
        sFax = "(" + billFax1.Text + ") " + billFax2.Text + "-" + billFax3.Text
        Dim curr As String = System.Configuration.ConfigurationManager.AppSettings("Currency")
        Dim ccMID As String = System.Configuration.ConfigurationManager.AppSettings("CC2MerchID")
        Dim ccUID As String = System.Configuration.ConfigurationManager.AppSettings("CC2UserID")
        Dim ccPIN As String = System.Configuration.ConfigurationManager.AppSettings("CC2PIN")
        Dim ccTest As String = System.Configuration.ConfigurationManager.AppSettings("CC2isTest")
        Dim xAmount As Integer = CInt(OrderTotal.Text)
        Dim sAmount As String = FormatNumber(xAmount, 2)
        sAmount = Replace(sAmount, ",", "")

        Dim url As String = "https://www.myvirtualmerchant.com/VirtualMerchant/process.do"
        Dim result As String = ""
        Dim pos As Integer = 0
        Dim strPost As String = "ssl_transaction_type=CCSALE"
        strPost = strPost & "&ssl_merchant_id=" & ccMID
        strPost = strPost & "&ssl_pin=" & ccPIN
        strPost = strPost & "&ssl_user_id=" & ccUID
        strPost = strPost & "&ssl_test_mode=" & ccTest

        strPost = strPost & "&ssl_amount=" & sAmount
        strPost = strPost & "&ssl_card_number=" & checkString(ccNumber.Text, 19)
        strPost = strPost & "&ssl_exp_date=" & sMonth + sYear
        strPost = strPost & "&ssl_cvv2cvc2_indicator=1"
        strPost = strPost & "&ssl_cvv2cvc2=" & checkString(ccCVC.Text, 4)
        strPost = strPost & "&ssl_description=" & checkString(theDesc, 255)

        strPost = strPost & "&ssl_invoice_number=" & cartID.ToString()
        If Len(theDesc) > 17 Then
            theDesc = Replace(theDesc, "-", "")
        End If
        strPost = strPost & "&ssl_customer_code=" & checkString(theDesc, 17)
        strPost = strPost & "&ssl_company=" & checkString(CompanyName.Text, 50)
        strPost = strPost & "&ssl_first_name=" & checkString(billFName.Text, 20)
        strPost = strPost & "&ssl_last_name=" & checkString(billLName.Text, 30)
        strPost = strPost & "&ssl_avs_address=" & checkString(billAddr1.Text, 20)
        strPost = strPost & "&ssl_city=" & checkString(billCity.Text, 30)
        strPost = strPost & "&ssl_state=" & billState.SelectedValue
        strPost = strPost & "&ssl_avs_zip=" & checkString(billZip.Text, 9)
        strPost = strPost & "&ssl_country=" & billCountry.SelectedValue
        strPost = strPost & "&ssl_phone=" & checkString(sPhone, 20)
        strPost = strPost & "&ssl_email=" & checkString(billEmail.Text, 100)

        strPost = strPost & "&ssl_show_form=FALSE"
        strPost = strPost & "&ssl_result_format=ASCII"

        Dim myWriter As StreamWriter = Nothing
        Dim objRequest As HttpWebRequest = CType(WebRequest.Create(url), HttpWebRequest)
        objRequest.Method = "POST"
        objRequest.ContentLength = strPost.Length
        objRequest.ContentType = "application/x-www-form-urlencoded"

        Try
            myWriter = New StreamWriter(objRequest.GetRequestStream())
            myWriter.Write(strPost)

        Catch ex As Exception
            Return ex.Message
        Finally
            myWriter.Close()
        End Try

        Dim objResponse As HttpWebResponse = CType(objRequest.GetResponse(), HttpWebResponse)
        Dim sr As New StreamReader(objResponse.GetResponseStream())
        Dim arrResponse(20) As String
        Dim cnt As Integer = 1

        While cnt < 21
            arrResponse(cnt) = sr.ReadLine & vbCr
            cnt += 1
        End While
        sr.Close()

        '1 Card #
        '2 exp date
        '3 Amount
        '4 ssl description
        '5 ssl result
        '   0 = approved

        cnt = 1
        While cnt < 21
            If InStr(arrResponse(cnt), "ssl_result=") > 0 Then
                pos = InStr(arrResponse(cnt), "=")
                ErrCode = Val(arrResponse(cnt).Substring(pos, 1))
            End If
            If InStr(arrResponse(cnt), "ssl_result_message=") > 0 Then
                pos = InStr(arrResponse(cnt), "=")
                ccErrorText = arrResponse(cnt).Substring(pos)
            End If
            If InStr(arrResponse(cnt), "=") > 0 Then
                result = result & arrResponse(cnt)
            End If

            If InStr(arrResponse(cnt), "errorCode=") > 0 Then
                pos = InStr(arrResponse(cnt), "=")
                ErrCode = Val(arrResponse(cnt).Substring(pos, 4))
            End If
            If InStr(arrResponse(cnt), "errorMessage=") > 0 Then
                pos = InStr(arrResponse(cnt), "=")
                ccErrorText = arrResponse(cnt).Substring(pos)
                cnt = 20
            End If

            cnt += 1
        End While

        If ErrCode = 0 Then
            ccErrorText = ""
        End If

        addCCTrans(result)

        Return ErrCode
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

    Protected Function getStateID(ByVal abbrv As String) As Integer
        Dim ID As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String
        Dim dl As SqlDataReader

        sql = "SELECT StateID FROM States WHERE StateAbbreviation = '" + abbrv + "'"
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                ID = dl("StateID")
            End While

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        Return ID
    End Function

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

    Protected Sub emailError(ByVal cartID As Integer, ByVal errText As String)
        Dim sB As New StringBuilder

        Dim ltChar As String = "&lt;"
        Dim rtChar As String = "&gt;"
        Dim dblQ As String = Chr(34)
        Dim strFrom As String = System.Configuration.ConfigurationManager.AppSettings("EmailFrom")
        Dim strTo As String = System.Configuration.ConfigurationManager.AppSettings("RegistrationsEmail")
        Dim strSubject As String = "ERROR ENTERING REGISTRATION"

        Dim ordDtl As String = readFile("Templates\ConfirmDtlTemplate.txt")
        Dim theDate As DateTime = DateTime.Now

        Dim dat As String = DateTime.Now.Date.ToString("MMM dd, yyyy")
        Dim dat2 As String = theDate.ToShortDateString

        sB.Append(readFile("Templates\OrderError.txt"))
        sB.Replace("ERRORTEXT", errText)
        sB.Replace(ltChar + "DATE" + rtChar, dat)
        sB.Replace(ltChar + "ORDERNO" + rtChar, cartID.ToString())

        Dim theText As String = ""
        theText = fillAuthText()
        sB.Replace(ltChar + "AUTHINFO" + rtChar, theText)
        theText = fillBillText()
        sB.Replace(ltChar + "BILLINFO" + rtChar, theText)

        theText = "Payment Method: " + PayMethod.SelectedValue + "<br />" + vbCr
        Select Case PayMethod.SelectedValue
            Case "Credit Card"
                theText = theText & "CC Type: " & ccType.Text & "<br />" & vbCr
                If Len(ccNumber.Text) = 15 Then
                    theText = theText + "CC Number: ****-******-*" + Right(ccNumber.Text, 4) + "<br />" + vbCr
                Else
                    theText = theText + "CC Number: ****-****-****-" + Right(ccNumber.Text, 4) + "<br />" + vbCr
                End If
                theText = theText + "Expiration: " + "**/****" + "<br />" + vbCr
            Case "Check"
                theText = theText + "Check Number: " + ChkNumber.Text + "<br />" + vbCr

            Case Else
                theText = theText + "PO Number: " + PONumber.Text + "<br />" + vbCr
        End Select
        sB.Replace(ltChar + "PAYMENTINFO" + rtChar, theText)

        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader

        Dim ordSum As String = "<Table cellpadding=" & dblQ & "0" & dblQ & " cellspacing=" & dblQ & "0" & dblQ & ">"
        Dim thisDtl As String = ""
        Dim thisAttDtl As String = ""
        Dim lastSID As Integer = 0
        Dim ordTotal As Integer = 0
        Dim semDescLine As String = ""
        Dim objEmail As New MailMessage()
        Dim smtp As New SmtpClient

        sql = "SELECT temp_Reg.sem_SID as SID, temp_Reg.sem_Title as Title, "
        sql = sql & "temp_Reg.sem_Place as Place, temp_Reg.sem_FeeName as Days, temp_Att.att_FName as FName, "
        sql = sql & "temp_Att.att_LName as LName, temp_Att.att_Title as aTitle, "
        sql = sql & "temp_Att.att_Email as Email, temp_Reg.sem_FeeAmt as Fee "
        sql = sql & "FROM temp_Reg RIGHT OUTER JOIN "
        sql = sql & "temp_Att ON temp_Reg.reg_SEQ = temp_Att.reg_SEQ "
        sql = sql & "WHERE (temp_Reg.reg_ID = " & cartID.ToString() & ") "
        sql = sql & "ORDER BY temp_Reg.reg_SEQ"
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                If dl("SID") <> lastSID Then
                    If lastSID > 0 Then
                        ordSum = ordSum & "<tr><td colspan=" & dblQ & "3" & dblQ & "><br />"
                    Else
                        ordSum = ordSum & "<tr><td colspan=" & dblQ & "3" & dblQ & ">"
                    End If
                    lastSID = dl("SID")
                    semDescLine = lastSID.ToString() & ": " & dl("Title")
                    semDescLine = semDescLine & " - " & dl("Place") & "  " & dl("Days")
                    ordSum = ordSum & semDescLine & "</td></tr>" & vbCr

                    thisAttDtl = ordDtl
                    thisAttDtl = Replace(thisAttDtl, ltChar + "TIME" + rtChar, fillCourseTimes(lastSID))
                    thisAttDtl = Replace(thisAttDtl, ltChar + "LOCATION" + rtChar, fillCourseLoc(lastSID))
                    thisDtl = thisDtl + Replace(thisAttDtl, ltChar + "SEMINAR" + rtChar, lastSID.ToString() & ": " & dl("Title"))
                    thisAttDtl = Replace(thisAttDtl, ltChar + "SEMINAR" + rtChar, semDescLine)

                End If
                ordSum = ordSum & "<tr><td style=" & dblQ & "width: 50px;" & dblQ & "></td>" & vbCr
                ordSum = ordSum & "<td>" & dl("FName") & " " & dl("LName") & "</td>" & vbCr
                ordSum = ordSum & "<td align=" & dblQ & "right" & dblQ & ">"
                ordSum = ordSum & FormatCurrency(dl("Fee")) & "</td></tr>" & vbCr
                ordTotal = ordTotal + dl("Fee")

            End While

        Catch ex As Exception
        Finally
            sqlConn.Close()
        End Try
        ordSum = ordSum & "</table>" & vbCr
        sB.Replace(ltChar + "ORDERSUMMARY" + rtChar, ordSum)
        sB.Replace(ltChar + "DETAILINFO" + rtChar, thisDtl)
        'strTo = ""
        If strTo <> "" Then
            Try
                objEmail = New MailMessage(strFrom, strTo)
                objEmail.Subject = strSubject
                objEmail.Body = sB.ToString()
                objEmail.IsBodyHtml = True
                smtp = New SmtpClient
                smtp.Send(objEmail)
            Catch smtpEx As SmtpException
                'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a problem in sending the email: {0}');", smtpEx.Message.Replace("'", "\'")), True)
            Catch generalEx As Exception
                'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a general problem: {0}');", generalEx.Message.Replace("'", "\'")), True)
            End Try
        End If
        strTo = "bobz@americantrainco.com"
        Try
            objEmail = New MailMessage(strFrom, strTo)
            objEmail.Subject = strSubject
            objEmail.Body = sB.ToString()
            objEmail.IsBodyHtml = True
            smtp = New SmtpClient
            smtp.Send(objEmail)
        Catch smtpEx As SmtpException
            'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a problem in sending the email: {0}');", smtpEx.Message.Replace("'", "\'")), True)
        Catch generalEx As Exception
            'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a general problem: {0}');", generalEx.Message.Replace("'", "\'")), True)
        End Try

    End Sub

    Protected Sub emailConfirmations(ByVal cartID As Integer, ByVal RID As Integer)
        Dim sB As New StringBuilder
        Dim sB1 As New StringBuilder
        Dim doMsg As Integer = 0
        Dim ltChar As String = "&lt;"
        Dim rtChar As String = "&gt;"
        Dim dblQ As String = Chr(34)
        Dim strFrom As String = System.Configuration.ConfigurationManager.AppSettings("EmailFrom")
        Dim strTo As String = System.Configuration.ConfigurationManager.AppSettings("RegistrationsEmail")
        Dim strToAlt As String = System.Configuration.ConfigurationManager.AppSettings("RegistrationsEmailAlt")
        Dim strToATI As String = strTo
        Dim strSubject As String = System.Configuration.ConfigurationManager.AppSettings("RegConfirmSubject")
        Dim strAttSubject As String = System.Configuration.ConfigurationManager.AppSettings("AttendConfirmSubject")
        Dim theList As String = strTo
        If authEmail.Text <> "" Then
            theList = theList & "|" & authEmail.Text
        End If
        If billEmail.Text <> "" And billEmail.Text <> authEmail.Text Then
            theList = theList & "|" & billEmail.Text
        End If

        Dim arrConf1To() As String
        arrConf1To = Split(theList, "|", -1)

        sB.Append(readFile("Templates\OrderConfirm.txt"))
        sB1.Append(readFile("Templates\OrderConfirmATI.txt"))
        Dim ordDtl As String = readFile("Templates\ConfirmDtlTemplate.txt")
        Dim attConf As String = readFile("Templates\AttendeeConfirm.txt")
        Dim theDate As DateTime = DateTime.Now
        Dim dat As String = DateTime.Now.Date.ToString("MMM dd, yyyy")
        Dim dat2 As String = theDate.ToShortDateString

        sB.Replace(ltChar + "DATE" + rtChar, dat)
        sB.Replace(ltChar + "ORDERNO" + rtChar, RID.ToString())
        sB1.Replace(ltChar + "DATE" + rtChar, dat)
        sB1.Replace(ltChar + "ORDERNO" + rtChar, RID.ToString())

        Dim theText As String = ""
        theText = fillAuthText()
        sB.Replace(ltChar + "AUTHINFO" + rtChar, theText)
        sB1.Replace(ltChar + "AUTHINFO" + rtChar, theText)
        theText = fillBillText()
        sB.Replace(ltChar + "BILLINFO" + rtChar, theText)
        sB1.Replace(ltChar + "BILLINFO" + rtChar, theText)

        theText = "Payment Method: " + PayMethod.SelectedValue + "<br />" + vbCr
        Select Case PayMethod.SelectedValue
            Case "Credit Card"
                theText = theText & "CC Type: " & ccType.Text & "<br />" & vbCr
                If Len(ccNumber.Text) = 15 Then
                    theText = theText + "CC Number: ****-******-*" + Right(ccNumber.Text, 4) + "<br />" + vbCr
                Else
                    theText = theText + "CC Number: ****-****-****-" + Right(ccNumber.Text, 4) + "<br />" + vbCr
                End If
                theText = theText + "Expiration: " + "**/****" + "<br />" + vbCr
            Case "Check"
                theText = theText + "Check Number: " + ChkNumber.Text + "<br />" + vbCr

            Case Else
                theText = theText + "PO Number: " + PONumber.Text + "<br />" + vbCr
        End Select
        sB.Replace(ltChar + "PAYMENTINFO" + rtChar, theText)
        sB1.Replace(ltChar + "PAYMENTINFO" + rtChar, theText)

        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader

        Dim ordSum As String = "<Table cellpadding=" & dblQ & "0" & dblQ & " cellspacing=" & dblQ & "0" & dblQ & ">"
        Dim thisDtl As String = ""
        Dim thisAttConf As String = ""
        Dim thisAttDtl As String = ""
        Dim lastSID As Integer = 0
        Dim ordTotal As Integer = 0

        Dim moneyDiscount As Decimal = 0

        Dim semDescLine As String = ""
        Dim objEmail As New MailMessage()
        Dim smtp As New SmtpClient
        Dim isWebinar As Boolean = False

        sql = "SELECT temp_Reg.sem_SID as SID, temp_Reg.sem_Title as Title, "
        sql = sql & "temp_Reg.sem_Place as Place, temp_Reg.sem_FeeName as Days, temp_Att.att_FName as FName, "
        sql = sql & "temp_Att.att_LName as LName, temp_Att.att_Title as aTitle, "
        sql = sql & "temp_Att.att_Email as Email, temp_Reg.sem_FeeAmt as Fee, temp_Reg.sem_Total as FeeTotal, "
        sql = sql & "temp_Reg.sem_Discount as Discount, temp_Att.att_Discount as attDiscount "
        sql = sql & "FROM temp_Reg RIGHT OUTER JOIN "
        sql = sql & "temp_Att ON temp_Reg.reg_SEQ = temp_Att.reg_SEQ "
        sql = sql & "WHERE (temp_Reg.reg_ID = " & cartID.ToString() & ") "
        sql = sql & "ORDER BY temp_Reg.reg_SEQ"
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                isWebinar = (InStr(dl("Place"), "WEBINAR") > 0)
                If dl("SID") <> lastSID Then
                    If lastSID > 0 Then
                        ordSum = ordSum & "<tr><td colspan=" & dblQ & "3" & dblQ & "><br />"
                    Else
                        ordSum = ordSum & "<tr><td colspan=" & dblQ & "3" & dblQ & ">"
                    End If
                    lastSID = dl("SID")
                    semDescLine = lastSID.ToString() & ": " & dl("Title")
                    semDescLine = semDescLine & " - " & dl("Place") & "  " & dl("Days")
                    ordSum = ordSum & semDescLine & "</td></tr>" & vbCr

                    thisAttDtl = ordDtl
                    thisAttDtl = Replace(thisAttDtl, ltChar + "TIME" + rtChar, fillCourseTimes(lastSID))
                    If isWebinar Then
                        thisAttDtl = Replace(thisAttDtl, ltChar + "LOCATION" + rtChar, fillCourseLoc(lastSID))
                    Else
                        thisAttDtl = Replace(thisAttDtl, ltChar + "LOCATION" + rtChar, fillCourseLoc(lastSID))
                    End If
                    thisDtl = thisDtl + Replace(thisAttDtl, ltChar + "SEMINAR" + rtChar, lastSID.ToString() & ": " & dl("Title"))
                    thisAttDtl = Replace(thisAttDtl, ltChar + "SEMINAR" + rtChar, semDescLine)

                    If doMsg = 0 Then
                        doMsg = isCourseCanceling(lastSID)
                    End If
                End If
                ordSum = ordSum & "<tr><td style=" & dblQ & "width: 50px;" & dblQ & "></td>" & vbCr
                ordSum = ordSum & "<td>" & dl("FName") & " " & dl("LName") & "</td>" & vbCr
                ordSum = ordSum & "<td align=" & dblQ & "right" & dblQ & ">"
                ordSum = ordSum & FormatCurrency(dl("Fee")) & "</td></tr>" & vbCr
                ordTotal = ordTotal + dl("Fee")

                If dl("attDiscount") > 0 Then
                    ordSum = ordSum & "<tr><td style=" & dblQ & "width: 50px;" & dblQ & "></td>" & vbCr
                    ordSum = ordSum & "<td>&nbsp;</td>" & vbCr
                    ordSum = ordSum & "<td align=" & dblQ & "right" & dblQ & ">("
                    ordSum = ordSum & FormatCurrency(dl("attDiscount")) & ")</td></tr>" & vbCr
                End If

                thisAttConf = attConf
                thisAttConf = Replace(thisAttConf, ltChar + "DATE" + rtChar, dat2)
                thisAttConf = Replace(thisAttConf, ltChar + "TRANSNO" + rtChar, RID.ToString())
                thisAttConf = Replace(thisAttConf, ltChar + "NAME" + rtChar, dl("FName") & " " & dl("LName"))
                thisAttConf = Replace(thisAttConf, ltChar + "TITLE" + rtChar, dl("aTitle"))
                thisAttConf = Replace(thisAttConf, ltChar + "COMPANY" + rtChar, CompanyName.Text)
                thisAttConf = Replace(thisAttConf, ltChar + "DETAILINFO" + rtChar, thisAttDtl)

                If dl("Email") <> "" Then
                    strTo = dl("Email")
                Else
                    If authEmail.Text <> "" Then
                        strTo = authEmail.Text
                    Else
                        strTo = billEmail.Text
                    End If
                End If
                If strTo <> "" Then
                    Try
                        objEmail = New MailMessage(strFrom, strTo)
                        objEmail.Subject = strAttSubject
                        objEmail.Body = thisAttConf
                        objEmail.IsBodyHtml = True
                        smtp = New SmtpClient
                        smtp.Send(objEmail)

                    Catch smtpEx As SmtpException
                        'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a problem in sending the email: {0}');", smtpEx.Message.Replace("'", "\'")), True)
                    Catch generalEx As Exception
                        'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a general problem: {0}');", generalEx.Message.Replace("'", "\'")), True)
                    End Try
                End If

            End While

        Catch ex As Exception
        Finally
            sqlConn.Close()
        End Try
        ordSum = ordSum & "<tr><td style=" & dblQ & "width: 50px;" & dblQ & "></td>" & vbCr
        ordSum = ordSum & "<td>" & "** ORDER TOTAL **" & "</td>" & vbCr
        ordSum = ordSum & "<td align=" & dblQ & "right" & dblQ & ">"
        ordSum = ordSum & FormatCurrency(ordTotal) & "</td></tr>" & vbCr
        ordSum = ordSum & "</table>" & vbCr

        sB.Replace(ltChar + "ORDERSUMMARY" + rtChar, ordSum)
        sB.Replace(ltChar + "DETAILINFO" + rtChar, thisDtl)
        sB1.Replace(ltChar + "ORDERSUMMARY" + rtChar, ordSum)
        sB1.Replace(ltChar + "DETAILINFO" + rtChar, thisDtl)

        If doMsg > 0 Then
            theText = "<div style=" & dblQ & "font-weight: bold; color: #800000; "
            theText = theText & "font-style: italic; text-align: center;" & dblQ & ">"
            theText = theText & "** CLASS IS PENDING CANCELLATION **</div>"
            sB1.Replace(ltChar + "XXMSG" + rtChar, theText)
            theText = "** PENDING CANCELLATION **   "
        Else
            theText = ""
            sB1.Replace(ltChar + "XXMSG" + rtChar, theText)
        End If

        Dim arValue As String
        For Each arValue In arrConf1To
            If arValue <> "" And Left(arValue, 13) <> "Registrations" And arValue <> strToATI Then
                Try
                    objEmail = New MailMessage(strFrom, arValue)
                    If arValue = strToATI Then
                        objEmail.Subject = theText & strSubject
                        objEmail.Body = sB1.ToString()
                    Else
                        objEmail.Subject = strSubject
                        objEmail.Body = sB.ToString()
                    End If
                    objEmail.IsBodyHtml = True
                    smtp = New SmtpClient
                    smtp.Send(objEmail)
                Catch smtpEx As SmtpException
                    'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a problem in sending the email: {0}');", smtpEx.Message.Replace("'", "\'")), True)
                Catch generalEx As Exception
                    'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a general problem: {0}');", generalEx.Message.Replace("'", "\'")), True)
                End Try
            End If
        Next

        If doMsg > 0 Then
            Try
                objEmail = New MailMessage(strFrom, strToAlt)
                objEmail.Subject = theText & strSubject
                objEmail.Body = sB1.ToString()
                objEmail.IsBodyHtml = True
                smtp = New SmtpClient
                smtp.Send(objEmail)
            Catch smtpEx As SmtpException
                'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a problem in sending the email: {0}');", smtpEx.Message.Replace("'", "\'")), True)
            Catch generalEx As Exception
                'ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a general problem: {0}');", generalEx.Message.Replace("'", "\'")), True)
            End Try
        End If

    End Sub

    Protected Function fillAuthText() As String
        Dim theText As String = ""
        theText = theText + authFName.Text + " " + authLName.Text + "<br />" + vbCr
        If authTitle.Text <> "" Then
            theText = theText + authTitle.Text + "<br />" + vbCr
        End If
        If CompanyName.Text <> "" Then
            theText = theText + CompanyName.Text + "<br />" + vbCr
        End If
        If authMailCode.Text <> "" Then
            theText = theText + "Mail Code: " + authMailCode.Text + "<br />" + vbCr
        End If
        theText = theText + authAddr1.Text + "<br />" + vbCr
        If authAddr2.Text <> "" Then
            theText = theText + authAddr2.Text + "<br />" + vbCr
        End If
        theText = theText + authCity.Text + ", " + authState.SelectedValue + "  " + authZip.Text + "<br />" + vbCr
        theText = theText + authCountry.SelectedValue + "<br />" + vbCr
        theText = theText + "Phone: (" + authPhone1.Text + ") " + authPhone2.Text + "-" + authPhone3.Text
        If authPhoneExt.Text <> "" Then
            theText = theText + "  Ext: " + authPhoneExt.Text
        End If
        theText = theText + "<br />" + vbCr
        If authFax1.Text <> "" Then
            theText = theText + "  Fax: (" + authFax1.Text + ") " + authFax2.Text + "-" + authFax3.Text + "<br />" + vbCr
        End If
        theText = theText + "Email: " + authEmail.Text
        Return theText

    End Function

    Protected Function fillBillText() As String
        Dim theText As String = ""
        theText = theText + billFName.Text + " " + billLName.Text + "<br />" + vbCr
        If billTitle.Text <> "" Then
            theText = theText + billTitle.Text + "<br />" + vbCr
        End If
        If CompanyName.Text <> "" Then
            theText = theText + CompanyName.Text + "<br />" + vbCr
        End If
        If billMailCode.Text <> "" Then
            theText = theText + "Mail Code: " + billMailCode.Text + "<br />" + vbCr
        End If
        theText = theText + billAddr1.Text + "<br />" + vbCr
        If billAddr2.Text <> "" Then
            theText = theText + billAddr2.Text + "<br />" + vbCr
        End If
        theText = theText + billCity.Text + ", " + billState.SelectedValue + "  " + billZip.Text + "<br />" + vbCr
        theText = theText + billCountry.SelectedValue + "<br />" + vbCr
        theText = theText + "Phone: (" + billPhone1.Text + ") " + billPhone2.Text + "-" + billPhone3.Text
        If billPhoneExt.Text <> "" Then
            theText = theText + "  Ext: " + billPhoneExt.Text
        End If
        theText = theText + "<br />" + vbCr
        If billFax1.Text <> "" Then
            theText = theText + "  Fax: (" + billFax1.Text + ") " + billFax2.Text + "-" + billFax3.Text + "<br />" + vbCr
        End If
        theText = theText + "Email: " + billEmail.Text

        Return theText

    End Function

    Private Function isCourseCanceling(ByVal SID As Integer) As Integer
        Dim theStat As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader
        sql = "SELECT SCHEDULES.ScheduleStatus as stat FROM SCHEDULES "
        sql = sql & "WHERE (SCHEDULES.ScheduleID = " & SID.ToString() & ")"
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                theStat = dl("stat")
            End While
        Catch ex As Exception
            theStat = 0
        Finally
            sqlConn.Close()
        End Try
        If theStat > 5 Then
            theStat = 0
        End If
        If theStat = 1 Then
            theStat = 0
        End If
        Return theStat

    End Function

    Private Function fillCourseTimes(ByVal SID As Integer) As String
        Dim theText As String = ""
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader
        sql = "SELECT COURSES.CourseTimes as Times FROM COURSES INNER JOIN "
        sql = sql & "ScheduleCourseInstructors ON COURSES.CourseID = ScheduleCourseInstructors.CourseID "
        sql = sql & "WHERE (ScheduleCourseInstructors.ScheduleID = " & SID.ToString() & ")"
        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                theText = dl("Times")
            End While
        Catch ex As Exception
        Finally
            sqlConn.Close()
        End Try
        theText = Replace(theText, vbCr, "<br />")
        Return theText

    End Function

    Private Function fillCourseLoc(ByVal SID As Integer) As String
        Dim theText As String = "Seminar location has not been finalized at this time." & "<br />" & vbCr
        theText = theText & "A new confirmation letter will be sent to you once the" & "<br />" & vbCr
        theText = theText & "location has been finalized."
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""
        Dim dl As SqlDataReader

        sql = "SELECT dbo.fixOtherInfo(Locations.LocationNotes) as Loc FROM Locations "
        sql = sql & "RIGHT OUTER JOIN SCHEDULES ON Locations.LocationID = SCHEDULES.LocationID "
        sql = sql & "WHERE (SCHEDULES.ScheduleID = " & SID.ToString() & ")"

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                theText = dl("Loc")
            End While
        Catch ex As Exception
        Finally
            sqlConn.Close()
        End Try
        Return theText

    End Function

    Private Function readFile(ByVal theName As String) As String
        Dim bodyText As String = ""
        Dim path As String = Request.PhysicalApplicationPath() + theName
        Dim objReader As StreamReader
        Try
            objReader = New StreamReader(path)
            bodyText = objReader.ReadToEnd()
            objReader.Close()
        Catch ex As Exception
        End Try
        Return bodyText
    End Function

    Protected Sub ccNumber_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles ccNumber.TextChanged
        ccNumber.Text = Replace(ccNumber.Text, " ", "")
        ccNumber.Text = Replace(ccNumber.Text, "-", "")
    End Sub

    Private Function spAddRegistration() As Integer
        Dim regID As Integer = Session("cartRegID")
        Dim newRegID As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim sql As String = ""

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        sqlConn = New SqlConnection(strConnection)
        sqlCommand = New SqlCommand("dbo.add_Registration", sqlConn)
        sqlCommand.CommandType = Data.CommandType.StoredProcedure
        sqlCommand.Parameters.Add(New SqlParameter("@cartID", SqlDbType.Int))
        sqlCommand.Parameters("@cartID").Value = regID
        Try
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            newRegID = sqlCommand.ExecuteScalar()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

        If newRegID > 0 And (Len(Session("gReferrer")) > 1 Or Session("gKeyCode") > 0) Then
            sql = "INSERT INTO RegistrationReferrals "
            sql &= "(RegID, Referrer, RefCode, Company, FirstName, LastName, EntryPage, Website)"
            sql &= " VALUES ("
            sql &= newRegID.ToString() & ",'"
            sql &= Session("gReferrer") & "',"
            sql &= Session("gKeyCode").ToString() & ",'"
            If Len(Session("gCompany")) > 2 Then
                sql &= Session("gCompany") & "','"
            Else
                sql &= checkString(CompanyName.Text, 255) & "','"
            End If
            If Len(Session("gLastName")) > 2 Then
                sql &= Session("gFirstName") & "','"
                sql &= Session("gLastName") & "','"
            Else
                sql &= checkString(authFName.Text, 255) & "','"
                sql &= checkString(authLName.Text, 255) & "','"
            End If
            sql &= Session("gEntryPg") & "',"
            sql &= "'ATI')"
            sql_Exec(sql)
        End If

            Return newRegID

    End Function

    Protected Sub addCCTrans(ByVal result As String)
        Dim regID As Integer = Session("cartRegID")
        Dim xAmount As Integer = CInt(OrderTotal.Text)
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        Dim errCode As Integer = -1

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        sqlConn = New SqlConnection(strConnection)
        sqlCommand = New SqlCommand("dbo.add_CC_Log", sqlConn)
        sqlCommand.CommandType = Data.CommandType.StoredProcedure

        sqlCommand.Parameters.Add(New SqlParameter("@p1", SqlDbType.Int))
        sqlCommand.Parameters.Add(New SqlParameter("@p2", SqlDbType.Int))
        sqlCommand.Parameters.Add(New SqlParameter("@p3", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p4", SqlDbType.VarChar, 50))
        sqlCommand.Parameters.Add(New SqlParameter("@p5", SqlDbType.Money))
        sqlCommand.Parameters.Add(New SqlParameter("@p6", SqlDbType.VarChar, 500))
        sqlCommand.Parameters.Add(New SqlParameter("@p7", SqlDbType.VarChar, 50))

        sqlCommand.Parameters("@p1").Value = regID
        sqlCommand.Parameters("@p2").Value = 0
        sqlCommand.Parameters("@p3").Value = ccType.SelectedValue
        sqlCommand.Parameters("@p4").Value = Right(ccNumber.Text, 4)
        sqlCommand.Parameters("@p5").Value = xAmount
        sqlCommand.Parameters("@p6").Value = checkString(result, 500)
        sqlCommand.Parameters("@p7").Value = "ATI"

        Try
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            errCode = sqlCommand.ExecuteScalar()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

    End Sub


    Protected Sub promoCleanup()

        PromoType.Value = Trim(PromoTypeX.SelectedValue) & " - " & Trim(PromoDescX.SelectedValue)

        Select Case PromoType.Value

            Case "Direct Mail - Postcard"
                PromoCode.Value = Trim(PromoDesc2X.Text)
                PromoDesc.Value = Trim(PromoDesc3.Text)
                If PromoCode.Value = "" Then
                    PromoCode.Value = "Z02 0000 0"
                End If

            Case "Direct Mail - Envelope"
                PromoCode.Value = Trim(PromoDesc2X.Text)
                PromoDesc.Value = Trim(PromoDesc3.Text)
                If PromoCode.Value = "" Then
                    PromoCode.Value = "Z01 0000 0"
                End If

            Case "Direct Mail - Other"
                PromoCode.Value = "Z03 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Direct Mail - Single Brochures in Regular Envelope"
                PromoCode.Value = Trim(PromoDesc2X.Text)
                PromoDesc.Value = Trim(PromoDesc3.Text)
                If PromoCode.Value = "" Then
                    PromoCode.Value = "Z01 0000 0"
                End If

            Case "Direct Mail - Mini Poster in Large Envelope"
                PromoCode.Value = Trim(PromoDesc2X.Text)
                PromoDesc.Value = Trim(PromoDesc3.Text)
                If PromoCode.Value = "" Then
                    PromoCode.Value = "Z04 0000 0"
                End If


            Case "Internet - Google"
                PromoCode.Value = "Z08 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Yahoo"
                PromoCode.Value = "Z09 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Bing"
                PromoCode.Value = "Z10 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Some Other Site"
                PromoCode.Value = "Y99 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Other"
                PromoCode.Value = "Y99 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Email"
                PromoCode.Value = Trim(PromoDesc2X.Text)
                PromoDesc.Value = Trim(PromoDesc3.Text)
                If PromoCode.Value = "" Then
                    PromoCode.Value = "Y25 0000 0"
                End If

            Case "Other - Fax"
                PromoCode.Value = Trim(PromoDesc2X.Text)
                PromoDesc.Value = Trim(PromoDesc3.Text)
                If PromoCode.Value = "" Then
                    PromoCode.Value = "J24 0000 0"
                End If

            Case "Other - Magazine Ad"
                PromoCode.Value = "Y98 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Tradeshow"
                PromoCode.Value = "Y30 0000 0"
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Referral"
                PromoCode.Value = ""
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Other"
                PromoCode.Value = ""
                PromoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

        End Select

    End Sub


    Protected Sub updateforDiscount()

        Dim pCode As String = PromoCode.Value
        Dim pStarts As Date = Today()
        Dim pEnds As Date = Today()
        Dim pPercent As Integer = 0
        Dim pDolPerDay As Integer = 0
        Dim pDolFlat As Integer = 0
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim dl As SqlDataReader
        Dim sql As String = "SELECT * FROM [Discounts] WHERE [PromoCode] = '" & pCode & "'"
        Dim strConnection As String = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Dim cont As Boolean = True
        Dim didOne As Boolean = False

        'Is there a promo code?
        If (Len(pCode) < 1) Then
            cont = False
        End If

        If cont Then
            'Check for a discount record for the promo code??
            Try
                sqlConn = New SqlConnection(strConnection)
                sqlCommand = New SqlCommand(sql, sqlConn)
                sqlConn.Open()
                sqlCommand.Connection = sqlConn
                dl = sqlCommand.ExecuteReader()
                While dl.Read()
                    pStarts = dl("PromoStarts")
                    pEnds = dl("PromoEnds")
                    pPercent = dl("Open_Percent")
                    pDolPerDay = dl("Open_DolPerDay")
                    pDolFlat = dl("Open_DolFlat")
                End While
                If pStarts > Today() Then
                    cont = False
                End If
                If pEnds < Today() Then
                    cont = False
                End If
                If (pPercent + pDolPerDay + pDolFlat) < 1 Then
                    cont = False
                End If

            Catch ex As Exception
                cont = False
            Finally
                sqlConn.Close()
            End Try
        End If

        If cont Then 'Still good to go
            Dim pid As Integer = Session("cartRegID")
            Dim ttldiscount As Double = 0
            Dim discount As Double = 0
            Dim seq As Integer = 0
            Dim feeName As String = ""
            Dim feeAmt As Double = 0
            Dim feeQty As Integer = 0
            Dim feeTtl As Double = 0
            Dim feeDisc As Double = 0

            'loop through each temp_Reg record
            sql = "SELECT * FROM [temp_Reg] WHERE [reg_ID] = " & pid
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sql, sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            dl = sqlCommand.ExecuteReader()
            While dl.Read()
                seq = dl("reg_SEQ")
                feeName = dl("sem_FeeName")
                feeAmt = dl("sem_FeeAmt")
                feeQty = dl("sem_Qty")
                feeTtl = dl("sem_Total")
                feeDisc = dl("sem_Discount")
                discount = 0
                If (pDolFlat > 0) Then
                    discount = pDolFlat * feeQty
                ElseIf pPercent > 0 Then
                    discount = feeTtl * (pPercent / 100)
                ElseIf pDolPerDay > 0 Then
                    If (Left(feeName, 4) = "Both") Then
                        discount = (pDolPerDay * 2) * feeQty
                    ElseIf (Left(feeName, 5) = "Three") Then
                        discount = (pDolPerDay * 3) * feeQty
                    Else
                        discount = pDolPerDay * feeQty
                    End If
                End If
                discount = Math.Round(discount, 0)

                If discount <> feeDisc Then
                    sql = "UPDATE [temp_Reg] SET [sem_Discount] = "
                    sql &= discount.ToString() & " WHERE([reg_SEQ] = " & seq.ToString() & ")"
                    sql_Exec(sql)
                    didOne = True
                End If

            End While

            If (didOne) Then
                sql = "SELECT SUM(sem_Total - sem_Discount) as MaxID FROM temp_Reg WHERE reg_ID = " & Session("cartRegID").ToString()
                pid = getMaxID(sql)
                sql = "UPDATE temp_CUST SET reg_Cost = " & pid.ToString()
                sql = sql & " WHERE reg_ID = " & Session("cartRegID").ToString()
                sql_Exec(sql)
            End If

        End If
        saveCust()

    End Sub

    Protected Sub PromoTypeX_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PromoTypeX.SelectedIndexChanged
        PromoDescX.Items.Clear()
        fillPromoDescX()
        setPromoDesc2Label()
    End Sub

    Protected Sub PromoDescX_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PromoDescX.SelectedIndexChanged
        setPromoDesc2Label()
        'btnContinue.Enabled = (processButtonState() = 0)

    End Sub

    Protected Sub fillPromoDescX()

        PromoDescX.Items.Add("Please Select")
        Select Case PromoTypeX.SelectedValue
            Case "Please Select"

            Case "Direct Mail"

                PromoDescX.Items.Add("Single Brochures in Regular Envelope")
                PromoDescX.Items.Add("Mini Poster in Large Envelope")
                PromoDescX.Items.Add("Postcard")
                PromoDescX.Items.Add("Other")
            Case "Internet"

                PromoDescX.Items.Add("Google")
                PromoDescX.Items.Add("Yahoo")
                PromoDescX.Items.Add("Bing")
                PromoDescX.Items.Add("Some Other Site")
                PromoDescX.Items.Add("Other")
            Case "Other"

                PromoDescX.Items.Add("Email")
                PromoDescX.Items.Add("Fax")
                PromoDescX.Items.Add("Magazine Ad")
                PromoDescX.Items.Add("Tradeshow")
                PromoDescX.Items.Add("Referral")
                PromoDescX.Items.Add("Other")
        End Select
        PromoDescX.SelectedIndex = 0

    End Sub

    Protected Sub setPromoDesc2Label()

        Select Case PromoTypeX.SelectedValue
            Case "Please Select"
                PromoDesc2Label.Text = "Promotion Code:"
                PromoDesc3.Visible = False
                PromoDesc3Label.Visible = False

            Case "Direct Mail"
                PromoDesc2Label.Text = "Promo Code if you know it:"
                Select Case PromoDescX.SelectedValue
                    Case "Other"
                        PromoDesc2Label.Text = "Please describe:"
                End Select
                PromoDesc3.Visible = False
                PromoDesc3Label.Visible = False

            Case "Internet"
                PromoDesc2Label.Text = "Search Term if you know it:"
                PromoDesc3.Visible = True
                PromoDesc3Label.Visible = True
                PromoDesc3Label.Text = "Other helpful information about how you found us:"

                Select Case PromoDescX.SelectedValue
                    Case "Some Other Site"
                        PromoDesc2Label.Text = "Name of Other Site if you know it:"
                    Case "Other"
                        PromoDesc2Label.Text = "Brief Description:"
                        PromoDesc3.Visible = False
                        PromoDesc3Label.Visible = False

                End Select

            Case "Other"
                PromoDesc2Label.Text = "Promo Code if you know it:"
                PromoDesc3.Visible = False
                PromoDesc3Label.Visible = False

                Select Case PromoDescX.SelectedValue
                    Case "Magazine Ad"
                        PromoDesc2Label.Text = "Name of Magazine if you know it:"
                    Case "Tradeshow"
                        PromoDesc2Label.Text = "Name of Trade Show if you know it:"
                    Case "Referral"
                        PromoDesc2Label.Text = "Who Referred You:"
                    Case "Other"
                        PromoDesc2Label.Text = "Brief Description:"
                End Select
        End Select


    End Sub

    Protected Function processButtonState() As Integer
        Dim goodtogo As Integer = 0
        If (PromoTypeX.SelectedIndex < 1) Or (PromoDescX.SelectedIndex < 1) Then
            Return (1)
        End If
        If (authFName.Text = "") Or (authLName.Text = "") Or (authAddr1.Text = "") Then
            Return (2)
        End If
        If (authCity.Text = "") Or (authZip.Text = "") Then
            Return (2)
        End If
        If (authPhone1.Text = "") Or (authPhone2.Text = "") Or (authPhone3.Text = "") Then
            Return (2)
        End If
        If Not cbBillSame.Checked Then
            If (billFName.Text = "") Or (billLName.Text = "") Or (billAddr1.Text = "") Then
                Return (3)
            End If
            If (billCity.Text = "") Or (billZip.Text = "") Then
                Return (3)
            End If
            If (billPhone1.Text = "") Or (billPhone2.Text = "") Or (billPhone3.Text = "") Then
                Return (3)
            End If
        End If
        If PayMethod.SelectedIndex < 1 Then
            Return (4)
        ElseIf PayMethod.SelectedIndex = 1 Then
            If (ccName.Text = "") Or (ccNumber.Text = "") Or (ccCVC.Text = "") Then
                Return (4)
            End If
        ElseIf PayMethod.SelectedIndex = 3 And PONumber.Text = "" Then
            Return (4)
        End If
        Return (goodtogo)
    End Function

    Protected Sub ccCVC_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles ccCVC.TextChanged
        btnContinue.Enabled = (processButtonState() = 0)

    End Sub

    Protected Sub ChkNumber_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles ChkNumber.TextChanged
        btnContinue.Enabled = (processButtonState() = 0)

    End Sub

    Protected Sub PONumber_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PONumber.TextChanged
        btnContinue.Enabled = (processButtonState() = 0)

    End Sub

    Protected Sub PromoDesc2X_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PromoDesc2X.TextChanged
        If Len(PromoDesc2X.Text) > 2 Then
            saveCust()
        End If
    End Sub

    Protected Sub authEmail_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles authEmail.TextChanged
        If Len(authEmail.Text) > 2 Then
            saveCust()
        End If
    End Sub

    Protected Sub billEmail_TextChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles billEmail.TextChanged
        If Len(billEmail.Text) > 2 Then
            saveCust()
        End If
    End Sub

End Class
