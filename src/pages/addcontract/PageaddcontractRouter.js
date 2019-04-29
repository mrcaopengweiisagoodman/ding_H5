import { Route } from 'react-keeper'
import Page from './Pageaddcontract';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/addcontract' >

            </Route>
        </div>)
};