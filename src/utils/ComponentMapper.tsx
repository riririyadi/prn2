import * as React from 'react';


const Province = React.lazy(() => import('../pages/Province'));
const Transaction = React.lazy(() => import('../pages/Transaction'));

const HomeIndex = React.lazy(() => import('../pages/HomeIndex'));
const OpenBlock = React.lazy(() => import('../pages/openblock/OpenBlock'));
const Form = React.lazy(() => import('../pages/Form'));
const Users = React.lazy(() => import('../pages/fnd/Users'));
const Responsibility = React.lazy(() => import('../pages/Responsibility'));

export const COMPONENT_MAP: Record<string, JSX.Element> = {

  province: <Province />,
  transaction: <Transaction />,
  OpenBlock: <OpenBlock />,
  homeIndex: <HomeIndex />,
  responsibility: <Responsibility />,
  form: <Form />,
  users: <Users />,
  Responsibility: <Responsibility />,
};
