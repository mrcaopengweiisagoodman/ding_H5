import { Route } from 'react-keeper'
import Page from './Pageauditcontract';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/auditcontract' >

            </Route>
        </div>)
};