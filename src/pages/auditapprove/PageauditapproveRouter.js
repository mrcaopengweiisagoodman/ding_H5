import { Route } from 'react-keeper'
import Page from './Pageauditapprove';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= 'auditapprove' >

            </Route>
        </div>)
};