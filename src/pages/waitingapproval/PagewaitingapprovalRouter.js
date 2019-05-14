import { Route } from 'react-keeper'
import Page from './Pagewaitingapproval';

export default {
    page: Page,
    route: () => (
        <div>
            <Route exact component={Page} path= '/waitingapproval' >

            </Route>
        </div>)
};