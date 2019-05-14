import { Route } from 'react-keeper'
import Page from './Pageaddauditapprove';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/addauditapprove' >

            </Route>
        </div>)
};