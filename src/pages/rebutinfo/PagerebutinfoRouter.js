import { Route } from 'react-keeper'
import Page from './Pagerebutinfo';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/rebutinfo/:id' >

            </Route>
        </div>)
};