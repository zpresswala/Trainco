Imports System.Data.SqlClient
Imports System.Text

Partial Class SignUp2
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim myFunc As New ATI_GlobalFunctions
        Dim CoName As String = System.Configuration.ConfigurationManager.AppSettings("CompanyName")
        NameLabel.Text = CoName
        If Me.IsPostBack = False Then
            Page.Header.Title = "Facility & Plant Management Training Sign Up | American Trainco"

            Dim mtD As New HtmlMeta()
            mtD.Name = "description"
            mtD.Content = "Our facility & plant management sign up is ideal if you want to take a maintenance training seminar or get certification testing. Visit American Trainco today!"
            Page.Header.Controls.Add(mtD)

            'Dim mtK As New HtmlMeta()
            'mtK.Name = "keywords"
            'mtK.Content = "Electrical training, industrial, maintenance, national electrical code, electric, national electric code, nfpa 70e, arc flash, course, plc, vfd, boiler operator, building maintenance seminar, air conditioning, pump class, maintenance management, nec, electrical safety, schematics, epa 608, refrigerant technician, allen Bradley, motor controls, nec, hydraulics , American Trainco"
            'Page.Header.Controls.Add(mtK)

            myFunc.fillGlobals(Page.Request())

            PromoTypeX.SelectedIndex = 0
            PromoDescX.Items.Clear()
            PromoDesc2Label.Text = "Promotion Code:"
            PromoDesc2X.Text = ""
            PromoDesc3.Text = ""
            promoType.Value = ""
            promoCode.Value = ""
            PromoDesc.Value = ""

            Phone1.Attributes.Add("onkeyup", "autoTab(" + Phone1.ClientID() + "," + Phone2.ClientID + ")")
            Phone2.Attributes.Add("onkeyup", "autoTab(" + Phone2.ClientID() + "," + Phone3.ClientID + ")")
            'Phone3.Attributes.Add("onkeyup", "autoTab(" + Phone3.ClientID() + ",null)")
            Fax1.Attributes.Add("onkeyup", "autoTab(" + Fax1.ClientID() + "," + Fax2.ClientID + ")")
            Fax2.Attributes.Add("onkeyup", "autoTab(" + Fax2.ClientID() + "," + Fax3.ClientID + ")")
            'Fax3.Attributes.Add("onkeyup", "autoTab(" + Fax3.ClientID() + ",null)")


        End If
    End Sub

    Protected Sub btnSubmit_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnSubmit.Click
        promoCleanup()
        If (Not (Email.Text = "bobz@americantrainco.com")) And goodEntry() Then
            postSignUp()
            sendSignUpEmail()
        End If
        Response.Redirect("~/SignUp2_ThankYou.aspx")

    End Sub

    Protected Function goodEntry() As Boolean
        Dim rtn As Boolean = True

        If (Len(checkString(Zipcode.Text, 255)) > 5) And (Len(checkString(Address2.Text, 255)) > 10) Then
            rtn = False
        ElseIf (Len(checkString(FirstName.Text, 255)) > 25) Or (Len(checkString(LastName.Text, 255)) > 25) Then
            rtn = False
        ElseIf (checkString(FirstName.Text, 255) = checkString(LastName.Text, 255)) Or (checkString(FirstName.Text, 255) = checkString(Company.Text, 255)) Then
            rtn = False
        ElseIf (checkString(Company.Text, 255) = checkString(theTitle.Text, 255)) Or (checkString(Company.Text, 255) = checkString(Address1.Text, 255)) Then
            rtn = False
        End If

        Return rtn

    End Function

    Protected Sub postSignUp()
        Dim sB As New StringBuilder
        Dim theText As String = ""
        Dim sqlConn As New SqlConnection
        Dim sqlCommand As SqlCommand
        Dim strConnection As String
        sB.Append("INSERT INTO WebSignups (")
        sB.Append("Referrer, FirstName, MiddleName, LastName, CompanyName, ")
        sB.Append("Title, Address1, Address2, City, State, Zipcode, Country, ")
        sB.Append("Phone, PhoneExtn, Fax, Email, Interest, PromoCode, PromoType, ")
        sB.Append("PromoDesc, PreferredContact, OptIN) VALUES (")
        sB.Append("'ATI Website - General', ")
        sB.Append("'" + checkString(FirstName.Text, 255) + "', ")
        sB.Append("'" + checkString(MiddleName.Text, 255) + "', ")
        sB.Append("'" + checkString(LastName.Text, 255) + "', ")
        sB.Append("'" + checkString(Company.Text, 255) + "', ")
        sB.Append("'" + checkString(theTitle.Text, 255) + "', ")
        sB.Append("'" + checkString(Address1.Text, 255) + "', ")
        sB.Append("'" + checkString(Address2.Text, 255) + "', ")
        sB.Append("'" + checkString(City.Text, 255) + "', ")
        sB.Append("'" + State.SelectedValue + "', ")
        sB.Append("'" + checkString(Zipcode.Text, 20) + "', ")
        sB.Append("'" + Country.SelectedValue + "', ")
        sB.Append("'" + checkString("(" + Phone1.Text + ") " + Phone2.Text + "-" + Phone3.Text, 20) + "', ")
        sB.Append("'" + checkString(PhoneExt.Text, 20) + "', ")
        sB.Append("'" + checkString("(" + Fax1.Text + ") " + Fax2.Text + "-" + Fax3.Text, 20) + "', ")
        sB.Append("'" + checkString(Email.Text, 255) + "', ")

        Dim xText As String = tSubject.SelectedValue
        If tSubject2.Text <> "" Then
            xText = checkString(tSubject2.Text, 255)
        End If
        theText = theText + "Subject: " + xText + vbCr
        xText = checkString(tPeople.Text, 255)
        theText = theText + "# People: " + xText + vbCr

        sB.Append("'" + theText + "', ")
        sB.Append("'" + PromoCode.Value + "', ")
        sB.Append("'" + PromoType.Value + "', ")
        sB.Append("'" + checkString(PromoDesc.Value, 255) + "', ")

        theText = ""
        If cbEmail.Checked Then
            theText = theText + "Email "
        End If
        If cbFax.Checked Then
            theText = theText + "Fax "
        End If
        If cbMail.Checked Then
            theText = theText + "Mail "
        End If
        If cbPhone.Checked Then
            theText = theText + "Phone"
        End If

        '12/16/09 No Option - Force Opt In per Dan
        sB.Append("'" + theText + "', ")
        'If OptIn.Checked Then
        sB.Append("1)")
        'Else
        'sB.Append("0)")
        'End If

        strConnection = ConfigurationManager.ConnectionStrings("ATI_WebConnectionString").ToString()
        Try
            sqlConn = New SqlConnection(strConnection)
            sqlCommand = New SqlCommand(sB.ToString(), sqlConn)
            sqlConn.Open()
            sqlCommand.Connection = sqlConn
            sqlCommand.ExecuteNonQuery()

        Catch ex As Exception

        Finally
            sqlConn.Close()
        End Try

    End Sub

    Protected Sub sendSignUpEmail()
        Dim strFrom As String = System.Configuration.ConfigurationManager.AppSettings("EmailFrom")
        Dim strTo As String = System.Configuration.ConfigurationManager.AppSettings("CustServiceEmail")
        Dim strSubject As String = "Seminar Schedule Request from Website"
        Dim strBody As String = ""
        Dim sB As New StringBuilder
        'strTo = "bobz@americantrainco.com"

        sB.Append("Date: " + Today().ToString + vbCrLf + vbCrLf)
        sB.Append("The following new Web Signup record has just been posted:" + vbCrLf + vbCrLf)

        sB.Append("First Name: " + checkString(FirstName.Text, 255) + vbCrLf)
        sB.Append("Middle Name: " + checkString(MiddleName.Text, 255) + vbCrLf)
        sB.Append("Last Name: " + checkString(LastName.Text, 255) + vbCrLf + vbCrLf)

        sB.Append("Company: " + checkString(Company.Text, 255) + vbCrLf)
        sB.Append("Title: " + checkString(theTitle.Text, 255) + vbCrLf)
        sB.Append("Address Ln 1: " + checkString(Address1.Text, 255) + vbCrLf)
        sB.Append("Address Ln 2: " + checkString(Address2.Text, 255) + vbCrLf)
        sB.Append("City: " + checkString(City.Text, 255) + vbCrLf)
        sB.Append("State: " + State.SelectedValue + vbCrLf)
        sB.Append("Zip: " + checkString(Zipcode.Text, 20) + vbCrLf)
        sB.Append("Country: " + Country.SelectedValue + vbCrLf + vbCrLf)

        sB.Append("Phone: " + checkString("(" + Phone1.Text + ") " + Phone2.Text + "-" + Phone3.Text, 20) + "  Ext: " + checkString(PhoneExt.Text, 20) + vbCrLf)
        sB.Append("Fax: " + checkString("(" + Fax1.Text + ") " + Fax2.Text + "-" + Fax3.Text, 20) + vbCrLf)
        sB.Append("Email: " + Email.Text + vbCrLf + vbCrLf)

        sB.Append("Subject of Interest: " + tSubject.SelectedValue + vbCrLf)
        sB.Append("Other Interest: " + checkString(tSubject2.Text, 255) + vbCrLf)
        sB.Append("Number of People: " + checkString(tPeople.Text, 255) + vbCrLf)

        sB.Append("Promo Code: " + PromoCode.Value + vbCrLf)
        sB.Append("Promo Type: " + PromoType.Value + vbCrLf)
        sB.Append("Promo Desc.: " + checkString(PromoDesc.Value, 255) + vbCrLf + vbCrLf)

        'If OptIn.Checked Then
        'sB.Append("News & Announcements: SEND" + vbCrLf)
        'Else
        'sB.Append("News & Announcements: DO NOT SEND" + vbCrLf)
        'End If

        sB.Append("Preferred Contact Methods: ")
        If cbEmail.Checked Then
            sB.Append("Email  ")
        End If
        If cbFax.Checked Then
            sB.Append("Fax  ")
        End If
        If cbMail.Checked Then
            sB.Append("Postal Mail  ")
        End If
        If cbPhone.Checked Then
            sB.Append("Phone  ")
        End If
        sB.Append(vbCrLf + vbCrLf)


        Try
            Dim objEmail As New MailMessage(strFrom, strTo)
            objEmail.Subject = strSubject
            objEmail.Body = sB.ToString()
            objEmail.IsBodyHtml = False
            Dim smtp As New SmtpClient
            smtp.Send(objEmail)

        Catch smtpEx As SmtpException
            ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a problem in sending the email: {0}');", smtpEx.Message.Replace("'", "\'")), True)

        Catch generalEx As Exception
            ClientScript.RegisterStartupScript(Me.GetType(), "OhOh", String.Format("alert('There was a general problem: {0}');", generalEx.Message.Replace("'", "\'")), True)

        End Try


    End Sub

    Protected Function checkString(ByVal xStr As String, ByVal xMax As Integer) As String
        Dim theText As String = Replace(xStr, "'", "")
        Dim theLen As Integer = Len(theText)
        If theLen > xMax And xMax > 0 Then
            theText = Left(theText, xMax)
        End If
        Return theText
    End Function

    Protected Sub promoCleanup()
        promoType.Value = Trim(PromoTypeX.SelectedValue) & " - " & Trim(PromoDescX.SelectedValue)

        Select Case promoType.Value

            Case "Direct Mail - Postcard"
                promoCode.Value = Trim(PromoDesc2X.Text)
                promoDesc.Value = Trim(PromoDesc3.Text)
                If promoCode.Value = "" Then
                    promoCode.Value = "Z02 0000 0"
                End If

            Case "Direct Mail - Envelope"
                promoCode.Value = Trim(PromoDesc2X.Text)
                promoDesc.Value = Trim(PromoDesc3.Text)
                If promoCode.Value = "" Then
                    promoCode.Value = "Z01 0000 0"
                End If

            Case "Direct Mail - Other"
                promoCode.Value = "Z03 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Google"
                promoCode.Value = "Z08 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Yahoo"
                promoCode.Value = "Z09 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Bing"
                promoCode.Value = "Z10 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Some Other Site"
                promoCode.Value = "Y99 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Internet - Other"
                promoCode.Value = "Y99 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Email"
                promoCode.Value = Trim(PromoDesc2X.Text)
                promoDesc.Value = Trim(PromoDesc3.Text)
                If promoCode.Value = "" Then
                    promoCode.Value = "Y25 0000 0"
                End If

            Case "Other - Fax"
                promoCode.Value = Trim(PromoDesc2X.Text)
                promoDesc.Value = Trim(PromoDesc3.Text)
                If promoCode.Value = "" Then
                    promoCode.Value = "J24 0000 0"
                End If

            Case "Other - Magazine Ad"
                promoCode.Value = "Y98 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Tradeshow"
                promoCode.Value = "Y30 0000 0"
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Referral"
                promoCode.Value = ""
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

            Case "Other - Other"
                promoCode.Value = ""
                promoDesc.Value = Trim(PromoDesc2X.Text) & " - " & Trim(PromoDesc3.Text)

        End Select
    End Sub

    Protected Sub tSubject_DataBound(ByVal sender As Object, ByVal e As System.EventArgs) Handles tSubject.DataBound
        tSubject.Items.Insert(0, "Select a Category")
        tSubject.SelectedIndex = 0
        tSubject.Items(0).Value = ""
    End Sub

    Protected Sub PromoTypeX_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PromoTypeX.SelectedIndexChanged
        PromoDescX.Items.Clear()
        fillPromoDescX()
        setPromoDesc2Label()
    End Sub

    Protected Sub PromoDescX_SelectedIndexChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles PromoDescX.SelectedIndexChanged
        setPromoDesc2Label()
    End Sub

    Protected Sub fillPromoDescX()

        PromoDescX.Items.Add("Please Select")
        Select Case PromoTypeX.SelectedValue
            Case "Please Select"

            Case "Direct Mail"

                PromoDescX.Items.Add("Postcard")
                PromoDescX.Items.Add("Envelope")
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

End Class
