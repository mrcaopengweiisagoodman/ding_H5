import { Route } from 'react-keeper'
import Page from './Pageaddcontractrelation';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/addcontractrelation/:pid/:pTitle' >

            </Route>
        </div>)
};