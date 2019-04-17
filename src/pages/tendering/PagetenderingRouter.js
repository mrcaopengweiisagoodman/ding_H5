import { Route } from 'react-keeper'
import Page from './Pagetendering';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/tendering' >

            </Route>
        </div>)
};