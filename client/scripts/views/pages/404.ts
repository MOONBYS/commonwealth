import 'pages/404.scss';

import m from 'mithril';
import mixpanel from 'mixpanel-browser';
import { EmptyState, Icon, Icons } from 'construct-ui';
import Sublayout from 'views/sublayout';

const PageNotFound: m.Component<{ title?: string, message?: string }> = {
  oncreate: (vnode) => {
    mixpanel.track('PageVisit', { 'Page Name': '404Page' });
  },
  view: (vnode) => {
    const { message, title } = vnode.attrs;

    return m(Sublayout, {
      class: 'PageNotFound',
      title,
    }, [
      m('.page-not-found-container', [
        m(EmptyState, {
          class: 'PageNotFound',
          icon: Icons.HELP_CIRCLE,
          header: 'Page not found',
          content: message
            || 'This page may not be visible to the public. If it belongs to a private thread or community, try logging in.'
        }),
      ]),
    ]);
  }
};

export default PageNotFound;
