import { Route } from 'react-keeper'
import Page from './Pagedetailcontractsub';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/detailcontractsub/:id' >

            </Route>
        </div>)
};