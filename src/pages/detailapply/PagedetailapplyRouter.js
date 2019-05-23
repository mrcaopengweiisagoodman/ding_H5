import { Route } from 'react-keeper'
import Page from './Pagedetailapply';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/detailapply/:id' >

            </Route>
        </div>)
};