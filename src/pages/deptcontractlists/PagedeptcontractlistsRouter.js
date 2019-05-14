import { Route } from 'react-keeper'
import Page from './Pagedeptcontractlists';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/deptcontractlists/:deptId' >

            </Route>
        </div>)
};