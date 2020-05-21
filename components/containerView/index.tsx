import { useEffect, useState, useContext } from 'react';
import { fetchLitDataset, getOneThing, getAllIris } from '@inrupt/lit-solid-core';
import { ldp } from 'rdf-namespaces';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { UserContext } from '../../src/contexts/UserContext';
import { ILoggedInSolidSession } from '../../lib/solid-auth-fetcher/dist/solidSession/ISolidSession';
import { fetch } from '../../lib/solid-auth-fetcher/dist';
import { useRedirectIfLoggedOut } from '../../src/effects/auth';
import Spinner from '../spinner';


// TODO move this to a shims file
if (!global.setImmediate) {
  global.setImmediate = (fn, ...args): any => global.setTimeout(fn, 0, ...args);
}

export async function getContainerResourceIrisFromSession(session: ILoggedInSolidSession) {
  const { webId } = session;

  // TODO the typescript error for `fetch` is a known issue: SDK-995
  const profile = await fetchLitDataset(webId, { fetch });
  const containerIris = getAllIris(profile, 'http://www.w3.org/ns/pim/space#storage');

  // TODO work with multiple top-level containers (to be implemented in a later user story.)
  const containerIri = containerIris[0];

  // Assign `fetch` from our SAF with session.
  // TODO this will be unnecessary once SAF is loaded through an npm module instead of
  // a submodule.
  const litDataset = await fetchLitDataset(containerIri, { fetch });

  const container = getOneThing(litDataset, containerIri);

  const resourceIris = getAllIris(container, ldp.contains);

  return {
    containerIri,
    resources: resourceIris,
  };
}


export default function Home() {
  useRedirectIfLoggedOut();

  const defaultResources: string[] | null = [];
  const { session, isLoadingSession } = useContext(UserContext);

  const [resources, setResources] = useState(defaultResources);
  const [containerIri, setContainerIri] = useState('');
  const [isLoading, setIsLoading] = useState(isLoadingSession);

  useEffect(() => {
    async function fetchContainerData() {
      if (typeof session === 'undefined') { return; }

      const {
        containerIri: loadedContainerIri,
        resources: loadedResources,
      } = await getContainerResourceIrisFromSession(session);

      setContainerIri(loadedContainerIri);
      setResources(loadedResources);
      setIsLoading(false);
    }

    fetchContainerData();
  }, [session]);

  if (isLoading || !resources) {
    return (<Spinner />);
  }

  return (
    <>
      { resources.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>My Access</TableCell>
              <TableCell>Modified</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {resources.map((iri: string) => (
              <TableRow key={iri}>
                <TableCell>
                  <a href={`/resource/${iri}`}>
                    {iri.replace(containerIri, '')}
                  </a>
                </TableCell>
                <TableCell>Folder</TableCell>
                <TableCell>Full</TableCell>
                <TableCell>Today :)</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </>
  );
}
