import { Route } from 'react-keeper'
import Page from './Pagecontractsearch';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/contractsearch/:ori' >

            </Route>
        </div>)
};