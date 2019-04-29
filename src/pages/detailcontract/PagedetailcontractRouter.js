import { Route } from 'react-keeper'
import Page from './Pagedetailcontract';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/detailcontract/:id' >

            </Route>
        </div>)
};