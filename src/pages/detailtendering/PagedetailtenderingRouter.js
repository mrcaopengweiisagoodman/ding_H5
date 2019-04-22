import { Route } from 'react-keeper'
import Page from './Pagedetailtendering';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/detailtendering/:id' >

            </Route>
        </div>)
};