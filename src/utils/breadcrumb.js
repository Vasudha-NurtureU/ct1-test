// redux store
import appStore from 'store/index';

import { UPDATEBREADCRUMB } from "store/actions/type/app";

const buildBreadcrumb = (props, breadcrumbs) => {
  appStore.dispatch({ type: UPDATEBREADCRUMB, payload: breadcrumbs })
};

export default buildBreadcrumb;