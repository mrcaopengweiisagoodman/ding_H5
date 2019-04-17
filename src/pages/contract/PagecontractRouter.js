import { Route } from 'react-keeper'
import Page from './Pagecontract';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/contract' >

            </Route>
        </div>)
};