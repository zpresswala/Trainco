using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Forms.Core;
using Umbraco.Forms.Core.Enums;
using Umbraco.Forms.Data.Storage;
using Umbraco.Forms.Web.Services;

namespace TPCTrainco.Umbraco.App_Code
{
    public class FormWorkflowTPC : WorkflowType
    {
        public FormWorkflowTPC()
        {
            this.Id = Guid.Parse("89E46D3E-2423-4E69-B256-04C2E8DCA064");
            this.Name = "Add to ATI Database";
            this.Description = "Add the form data to the ATI database";
        }

        public override WorkflowExecutionStatus Execute(Record record, RecordEventArgs e)
        {
            // first we log it
            LogHelper.Info(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType, "the IP " + record.IP + " has submitted a record");
            // we can then iterate through the fields
            foreach (RecordField rf in record.RecordFields.Values)
            {
                // and we can then do something with the collection of values on each field
                List<object> vals = rf.Values;

                // or just get it as a string
                rf.ValuesAsString();
            }

            // If we altered a field, we can save it using the record storage
            RecordStorage store = new RecordStorage();
            store.UpdateRecord(record, e.Form);
            store.Dispose();

            // we then invoke the recordservice which handles all record states //and make the service delete the record.
            RecordService rs = new RecordService();
            rs.Delete(record, e.Form);
            //rs.Dispose(record, e.Form);

            return WorkflowExecutionStatus.Completed;
        }

        public override List<Exception> ValidateSettings()
        {
            List<Exception> exceptions = new List<Exception>();

            //if you have any settings, validate them here

            return exceptions;
        }
    }
}