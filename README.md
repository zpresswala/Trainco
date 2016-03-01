# TPCTrainco
TPC Trainco Website

To get the project running locally:
1. Install Gulp: npm install -g gulp
2. CD into the project's directory, then run npm install
3. To start the server, run the command "gulp". This will compile CSS and watch files for changes too.

### API Notes
GET /api/seminars/search/?
*Query String Options*​
keyword={keyword}
&topic={topics (comma separated)}
&location={city or ZIP}
&radius={miles radius}
&date-start={start date of search}
&date-end={end date of search}

            <div class="pagination-btn-wrapper">
              <!-- inception pagination buttons -->
            <button class="btn-pagination"
                    ng-disabled="ctrl.inceptCurrentPage === 0"
                    ng-click="ctrl.inceptCurrentPage=ctrl.inceptCurrentPage-1">
                    Previous
            </button>
                {{ ctrl.inceptCurrentPage + 1 }} / {{ (ctrl.seminarLocations.length/10) - 1 | number:0 }}
                <button class="btn-pagination"
                      ng-disabled="ctrl.inceptCurrentPage >= (ctrl.seminarLocations.length/10 - 1)"
                      ng-click="ctrl.inceptCurrentPage=ctrl.inceptCurrentPage+1">
                    Next
                </button>
            <!-- inception pagination buttons -->
            </div>
