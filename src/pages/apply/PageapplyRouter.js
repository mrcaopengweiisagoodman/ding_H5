import { Route } from 'react-keeper'
import Page from './Pageapply';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/apply' >

            </Route>
        </div>)
};