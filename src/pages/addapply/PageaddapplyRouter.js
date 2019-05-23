import { Route } from 'react-keeper'
import Page from './Pageaddapply';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/addapply' >

            </Route>
        </div>)
};