import { Route } from 'react-keeper'
import Page from './Pageaddtendering';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/addtendering' >

            </Route>
        </div>)
};