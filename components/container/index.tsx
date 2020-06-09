import { ReactElement, useEffect, useState, useContext } from "react";
import { ldp } from "rdf-namespaces";

import { fetchLitDataset, getThingOne, getIriAll } from "lit-solid";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

import UserContext from "../../src/contexts/UserContext";
import { useRedirectIfLoggedOut } from "../../src/effects/auth";
import Spinner from "../spinner";

export async function getContainerResourceIrisFromContainerIri(
  containerIri: string
): Promise<string[]> {
  const litDataset = await fetchLitDataset(containerIri);
  const container = getThingOne(litDataset, containerIri);
  return getIriAll(container, ldp.contains);
}

interface IPodList {
  iri: string;
}

export default function Container(props: IPodList): ReactElement {
  useRedirectIfLoggedOut();

  const { iri } = props;

  const defaultResources: string[] | null = [];
  const { session, isLoadingSession } = useContext(UserContext);

  const [resources, setResources] = useState(defaultResources);
  const [isLoading, setIsLoading] = useState(
    isLoadingSession || !resources.length
  );

  useEffect(() => {
    if (isLoadingSession || !session) {
      return;
    }

    getContainerResourceIrisFromContainerIri(iri)
      .then((loadedResources) => {
        setResources(loadedResources);
        setIsLoading(false);
      })
      .catch((e) => {
        throw e;
      });
  }, [session, isLoadingSession, iri]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
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
          {!resources.length ? (
            <TableRow>
              <TableCell rowSpan={4}>
                No resources were found within this container.
              </TableCell>
            </TableRow>
          ) : null}

          {resources.map((resourceIri: string) => (
            <TableRow key={resourceIri}>
              <TableCell>
                <a href={`/resource/${encodeURIComponent(resourceIri)}`}>
                  {resourceIri.replace(iri, "")}
                </a>
              </TableCell>
              <TableCell>Folder</TableCell>
              <TableCell>Full</TableCell>
              <TableCell>Today :)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
