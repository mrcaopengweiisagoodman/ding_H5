import { Route } from 'react-keeper'
import Page from './Pageaudit';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/audit' >

            </Route>
        </div>)
};