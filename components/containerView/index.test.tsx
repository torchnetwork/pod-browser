import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { fetchLitDataset, getOneThing, getAllIris } from '@inrupt/lit-solid-core';
import { getSession } from '../../lib/solid-auth-fetcher/dist';
import ContainerView, { getContainerResourceIrisFromSession } from './index';


jest.mock('../../lib/solid-auth-fetcher/dist');
jest.mock('@inrupt/lit-solid-core');


describe('Container view', () => {
  test('Renders a container view', () => {
    const tree = shallow(<ContainerView />);
    expect(shallowToJson(tree)).toMatchSnapshot();
  });
});

describe('Loading container resource iri list', () => {
  test('Returns empty properties if there is no session', async () => {
    expect(await getContainerResourceIrisFromSession()).toEqual({
      containerIri: '',
      resources: [],
    });
  });

  test('Loads resource iris if there is a session', async () => {
    const containerIri = 'https://myaccount.mypodserver.com';

    const resources = [
      'https://myaccount.mypodserver.com/inbox',
      'https://myaccount.mypodserver.com/private',
      'https://myaccount.mypodserver.com/note.txt',
    ];

    (getSession as any).mockImplementation(() => Promise.resolve({
      webId: 'https://myaccount.mypodserver.com/profile/card#me',
    }));

    (getAllIris as any).mockImplementationOnce(() => [containerIri]);
    (getAllIris as any).mockImplementationOnce(() => resources);

    expect(await getContainerResourceIrisFromSession()).toEqual({
      containerIri,
      resources,
    });
  });
});
