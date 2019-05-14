import { Route } from 'react-keeper'
import Page from './Pagedetailauditapprove';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/detailauditapprove/:id' >

            </Route>
        </div>)
};